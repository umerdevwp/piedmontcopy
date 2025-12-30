
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Create Order
router.post('/', async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, userId } = req.body;

        // Check for Sandbox Mode
        const sandboxSetting = await prisma.setting.findUnique({
            where: { key: 'sandbox_mode' }
        });
        const isSandbox = sandboxSetting?.value === 'true';

        // Log the incoming request for debugging
        console.log('Order Placement Attempt:', { isSandbox, itemsCount: items?.length, totalAmount });

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const order = await prisma.order.create({
            data: {
                userId: userId || null,
                totalAmount: totalAmount,
                shippingAddress: shippingAddress,
                status: isSandbox ? 'sandbox_test' : 'received',
                items: {
                    create: items.map((item: any) => ({
                        productId: typeof item.productId === 'string' ? parseInt(item.productId) : item.productId,
                        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
                        configurations: item.configurations,
                        files: item.files || [],
                        subtotal: item.totalPrice,
                        fileUrl: item.fileUrl || null
                    }))
                }
            },
            include: {
                items: true
            }
        });

        res.status(201).json(order);
    } catch (error: any) {
        console.error('Detailed Order Error:', error);
        res.status(500).json({
            error: 'Failed to create order',
            details: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
});

// Get Logged-in User Orders
router.get('/my-orders', authenticate, async (req: any, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin: Get All Orders with Details
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                            phone: true,
                            address: true
                        } as any
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count()
        ]);

        res.json({
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Admin: Delete Order
router.delete('/admin/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const orderId = parseInt(id);

        await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { orderId } }),
            prisma.order.delete({ where: { id: orderId } })
        ]);

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

// Admin: Update Order Status
router.patch('/admin/:id/status', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Admin: Full Order Update (Data & Items)
router.put('/admin/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, totalAmount, shippingAddress, items } = req.body;
        const orderId = parseInt(id);

        // Use a transaction to update the order and its items
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // 1. Update the order basic info
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status,
                    totalAmount,
                    shippingAddress
                }
            });

            // 2. Update items
            // For simplicity, we'll update existing or delete/recreate if they change significantly.
            // But usually, updating existing IDs is safer.
            for (const item of items) {
                if (item.id) {
                    await tx.orderItem.update({
                        where: { id: item.id },
                        data: {
                            quantity: item.quantity,
                            configurations: item.configurations,
                            files: item.files || [],
                            subtotal: item.subtotal
                        }
                    });
                }
            }

            return tx.order.findUnique({
                where: { id: orderId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                            phone: true,
                            address: true
                        } as any
                    }
                }
            });
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

export default router;
