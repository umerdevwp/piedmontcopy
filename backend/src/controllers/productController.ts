import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 1000;
        const skip = (page - 1) * limit;
        const search = req.query.search as string;

        const where: any = {};
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    options: {
                        include: {
                            values: true
                        }
                    },
                    images: true
                },
                skip: limit === 0 ? 0 : skip,
                take: limit === 0 ? undefined : limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: limit === 0 ? 1 : Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                options: {
                    include: {
                        values: true
                    }
                },
                images: true
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { slug, name, description, basePrice, options: optionsStr, featuredImageIndex } = req.body;
        const files = req.files as Express.Multer.File[];

        let options = [];
        if (optionsStr) {
            try {
                options = JSON.parse(optionsStr);
            } catch (e) {
                console.error('Failed to parse options', e);
            }
        }

        const product = await prisma.product.create({
            data: {
                slug,
                name,
                description,
                basePrice: parseFloat(basePrice),
                // Keep imageUrl backward compatible using the first image or featured one
                imageUrl: files && files.length > 0 ? `/uploads/${files[parseInt(featuredImageIndex) || 0].filename}` : null,
                images: {
                    create: files ? files.map((file, index) => ({
                        url: `/uploads/${file.filename}`,
                        isFeatured: parseInt(featuredImageIndex) === index
                    })) : []
                },
                options: {
                    create: options?.map((opt: any) => ({
                        name: opt.name,
                        type: opt.type,
                        values: {
                            create: opt.values.map((val: any) => ({
                                name: val.name,
                                priceModifier: val.priceModifier
                            }))
                        }
                    }))
                }
            },
            include: {
                options: { include: { values: true } },
                images: true
            }
        });

        res.status(201).json(product);
    } catch (error: any) {
        console.error('Create Product Error:', error);
        // Handle unique constraint violation for slug
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Product with this slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        console.log(`Updating product: ${req.params.id}`, {
            method: req.method,
            contentType: req.headers['content-type'],
            hasBody: !!req.body,
            hasFiles: !!req.files
        });

        if (!req.body) {
            return res.status(400).json({
                error: 'Request body is missing. If you are uploading images, ensure you are using multipart/form-data.'
            });
        }

        const { id } = req.params;
        const { slug, name, description, basePrice, options: optionsStr, deleteImageIds: deleteImageIdsStr, featuredImageId, featuredImageIndex } = req.body;
        const productId = parseInt(id);
        const files = req.files as Express.Multer.File[];

        let options = [];
        if (optionsStr && typeof optionsStr === 'string') {
            try { options = JSON.parse(optionsStr); } catch (e) { }
        } else if (optionsStr) {
            options = optionsStr;
        }

        let deleteImageIds: number[] = [];
        if (deleteImageIdsStr) {
            try { deleteImageIds = JSON.parse(deleteImageIdsStr); } catch (e) { }
        }

        const updatedProduct = await prisma.$transaction(async (tx) => {
            // 1. Handle Image Deletions
            if (deleteImageIds.length > 0) {
                await tx.productImage.deleteMany({
                    where: {
                        id: { in: deleteImageIds },
                        productId: productId
                    }
                });
            }

            // 2. Reset Featured Status for ALL existing images (before adding new ones)
            await tx.productImage.updateMany({
                where: { productId: productId },
                data: { isFeatured: false }
            });

            // 3. Add New Images
            if (files && files.length > 0) {
                await tx.productImage.createMany({
                    data: files.map((file, index) => ({
                        url: `/uploads/${file.filename}`,
                        productId: productId,
                        isFeatured: parseInt(featuredImageIndex) === index
                    }))
                });
            }

            // 4. Set Existing Image as Featured (if selected)
            if (featuredImageId) {
                await tx.productImage.update({
                    where: { id: parseInt(featuredImageId) },
                    data: { isFeatured: true }
                });
            }

            // 5. Fallback: Ensure one image is featured if none are
            // Logic: Check if any is featured. If not, set the first one.
            // Note: We can't easily check newly created ones in the same TX without querying, 
            // but we can assume if featuredImageIndex was set, one is created.
            // If neither featuredImageId nor featuredImageIndex (valid) was set, we might have no featured image.

            // Check if we have a featured image now?
            // Since we might have just created one, let's query.
            let featuredImg = await tx.productImage.findFirst({ where: { productId, isFeatured: true } });

            if (!featuredImg) {
                // Try to find ANY image
                const firstImg = await tx.productImage.findFirst({ where: { productId } });
                if (firstImg) {
                    await tx.productImage.update({ where: { id: firstImg.id }, data: { isFeatured: true } });
                    featuredImg = firstImg;
                }
            }

            // 6. Update Product Basic & Options
            const product = await tx.product.update({
                where: { id: productId },
                data: {
                    slug,
                    name,
                    description,
                    basePrice: basePrice ? parseFloat(basePrice) : undefined,
                    imageUrl: featuredImg ? featuredImg.url : null
                }
            });

            // 7. Update Options (Full Replace Strategy as before)
            if (options) { // Only update options if provided
                const existingOptions = await tx.productOption.findMany({ where: { productId } });
                const optionIds = existingOptions.map(o => o.id);
                await tx.optionValue.deleteMany({ where: { optionId: { in: optionIds } } });
                await tx.productOption.deleteMany({ where: { productId } });

                if (options.length > 0) {
                    for (const opt of options) {
                        await tx.productOption.create({
                            data: {
                                name: opt.name,
                                type: opt.type,
                                productId: productId,
                                values: {
                                    create: opt.values.map((val: any) => ({
                                        name: val.name,
                                        priceModifier: val.priceModifier
                                    }))
                                }
                            }
                        });
                    }
                }
            }

            return tx.product.findUnique({
                where: { id: productId },
                include: {
                    options: { include: { values: true } },
                    images: true
                }
            });
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productId = parseInt(id);

        // Prisma transaction to delete deeply nested relations
        await prisma.$transaction(async (tx) => {
            // Delete images
            await tx.productImage.deleteMany({ where: { productId } });

            // Delete options
            const options = await tx.productOption.findMany({ where: { productId } });
            const optionIds = options.map(o => o.id);
            await tx.optionValue.deleteMany({ where: { optionId: { in: optionIds } } });
            await tx.productOption.deleteMany({ where: { productId } });

            // Delete product
            await tx.product.delete({ where: { id: productId } });
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
