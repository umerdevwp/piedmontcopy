import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllServices = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [services, total] = await Promise.all([
            prisma.service.findMany({
                include: { images: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.service.count()
        ]);

        res.json({
            data: services,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Prisma Error (getAllServices):', error);
        res.status(500).json({ message: 'Error fetching services', error: error instanceof Error ? error.message : error });
    }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const service = await prisma.service.findUnique({
            where: { slug },
            include: { images: true }
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error('Prisma Error (getServiceBySlug):', error);
        res.status(500).json({ message: 'Error fetching service', error: error instanceof Error ? error.message : error });
    }
};

export const createService = async (req: Request, res: Response) => {
    try {
        const { slug, title, description, longDescription, features: featuresStr, icon, featuredImageIndex } = req.body;
        const files = req.files as Express.Multer.File[];

        // Parse features from JSON string
        let features = [];
        try {
            features = JSON.parse(featuresStr);
        } catch (e) {
            features = [];
        }

        const service = await prisma.service.create({
            data: {
                slug,
                title,
                description,
                longDescription,
                features,
                icon,
                imageUrl: files && files.length > 0 ? `/uploads/${files[parseInt(featuredImageIndex) || 0].filename}` : null,
                images: {
                    create: files ? files.map((file, index) => ({
                        url: `/uploads/${file.filename}`,
                        isFeatured: parseInt(featuredImageIndex) === index
                    })) : []
                }
            },
            include: { images: true }
        });
        res.status(201).json(service);
    } catch (error: any) {
        console.error('Prisma Error (createService):', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'A service with this slug already exists.' });
        }
        res.status(500).json({ message: 'Error creating service', error: error.message || error });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        console.log(`Updating service: ${req.params.id}`, {
            method: req.method,
            contentType: req.headers['content-type'],
            hasBody: !!req.body
        });

        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing.' });
        }

        const { id } = req.params;
        const { slug, title, description, longDescription, features: featuresStr, icon, deleteImageIds: deleteImageIdsStr, featuredImageId, featuredImageIndex } = req.body;
        const serviceId = parseInt(id);
        const files = req.files as Express.Multer.File[];

        let features = [];
        if (featuresStr) {
            try { features = JSON.parse(featuresStr); } catch (e) { }
        } else if (Array.isArray(featuresStr)) {
            features = featuresStr;
        }

        let deleteImageIds: number[] = [];
        if (deleteImageIdsStr) {
            try { deleteImageIds = JSON.parse(deleteImageIdsStr); } catch (e) { }
        }

        const updatedService = await prisma.$transaction(async (tx) => {
            // 1. Handle Image Deletions
            if (deleteImageIds.length > 0) {
                await tx.serviceImage.deleteMany({
                    where: {
                        id: { in: deleteImageIds },
                        serviceId: serviceId
                    }
                });
            }

            // 2. Reset Featured Status for ALL existing images (before adding new ones)
            await tx.serviceImage.updateMany({
                where: { serviceId: serviceId },
                data: { isFeatured: false }
            });

            // 3. Add New Images
            if (files && files.length > 0) {
                await tx.serviceImage.createMany({
                    data: files.map((file, index) => ({
                        url: `/uploads/${file.filename}`,
                        serviceId: serviceId,
                        isFeatured: parseInt(featuredImageIndex) === index
                    }))
                });
            }

            // 4. Set Existing Image as Featured (if selected)
            if (featuredImageId) {
                await tx.serviceImage.update({
                    where: { id: parseInt(featuredImageId) },
                    data: { isFeatured: true }
                });
            }

            // 5. Fallback: Ensure one image is featured if none are
            let featuredImg = await tx.serviceImage.findFirst({ where: { serviceId, isFeatured: true } });

            if (!featuredImg) {
                // Try to find ANY image
                const firstImg = await tx.serviceImage.findFirst({ where: { serviceId } });
                if (firstImg) {
                    await tx.serviceImage.update({ where: { id: firstImg.id }, data: { isFeatured: true } });
                    featuredImg = firstImg;
                }
            }

            // 6. Update Service
            return tx.service.update({
                where: { id: serviceId },
                data: {
                    slug,
                    title,
                    description,
                    longDescription,
                    features,
                    icon,
                    imageUrl: featuredImg ? featuredImg.url : undefined
                },
                include: { images: true }
            });
        });

        res.json(updatedService);
    } catch (error: any) {
        console.error('Prisma Error (updateService):', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'A service with this slug already exists.' });
        }
        res.status(500).json({ message: 'Error updating service', error: error.message || error });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const serviceId = parseInt(id);

        await prisma.$transaction(async (tx) => {
            // Delete images first
            await tx.serviceImage.deleteMany({ where: { serviceId } });

            // Delete service
            await tx.service.delete({ where: { id: serviceId } });
        });

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Prisma Error (deleteService):', error);
        res.status(500).json({ message: 'Error deleting service', error: error instanceof Error ? error.message : error });
    }
};
