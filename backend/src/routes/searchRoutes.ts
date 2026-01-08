import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/search?q=...
router.get('/', async (req, res) => {
    try {
        const query = req.query.q as string;

        if (!query || query.length < 2) {
            return res.json({ products: [], services: [] });
        }

        const [products, services] = await Promise.all([
            prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { slug: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 8,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    imageUrl: true,
                    basePrice: true
                }
            }),
            prisma.service.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { slug: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    imageUrl: true,
                    icon: true
                }
            })
        ]);

        res.json({ products, services });
    } catch (error) {
        console.error('Search API Error:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
});

export default router;
