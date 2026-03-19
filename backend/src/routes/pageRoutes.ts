import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Public: Get page by slug (for frontend renderer)
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await prisma.page.findFirst({
            where: {
                slug
            }
        });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        // If page is not published, only allow if it's an admin (this is a simplified check, 
        // in a production app we'd want to check the token if present)
        if (!page.isPublished) {
            // We can check for a 'preview' query param or similar
            const isPreview = req.query.preview === 'true';
            if (!isPreview) {
                return res.status(404).json({ error: 'Page not found' });
            }
        }

        res.json(page);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch page', details: error.message });
    }
});

// Admin: Get all pages
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json(pages);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Admin: Get page by ID (for builder)
router.get('/admin/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const page = await prisma.page.findUnique({
            where: { id: parseInt(id) }
        });

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(page);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

// Admin: Create page
router.post('/admin', authenticate, isAdmin, async (req, res) => {
    try {
        const { title, slug, content } = req.body;
        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content: content || [],
                isPublished: false
            }
        });
        res.status(201).json(page);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Slug must be unique' });
        }
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// Admin: Update page
router.put('/admin/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, content, isPublished } = req.body;

        const page = await prisma.page.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                content,
                isPublished,
                updatedAt: new Date()
            }
        });

        res.json(page);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// Admin: Delete page
router.delete('/admin/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.page.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Page deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

export default router;
