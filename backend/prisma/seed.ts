import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive seed...');

    // 1. CLEAR EXISTING DATA
    // Delete in reverse order of dependency
    await prisma.serviceImage.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.optionValue.deleteMany({});
    await prisma.productOption.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('🗑️  Cleared existing data (Clean Slate)');

    // 2. CREATE USERS
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@piedmontcopy.com',
            password: adminPassword,
            role: 'admin',
            fullName: 'System Administrator'
        }
    });

    const standardPassword = await bcrypt.hash('user123', 10);
    const customers = [];
    const customerData = [
        { email: 'john.doe@example.com', name: 'John Doe' },
        { email: 'jane.smith@example.com', name: 'Jane Smith' },
        { email: 'mike.jones@example.com', name: 'Mike Jones' },
        { email: 'sarah.white@example.com', name: 'Sarah White' },
        { email: 'alex.brown@example.com', name: 'Alex Brown' }
    ];

    for (const data of customerData) {
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: standardPassword,
                role: 'customer',
                fullName: data.name,
                phone: '555-010' + Math.floor(Math.random() * 9),
                address: '123 Printing Way, Press City, NY 1000' + Math.floor(Math.random() * 9)
            }
        });
        customers.push(user);
    }
    console.log('✅ Created Admin and 5 Customer users');

    // 3. CREATE PRODUCTS
    const products = [];

    // Helper to create product with options
    const productSpecs = [
        {
            slug: 'business-cards',
            name: 'Business Cards',
            price: 29.99,
            img: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Premium business cards printed on high-quality cardstock. Options for matte, gloss, or velvet finishes to help you make a lasting first impression.</p>',
            options: [
                { name: 'Paper Type', values: [{ n: '14pt Matte', p: 0 }, { n: '16pt Gloss', p: 5 }, { n: '100lb Linen', p: 10 }] },
                { name: 'Quantity', values: [{ n: '100', p: 0 }, { n: '250', p: 15 }, { n: '500', p: 25 }, { n: '1000', p: 45 }] }
            ]
        },
        {
            slug: 'flyers',
            name: 'Promotional Flyers',
            price: 49.99,
            img: 'https://images.unsplash.com/photo-1620844788326-17b5f1352c80?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Vibrant, full-color flyers that grab attention. Perfect for event promotion, menus, or informational hand-outs. Choice of sizes and weights.</p>',
            options: [
                { name: 'Size', values: [{ n: '4" x 6"', p: 0 }, { n: '5" x 7"', p: 10 }, { n: '8.5" x 11"', p: 20 }] },
                { name: 'Paper Weight', values: [{ n: '80lb Gloss Text', p: 0 }, { n: '100lb Gloss Text', p: 15 }] }
            ]
        },
        {
            slug: 'brochures',
            name: 'Tri-Fold Brochures',
            price: 89.99,
            img: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Professional marketing brochures with precision folding. Organize your services or products in a portable, high-impact format.</p>',
            options: [
                { name: 'Folding', values: [{ n: 'Tri-Fold', p: 0 }, { n: 'Bi-Fold', p: 0 }, { n: 'Z-Fold', p: 10 }] },
                { name: 'Quantity', values: [{ n: '50', p: 0 }, { n: '100', p: 30 }, { n: '250', p: 70 }] }
            ]
        },
        {
            slug: 'banners',
            name: 'Vinyl Banners',
            price: 59.99,
            img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Durable outdoor banners printed on 13oz vinyl. Includes brass grommets every 2 feet for easy hanging. Weather and UV resistant.</p>',
            options: [
                { name: 'Size', values: [{ n: '2\' x 4\'', p: 0 }, { n: '3\' x 6\'', p: 35 }, { n: '4\' x 8\'', p: 75 }] },
                { name: 'Wind Slits', values: [{ n: 'No', p: 0 }, { n: 'Yes', p: 12 }] }
            ]
        },
        {
            slug: 'posters',
            name: 'Wall Posters',
            price: 19.99,
            img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Turn your photography or designs into custom wall art. Printed on premium satin-finish photo paper with archival inks for deep blacks and vivid colors.</p>',
            options: [
                { name: 'Size', values: [{ n: '11" x 17"', p: 0 }, { n: '18" x 24"', p: 15 }, { n: '24" x 36"', p: 30 }] },
                { name: 'Material', values: [{ n: 'Stat-Flat Poly', p: 0 }, { n: 'Satin Paper', p: 0 }, { n: 'Foam Board', p: 45 }] }
            ]
        },
        {
            slug: 'stickers',
            name: 'Die-Cut Stickers',
            price: 34.00,
            img: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Individually cut stickers in any shape. Made from durable, waterproof vinyl that lasts up to 5 years outdoors. Matte or gloss finish.</p>',
            options: [
                { name: 'Finish', values: [{ n: 'Gloss', p: 0 }, { n: 'Matte', p: 0 }, { n: 'Holographic', p: 25 }] },
                { name: 'Quantity', values: [{ n: '50', p: 0 }, { n: '100', p: 20 }, { n: '250', p: 50 }] }
            ]
        },
        {
            slug: 'booklets',
            name: 'Saddle-Stitched Booklets',
            price: 120.00,
            img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Perfect for catalogs, event programs, or small publications. Securely stapled on the spine for a clean, professional finish.</p>',
            options: [
                { name: 'Page Count', values: [{ n: '8 Pages', p: 0 }, { n: '16 Pages', p: 40 }, { n: '32 Pages', p: 95 }] },
                { name: 'Cover', values: [{ n: 'Self-Cover', p: 0 }, { n: 'Heavyweight Cover', p: 25 }] }
            ]
        },
        {
            slug: 'notepads',
            name: 'Custom Notepads',
            price: 15.50,
            img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000',
            desc: '<p>Practical branded stationery for your office or as client gifts. 50 sheets per pad with a sturdy cardboard backing.</p>',
            options: [
                { name: 'Sheet Count', values: [{ n: '25 Sheets', p: 0 }, { n: '50 Sheets', p: 5 }] },
                { name: 'Size', values: [{ n: '4" x 6"', p: 0 }, { n: '5.5" x 8.5"', p: 4 }] }
            ]
        }
    ];

    for (const spec of productSpecs) {
        const product = await prisma.product.create({
            data: {
                slug: spec.slug,
                name: spec.name,
                description: spec.desc,
                basePrice: spec.price,
                imageUrl: spec.img,
                options: {
                    create: spec.options.map(opt => ({
                        name: opt.name,
                        type: 'select',
                        values: {
                            create: opt.values.map(val => ({
                                name: val.n,
                                priceModifier: val.p
                            }))
                        }
                    }))
                },
                images: {
                    create: [{ url: spec.img, isFeatured: true }]
                }
            },
            include: { options: { include: { values: true } } }
        });
        products.push(product);
    }
    console.log('✅ Created 8 Products with configuration options');

    // 4. CREATE SERVICES
    const serviceSpecs = [
        {
            slug: 'book-binding',
            title: 'Professional Book Binding',
            desc: 'High-quality binding for reports, thesis, and portfolios.',
            long: '<p>Give your documents the professional finish they deserve. Our binding options include spiral, wire-o, and perfect binding, suitable for everything from internal reports to graduate theses.</p>',
            features: ['Quick 24-hr turnaround', 'Clear/Solid covers', 'Sizes up to 300 pages', 'Thermal binding available'],
            img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1000',
            icon: 'Book'
        },
        {
            slug: 'copying',
            title: 'High-Speed Copying',
            desc: 'B&W and color copying for all your document needs.',
            long: '<p>Our high-volume digital copiers deliver crisp, clean results at incredible speeds. Whether you need a thousand copies of a training manual or a single color print of a photo, we handle it all.</p>',
            features: ['High-volume capacity', 'Auto collation', 'Stapling & hole punching', 'Vibrant color reproduction'],
            img: 'https://images.unsplash.com/photo-1544476915-ed1370594142?auto=format&fit=crop&q=80&w=1000',
            icon: 'Copy'
        },
        {
            slug: 'lamination',
            title: 'Professional Lamination',
            desc: 'Protect your important documents from wear and tear.',
            long: '<p>Seal your posters, menus, or ID cards in high-grade plastic to protect them from moisture, grease, and fingerprints. Available in gloss or matte finishes.</p>',
            features: ['UV resistance', 'Sizes up to 36" wide', 'Matte or Gloss options', 'Heavy 5-mil plastic'],
            img: 'https://images.unsplash.com/photo-1574621122321-3c734999039a?auto=format&fit=crop&q=80&w=1000',
            icon: 'Layers'
        },
        {
            slug: 'scanning',
            title: 'Archival Scanning & OCR',
            desc: 'Convert paper documents into searchable digital files.',
            long: '<p>Go paperless with our professional scanning services. We convert stacks of documents into searchable PDFs using advanced OCR technology.</p>',
            features: ['OCR Searchable text', 'Batch processing', 'Large format scanning', 'Cloud delivery'],
            img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
            icon: 'Scan'
        },
        {
            slug: 'layout-design',
            title: 'Creative Layout Design',
            desc: 'Expert design help for your brand and marketing materials.',
            long: '<p>Our in-house design team works with you to create stunning layouts for flyers, brochures, and logos that perfectly represent your vision.</p>',
            features: ['Logo development', 'Print-ready layouts', 'Typography experts', 'Brand consultation'],
            img: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?auto=format&fit=crop&q=80&w=1000',
            icon: 'Layout'
        },
        {
            slug: 'desktop-publishing',
            title: 'Desktop Publishing',
            desc: 'Formatting and layout for complex manual and books.',
            long: '<p>We specialize in the meticulous formatting of multi-page documents, technical manuals, and corporate reports, ensuring consistency and readability.</p>',
            features: ['InDesign experts', 'Complex tables/graphics', 'Proofreading help', 'Print optimization'],
            img: 'https://images.unsplash.com/photo-1521575107034-e0fa0b594529?auto=format&fit=crop&q=80&w=1000',
            icon: 'Book'
        },
        {
            slug: 'custom-printing',
            title: 'Specialty Custom Printing',
            desc: 'Tailored solutions for your most unique requirements.',
            long: '<p>Beyond standard products, we offer custom sizes, specialty paper stocks, and unique finishes like foil stamping and embossing for those special projects.</p>',
            features: ['Exotic paper stocks', 'Foil & Embossing', 'Custom die-cutting', 'Small-batch experts'],
            img: 'https://images.unsplash.com/photo-1517420803447-0683407c913c?auto=format&fit=crop&q=80&w=1000',
            icon: 'Printer'
        },
        {
            slug: 'faxing',
            title: 'Secure Fax Services',
            desc: 'Dependable incoming and outgoing faxing with confirmation.',
            long: '<p>Local and international fax services with immediate confirmation receipts. We provide a secure way to send and receive sensitive legal or medical documents.</p>',
            features: ['Confirmation receipts', 'International reach', 'Incoming fax hold', 'Secure handling'],
            img: 'https://images.unsplash.com/photo-1520923642038-b4259acecca7?auto=format&fit=crop&q=80&w=1000',
            icon: 'Phone'
        }
    ];

    for (const spec of serviceSpecs) {
        await prisma.service.create({
            data: {
                slug: spec.slug,
                title: spec.title,
                description: spec.desc,
                longDescription: spec.long,
                features: spec.features,
                imageUrl: spec.img,
                icon: spec.icon,
                images: {
                    create: [{ url: spec.img, isFeatured: true }]
                }
            }
        });
    }
    console.log('✅ Created 8 Professional Services');

    // 5. CREATE ORDERS
    console.log('🛒 Generating 10 varied orders...');
    const statuses = ['received', 'processing', 'completed', 'cancelled'];

    for (let i = 0; i < 10; i++) {
        const user = customers[Math.floor(Math.random() * customers.length)];
        const orderStatus = statuses[Math.floor(Math.random() * statuses.length)];

        // Randomly pick 1-3 products for this order
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, itemCount);

        const orderItems = [];
        let totalAmount = 0;

        for (const product of selectedProducts) {
            const quantity = Math.floor(Math.random() * 5) + 1;
            const configurations: Record<string, any> = {};
            let itemPrice = Number(product.basePrice);

            // Select random value for each option
            product.options.forEach(option => {
                const randomVal = option.values[Math.floor(Math.random() * option.values.length)];
                configurations[option.name] = {
                    name: randomVal.name,
                    priceModifier: Number(randomVal.priceModifier)
                };
                itemPrice += Number(randomVal.priceModifier);
            });

            const subtotal = itemPrice * quantity;
            totalAmount += subtotal;

            orderItems.push({
                productId: product.id,
                quantity,
                configurations,
                subtotal
            });
        }

        await prisma.order.create({
            data: {
                userId: user.id,
                status: orderStatus,
                totalAmount: totalAmount,
                shippingAddress: user.address as any,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000), // Random date in last 10 days
                items: {
                    create: orderItems
                }
            }
        });
    }

    console.log('✅ Created 10 realistic orders with multiple items');
    console.log('\n🌟 SEEDING COMPLETE!');
    console.log('------------------');
    console.log('Admin Email: admin@piedmontcopy.com');
    console.log('Customer Email: john.doe@example.com (and others)');
    console.log('Password for all customers: user123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
