import { Router } from 'express';
import {
    getAllServices,
    getServiceBySlug,
    createService,
    updateService,
    deleteService,
} from '../controllers/serviceController';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

// Apply upload middleware to allow file uploads (multiple 'images')
router.post('/', upload.array('images'), createService);
router.put('/:id', upload.array('images'), updateService);
router.delete('/:id', deleteService);

export default router;
