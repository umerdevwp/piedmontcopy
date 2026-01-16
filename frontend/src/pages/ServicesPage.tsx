import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, ArrowRight, CheckCircle2,
    MessageSquare, Phone, Mail,
    Loader2, Sparkles, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '../types';
import ProductImage from '../components/ProductImage';

const CATEGORIES = ['All', 'Marketing', 'Business', 'Corporate', 'Events', 'Personal'];

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeCategory !== 'All') params.append('category', activeCategory);

        fetch(`/api/services?${params.toString()}`)
            .then(res => res.json())
            .then(response => {
                setServices(Array.isArray(response) ? response : (response.data || []));
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch services:', err);
                setLoading(false);
            });
    }, [activeCategory]);

    const filteredServices = useMemo(() => {
        return services.filter(service =>
            service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [services, searchQuery]);

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Simplified Hero Section */}
            <div className="bg-white border-b border-slate-200 mb-8">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="flex-1 max-w-2xl">
                            <div className="h-1.5 w-16 bg-primary mb-8 rounded-full" />
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
                                Professional <span className="text-primary">Portfolio</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                                Precision-engineered printing solutions and expert design services tailored for your business.
                            </p>

                            {/* Integrated Search field */}
                            <div className="relative max-w-xl group">
                                <div className={`absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-slate-400'}`}>
                                    <Search className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search services (e.g. 'design', 'printing', 'logo')..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-primary/20 text-slate-900 font-bold placeholder:text-slate-300 transition-all shadow-sm group-hover:shadow-md"
                                />
                            </div>
                        </div>

                        <div className="group hidden lg:flex items-center gap-6 p-8 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                            <div className="shrink-0 w-16 h-16 bg-white text-primary rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio Scope</div>
                                <div className="text-2xl font-black text-slate-900 leading-none">
                                    {filteredServices.length} Solutions
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simplified Filter Navigation */}
            <div className="mb-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-xl shadow-primary/30 -translate-y-0.5'
                                    : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* Services Grid */}
            <section className="py-24 container mx-auto px-4">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-6" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Professional Portfolio...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredServices.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {
                    !loading && filteredServices.length === 0 && (
                        <div className="py-32 text-center max-w-md mx-auto">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Search className="h-8 w-8 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No services found</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Try adjusting your search or category filters to find what you're looking for.</p>
                        </div>
                    )
                }
            </section >

            {/* Premium Support / FAQ Section */}
            < section className="bg-slate-900 py-24 relative overflow-hidden" >
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
                <div className="container mx-auto px-4 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/10">
                                <MessageSquare className="h-3 w-3" />
                                Expert Consultation
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-8">
                                Need a custom <br /><span className="text-primary italic">Strategy?</span>
                            </h2>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
                                Our consultants are ready to help you architect the perfect branding and printing solution for your specific requirements.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all cursor-default">
                                    <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div className="text-white font-black uppercase tracking-widest text-[10px] mb-1">Phone Line</div>
                                    <div className="text-white font-bold text-lg">510-655-3030</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all cursor-default">
                                    <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="text-white font-black uppercase tracking-widest text-[10px] mb-1">Email Support</div>
                                    <div className="text-white font-bold text-lg">print@piedmontcopy.com</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl relative">
                            <div className="absolute top-10 right-10">
                                <Building2 className="h-10 w-10 text-slate-100" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Quick Connectivity</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/20 font-bold text-sm" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Protocol</label>
                                        <input type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/20 font-bold text-sm" placeholder="john@company.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirement Overview</label>
                                    <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/20 font-bold text-sm resize-none" placeholder="Briefly describe your project..." />
                                </div>
                                <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all active:scale-95">
                                    Initiate Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative h-full"
        >
            <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 h-full flex flex-col flex-1">
                {/* Image & Badge Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <ProductImage
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-white/50">
                            {service.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-10 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors pr-4">
                            {service.title}
                        </h3>
                        <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>

                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                        {service.description}
                    </p>

                    <div className="space-y-4 mb-10">
                        {service.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex items-end justify-between mt-auto">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Investment Plan</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-bold text-slate-400">From</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                    ${service.startingPrice ? Number(service.startingPrice).toFixed(0) : '0'}
                                </span>
                            </div>
                        </div>
                        <Link
                            to={`/services/${service.slug}`}
                            className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-all duration-300 shadow-xl"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
