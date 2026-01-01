
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all pages (Admin only or Public?)
// Usually public for showing in menus, but let's keep it restricted for now or allow filtering
router.get('/', async (req, res) => {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Get single page by slug (Public)
router.get('/:slug', async (req, res) => {
    try {
        const page = await prisma.page.findUnique({
            where: { slug: req.params.slug }
        });
        if (!page) return res.status(404).json({ error: 'Page not found' });
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

// Create page (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
    const { slug, title, content } = req.body;
    try {
        const page = await prisma.page.create({
            data: { slug, title, content }
        });
        res.status(201).json(page);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A page with this slug already exists.' });
        }
        console.error('Create Page Error:', error);
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// Update page (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { slug, title, content } = req.body;
    try {
        const page = await prisma.page.update({
            where: { id: parseInt(id) },
            data: { slug, title, content }
        });
        res.json(page);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A page with this slug already exists.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Page not found.' });
        }
        console.error('Update Page Error:', error);
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// Delete page (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.page.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

export default router;
