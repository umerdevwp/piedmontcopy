import { v4 as uuidv4 } from 'uuid';

export const PremadeTemplates = [
    {
        id: "modern-hero",
        category: "Landing",
        title: "Modern Tech Hero",
        description: "High-impact hero section with glassmorphism and animated text.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: {
                    padding: "160px 0",
                    background: "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)",
                },
                children: [
                    {
                        id: uuidv4(),
                        type: "row",
                        props: { columns: 1, textAlign: "center" },
                        children: [
                            {
                                id: uuidv4(),
                                type: "heading",
                                props: {
                                    tag: "h1",
                                    text: "Architecting the Digital Frontier",
                                    fontSize: "80px",
                                    fontWeight: "900",
                                    color: "#ffffff",
                                    textShadow: { x: "0px", y: "0px", blur: "40px", color: "rgba(56, 189, 248, 0.5)" }
                                }
                            },
                            {
                                id: uuidv4(),
                                type: "paragraph",
                                props: {
                                    text: "We build premium digital experiences that push the boundaries of what's possible. Fast, secure, and stunningly beautiful.",
                                    fontSize: "20px",
                                    color: "#94a3b8",
                                    maxWidth: "800px",
                                    margin: "0 auto 40px"
                                }
                            },
                            {
                                id: uuidv4(),
                                type: "button",
                                props: {
                                    text: "Start Your Mission",
                                    size: "large",
                                    colors: { normal: { bg: "#3b82f6", text: "#ffffff", border: "#3b82f6" } },
                                    alignment: "center"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "agency-landing",
        category: "Agency",
        title: "Creative Agency Showcase",
        description: "Full-page layout for creative and digital agencies.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "100px 0", background: "#ffffff" },
                children: [
                    {
                        id: uuidv4(),
                        type: "heading",
                        props: { tag: "h2", text: "Selected Works", textAlign: "center", fontSize: "48px", fontWeight: "900" }
                    },
                    {
                        id: uuidv4(),
                        type: "row",
                        props: { columns: 3, gap: "30px" },
                        children: [
                            {
                                id: uuidv4(),
                                type: "image",
                                props: { url: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop", aspect: "square", border: { radius: "24px" } }
                            },
                            {
                                id: uuidv4(),
                                type: "image",
                                props: { url: "https://images.unsplash.com/photo-1634942537034-22b270776bd3?q=80&w=1000&auto=format&fit=crop", aspect: "square", border: { radius: "24px" } }
                            },
                            {
                                id: uuidv4(),
                                type: "image",
                                props: { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", aspect: "square", border: { radius: "24px" } }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "saas-product",
        category: "Product",
        title: "SaaS Launch System",
        description: "Feature grids, pricing, and FAQ for software products.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "80px 0", background: "#f8fafc" },
                children: [
                    {
                        id: uuidv4(),
                        type: "heading",
                        props: { tag: "h2", text: "Scale Faster", textAlign: "center", fontWeight: "900" }
                    },
                    {
                        id: uuidv4(),
                        type: "accordion",
                        props: {
                            items: [
                                { title: "Automated Workflows", content: "Save hundreds of hours with our proprietary automation engine." },
                                { title: "Global Security", content: "Enterprise-grade encryption for every single packet." },
                                { title: "Real-time Analytics", content: "Deep insights at the speed of thought." }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "portfolio-grid",
        category: "Portfolio",
        title: "Minimalist Portfolio",
        description: "Clean layout for designers and photographers.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "60px 0" },
                children: [
                    {
                        id: uuidv4(),
                        type: "heading",
                        props: { tag: "h1", text: "The Art of Less", fontSize: "120px", fontWeight: "900", textAlign: "center", opacity: 0.1 }
                    },
                    {
                        id: uuidv4(),
                        type: "gallery",
                        props: {
                            columns: 2, aspectRatio: "16/9", images: [
                                { url: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=1000", alt: "Work 1" },
                                { url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000", alt: "Work 2" }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "service-package",
        category: "Services",
        title: "Detail Service Flow",
        description: "Deep dive into service offerings with contact forms.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "100px 0" },
                children: [
                    {
                        id: uuidv4(),
                        type: "row",
                        props: { columns: 2 },
                        children: [
                            {
                                id: uuidv4(),
                                type: "column",
                                children: [
                                    { id: uuidv4(), type: "heading", props: { tag: "h3", text: "Ready to Start?" } },
                                    { id: uuidv4(), type: "paragraph", props: { text: "Fill out the protocol below and our team will initialize communication." } }
                                ]
                            },
                            {
                                id: uuidv4(),
                                type: "form",
                                props: {
                                    fields: [
                                        { id: "name", label: "Identity", type: "text", required: true },
                                        { id: "email", label: "Encrypted Email", type: "email", required: true },
                                        { id: "msg", label: "Message Data", type: "textarea" }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "corporate-about",
        category: "Corporate",
        title: "Corporate Identity",
        description: "Professional about page with team and mission.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "120px 0", background: "#0f172a" },
                children: [
                    {
                        id: uuidv4(),
                        type: "counter",
                        props: { number: 500, suffix: "+", title: "Enterprise Clients", prefix: "" }
                    },
                    {
                        id: uuidv4(),
                        type: "testimonial",
                        props: {
                            items: [
                                { author: "Sarah J. Chen", role: "CTO, OmniCorp", text: "The velocity and precision of this system is unmatched in the industry today.", avatar: "https://i.pravatar.cc/150?u=sarah" }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "real-estate",
        category: "Real Estate",
        title: "Luxury Property Hub",
        description: "Elegant listings for high-end real estate.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "80px 0", background: "#fafaf9" },
                children: [
                    { id: uuidv4(), type: "heading", props: { tag: "h2", text: "Featured Estates", textAlign: "center" } },
                    {
                        id: uuidv4(), type: "gallery", props: {
                            columns: 3, aspectRatio: "16/9", images: [
                                { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000", alt: "Property 1" },
                                { url: "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=1000", alt: "Property 2" },
                                { url: "https://images.unsplash.com/photo-1600607687940-47 pre87c2b5e1?q=80&w=1000", alt: "Property 3" }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "event-webinar",
        category: "Events",
        title: "Global Summit",
        description: "Registration and speaker lineup for events.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "100px 0", background: "linear-gradient(45deg, #4f46e5, #9333ea)" },
                children: [
                    { id: uuidv4(), type: "heading", props: { tag: "h1", text: "CONVERGENCE 2026", color: "#ffffff", textAlign: "center" } },
                    {
                        id: uuidv4(), type: "tabs", props: {
                            items: [
                                { title: "Day 01", content: "Keynote: The Post-AI World. Panel: Security in Hyper-scale." },
                                { title: "Day 02", content: "Workshops: Building the Future. Closing: Towards Singularity." }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "restaurant-menu",
        category: "Restaurant",
        title: "Culina Modern",
        description: "Stunning menu and reservation flow.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "80px 0", background: "#1a1a1a" },
                children: [
                    { id: uuidv4(), type: "heading", props: { tag: "h2", text: "The Evening Carte", color: "#d4af37", textAlign: "center" } },
                    {
                        id: uuidv4(), type: "iconList", props: {
                            items: [
                                { text: "Truffle Lobster Tail", icon: "Utensils" },
                                { text: "A5 Miyazaki Wagyu", icon: "Utensils" },
                                { text: "Gold-Leaf Saffron Risotto", icon: "Utensils" }
                            ], color: "#ffffff"
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "educational-course",
        category: "Education",
        title: "Quantum Learning",
        description: "Syllabus and instructor sections for online courses.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "100px 0" },
                children: [
                    { id: uuidv4(), type: "heading", props: { tag: "h2", text: "Course Curriculum" } },
                    {
                        id: uuidv4(), type: "accordion", props: {
                            items: [
                                { title: "Module 01: Fundamentals", content: "Core principles of quantum computation and logic gates." },
                                { title: "Module 02: Advanced Algorithms", content: "Shor's algorithm and Groot's search optimization." }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "blog-content",
        category: "Content",
        title: "Mindshare Reader",
        description: "Optimized for long-form reading and typography.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "80px 0", maxWidth: "800px" },
                children: [
                    { id: uuidv4(), type: "heading", props: { tag: "h1", text: "The Philosophy of Digital Entropy" } },
                    { id: uuidv4(), type: "paragraph", props: { text: "In the rapidly evolving landscape of distributed systems, the concept of entropy is more than just a physical law; it's a design constraint that defines how we build resilient networks.", dropCap: true } },
                    { id: uuidv4(), type: "image", props: { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000", border: { radius: "12px" } } }
                ]
            }
        ]
    },
    {
        id: "shop-grid",
        category: "E-commerce",
        title: "Alpha Store",
        description: "Premium product grid and sales triggers.",
        content: [
            {
                id: uuidv4(),
                type: "section",
                props: { padding: "60px 0" },
                children: [
                    {
                        id: uuidv4(), type: "row", props: { columns: 4, gap: "20px" }, children: [
                            {
                                id: uuidv4(), type: "column", children: [
                                    { id: uuidv4(), type: "image", props: { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500", border: { radius: "20px" } } },
                                    { id: uuidv4(), type: "heading", props: { tag: "h4", text: "Chronos Watch", fontSize: "16px" } }
                                ]
                            },
                            {
                                id: uuidv4(), type: "column", children: [
                                    { id: uuidv4(), type: "image", props: { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500", border: { radius: "20px" } } },
                                    { id: uuidv4(), type: "heading", props: { tag: "h4", text: "Aura Headphones", fontSize: "16px" } }
                                ]
                            },
                            {
                                id: uuidv4(), type: "column", children: [
                                    { id: uuidv4(), type: "image", props: { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500", border: { radius: "20px" } } },
                                    { id: uuidv4(), type: "heading", props: { tag: "h4", text: "Ignite Sneakers", fontSize: "16px" } }
                                ]
                            },
                            {
                                id: uuidv4(), type: "column", children: [
                                    { id: uuidv4(), type: "image", props: { url: "https://images.unsplash.com/photo-1526170315873-3a5616299088?q=80&w=500", border: { radius: "20px" } } },
                                    { id: uuidv4(), type: "heading", props: { tag: "h4", text: "Nomad Backpack", fontSize: "16px" } }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
