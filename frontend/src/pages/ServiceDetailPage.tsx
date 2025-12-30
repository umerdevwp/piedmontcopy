import { useParams, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Phone, Mail, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Product, Service } from '../types';
import ProductImage from '../components/ProductImage';

export default function ServiceDetailPage() {
    const { slug } = useParams();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/services/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Service not found');
                return res.json();
            })
            .then(data => {
                setService(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch service:', err);
                setError(err.message);
                setLoading(false);
            });

        fetch('/api/products')
            .then(res => res.json())
            .then(response => {
                const productsData = Array.isArray(response) ? response : (response.data || []);
                setRelatedProducts(productsData.slice(0, 3));
                setLoadingProducts(false);
            })
            .catch(err => {
                console.error('Failed to fetch related products:', err);
                setLoadingProducts(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Service Profile...</p>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="container mx-auto px-4 py-32 text-center max-w-xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-600 rounded-3xl mb-8">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Service Not Found</h1>
                <p className="text-slate-500 font-medium leading-relaxed mb-12">The service listing you're looking for might have been moved or archived. Please explore our other professional solutions.</p>
                <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:-translate-y-1">
                    Explore Solutions
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full overflow-hidden bg-slate-900">
                <ProductImage
                    src={service.imageUrl}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto">
                        <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span>Services</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white font-medium">{service.title}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                            {service.title}
                        </h1>
                        <p className="text-xl text-slate-200 max-w-2xl animate-fade-in-up delay-100">
                            {service.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Overview */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Overview</h2>
                        <div
                            className="prose prose-slate max-w-none text-slate-600 leading-relaxed rich-text-content"
                            dangerouslySetInnerHTML={{ __html: service.longDescription }}
                        />
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-green-50 p-2 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{feature}</h3>
                                    <p className="text-sm text-slate-500">Premium quality guaranteed.</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-primary to-accent p-10 rounded-3xl text-white text-center shadow-xl">
                        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-white/90 mb-8 max-w-xl mx-auto">
                            Contact our team today to discuss your {service.title.toLowerCase()} needs. We offer fast turnaround times and competitive pricing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                                Request a Quote
                            </button>
                            <Link to="/contact" className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Contact Widget */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Need Help?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-600">
                                <div className="bg-slate-100 p-2 rounded-lg">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600">
                                <div className="bg-slate-100 p-2 rounded-lg">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium">support@piedmont.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600">
                                <div className="bg-slate-100 p-2 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium">Mon-Fri, 9am - 6pm</span>
                            </li>
                        </ul>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                Book Consultation
                            </button>
                        </div>
                    </div>

                    {/* Related Products Widget */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Related Products</h3>
                        {loadingProducts ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {relatedProducts.map(prod => (
                                    <Link key={prod.id} to={`/products/${prod.slug}`} className="flex gap-4 group">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                                            <ProductImage src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm group-hover:text-primary transition-colors line-clamp-2">{prod.name}</h4>
                                            <p className="text-xs text-slate-500 mt-1">From ${Number(prod.basePrice).toFixed(2)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mt-6 hover:underline">
                            View All Products <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
