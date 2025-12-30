import type { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        slug: 'business-cards',
        name: 'Standard Business Cards',
        description: 'Professional business cards printed on high-quality cardstock. Make a lasting impression with our premium finishes.',
        basePrice: 15.00,
        imageUrl: 'https://placehold.co/600x400/2563eb/ffffff?text=Business+Cards',
        options: [
            {
                id: 'paper',
                name: 'Paper Type',
                type: 'select',
                values: [
                    { id: '14pt-matte', name: '14pt Matte', priceModifier: 0 },
                    { id: '16pt-gloss', name: '16pt Gloss', priceModifier: 5.00 },
                    { id: '100lb-linen', name: '100lb Linen', priceModifier: 8.00 },
                    { id: '18pt-ultra', name: '18pt Ultra Thick', priceModifier: 15.00 }
                ]
            },
            {
                id: 'sides',
                name: 'Printed Sides',
                type: 'radio',
                values: [
                    { id: 'front-only', name: 'Front Only', priceModifier: 0 },
                    { id: 'front-back', name: 'Front & Back', priceModifier: 4.00 }
                ]
            },
            {
                id: 'finish',
                name: 'Coating',
                type: 'select',
                values: [
                    { id: 'none', name: 'No Coating', priceModifier: 0 },
                    { id: 'uv-gloss', name: 'UV High Gloss', priceModifier: 5.00 },
                    { id: 'matte-finish', name: 'Matte Finish', priceModifier: 5.00 }
                ]
            },
            {
                id: 'corners',
                name: 'Corners',
                type: 'radio',
                values: [
                    { id: 'square', name: 'Standard Square', priceModifier: 0 },
                    { id: 'rounded', name: 'Rounded Corners', priceModifier: 6.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '100', name: '100', priceModifier: 0, multiplier: 1 },
                    { id: '250', name: '250', priceModifier: 10.00, multiplier: 1 },
                    { id: '500', name: '500', priceModifier: 20.00, multiplier: 1 },
                    { id: '1000', name: '1000', priceModifier: 35.00, multiplier: 1 },
                    { id: '2500', name: '2500', priceModifier: 60.00, multiplier: 1 }
                ]
            }
        ]
    },
    {
        id: '2',
        slug: 'flyers',
        name: 'Marketing Flyers',
        description: 'Vibrant full-color flyers to promote your events and business. Available in multiple sizes and paper stocks.',
        basePrice: 45.00,
        imageUrl: 'https://placehold.co/600x400/ca8a04/ffffff?text=Flyers',
        options: [
            {
                id: 'size',
                name: 'Size',
                type: 'select',
                values: [
                    { id: '4x6', name: '4" x 6"', priceModifier: 0 },
                    { id: '5x7', name: '5" x 7"', priceModifier: 10.00 },
                    { id: '85x11', name: '8.5" x 11"', priceModifier: 25.00 },
                    { id: '11x17', name: '11" x 17"', priceModifier: 40.00 }
                ]
            },
            {
                id: 'paper',
                name: 'Paper Stock',
                type: 'select',
                values: [
                    { id: '100lb-gloss-text', name: '100lb Gloss Text', priceModifier: 0 },
                    { id: '100lb-matte-text', name: '100lb Matte Text', priceModifier: 0 },
                    { id: '14pt-cardstock', name: '14pt Cardstock', priceModifier: 15.00 }
                ]
            },
            {
                id: 'folding',
                name: 'Folding Options',
                type: 'select',
                values: [
                    { id: 'none', name: 'No Fold', priceModifier: 0 },
                    { id: 'tri-fold', name: 'Tri-Fold', priceModifier: 20.00 },
                    { id: 'half-fold', name: 'Half-Fold', priceModifier: 20.00 },
                    { id: 'z-fold', name: 'Z-Fold', priceModifier: 20.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '100', name: '100', priceModifier: 0 },
                    { id: '500', name: '500', priceModifier: 30.00 },
                    { id: '1000', name: '1000', priceModifier: 50.00 },
                    { id: '5000', name: '5000', priceModifier: 150.00 }
                ]
            }
        ]
    },
    {
        id: '3',
        slug: 'stickers',
        name: 'Custom Stickers',
        description: 'Durable, weather-resistant stickers. Perfect for branding, packaging, and giveaways.',
        basePrice: 25.00,
        imageUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=Stickers',
        options: [
            {
                id: 'shape',
                name: 'Shape',
                type: 'radio',
                values: [
                    { id: 'circle', name: 'Circle', priceModifier: 0 },
                    { id: 'square', name: 'Square', priceModifier: 0 },
                    { id: 'rectangle', name: 'Rectangle', priceModifier: 0 },
                    { id: 'oval', name: 'Oval', priceModifier: 5.00 }
                ]
            },
            {
                id: 'size',
                name: 'Size',
                type: 'select',
                values: [
                    { id: '2x2', name: '2" x 2"', priceModifier: 0 },
                    { id: '3x3', name: '3" x 3"', priceModifier: 10.00 },
                    { id: '4x4', name: '4" x 4"', priceModifier: 18.00 },
                    { id: '5x5', name: '5" x 5"', priceModifier: 25.00 }
                ]
            },
            {
                id: 'material',
                name: 'Material',
                type: 'select',
                values: [
                    { id: 'white-vinyl', name: 'White Vinyl', priceModifier: 0 },
                    { id: 'clear-vinyl', name: 'Clear Vinyl', priceModifier: 10.00 },
                    { id: 'holographic', name: 'Holographic', priceModifier: 25.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '50', name: '50', priceModifier: 0 },
                    { id: '100', name: '100', priceModifier: 20.00 },
                    { id: '250', name: '250', priceModifier: 40.00 },
                    { id: '500', name: '500', priceModifier: 70.00 }
                ]
            }
        ]
    },
    {
        id: '4',
        slug: 'banners',
        name: 'Vinyl Banners',
        description: 'Large format vinyl banners for indoor and outdoor use. Grommets included.',
        basePrice: 55.00,
        imageUrl: 'https://placehold.co/600x400/db2777/ffffff?text=Banners',
        options: [
            {
                id: 'size',
                name: 'Size',
                type: 'select',
                values: [
                    { id: '2x4', name: '2\' x 4\'', priceModifier: 0 },
                    { id: '3x6', name: '3\' x 6\'', priceModifier: 25.00 },
                    { id: '4x8', name: '4\' x 8\'', priceModifier: 45.00 },
                    { id: '5x10', name: '5\' x 10\'', priceModifier: 70.00 }
                ]
            },
            {
                id: 'material',
                name: 'Material',
                type: 'select',
                values: [
                    { id: '13oz-vinyl', name: '13oz Scrim Vinyl', priceModifier: 0 },
                    { id: 'mesh', name: 'Mesh Vinyl (Wind Resistant)', priceModifier: 15.00 },
                    { id: '18oz-matte', name: '18oz Matte Vinyl', priceModifier: 25.00 }
                ]
            },
            {
                id: 'grommets',
                name: 'Grommets',
                type: 'radio',
                values: [
                    { id: 'all-corners', name: 'Every 2 Feet & Corners', priceModifier: 0 },
                    { id: 'corners-only', name: 'Corners Only', priceModifier: 0 },
                    { id: 'none', name: 'No Grommets', priceModifier: -5.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '1', name: '1', priceModifier: 0 },
                    { id: '2', name: '2', priceModifier: 50.00 },
                    { id: '5', name: '5', priceModifier: 200.00 }
                ]
            }
        ]
    },
    {
        id: '5',
        slug: 'postcards',
        name: 'Postcards',
        description: 'Reach new customers with direct mail postcards. High-quality and affordable.',
        basePrice: 20.00,
        imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Postcards',
        options: [
            {
                id: 'size',
                name: 'Size',
                type: 'select',
                values: [
                    { id: '4x6', name: '4" x 6"', priceModifier: 0 },
                    { id: '5x7', name: '5" x 7"', priceModifier: 5.00 },
                    { id: '6x9', name: '6" x 9"', priceModifier: 10.00 }
                ]
            },
            {
                id: 'paper',
                name: 'Paper',
                type: 'select',
                values: [
                    { id: '14pt', name: '14pt Cardstock', priceModifier: 0 },
                    { id: '16pt', name: '16pt Cardstock', priceModifier: 8.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '100', name: '100', priceModifier: 0 },
                    { id: '500', name: '500', priceModifier: 25.00 },
                    { id: '1000', name: '1000', priceModifier: 40.00 }
                ]
            }
        ]
    },
    {
        id: '6',
        slug: 'brochures',
        name: 'Folded Brochures',
        description: 'Tell your full story with a professional brochure. Perfect for menus and services.',
        basePrice: 60.00,
        imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Brochures',
        options: [
            {
                id: 'size',
                name: 'Flat Size',
                type: 'select',
                values: [
                    { id: '85x11', name: '8.5" x 11"', priceModifier: 0 },
                    { id: '11x17', name: '11" x 17"', priceModifier: 30.00 }
                ]
            },
            {
                id: 'fold',
                name: 'Fold Type',
                type: 'select',
                values: [
                    { id: 'tri-fold', name: 'Tri-Fold', priceModifier: 0 },
                    { id: 'z-fold', name: 'Z-Fold', priceModifier: 0 },
                    { id: 'half-fold', name: 'Half-Fold', priceModifier: 0 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '100', name: '100', priceModifier: 0 },
                    { id: '500', name: '500', priceModifier: 40.00 },
                    { id: '1000', name: '1000', priceModifier: 70.00 }
                ]
            }
        ]
    },
    {
        id: '7',
        slug: 'posters',
        name: 'Large Posters',
        description: 'Make a big impact with high-gloss posters. Ideal for windows and walls.',
        basePrice: 30.00,
        imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=Posters',
        options: [
            {
                id: 'size',
                name: 'Size',
                type: 'select',
                values: [
                    { id: '18x24', name: '18" x 24"', priceModifier: 0 },
                    { id: '24x36', name: '24" x 36"', priceModifier: 15.00 }
                ]
            },
            {
                id: 'paper',
                name: 'Paper',
                type: 'radio',
                values: [
                    { id: 'gloss', name: 'Photo Gloss', priceModifier: 0 },
                    { id: 'matte', name: 'Premium Matte', priceModifier: 5.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '1', name: '1', priceModifier: 0 },
                    { id: '10', name: '10', priceModifier: 50.00 },
                    { id: '50', name: '50', priceModifier: 150.00 }
                ]
            }
        ]
    },
    {
        id: '8',
        slug: 'door-hangers',
        name: 'Door Hangers',
        description: 'Effective local marketing directly involved on the door.',
        basePrice: 35.00,
        imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Door+Hangers',
        options: [
            {
                id: 'size',
                name: 'Size',
                type: 'select',
                values: [
                    { id: '35x85', name: '3.5" x 8.5"', priceModifier: 0 },
                    { id: '425x11', name: '4.25" x 11"', priceModifier: 10.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '250', name: '250', priceModifier: 0 },
                    { id: '500', name: '500', priceModifier: 20.00 },
                    { id: '1000', name: '1000', priceModifier: 35.00 }
                ]
            }
        ]
    },
    {
        id: '9',
        slug: 'envelopes',
        name: 'Custom Envelopes',
        description: 'Branded envelopes to match your stationery.',
        basePrice: 40.00,
        imageUrl: 'https://placehold.co/600x400/64748b/ffffff?text=Envelopes',
        options: [
            {
                id: 'type',
                name: 'Type',
                type: 'select',
                values: [
                    { id: 'no-10', name: '#10 Standard', priceModifier: 0 },
                    { id: 'no-10-window', name: '#10 Window', priceModifier: 5.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '500', name: '500', priceModifier: 0 },
                    { id: '1000', name: '1000', priceModifier: 40.00 }
                ]
            }
        ]
    },
    {
        id: '10',
        slug: 'letterheads',
        name: 'Letterhead',
        description: 'Official letterhead for your business correspondence.',
        basePrice: 35.00,
        imageUrl: 'https://placehold.co/600x400/94a3b8/ffffff?text=Letterhead',
        options: [
            {
                id: 'paper',
                name: 'Paper Type',
                type: 'select',
                values: [
                    { id: '70lb', name: '70lb Premium Opaque', priceModifier: 0 },
                    { id: 'linen', name: 'Textured Linen', priceModifier: 15.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '250', name: '250', priceModifier: 0 },
                    { id: '500', name: '500', priceModifier: 20.00 },
                    { id: '1000', name: '1000', priceModifier: 35.00 }
                ]
            }
        ]
    },
    {
        id: '11',
        slug: 'notepads',
        name: 'Custom Notepads',
        description: 'Great for giveaways and office use.',
        basePrice: 50.00,
        imageUrl: 'https://placehold.co/600x400/f43f5e/ffffff?text=Notepads',
        options: [
            {
                id: 'sheets',
                name: 'Sheets per Pad',
                type: 'select',
                values: [
                    { id: '25', name: '25 Sheets', priceModifier: -5.00 },
                    { id: '50', name: '50 Sheets', priceModifier: 0 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity (Pads)',
                type: 'select',
                values: [
                    { id: '10', name: '10 Pads', priceModifier: 0 },
                    { id: '50', name: '50 Pads', priceModifier: 100.00 }
                ]
            }
        ]
    },
    {
        id: '12',
        slug: 'booklets',
        name: 'Booklets & Catalogs',
        description: 'Multi-page booklets for catalogs, reports, and magazines.',
        basePrice: 120.00,
        imageUrl: 'https://placehold.co/600x400/0ea5e9/ffffff?text=Booklets',
        options: [
            {
                id: 'pages',
                name: 'Page Count',
                type: 'select',
                values: [
                    { id: '8', name: '8 Pages', priceModifier: 0 },
                    { id: '12', name: '12 Pages', priceModifier: 20.00 },
                    { id: '16', name: '16 Pages', priceModifier: 40.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '50', name: '50', priceModifier: 0 },
                    { id: '100', name: '100', priceModifier: 60.00 }
                ]
            }
        ]
    },
    {
        id: '13',
        slug: 'folders',
        name: 'Presentation Folders',
        description: 'Keep your documents organized in style.',
        basePrice: 85.00,
        imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=Folders',
        options: [
            {
                id: 'pockets',
                name: 'Pockets',
                type: 'radio',
                values: [
                    { id: '2', name: '2 Pockets', priceModifier: 0 },
                    { id: '1', name: '1 Pocket', priceModifier: -5.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '100', name: '100', priceModifier: 0 },
                    { id: '250', name: '250', priceModifier: 80.00 }
                ]
            }
        ]
    },
    {
        id: '14',
        slug: 'magnets',
        name: 'Car Magnets',
        description: 'Turn your vehicle into a moving billboard.',
        basePrice: 30.00,
        imageUrl: 'https://placehold.co/600x400/ef4444/ffffff?text=Magnets',
        options: [
            {
                id: 'size',
                name: 'Size',
                type: 'select',
                values: [
                    { id: '12x18', name: '12" x 18"', priceModifier: 0 },
                    { id: '12x24', name: '12" x 24"', priceModifier: 10.00 },
                    { id: '18x24', name: '18" x 24"', priceModifier: 20.00 }
                ]
            },
            {
                id: 'quantity',
                name: 'Quantity',
                type: 'select',
                values: [
                    { id: '1', name: '1', priceModifier: 0 },
                    { id: '2', name: '2 Pair', priceModifier: 25.00 }
                ]
            }
        ]
    }
];
