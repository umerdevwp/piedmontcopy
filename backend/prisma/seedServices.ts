import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const services = [
    {
        slug: 'book-binding',
        title: 'Professional Book Binding',
        description: 'High-quality binding solutions for your documents, reports, and books.',
        longDescription: `Elevate your documents with our premium book binding services. Whether you need a simple spiral bind for a school project or a sophisticated hardcover for a corporate report, we have the machinery and expertise to deliver flawless results. ${LOREM_IPSUM}`,
        features: ['Spiral Binding', 'Perfect Binding', 'Hardcover Options', 'Velo Binding', 'Custom Covers'],
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
        icon: 'Book'
    },
    {
        slug: 'copying-services',
        title: 'High-Speed Copying',
        description: 'Fast, crisp, and high-volume copying for black & white or color documents.',
        longDescription: `Need copies fast? Our state-of-the-art copiers can handle high-volume jobs with incredible speed and accuracy. We offer a range of paper stocks and finishing options to ensure your copies look professional and polished. ${LOREM_IPSUM}`,
        features: ['B&W and Color', 'High Volume', 'Collating', 'Stapling', 'Hole Punching'],
        imageUrl: 'https://images.unsplash.com/photo-1635352723756-74637b909f6d?auto=format&fit=crop&q=80&w=1000',
        icon: 'Copy'
    },
    {
        slug: 'lamination',
        title: 'Protective Lamination',
        description: 'Preserve and protect your important documents with our lamination services.',
        longDescription: `Shield your documents from spills, tears, and everyday wear and tear. Our lamination services are perfect for menus, ID cards, signage, and important certificates. Choose from a variety of finishes, including matte and gloss. ${LOREM_IPSUM}`,
        features: ['Business Card Size', 'Large Format', 'Matte & Gloss Finish', 'Rigid or Flexible', 'Waterproof'],
        imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
        icon: 'Layers'
    },
    {
        slug: 'scanning',
        title: 'Document Scanning',
        description: 'Digitize your archives with high-resolution scanning services.',
        longDescription: `Go paperless and organize your files with our professional scanning services. We convert your physical documents into high-quality digital formats (PDF, JPG, TIFF) that are easy to store, potential share, and search. ${LOREM_IPSUM}`,
        features: ['High Resolution', 'OCR Text Recognition', 'Large Format Scanning', 'Bulk Document Archiving', 'Secure Handling'],
        imageUrl: 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a?auto=format&fit=crop&q=80&w=1000',
        icon: 'Scan'
    },
    {
        slug: 'layout-design',
        title: 'Professional Layout Design',
        description: 'Expert layout services for brochures, flyers, and publications.',
        longDescription: `Don't let a bad layout ruin your message. Our graphic design team can help you structure your content for maximum impact. We specialize in creating clean, readable, and visually appealing layouts for all types of printed materials. ${LOREM_IPSUM}`,
        features: ['Brochure Layout', 'Magazine Spreads', 'Newsletter Formatting', 'Typesetting', 'Visual Hierarchy'],
        imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=1000',
        icon: 'Layout'
    },
    {
        slug: 'desktop-publishing',
        title: 'Desktop Publishing',
        description: 'Full-service DTP to prepare your documents for print.',
        longDescription: `Ensure your documents are print-ready with our desktop publishing services. We handle file conversion, color correction, font management, and margin adjustments to guarantee a perfect print run every time. ${LOREM_IPSUM}`,
        features: ['File Conversion', 'Color Management', 'Print Preparation', 'Formatting', 'Editing'],
        imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000',
        icon: 'MonitorCheck'
    },
    {
        slug: 'custom-printing',
        title: 'Custom Printing Solutions',
        description: 'Unique printing capabilities for non-standard projects.',
        longDescription: `Have a unique idea? We can make it happen. From custom die-cuts and foil stamping to specialized materials and unique sizes, our manufacturing team loves a challenge. Let's create something one-of-a-kind. ${LOREM_IPSUM}`,
        features: ['Die Cutting', 'Foil Stamping', 'Embossing', 'Specialty Papers', 'Pantone Matching'],
        imageUrl: 'https://images.unsplash.com/photo-1616624976779-7c4701e30906?auto=format&fit=crop&q=80&w=1000',
        icon: 'Printer'
    },
    {
        slug: 'faxing',
        title: 'Fax Services',
        description: 'Reliable domestic and international fax sending and receiving.',
        longDescription: `Yes, fax is still essential for many legal and medical documents. We offer secure, reliable fax services to any number worldwide. We provide a transmission receipt for every job, ensuring your important documents reach their destination. ${LOREM_IPSUM}`,
        features: ['Domestic & International', 'Sending & Receiving', 'Confirmation Receipts', 'Secure Transmission', 'Hard Copy Proofs'],
        imageUrl: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80&w=1000',
        icon: 'Phone'
    }
];

async function main() {
    console.log('Start seeding services...');
    for (const s of services) {
        const service = await prisma.service.upsert({
            where: { slug: s.slug },
            update: s,
            create: s,
        });
        console.log(`Created service with id: ${service.id}`);
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
