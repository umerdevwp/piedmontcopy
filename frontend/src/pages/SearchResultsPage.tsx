import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Settings, ChevronRight, SlidersHorizontal, ArrowUpRight, Loader2 } from 'lucide-react';

interface ResultItem {
    id: number;
    name?: string;
    title?: string;
    slug: string;
    imageUrl?: string;
    basePrice?: string;
    description?: string;
}

interface SearchResults {
    products: ResultItem[];
    services: ResultItem[];
}

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResults>({ products: [], services: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Search results fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (query) fetchResults();
        else setLoading(false);
    }, [query]);

    const totalResults = results.products.length + results.services.length;

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Searching for "{query}"...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-4">
                                <Search className="h-4 w-4" /> Search Results
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                Showing results for <span className="text-primary italic">"{query}"</span>
                            </h1>
                            <p className="text-slate-500 font-medium mt-4 text-lg">
                                We found {totalResults} matches across products and services.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400 text-xs font-black">
                                        {i === 1 ? 'P' : i === 2 ? 'S' : '+'}
                                    </div>
                                ))}
                            </div>
                            <div className="h-12 w-px bg-slate-200 hidden md:block" />
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase text-slate-400">Total Found</div>
                                <div className="text-2xl font-black text-slate-900">{totalResults}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {totalResults === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200 max-w-2xl mx-auto shadow-xl">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Search className="h-10 w-10 text-slate-300" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">No matches discovered</h2>
                        <p className="text-slate-500 font-medium mb-10 text-lg">
                            We couldn't find anything matching your term. Try using more general keywords or browse our categories.
                        </p>
                        <Link to="/products" className="inline-flex items-center justify-center px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:-translate-y-1">
                            Explore Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Sidebar Filters - Visual Only for now */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-24">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm flex items-center gap-2">
                                        <SlidersHorizontal className="h-4 w-4" /> Filters
                                    </h3>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Reset</button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Category</label>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between group cursor-pointer">
                                                <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">Products</span>
                                                <span className="bg-slate-50 px-2 py-1 rounded-lg text-[10px] font-black text-slate-400">{results.products.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between group cursor-pointer">
                                                <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">Services</span>
                                                <span className="bg-slate-50 px-2 py-1 rounded-lg text-[10px] font-black text-slate-400">{results.services.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="bg-primary/5 rounded-2xl p-6">
                                            <div className="text-primary font-black uppercase tracking-widest text-[9px] mb-2">Need help?</div>
                                            <div className="text-slate-900 font-bold text-sm mb-4 leading-snug">Can't find a specific item? Talk to our print experts.</div>
                                            <button className="w-full py-3 bg-white text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Support Center</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Content */}
                        <div className="lg:col-span-3 space-y-16">
                            {/* Products Section */}
                            {results.products.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <Package className="h-5 w-5 text-primary" />
                                            </div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Main Products</h2>
                                        </div>
                                        <span className="text-slate-400 font-bold text-sm">{results.products.length} Items found</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {results.products.map(product => (
                                            <Link
                                                key={product.id}
                                                to={`/products/${product.slug}`}
                                                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
                                            >
                                                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-300 font-black uppercase text-xs">No Image Available</div>
                                                    )}
                                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-primary shadow-sm">
                                                        From ${product.basePrice}
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-lg font-black text-slate-900 mb-2 truncate group-hover:text-primary transition-colors">{product.name}</h3>
                                                    <div className="flex items-center justify-between mt-6">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary/60 transition-colors">Configure Item</div>
                                                        <ArrowUpRight className="h-5 w-5 text-slate-200 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Services Section */}
                            {results.services.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center">
                                                <Settings className="h-5 w-5 text-accent" />
                                            </div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Printing & Design Services</h2>
                                        </div>
                                        <span className="text-slate-400 font-bold text-sm">{results.services.length} Services found</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {results.services.map(service => (
                                            <Link
                                                key={service.id}
                                                to={`/services/${service.slug}`}
                                                className="group bg-white rounded-3xl border border-slate-200 p-6 flex gap-6 hover:shadow-xl hover:border-accent/20 transition-all duration-500"
                                            >
                                                <div className="h-24 w-24 rounded-2xl bg-accent/5 overflow-hidden shrink-0 border border-accent/10 flex items-center justify-center">
                                                    {service.imageUrl ? (
                                                        <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <Settings className="h-10 w-10 text-accent/20" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-accent transition-colors">{service.title}</h3>
                                                    <p className="text-sm text-slate-500 line-clamp-2 font-medium mb-4">{service.description}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-accent tracking-widest group-hover:gap-4 transition-all">
                                                        Learn More <ChevronRight className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
