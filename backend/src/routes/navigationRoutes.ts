import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/navigation - Public: Get all navigation items as tree
router.get('/tree', async (req, res) => {
    try {
        const scope = (req.query.scope as string) || 'header';
        const items = await prisma.navigationItem.findMany({
            where: {
                parentId: null,
                isActive: true,
                scope: scope
            },
            orderBy: { position: 'asc' },
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { position: 'asc' },
                    include: {
                        children: {
                            where: { isActive: true },
                            orderBy: { position: 'asc' }
                        }
                    }
                }
            }
        });
        res.json(items);
    } catch (error) {
        console.error('Navigation fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch navigation tree' });
    }
});

// GET /api/navigation/all - Admin:// Get all items (flat list for admin)
router.get('/all', authenticate, isAdmin, async (req, res) => {
    try {
        const scope = (req.query.scope as string) || 'header';
        const items = await prisma.navigationItem.findMany({
            where: { scope },
            orderBy: { position: 'asc' },
            include: {
                children: {
                    orderBy: { position: 'asc' }
                }
            }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// POST /api/navigation - Admin: Create navigation item
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
        const { label, url, type, parentId, position, icon, imageUrl, description, badge, isActive, scope } = req.body;

        const item = await prisma.navigationItem.create({
            data: {
                label,
                url,
                type,
                parentId: parentId || null,
                position: position || 0,
                icon,
                imageUrl,
                description,
                badge,
                isActive: isActive ?? true,
                scope: scope || 'header'
            }
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Navigation create error:', error);
        res.status(500).json({ error: 'Failed to create navigation item' });
    }
});

// PUT /api/navigation/:id - Admin: Update navigation item
router.put('/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { label, url, type, parentId, position, icon, imageUrl, description, badge, isActive, scope } = req.body;

        const item = await prisma.navigationItem.update({
            where: { id: Number(id) },
            data: {
                label,
                url,
                type,
                parentId: parentId || null,
                position,
                icon,
                imageUrl,
                description,
                badge,
                isActive,
                scope
            }
        });

        res.json(item);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Navigation item not found' });
        }
        res.status(500).json({ error: 'Failed to update navigation item' });
    }
});

// DELETE /api/navigation/:id - Admin: Delete navigation item
router.delete('/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;

        await prisma.navigationItem.delete({
            where: { id: Number(id) }
        });

        res.json({ success: true });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Navigation item not found' });
        }
        res.status(500).json({ error: 'Failed to delete navigation item' });
    }
});

// PUT /api/navigation/reorder/bulk - Admin: Bulk reorder items with hierarchy support
router.put('/reorder/bulk', authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
        const { items } = req.body; // [{ id: 1, position: 0, parentId: null }, { id: 2, position: 1, parentId: 1 }]

        await prisma.$transaction(
            items.map((item: { id: number; position: number; parentId?: number | null }) =>
                prisma.navigationItem.update({
                    where: { id: item.id },
                    data: {
                        position: item.position,
                        parentId: item.parentId !== undefined ? item.parentId : undefined
                    }
                })
            )
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Bulk reorder error:', error);
        res.status(500).json({ error: 'Failed to reorder navigation items' });
    }
});

export default router;
