import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const navigationData = [
    // ======= UTILITY BAR LINKS (Header) =======
    { label: 'Websites', url: '/services/websites', type: 'utility', position: 0, icon: 'Globe', scope: 'header' },
    { label: 'Corporate Pricing', url: '/corporate', type: 'utility', position: 1, icon: 'Building2', scope: 'header' },
    { label: 'Reseller Program', url: '/reseller', type: 'utility', position: 2, icon: 'Users', badge: 'NEW', scope: 'header' },
    { label: 'Partner Services', url: '/partners', type: 'utility', position: 3, icon: 'Handshake', scope: 'header' },

    // ======= MAIN CATEGORIES (Header) =======
    {
        label: 'Deals', url: '/deals', type: 'main', position: 0, badge: 'HOT', scope: 'header',
        children: [
            {
                label: 'Current Promotions', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Up to 50% Off Business Cards', url: '/products/professional-business-cards', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Free Shipping Over $50', url: '/products', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Bulk Order Discounts', url: '/corporate', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            { label: 'Shop Deals', type: 'promo', position: 1, imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400', description: 'Limited time offers on all print products', scope: 'header' }
        ]
    },
    {
        label: 'Business Cards', url: '/products/professional-business-cards', type: 'main', position: 1, scope: 'header',
        children: [
            {
                label: 'By Material', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Matte Finish', url: '/products?filter=matte', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Glossy Finish', url: '/products?filter=glossy', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Uncoated', url: '/products?filter=uncoated', type: 'mega-item', position: 2, scope: 'header' },
                    { label: 'Textured/Linen', url: '/products?filter=textured', type: 'mega-item', position: 3, scope: 'header' }
                ]
            },
            {
                label: 'By Shape', type: 'mega-category', position: 1, scope: 'header', children: [
                    { label: 'Standard Rectangle', url: '/products?shape=standard', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Rounded Corners', url: '/products?shape=rounded', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Square', url: '/products?shape=square', type: 'mega-item', position: 2, scope: 'header' },
                    { label: 'Circle', url: '/products?shape=circle', type: 'mega-item', position: 3, scope: 'header' }
                ]
            },
            {
                label: 'Premium Options', type: 'mega-category', position: 2, scope: 'header', children: [
                    { label: 'Ultra Thick (32pt)', url: '/products?premium=thick', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Foil Accents', url: '/products?premium=foil', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Embossed', url: '/products?premium=embossed', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            { label: 'Premium Cards', type: 'promo', position: 3, imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=400', description: 'Make a lasting first impression', scope: 'header' }
        ]
    },
    {
        label: 'Signs & Banners', url: '/products/vinyl-banners-signage', type: 'main', position: 2, scope: 'header',
        children: [
            {
                label: 'Banners', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Vinyl Banners', url: '/products/vinyl-banners-signage', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Retractable Banners', url: '/products?type=retractable', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Mesh Banners', url: '/products?type=mesh', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            {
                label: 'Signs', type: 'mega-category', position: 1, scope: 'header', children: [
                    { label: 'Yard Signs', url: '/products?type=yard-signs', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'A-Frame Signs', url: '/products?type=a-frame', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Foam Board Signs', url: '/products/presentation-boards', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            {
                label: 'Posters', type: 'mega-category', position: 2, scope: 'header', children: [
                    { label: 'Large Format Posters', url: '/products/large-format-posters', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Mounted Posters', url: '/products?mount=foam', type: 'mega-item', position: 1, scope: 'header' }
                ]
            },
            { label: 'Outdoor Signage', type: 'promo', position: 3, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400', description: 'Weather-resistant for outdoor use', scope: 'header' }
        ]
    },
    {
        label: 'Marketing Materials', url: '/products', type: 'main', position: 3, scope: 'header',
        children: [
            {
                label: 'Brochures & Flyers', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Tri-Fold Brochures', url: '/products/tri-fold-brochures', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Marketing Flyers', url: '/products/marketing-flyers', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Rack Cards', url: '/products/rack-cards', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            {
                label: 'Direct Mail', type: 'mega-category', position: 1, scope: 'header', children: [
                    { label: 'Postcards', url: '/products/direct-mail-postcards', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Custom Envelopes', url: '/products/custom-envelopes', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Newsletters', url: '/products/newsletters', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            {
                label: 'Sales Materials', type: 'mega-category', position: 2, scope: 'header', children: [
                    { label: 'Sales Sheets', url: '/products/sales-sheets', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Product Catalogs', url: '/products/product-catalogs', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Pocket Folders', url: '/products/pocket-folders', type: 'mega-item', position: 2, scope: 'header' }
                ]
            }
        ]
    },
    {
        label: 'Stickers & Labels', url: '/products/die-cut-stickers', type: 'main', position: 4, scope: 'header',
        children: [
            {
                label: 'Sticker Types', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Die-Cut Stickers', url: '/products/die-cut-stickers', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Kiss-Cut Stickers', url: '/products?type=kiss-cut', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Sticker Sheets', url: '/products?type=sheets', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            {
                label: 'Product Labels', type: 'mega-category', position: 1, scope: 'header', children: [
                    { label: 'Roll Labels', url: '/products?type=roll', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Retail Hang Tags', url: '/products/retail-hang-tags', type: 'mega-item', position: 1, scope: 'header' }
                ]
            },
            { label: 'Custom Stickers', type: 'promo', position: 2, imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=400', description: 'Waterproof vinyl stickers', scope: 'header' }
        ]
    },
    {
        label: 'Booklets & Catalogs', url: '/products/custom-booklets', type: 'main', position: 5, scope: 'header',
        children: [
            {
                label: 'Booklet Types', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Custom Booklets', url: '/products/custom-booklets', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Product Catalogs', url: '/products/product-catalogs', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Funeral Programs', url: '/products/funeral-programs', type: 'mega-item', position: 2, scope: 'header' }
                ]
            },
            {
                label: 'Stationery', type: 'mega-category', position: 1, scope: 'header', children: [
                    { label: 'Custom Notepads', url: '/products/custom-notepads', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Greeting Cards', url: '/products/custom-greeting-cards', type: 'mega-item', position: 1, scope: 'header' },
                    { label: 'Wall Calendars', url: '/products/wall-calendars', type: 'mega-item', position: 2, scope: 'header' }
                ]
            }
        ]
    },
    {
        label: 'Promotional Products', url: '/products/custom-magnets', type: 'main', position: 6, scope: 'header',
        children: [
            {
                label: 'Office & Desk', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Custom Magnets', url: '/products/custom-magnets', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Bookmarks', url: '/products/premium-bookmarks', type: 'mega-item', position: 1, scope: 'header' }
                ]
            },
            {
                label: 'Packaging', type: 'mega-category', position: 1, scope: 'header', children: [
                    { label: 'Restaurant Menus', url: '/products/restaurant-menus', type: 'mega-item', position: 0, scope: 'header' }
                ]
            }
        ]
    },
    { label: 'Services', url: '/services', type: 'main', position: 7, scope: 'header' },
    {
        label: 'Design Services', url: '/design-tool', type: 'main', position: 8, scope: 'header',
        children: [
            {
                label: 'Design Tools', type: 'mega-category', position: 0, scope: 'header', children: [
                    { label: 'Online Design Tool', url: '/design-tool', type: 'mega-item', position: 0, badge: 'FREE', scope: 'header' },
                    { label: 'Upload Your Design', url: '/products', type: 'mega-item', position: 1, scope: 'header' }
                ]
            },
            {
                label: 'Professional Services', type: 'mega-category', position: 1, scope: 'header', children: [
                    { label: 'Logo Design', url: '/services/layout-design', type: 'mega-item', position: 0, scope: 'header' },
                    { label: 'Desktop Publishing', url: '/services/desktop-publishing', type: 'mega-item', position: 1, scope: 'header' }
                ]
            },
            { label: 'Design Help', type: 'promo', position: 2, imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400', description: 'Professional designers ready to help', scope: 'header' }
        ]
    },

    // ======= FOOTER ITEMS =======
    {
        label: 'Products', type: 'footer-column', position: 0, scope: 'footer',
        children: [
            { label: 'Business Cards', url: '/products', type: 'footer-link', position: 0, scope: 'footer' },
            { label: 'Flyers', url: '/products', type: 'footer-link', position: 1, scope: 'footer' },
            { label: 'Brochures', url: '/products', type: 'footer-link', position: 2, scope: 'footer' },
            { label: 'Vinyl Banners', url: '/products', type: 'footer-link', position: 3, scope: 'footer' }
        ]
    },
    {
        label: 'Support', type: 'footer-column', position: 1, scope: 'footer',
        children: [
            { label: 'Help Center', url: '#', type: 'footer-link', position: 0, scope: 'footer' },
            { label: 'File Preparation', url: '#', type: 'footer-link', position: 1, scope: 'footer' },
            { label: 'Shipping Info', url: '#', type: 'footer-link', position: 2, scope: 'footer' },
            { label: 'Contact Us', url: '/about', type: 'footer-link', position: 3, scope: 'footer' }
        ]
    },
    {
        label: 'Contact', type: 'footer-column', position: 2, scope: 'footer',
        children: [
            { label: '510-655-3030', url: 'tel:510-655-3030', type: 'footer-link', description: 'icon-phone', position: 0, scope: 'footer' },
            { label: 'print@piedmontcopy.com', url: 'mailto:print@piedmontcopy.com', type: 'footer-link', description: 'icon-mail', position: 1, scope: 'footer' },
            { label: '4237 Piedmont Ave Oakland', url: 'https://maps.google.com/?q=4237+Piedmont+Ave+Oakland', type: 'footer-link', description: 'icon-map', position: 2, scope: 'footer' }
        ]
    }
];

const globalSettings = [
    { key: 'site_description', value: 'Piedmontcopy presents the premier Online Printing Platform. We specialize in promotional, commercial, and informational print products completed with fast turnarounds and without sacrificing on quality. Piedmontcopy is located Oakland, California' },
    { key: 'primary_color', value: '#830738' },
    { key: 'footer_copyright', value: `© ${new Date().getFullYear()} PiedmontCopy. Premium Printing Solutions.` },
    { key: 'contact_phone', value: '510-655-3030' },
    { key: 'contact_email', value: 'print@piedmontcopy.com' },
    { key: 'contact_address', value: '4237 Piedmont Ave Oakland' },
    { key: 'social_facebook', value: 'https://facebook.com' },
    { key: 'social_twitter', value: 'https://twitter.com' },
    { key: 'social_instagram', value: 'https://instagram.com' },
    { key: 'social_linkedin', value: 'https://linkedin.com' },
    { key: 'sandbox_mode', value: 'true' }
];

async function createNavigationItem(data: any, parentId: number | null = null): Promise<void> {
    const { children, ...itemData } = data;

    const created = await prisma.navigationItem.create({
        data: {
            ...itemData,
            parentId
        }
    });

    if (children && children.length > 0) {
        for (const child of children) {
            await createNavigationItem(child, created.id);
        }
    }
}

async function main() {
    console.log('🌱 Seeding Navigation...');

    // Clear existing navigation
    await prisma.navigationItem.deleteMany();
    console.log('   Cleared existing navigation items');
    await prisma.globalSetting.deleteMany();
    console.log('   Cleared existing global settings');

    // Create all navigation items
    for (const item of navigationData) {
        await createNavigationItem(item);
        console.log(`   ✓ Created Nav Item: ${item.label} (${item.scope})`);
    }

    // Create global settings
    for (const setting of globalSettings) {
        await prisma.globalSetting.create({
            data: setting
        });
        console.log(`   ✓ Created Setting: ${setting.key}`);
    }

    console.log('✅ Navigation & Settings Seeding Complete!');
}

main()
    .catch((e) => {
        console.error('❌ Navigation Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
