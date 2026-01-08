import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, isAdmin, type AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.globalSetting.findMany();
        // Convert array to object for easier frontend consumption
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
        res.json(settingsMap);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// POST /api/settings - Bulk update settings (Admin only)
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
        const updates = req.body as Record<string, string>;
        const promises = Object.entries(updates).map(([key, value]) =>
            prisma.globalSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            })
        );

        await Promise.all(promises);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

export default router;
