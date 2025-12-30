import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ProductImage from '../components/ProductImage';

interface Product {
    id: number;
    slug: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string;
}

export default function ProductListPage() {
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
                console.error('Failed to fetch products:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const stripHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 mb-12">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="h-1 w-12 bg-primary mb-6 rounded-full" />
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                                Our Products
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                                Explore our comprehensive range of premium printing solutions. From high-end corporate stationery to large-scale marketing materials.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                            <span>{products.length} Professional Solutions</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {products.map(product => (
                        <Link key={product.id} to={`/products/${product.slug}`} className="group h-full flex flex-col">
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 h-full flex flex-col border border-slate-200 hover:border-primary/20">
                                <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                                    <ProductImage src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                            Configure & Order
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors mb-2">{product.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed mb-6 flex-1">
                                        {stripHtml(product.description)}
                                    </p>
                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Rate</span>
                                            <span className="text-2xl font-black text-slate-900">${Number(product.basePrice).toFixed(2)}</span>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
