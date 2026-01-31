
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get Dashboard Stats
router.get('/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const [
            totalOrders,
            totalRevenue,
            totalProducts,
            totalUsers,
            recentOrders,
            recentUsers
        ] = await Promise.all([
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: {
                    totalAmount: true
                }
            }),
            prisma.product.count(),
            prisma.user.count({
                where: { role: 'customer' }
            }),
            prisma.order.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { fullName: true, email: true }
                    }
                }
            }),
            prisma.user.findMany({
                take: 2,
                where: { role: 'customer' },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // Get revenue by day for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyStats: any = await prisma.$queryRaw`
            SELECT 
                DATE_TRUNC('day', "createdAt") as date,
                COUNT("id")::INT as counts,
                SUM("totalAmount")::FLOAT as revenue
            FROM "Order"
            WHERE "createdAt" >= ${thirtyDaysAgo}
            GROUP BY DATE_TRUNC('day', "createdAt")
            ORDER BY date ASC
        `;

        res.json({
            stats: {
                totalOrders,
                totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
                totalProducts,
                totalUsers,
            },
            recentActivity: {
                orders: recentOrders,
                users: recentUsers
            },
            dailyStats: dailyStats.map((stat: any) => ({
                ...stat,
                counts: Number(stat.counts),
                revenue: Number(stat.revenue)
            }))
        });
    } catch (error: any) {
        console.error('CRITICAL: Dashboard Stats Error:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard stats',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Helper to handle BigInt serialization if needed globally
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export default router;
