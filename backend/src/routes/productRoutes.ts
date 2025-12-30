import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin Routes
router.post('/', authenticate, isAdmin, upload.array('images'), createProduct);
router.put('/:id', authenticate, isAdmin, upload.array('images'), updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;
