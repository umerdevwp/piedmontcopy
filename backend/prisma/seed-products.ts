
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productsToSeed = [
    {
        name: "Vinyl Banners & Signage",
        slug: "vinyl-banners-signage",
        basePrice: 45.00,
        description: "<p>Command attention with our durable, high-visibility vinyl banners. Perfect for grand openings, trade shows, or outdoor events, these weather-resistant banners are built to last.</p><ul><li><strong>Durable Material:</strong> 13oz or 15oz scrim vinyl.</li><li><strong>Vibrant Printing:</strong> UV-resistant inks for long-lasting color.</li><li><strong>Easy Hanging:</strong> Grommets included every 2 feet.</li></ul>",
        images: [
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1521575107034-e0fa0b594529?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "grid",
                values: [
                    { name: '2\' x 4\'', priceModifier: 0 },
                    { name: '3\' x 6\'', priceModifier: 25 },
                    { name: '4\' x 8\'', priceModifier: 55 },
                    { name: '5\' x 10\'', priceModifier: 90 }
                ]
            },
            {
                name: "Material Weight",
                type: "select",
                values: [
                    { name: '13oz Standard Vinyl', priceModifier: 0 },
                    { name: '15oz Heavy Duty', priceModifier: 15 },
                    { name: 'Mesh (Wind Resident)', priceModifier: 20 }
                ]
            }
        ]
    },
    {
        name: "Custom Booklets",
        slug: "custom-booklets",
        basePrice: 150.00,
        description: "<p>Tell your complete story with professional booklets. Ideal for product catalogs, event programs, and training manuals.</p>",
        images: [
            "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1603518882570-562db9a35e4d?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Page Count",
                type: "grid",
                values: [
                    { name: '8 Pages', priceModifier: 0 },
                    { name: '16 Pages', priceModifier: 40 },
                    { name: '32 Pages', priceModifier: 90 }
                ]
            },
            {
                name: "Paper Stock",
                type: "select",
                values: [
                    { name: '80lb Gloss Text', priceModifier: 0 },
                    { name: '100lb Gloss Text', priceModifier: 25 },
                    { name: '70lb Uncoated', priceModifier: 10 }
                ]
            }
        ]
    },
    {
        name: "Premium Bookmarks",
        slug: "premium-bookmarks",
        basePrice: 19.99,
        description: "<p>Keep your brand in hand with custom bookmarks. A perfect giveaway for authors, libraries, and schools.</p>",
        images: [
            "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1629259160538-2d8579998822?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '50', priceModifier: 0 },
                    { name: '100', priceModifier: 15 },
                    { name: '250', priceModifier: 35 }
                ]
            },
            {
                name: "Finish",
                type: "select",
                values: [
                    { name: 'Gloss', priceModifier: 0 },
                    { name: 'Matte', priceModifier: 5 }
                ]
            }
        ]
    },
    {
        name: "Tri-Fold Brochures",
        slug: "tri-fold-brochures",
        basePrice: 75.00,
        description: "<p>Versatile and compact, brochures are a marketing staple. Present your services clearly with our crisp folding and vibrant colors.</p>",
        images: [
            "https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1568283307521-5847424bd476?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Fold Type",
                type: "select",
                values: [
                    { name: 'Tri-Fold', priceModifier: 0 },
                    { name: 'Z-Fold', priceModifier: 0 },
                    { name: 'Half-Fold', priceModifier: 0 }
                ]
            },
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '100', priceModifier: 0 },
                    { name: '250', priceModifier: 45 },
                    { name: '500', priceModifier: 90 }
                ]
            }
        ]
    },
    {
        name: "Professional Business Cards",
        slug: "professional-business-cards",
        basePrice: 24.99,
        description: "<p>Make a memorable first impression. Our business cards feature premium stocks and ultra-sharp printing.</p>",
        images: [
            "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1559131397-f94a8c38a7c2?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1616628188894-6bf46124741f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1607519541334-a3f80c65796f?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Paper Thickness",
                type: "select",
                values: [
                    { name: 'Standard 14pt', priceModifier: 0 },
                    { name: 'Premium 16pt', priceModifier: 5 },
                    { name: 'Ultra Thick 32pt', priceModifier: 15 }
                ]
            },
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '100', priceModifier: 0 },
                    { name: '250', priceModifier: 15 },
                    { name: '500', priceModifier: 25 }
                ]
            }
        ]
    },
    {
        name: "Product Catalogs",
        slug: "product-catalogs",
        basePrice: 200.00,
        description: "<p>Showcase your entire inventory with stunning detail. High-resolution printing ensures your products look their absolute best.</p>",
        images: [
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Binding",
                type: "select",
                values: [
                    { name: 'Saddle Stitch', priceModifier: 0 },
                    { name: 'Perfect Bound', priceModifier: 50 },
                    { name: 'Wire-O', priceModifier: 30 }
                ]
            },
            {
                name: "Copies",
                type: "grid",
                values: [
                    { name: '50', priceModifier: 0 },
                    { name: '100', priceModifier: 150 },
                    { name: '250', priceModifier: 300 }
                ]
            }
        ]
    },
    {
        name: "Wall Calendars",
        slug: "wall-calendars",
        basePrice: 19.99,
        description: "<p>Stay top-of-mind 365 days a year. Custom wall calendars are the perfect personalized gift or promotional item.</p>",
        images: [
            "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1633526543814-9718c8922b7a?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1527863261175-3cd90c4133ae?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1584281722579-24b94c503164?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "grid",
                values: [
                    { name: '8.5" x 11"', priceModifier: 0 },
                    { name: '11" x 17"', priceModifier: 5 }
                ]
            },
            {
                name: "Paper",
                type: "select",
                values: [
                    { name: '100lb Gloss', priceModifier: 0 },
                    { name: '80lb Matte', priceModifier: 0 }
                ]
            }
        ]
    },
    {
        name: "Custom Envelopes",
        slug: "custom-envelopes",
        basePrice: 55.00,
        description: "<p>Add a professional touch to your mail. Custom printed envelopes with your logo and return address.</p>",
        images: [
            "https://images.unsplash.com/photo-1605318624176-50897e93fcea?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1565611466035-779836365f5a?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1555502967-175628b06602?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "select",
                values: [
                    { name: '#10 Standard', priceModifier: 0 },
                    { name: 'A2 Social', priceModifier: 5 },
                    { name: 'A7 Announcement', priceModifier: 10 }
                ]
            },
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '250', priceModifier: 0 },
                    { name: '500', priceModifier: 35 },
                    { name: '1000', priceModifier: 65 }
                ]
            }
        ]
    },
    {
        name: "Marketing Flyers",
        slug: "marketing-flyers",
        basePrice: 35.00,
        description: "<p>The classic marketing tool. Cost-effective and versatile for street marketing, inserts, or takeaways.</p>",
        images: [
            "https://images.unsplash.com/photo-1620844788326-17b5f1352c80?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "grid",
                values: [
                    { name: '4" x 6"', priceModifier: 0 },
                    { name: '5" x 7"', priceModifier: 10 },
                    { name: '8.5" x 11"', priceModifier: 25 }
                ]
            },
            {
                name: "Paper",
                type: "select",
                values: [
                    { name: 'Premium Glossy', priceModifier: 0 },
                    { name: 'Premium Matte', priceModifier: 0 }
                ]
            }
        ]
    },
    {
        name: "Funeral Programs",
        slug: "funeral-programs",
        basePrice: 85.00,
        description: "<p>Honor the memory of loved ones with dignified, high-quality programs. We handle these sensitive orders with priority care.</p>",
        images: [
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000", // Generic booklet look
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1509470987114-1e037fb85d8a?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Design Layout",
                type: "select",
                values: [
                    { name: 'Standard Bi-Fold', priceModifier: 0 },
                    { name: 'Tri-Fold', priceModifier: 10 },
                    { name: '8-Page Booklet', priceModifier: 40 }
                ]
            },
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '50', priceModifier: 0 },
                    { name: '100', priceModifier: 30 },
                    { name: '200', priceModifier: 60 }
                ]
            }
        ]
    },
    {
        name: "Custom Greeting Cards",
        slug: "custom-greeting-cards",
        basePrice: 25.00,
        description: "<p>Personalized cards for holidays, thank yous, or invitations. Envelopes included.</p>",
        images: [
            "https://images.unsplash.com/photo-1563829286438-e4b7790b05b5?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1606821262044-673e35ac3d49?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1460500063983-994d4c27756c?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "grid",
                values: [
                    { name: '5" x 7"', priceModifier: 0 },
                    { name: '4" x 6"', priceModifier: -5 }
                ]
            },
            {
                name: "Inside Printing",
                type: "select",
                values: [
                    { name: 'Blank Inside', priceModifier: 0 },
                    { name: 'Black & White Message', priceModifier: 5 },
                    { name: 'Full Color Inside', priceModifier: 10 }
                ]
            }
        ]
    },
    {
        name: "Retail Hang Tags",
        slug: "retail-hang-tags",
        basePrice: 40.00,
        description: "<p>Elevate your retail products with professional tags. Includes pre-drilled holes for easy attachment.</p>",
        images: [
            "https://images.unsplash.com/photo-1598532163257-537dfe5d7c76?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1627483262268-9c96d8a3c4b5?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1576595580361-90a855b84e20?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Shape",
                type: "grid",
                values: [
                    { name: 'Rectangle', priceModifier: 0 },
                    { name: 'Square', priceModifier: 0 },
                    { name: 'Rounded Corners', priceModifier: 10 }
                ]
            },
            {
                name: "String",
                type: "select",
                values: [
                    { name: 'No String', priceModifier: 0 },
                    { name: 'Black Elastic', priceModifier: 15 },
                    { name: 'White Cotton', priceModifier: 15 }
                ]
            }
        ]
    },
    {
        name: "Restaurant Menus",
        slug: "restaurant-menus",
        basePrice: 60.00,
        description: "<p>Appetizing presentations for your food and drink offerings. Waterproof synthetic options available for durability.</p>",
        images: [
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Format",
                type: "grid",
                values: [
                    { name: 'Single Sheet', priceModifier: 0 },
                    { name: 'Bi-Fold', priceModifier: 15 },
                    { name: 'Tri-Fold', priceModifier: 20 }
                ]
            },
            {
                name: "Lamination",
                type: "select",
                values: [
                    { name: 'None (Paper)', priceModifier: 0 },
                    { name: '3mil Gloss Encapsulation', priceModifier: 25 },
                    { name: '5mil Heavy Duty', priceModifier: 40 }
                ]
            }
        ]
    },
    {
        name: "Custom Magnets",
        slug: "custom-magnets",
        basePrice: 45.00,
        description: "<p>Stick around longer! Custom magnets are great for business cards, vehicle signs, or fridge calendars.</p>",
        images: [
            "https://images.unsplash.com/photo-1582293041014-bb287411bc23?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1629813291585-78e945c7929d?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Type",
                type: "select",
                values: [
                    { name: 'Business Card Magnet', priceModifier: 0 },
                    { name: 'Car Door Magnet (Pair)', priceModifier: 55 },
                    { name: 'Calendar Magnet', priceModifier: 5 }
                ]
            },
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '50', priceModifier: 0 },
                    { name: '100', priceModifier: 20 },
                    { name: '500', priceModifier: 60 }
                ]
            }
        ]
    },
    {
        name: "Newsletters",
        slug: "newsletters",
        basePrice: 90.00,
        description: "<p>Keep your community informed with professional 11x17 newsletters, folded to 8.5x11.</p>",
        images: [
            "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Paper",
                type: "select",
                values: [
                    { name: 'Standard 24lb Bond', priceModifier: 0 },
                    { name: 'Premium 28lb Laser', priceModifier: 15 },
                    { name: '80lb Gloss Text', priceModifier: 25 }
                ]
            },
            {
                name: "Folding",
                type: "grid",
                values: [
                    { name: 'Half Fold', priceModifier: 0 },
                    { name: 'Tri-Fold', priceModifier: 0 },
                    { name: 'Flat (No Fold)', priceModifier: 0 }
                ]
            }
        ]
    },
    {
        name: "Custom Notepads",
        slug: "custom-notepads",
        basePrice: 18.00,
        description: "<p>Branded stationery that puts your logo on every desk. 50 sheets per pad with cardboard back.</p>",
        images: [
            "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1531346878377-a513bc95f30f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "grid",
                values: [
                    { name: '4.25" x 5.5"', priceModifier: 0 },
                    { name: '5.5" x 8.5"', priceModifier: 4 },
                    { name: '8.5" x 11"', priceModifier: 8 }
                ]
            },
            {
                name: "Sheets Per Pad",
                type: "select",
                values: [
                    { name: '25 Sheets', priceModifier: -2 },
                    { name: '50 Sheets', priceModifier: 0 },
                    { name: '100 Sheets', priceModifier: 5 }
                ]
            }
        ]
    },
    {
        name: "Pocket Folders",
        slug: "pocket-folders",
        basePrice: 250.00,
        description: "<p>Presentation matters. Organize your documents in custom branded pocket folders with business card slits.</p>",
        images: [
            "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1594918231016-041793740e5c?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1632349383616-43b67ce96f7e?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Pockets",
                type: "grid",
                values: [
                    { name: '2 Pockets', priceModifier: 0 },
                    { name: '1 Pocket (Right)', priceModifier: 0 }
                ]
            },
            {
                name: "Quantity",
                type: "select",
                values: [
                    { name: '100', priceModifier: 0 },
                    { name: '250', priceModifier: 150 },
                    { name: '500', priceModifier: 300 }
                ]
            }
        ]
    },
    {
        name: "Large Format Posters",
        slug: "large-format-posters",
        basePrice: 20.00,
        description: "<p>Make a big impact with photo-quality posters. Printed on satin or gloss photo paper for vivid details.</p>",
        images: [
            "https://images.unsplash.com/photo-1574621122321-3c734999039a?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1555465013-1bbb15367668?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "select",
                values: [
                    { name: '18" x 24"', priceModifier: 0 },
                    { name: '24" x 36"', priceModifier: 15 },
                    { name: '36" x 48"', priceModifier: 35 }
                ]
            },
            {
                name: "Mounting",
                type: "grid",
                values: [
                    { name: 'Rolled (No Mounting)', priceModifier: 0 },
                    { name: 'Foam Board', priceModifier: 15 },
                    { name: 'Gator Board', priceModifier: 30 }
                ]
            }
        ]
    },
    {
        name: "Direct Mail Postcards",
        slug: "direct-mail-postcards",
        basePrice: 30.00,
        description: "<p>The workhorse of direct mail. Thick cardstock stands up to the mail stream and gets your message delivered.</p>",
        images: [
            "https://images.unsplash.com/photo-1619447377062-23c2243d8393?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1586075010667-6229b4eaf169?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1579309858547-5d519b7d34bc?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1563829286438-e4b7790b05b5?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "grid",
                values: [
                    { name: '4" x 6"', priceModifier: 0 },
                    { name: '5" x 7"', priceModifier: 10 },
                    { name: '6" x 9"', priceModifier: 20 }
                ]
            },
            {
                name: "Coating",
                type: "select",
                values: [
                    { name: 'UV Gloss Front', priceModifier: 0 },
                    { name: 'Matte/Dull Finish', priceModifier: 0 }
                ]
            }
        ]
    },
    {
        name: "Presentation Boards",
        slug: "presentation-boards",
        basePrice: 40.00,
        description: "<p>Rigid foam core boards perfect for easel displays, court exhibits, or trade show signage.</p>",
        images: [
            "https://images.unsplash.com/photo-1549421263-6064833b963b?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "select",
                values: [
                    { name: '18" x 24"', priceModifier: 0 },
                    { name: '24" x 36"', priceModifier: 20 },
                    { name: '36" x 48"', priceModifier: 40 }
                ]
            },
            {
                name: "Material",
                type: "grid",
                values: [
                    { name: '3/16" Foam Core', priceModifier: 0 },
                    { name: '3/16" Gator Board (Heavy Duty)', priceModifier: 25 }
                ]
            }
        ]
    },
    {
        name: "Rack Cards",
        slug: "rack-cards",
        basePrice: 45.00,
        description: "<p>Standard 4x9 cards designed to fit standard brochure racks. Perfect for tourism, menus, or price lists.</p>",
        images: [
            "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1620844788326-17b5f1352c80?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Finish",
                type: "select",
                values: [
                    { name: 'Gloss', priceModifier: 0 },
                    { name: 'Matte', priceModifier: 5 }
                ]
            },
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '250', priceModifier: 0 },
                    { name: '500', priceModifier: 30 },
                    { name: '1000', priceModifier: 55 }
                ]
            }
        ]
    },
    {
        name: "Sales Sheets",
        slug: "sales-sheets",
        basePrice: 50.00,
        description: "<p>Equip your sales team with slick, high-quality sell sheets. The standard for product specs and pricing overviews.</p>",
        images: [
            "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Coating",
                type: "grid",
                values: [
                    { name: 'Glossy', priceModifier: 0 },
                    { name: 'Matte', priceModifier: 0 }
                ]
            },
            {
                name: "Sides",
                type: "select",
                values: [
                    { name: 'Single Sided', priceModifier: 0 },
                    { name: 'Double Sided', priceModifier: 15 }
                ]
            }
        ]
    },
    {
        name: "Die-Cut Stickers",
        slug: "die-cut-stickers",
        basePrice: 35.00,
        description: "<p>Custom shaped vinyl stickers that stick anywhere. Waterproof, scratch-resistant, and perfect for branding.</p>",
        images: [
            "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1615469062322-26210be6eb94?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000"
        ],
        options: [
            {
                name: "Size",
                type: "select",
                values: [
                    { name: '2" x 2"', priceModifier: 0 },
                    { name: '3" x 3"', priceModifier: 10 },
                    { name: '4" x 4"', priceModifier: 20 }
                ]
            },
            {
                name: "Quantity",
                type: "grid",
                values: [
                    { name: '50 Stickers', priceModifier: 0 },
                    { name: '100 Stickers', priceModifier: 25 },
                    { name: '200 Stickers', priceModifier: 45 }
                ]
            }
        ]
    }
];

async function main() {
    console.log('🌱 Starting Professional Product Seed...');

    for (const p of productsToSeed) {
        // Check if exists
        const exists = await prisma.product.findUnique({
            where: { slug: p.slug }
        });

        if (exists) {
            console.log(`⏩ Skipping ${p.name} (already exists)`);
            continue;
        }

        console.log(`Creating ${p.name}...`);
        await prisma.product.create({
            data: {
                slug: p.slug,
                name: p.name,
                description: p.description,
                basePrice: p.basePrice,
                imageUrl: p.images[0],
                images: {
                    create: p.images.map((url, idx) => ({
                        url,
                        isFeatured: idx === 0
                    }))
                },
                options: {
                    create: p.options.map(opt => ({
                        name: opt.name,
                        type: opt.type, // 'select' or 'grid'
                        values: {
                            create: opt.values.map(val => ({
                                name: val.name,
                                priceModifier: val.priceModifier
                            }))
                        }
                    }))
                }
            }
        });
    }

    console.log('✅ Professional Seeding Complete!');
}

main()
    .catch((e) => {
        console.error('❌ User Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
