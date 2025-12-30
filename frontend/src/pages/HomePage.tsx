import { ArrowRight, Star, Clock, Truck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Product } from '../types';
import ProductImage from '../components/ProductImage';

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(response => {
                // Handle paginated response
                const productsData = Array.isArray(response) ? response : (response.data || []);
                setProducts(productsData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch popular products:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-24 pb-24 bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=1974&auto=format&fit=crop"
                        alt="Hero background"
                        className="w-full h-full object-cover scale-105 animate-subtle-zoom"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-20">
                    <div className="max-w-2xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Now accepting custom orders
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                            Design. Print. <br />
                            <span className="text-primary italic">Perfected.</span>
                        </h1>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-lg">
                            Elevate your brand with premium custom printing. From tactile business cards to high-impact banners, we bring your vision to life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 transition-all duration-300"
                            >
                                EXPLORE PRODUCTS
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/design-tool"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                DESIGN ONLINE
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: Star, title: "Premium Finishes", desc: "Velvet touch, foil accents, and high-spec card stocks." },
                        { icon: Clock, title: "Rush Production", desc: "Next-day shipping options for tight deadlines." },
                        { icon: Truck, title: "Secure Delivery", desc: "Reliable, tracked shipping on every single order." }
                    ].map((feature, i) => (
                        <div key={i} className="group flex items-start gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-colors duration-500">
                            <div className="shrink-0 w-14 h-14 bg-slate-900 text-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{feature.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Products */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="h-1 w-12 bg-primary mb-4 rounded-full" />
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Best Sellers</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Tested and loved by 10,000+ customers</p>
                    </div>
                    <Link to="/products" className="group text-primary font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
                        View All Products
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-96 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gathering Products...</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {products.slice(0, 8).map((product) => (
                            <Link key={product.id} to={`/products/${product.slug}`} className="group block h-full">
                                <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 h-full flex flex-col border border-slate-100 hover:border-primary/20">
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <ProductImage
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                                                Best Seller
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                Customize
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting from</span>
                                                <span className="text-2xl font-black text-slate-900">${Number(product.basePrice).toFixed(2)}</span>
                                            </div>
                                            <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
                                                <ArrowRight className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
