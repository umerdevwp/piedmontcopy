
import express from 'express';
import { register, login, getMe, updateProfile, getAllUsers, createUser, updateUser, deleteUser } from '../controllers/authController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.patch('/update', authenticate, updateProfile);

// Admin User Management
router.get('/admin/all', authenticate, isAdmin, getAllUsers);
router.post('/admin/create', authenticate, isAdmin, createUser);
router.patch('/admin/update/:id', authenticate, isAdmin, updateUser);
router.delete('/admin/delete/:id', authenticate, isAdmin, deleteUser);

export default router;
