import { Router } from 'express';
import { upload } from '../middleware/upload';

const router = Router();

// Professional Artwork Upload Endpoint
router.post('/artwork', upload.array('files'), (req, res) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = files.map(file => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`,
            type: file.mimetype
        }));

        res.json({ files: uploadedFiles });
    } catch (error) {
        console.error('Artwork upload error:', error);
        res.status(500).json({ error: 'Failed to upload artwork' });
    }
});

export default router;
