
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌟 Creating Demo Page...');

    const demoContent = [
        // 1. Hero Slider (Most impressive first)
        {
            id: 'demo-slider',
            type: 'hero-slider',
            content: {
                slides: [
                    {
                        title: 'Welcome to the Demo',
                        subtitle: 'This page showcases every available component in our new Page Builder system.',
                        buttonText: 'Explore Blocks',
                        bgImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070',
                        tag: 'Feature Tour'
                    },
                    {
                        title: 'Dynamic Content',
                        subtitle: 'Easily manage rich layouts, animations, and responsive designs.',
                        buttonText: 'Get Started',
                        bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
                        tag: 'Powerful'
                    }
                ]
            }
        },

        // 2. Introduction Text
        {
            id: 'demo-intro',
            type: 'text',
            content: {
                body: '<div style="text-align: center;"><h2>The Building Blocks of Design</h2><p>Our CMS isn\'t just about text; it\'s about creating experiences. Below you will find examples of every block type currently available to you.</p></div>'
            }
        },

        // 3. Features Grid
        {
            id: 'demo-features',
            type: 'features',
            content: {
                items: [
                    { title: 'Responsive', desc: 'Looks great on mobile, tablet, and desktop automatically.' },
                    { title: 'Interactive', desc: 'Engage users with hover effects and smooth transitions.' },
                    { title: 'Customizable', desc: 'Control content, images, and layout from the admin panel.' }
                ]
            }
        },

        // 4. Parallax Section
        {
            id: 'demo-parallax',
            type: 'parallax',
            content: {
                title: 'Parallax Effects',
                subtitle: 'Add depth to your narrative with scrolling background interactions.',
                imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070',
                enabled: true
            }
        },

        // 5. Content + Media (Standard Layout)
        {
            id: 'demo-media-1',
            type: 'content-media',
            content: {
                title: 'Balanced Layouts',
                body: '<p>Combine rich imagery with compelling text. This block supports swapping sides with a single click, perfect for "zig-zag" layout patterns.</p>',
                imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072',
                buttonText: 'Learn More',
                swap: false
            }
        },

        // 6. Content + Media (Swapped/Reversed)
        {
            id: 'demo-media-2',
            type: 'content-media',
            content: {
                title: 'Visual Harmony',
                body: '<p>By alternating image positions, you create a visual rhythm that keeps readers engaged as they scroll down the page.</p>',
                imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070',
                buttonText: '',
                swap: true
            }
        },

        // 7. Premium List (Cards Style)
        {
            id: 'demo-list-title',
            type: 'text',
            content: { body: '<h3 style="text-align: center; margin-bottom: 0;">Multi-Style Lists</h3><p style="text-align: center;">One block, five different looks.</p>' }
        },
        {
            id: 'demo-list-cards',
            type: 'premium-list',
            content: {
                style: 'cards',
                items: [
                    { title: 'Card Style 1', desc: 'Clean, boxed layout with shadow.' },
                    { title: 'Card Style 2', desc: 'Perfect for highlighting services.' },
                    { title: 'Card Style 3', desc: 'Consistent height and spacing.' }
                ]
            }
        },

        // 8. Premium List (Checklist Style)
        {
            id: 'demo-list-check',
            type: 'premium-list',
            content: {
                style: 'checklist',
                items: [
                    { title: 'Checklist Item 1', desc: 'Great for feature lists' },
                    { title: 'Checklist Item 2', desc: 'Uses standard success icons' },
                    { title: 'Checklist Item 3', desc: 'Simple and effective' }
                ]
            }
        },

        // 9. Section Layout (Columns)
        {
            id: 'demo-layout-title',
            type: 'text',
            content: { body: '<h2 style="text-align: center;">Advanced Layouts</h2>' }
        },
        {
            id: 'demo-section',
            type: 'section-layout',
            content: {
                columns: [
                    {
                        width: '1/3',
                        blocks: [
                            { id: 'col-1-img', type: 'image', content: { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070', caption: 'Column 1' } },
                            { id: 'col-1-txt', type: 'text', content: { body: '<p style="font-size: 0.9em;">Stacked content in a 1/3 column.</p>' } }
                        ]
                    },
                    {
                        width: '2/3',
                        blocks: [
                            { id: 'col-2-hero', type: 'hero', content: { title: 'Nested Hero', subtitle: 'Yes, you can even put hero blocks inside columns.', buttonText: 'Crazy, right?', bgImage: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070' } }
                        ]
                    }
                ]
            }
        },

        // 10. Testimonials
        {
            id: 'demo-testimonials',
            type: 'testimonials',
            content: {
                items: [
                    { author: 'Jane Designer', quote: 'This is exactly the tool I needed to build pages faster.' },
                    { author: 'John Developer', quote: 'The code quality and performance are outstanding.' },
                    { author: 'Sarah Manager', quote: 'Finally, a CMS that actually looks good out of the box.' }
                ]
            }
        }
    ];

    await prisma.page.upsert({
        where: { slug: 'demo-elements' },
        update: {
            title: 'Element Showcase',
            content: demoContent
        },
        create: {
            slug: 'demo-elements',
            title: 'Element Showcase',
            content: demoContent
        }
    });

    console.log('✅ Demo page "demo-elements" created successfully!');
    console.log('👉 View at: http://localhost:5173/p/demo-elements');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
