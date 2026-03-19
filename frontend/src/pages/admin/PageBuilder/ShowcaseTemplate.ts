
export const ShowcaseTemplate = {
    title: "Pro Features Showcase",
    slug: "pro-features-showcase",
    content: [
        {
            id: "hero-section",
            type: "section",
            props: {
                padding: { top: "100px", right: "20px", bottom: "100px", left: "20px" },
                gradient: {
                    enabled: true,
                    type: "linear",
                    angle: 135,
                    stops: [
                        { color: "#1e293b", position: 0 },
                        { color: "#0f172a", position: 100 }
                    ]
                },
                // Box Model & Border Test
                border: {
                    width: "0px",
                    style: "solid",
                    color: "transparent",
                    radius: { tl: "0px", tr: "0px", bl: "80px", br: "0px" }
                }
            },
            children: [
                {
                    id: "hero-row",
                    type: "row",
                    props: { columns: 2, gap: "40px" },
                    children: [
                        {
                            id: "hero-col-1",
                            type: "column",
                            props: {},
                            children: [
                                {
                                    id: "hero-badge",
                                    type: "button",
                                    props: {
                                        text: "New v2.0 Released",
                                        size: "small",
                                        buttonType: "ghost",
                                        color: "#38bdf8",
                                        background: "rgba(56, 189, 248, 0.1)",
                                        border: { width: "1px", color: "rgba(56, 189, 248, 0.2)", radius: "20px" },
                                        padding: { vertical: "6px", horizontal: "12px" }
                                    }
                                },
                                {
                                    id: "hero-heading",
                                    type: "heading",
                                    props: {
                                        tag: "h1",
                                        text: "Experience the Future of Design",
                                        fontSize: "64px",
                                        fontWeight: "900",
                                        lineHeight: "1.1",
                                        color: "#ffffff",
                                        textShadow: { x: "0px", y: "4px", blur: "20px", color: "rgba(0,0,0,0.5)" },
                                        margin: { bottom: "20px" }
                                    }
                                },
                                {
                                    id: "hero-desc",
                                    type: "paragraph",
                                    props: {
                                        text: "This page demonstrates the power of our new Pro Editor. Inspect these elements to see advanced gradients, per-corner borders, and precision box-model controls.",
                                        fontSize: "18px",
                                        lineHeight: "1.6",
                                        color: "#94a3b8",
                                        margin: { bottom: "40px" }
                                    }
                                },
                                {
                                    id: "hero-cta-row",
                                    type: "row",
                                    props: { columns: 2, gap: "10px" },
                                    children: [
                                        {
                                            id: "cta-1",
                                            type: "button",
                                            props: {
                                                text: "Get Started Now",
                                                buttonType: "primary",
                                                size: "large",
                                                background: "#3b82f6",
                                                color: "#ffffff",
                                                boxShadow: { x: "0px", y: "8px", blur: "20px", color: "rgba(59, 130, 246, 0.4)" },
                                                border: { radius: "12px" }
                                            }
                                        },
                                        {
                                            id: "cta-2",
                                            type: "button",
                                            props: {
                                                text: "View Documentation",
                                                buttonType: "outline",
                                                size: "large",
                                                color: "#ffffff",
                                                border: { width: "1px", color: "#ffffff", radius: "12px" }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "hero-col-2",
                            type: "column",
                            props: {},
                            children: [
                                {
                                    id: "feature-card",
                                    type: "section", // Using section as a card
                                    props: {
                                        background: "rgba(255,255,255,0.05)",
                                        padding: { top: "40px", right: "40px", bottom: "40px", left: "40px" },
                                        border: { width: "1px", color: "rgba(255,255,255,0.1)", radius: "32px" },
                                        boxShadow: { x: "0px", y: "20px", blur: "40px", color: "rgba(0,0,0,0.2)" }
                                    },
                                    children: [
                                        {
                                            id: "card-heading",
                                            type: "heading",
                                            props: {
                                                tag: "h3",
                                                text: "Advanced Controls",
                                                color: "#ffffff",
                                                fontSize: "24px",
                                                margin: { bottom: "10px" }
                                            }
                                        },
                                        {
                                            id: "card-text",
                                            type: "paragraph",
                                            props: {
                                                text: "Every pixel is under your command. Adjust padding, margins, borders, and shadows with real-time visual feedback.",
                                                color: "#cbd5e1",
                                                margin: { bottom: "20px" }
                                            }
                                        },
                                        {
                                            id: "card-image",
                                            type: "image",
                                            props: {
                                                url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
                                                alt: "Abstract Design",
                                                border: { radius: "16px" },
                                                objectFit: "cover",
                                                boxShadow: { x: "0px", y: "10px", blur: "30px", color: "rgba(0,0,0,0.3)" }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "features-grid",
            type: "section",
            props: {
                padding: { top: "80px", bottom: "80px" },
                background: "#ffffff"
            },
            children: [
                {
                    id: "grid-heading",
                    type: "heading",
                    props: {
                        tag: "h2",
                        text: "Interactive Elements",
                        title: "Interactive Elements", // For legacy
                        textAlign: "center",
                        fontSize: "32px",
                        fontWeight: "800",
                        margin: { bottom: "60px" }
                    }
                },
                {
                    id: "interactive-row",
                    type: "row",
                    props: { columns: 3, gap: "30px" },
                    children: [
                        {
                            id: "col-form",
                            type: "column",
                            props: {},
                            children: [
                                {
                                    id: "form-heading",
                                    type: "heading",
                                    props: { tag: "h4", text: "Contact Form", margin: { bottom: "20px" } }
                                },
                                {
                                    id: "demo-form",
                                    type: "form",
                                    props: {
                                        fields: [
                                            { id: "f1", type: "text", label: "Full Name", width: "full" },
                                            { id: "f2", type: "email", label: "Email Address", width: "full" },
                                            { id: "f3", type: "textarea", label: "Message", width: "full" }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            id: "col-accordion",
                            type: "column",
                            props: {},
                            children: [
                                {
                                    id: "acc-heading",
                                    type: "heading",
                                    props: { tag: "h4", text: "FAQs", margin: { bottom: "20px" } }
                                },
                                {
                                    id: "demo-accordion",
                                    type: "accordion",
                                    props: {
                                        items: [
                                            { title: "What is Antigravity?", content: "The ultimate page builder experience." },
                                            { title: "Is it responsive?", content: "Yes, fully responsive out of the box." },
                                            { title: "Can I customize it?", content: "Absolutely, with the new Pro Inspector." }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            id: "col-tabs",
                            type: "column",
                            props: {},
                            children: [
                                {
                                    id: "tabs-heading",
                                    type: "heading",
                                    props: { tag: "h4", text: "Content Tabs", margin: { bottom: "20px" } }
                                },
                                {
                                    id: "demo-tabs",
                                    type: "tabs",
                                    props: {
                                        items: [
                                            { title: "Design", content: "Built for designers who code." },
                                            { title: "Develop", content: "Extensible React codebase." },
                                            { title: "Deploy", content: "Ship to production in seconds." }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
