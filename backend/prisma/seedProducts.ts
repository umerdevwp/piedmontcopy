
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
    {
        name: 'Premium Business Cards',
        slug: 'premium-business-cards',
        description: '<h1>Make a lasting first impression</h1><p>Our premium business cards are designed to showcase your professional identity with high-quality cardstocks and elegant finishes.</p><ul><li>Standard 3.5" x 2" size</li><li>Choice of matte or glossy finishes</li><li>Durable 16pt cardstock</li></ul>',
        basePrice: 19.99,
        imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop',
        options: [
            {
                name: 'Paper Stock',
                type: 'radio',
                values: [
                    { name: 'Standard Matte', priceModifier: 0 },
                    { name: 'Premium Glossy', priceModifier: 5.00 },
                    { name: 'Uncoated Linen', priceModifier: 12.00 }
                ]
            },
            {
                name: 'Quantity',
                type: 'select',
                values: [
                    { name: '100 Cards', priceModifier: 0 },
                    { name: '250 Cards', priceModifier: 15.00 },
                    { name: '500 Cards', priceModifier: 25.00 }
                ]
            }
        ]
    },
    {
        name: 'Marketing Flyers',
        slug: 'marketing-flyers',
        description: '<h2>Spread the word effectively</h2><p>Vibrant, full-color flyers that capture attention. Perfect for events, sales, and localized marketing campaigns.</p><ul><li>Edge-to-edge printing</li><li>FSC-certified paper</li><li>Multiple fold options available</li></ul>',
        basePrice: 45.00,
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop',
        options: [
            {
                name: 'Paper Size',
                type: 'radio',
                values: [
                    { name: '8.5" x 11" (Letter)', priceModifier: 0 },
                    { name: '5.5" x 8.5" (Half)', priceModifier: -10.00 }
                ]
            },
            {
                name: 'Finish',
                type: 'select',
                values: [
                    { name: 'Standard Silk', priceModifier: 0 },
                    { name: 'UV High Gloss', priceModifier: 8.00 }
                ]
            }
        ]
    },
    {
        name: 'Vinyl Banners',
        slug: 'vinyl-banners-pro',
        description: '<h1>Outdoor Advertising Specialists</h1><p>Durable, weatherproof vinyl banners with reinforced grommets. Built to withstand the elements and keep your message visible.</p>',
        basePrice: 29.00,
        imageUrl: 'https://images.unsplash.com/photo-1596708059442-b3e6fe654c63?q=80&w=1974&auto=format&fit=crop',
        options: [
            {
                name: 'Banner Size',
                type: 'select',
                values: [
                    { name: '2ft x 4ft', priceModifier: 0 },
                    { name: '3ft x 6ft', priceModifier: 25.00 },
                    { name: '4ft x 8ft', priceModifier: 55.00 }
                ]
            }
        ]
    },
    {
        name: 'Promotional Postcards',
        slug: 'promo-postcards',
        description: '<p>Direct mail marketing made easy. Professional postcards that deliver your message directly into customers\' hands.</p>',
        basePrice: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=2070&auto=format&fit=crop',
        options: [
            {
                name: 'Quantity',
                type: 'select',
                values: [
                    { name: '50 Postcards', priceModifier: 0 },
                    { name: '100 Postcards', priceModifier: 15.00 },
                    { name: '500 Postcards', priceModifier: 60.00 }
                ]
            }
        ]
    },
    {
        name: 'Trifold Brochures',
        slug: 'trifold-brochures',
        description: '<h3>Professional Information Presentation</h3><p>Organize your products and services into a clean, easy-to-read trifold layout.</p>',
        basePrice: 89.00,
        imageUrl: 'https://images.unsplash.com/photo-1586075010620-2dca46755ec8?q=80&w=1974&auto=format&fit=crop',
        options: [
            {
                name: 'Quantity',
                type: 'radio',
                values: [
                    { name: '25 Brochures', priceModifier: 0 },
                    { name: '100 Brochures', priceModifier: 60.00 }
                ]
            }
        ]
    },
    {
        name: 'Event Invitations',
        slug: 'event-invitations',
        description: '<h1>Celebrate in Style</h1><p>Premium invitations for weddings, corporate galas, and special milestones.</p>',
        basePrice: 35.00,
        imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop',
        options: [
            {
                name: 'Cardstock',
                type: 'radio',
                values: [
                    { name: 'Classic Smooth', priceModifier: 0 },
                    { name: 'Pearlescent Shimmer', priceModifier: 15.00 }
                ]
            }
        ]
    },
    {
        name: 'Mailing Labels',
        slug: 'mailing-labels',
        description: '<p>Convenient, self-adhesive labels for your shipping and correspondence needs.</p>',
        basePrice: 12.00,
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop',
        options: [
            {
                name: 'Quantity',
                type: 'select',
                values: [
                    { name: '140 Labels', priceModifier: 0 },
                    { name: '280 Labels', priceModifier: 8.00 }
                ]
            }
        ]
    },
    {
        name: 'Custom Stickers',
        slug: 'custom-stickers',
        description: '<h2>Brand everything</h2><p>High-quality vinyl stickers that stick to almost any surface. Waterproof and UV-resistant.</p>',
        basePrice: 15.00,
        imageUrl: 'https://images.unsplash.com/photo-1572375927902-1c716d522437?q=80&w=2021&auto=format&fit=crop',
        options: [
            {
                name: 'Shape',
                type: 'radio',
                values: [
                    { name: 'Round', priceModifier: 0 },
                    { name: 'Square', priceModifier: 0 },
                    { name: 'Die-cut Custom', priceModifier: 10.00 }
                ]
            }
        ]
    },
    {
        name: 'Ceramic Mugs',
        slug: 'ceramic-mugs',
        description: '<p>Start every morning with a custom mug featuring your logo or favorite photo.</p>',
        basePrice: 14.50,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?q=80&w=2070&auto=format&fit=crop',
        options: [
            {
                name: 'Mug Size',
                type: 'radio',
                values: [
                    { name: '11oz Standard', priceModifier: 0 },
                    { name: '15oz Deluxe', priceModifier: 4.00 }
                ]
            }
        ]
    },
    {
        name: 'Graphic T-shirts',
        slug: 'graphic-tshirts',
        description: '<h1>Wear your brand</h1><p>Soft, 100% cotton T-shirts with high-resolution direct-to-garment printing.</p>',
        basePrice: 22.00,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop',
        options: [
            {
                name: 'Size',
                type: 'select',
                values: [
                    { name: 'S', priceModifier: 0 },
                    { name: 'M', priceModifier: 0 },
                    { name: 'L', priceModifier: 0 },
                    { name: 'XL', priceModifier: 0 },
                    { name: '2XL', priceModifier: 3.00 }
                ]
            },
            {
                name: 'Material',
                type: 'radio',
                values: [
                    { name: 'Essential Cotton', priceModifier: 0 },
                    { name: 'Organic Premium', priceModifier: 8.00 }
                ]
            }
        ]
    },
    {
        name: 'Advertising Posters',
        slug: 'advertising-posters',
        description: '<h2>Visual impact delivered</h2><p>Large-format posters printed on premium photo-quality paper.</p>',
        basePrice: 18.00,
        imageUrl: 'https://images.unsplash.com/photo-1541944743827-e04bb645d993?q=80&w=2070&auto=format&fit=crop',
        options: [
            {
                name: 'Poster Size',
                type: 'select',
                values: [
                    { name: '18" x 24"', priceModifier: 0 },
                    { name: '24" x 36"', priceModifier: 15.00 }
                ]
            }
        ]
    },
    {
        name: 'Magnetic Signs',
        slug: 'magnetic-signs',
        description: '<p>Turn your vehicle into a moving billboard with easy-to-apply magnetic signage.</p>',
        basePrice: 42.00,
        imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop',
        options: [
            {
                name: 'Quantity',
                type: 'radio',
                values: [
                    { name: 'Single Sign', priceModifier: 0 },
                    { name: 'Pair (2 Signs)', priceModifier: 35.00 }
                ]
            }
        ]
    },
    {
        name: 'Desk Calendars',
        slug: 'desk-calendars',
        description: '<h1>Stay top of mind all year</h1><p>Perfect for corporate gifting. Your brand displayed every day of the year.</p>',
        basePrice: 16.99,
        imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop',
        options: [
            {
                name: 'Calendar Type',
                type: 'radio',
                values: [
                    { name: 'Standard Tent', priceModifier: 0 },
                    { name: 'Premium Wire-O', priceModifier: 6.00 }
                ]
            }
        ]
    },
    {
        name: 'Portfolio Folders',
        slug: 'portfolio-folders',
        description: '<h3>Professional Document Organization</h3><p>Custom presentation folders with internal pockets and business card slots.</p>',
        basePrice: 125.00,
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
        options: [
            {
                name: 'Finishing',
                type: 'select',
                values: [
                    { name: 'Matte Lamination', priceModifier: 0 },
                    { name: 'Soft Touch Velvet', priceModifier: 45.00 }
                ]
            }
        ]
    },
    {
        name: 'Personalized Pens',
        slug: 'personalized-pens',
        description: '<p>Keep your contact info in hand with laser-engraved executive pens.</p>',
        basePrice: 2.50,
        imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1924&auto=format&fit=crop',
        options: [
            {
                name: 'Unit Quantity',
                type: 'select',
                values: [
                    { name: '50 Units', priceModifier: 0 },
                    { name: '100 Units', priceModifier: 110.00 },
                    { name: '250 Units', priceModifier: 250.00 }
                ]
            }
        ]
    }
];

async function main() {
    console.log('Start seeding products...');
    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                basePrice: p.basePrice,
                imageUrl: p.imageUrl,
                options: {
                    create: p.options.map(o => ({
                        name: o.name,
                        type: o.type,
                        values: {
                            create: o.values.map(v => ({
                                name: v.name,
                                priceModifier: v.priceModifier
                            }))
                        }
                    }))
                }
            },
        });
        console.log(`Created/Updated product: ${product.name}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
