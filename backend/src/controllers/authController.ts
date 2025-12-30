
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
// @ts-ignore
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';

// Register User
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, fullName, phone, address } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === 'admin' ? 'admin' : 'customer';

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole,
                fullName: fullName || null,
                phone: phone || null,
                address: address || null
            } as any
        }) as any;

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login User
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } }) as any;
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName || null,
                phone: user.phone || null,
                address: user.address || null
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get Current User (Me)
export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                fullName: true,
                phone: true,
                address: true
            } as any
        }) as any;

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update User Profile
export const updateProfile = async (req: Request | any, res: Response) => {
    try {
        const { fullName, phone, address, email } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                fullName: fullName !== undefined ? fullName : undefined,
                phone: phone !== undefined ? phone : undefined,
                address: address !== undefined ? address : undefined,
                email: email !== undefined ? email : undefined
            } as any,
            select: {
                id: true,
                email: true,
                role: true,
                fullName: true,
                phone: true,
                address: true
            } as any
        }) as any;

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error: any) {
        console.error('Update Profile Error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

// --- ADMIN USER MANAGEMENT ---

// Get All Users (Admin)
export const getAllUsers = async (req: any, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    role: true,
                    fullName: true,
                    phone: true,
                    address: true,
                    createdAt: true
                } as any,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count()
        ]);

        res.json({
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create User (Admin)
export const createUser = async (req: any, res: Response) => {
    try {
        const { email, password, role, fullName, phone, address } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password || 'password123', 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'customer',
                fullName,
                phone,
                address
            } as any
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update User (Admin)
export const updateUser = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { email, role, fullName, phone, address, password } = req.body;

        const updateData: any = {
            email,
            role,
            fullName,
            phone,
            address
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json(user);
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete User (Admin)
export const deleteUser = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
