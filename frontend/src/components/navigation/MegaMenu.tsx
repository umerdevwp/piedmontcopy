import { Link } from 'react-router-dom';
import { type NavigationItem } from './types';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
    item: NavigationItem;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function MegaMenu({ item, onMouseEnter, onMouseLeave }: MegaMenuProps) {
    // Separate categories from promo items
    const categories = item.children?.filter(c => c.type === 'mega-category') || [];
    const promos = item.children?.filter(c => c.type === 'promo') || [];

    return (
        <div
            className="absolute top-full left-0 w-[90vw] max-w-6xl bg-white border border-slate-200 rounded-b-xl shadow-2xl mt-0 animate-in fade-in slide-in-from-top-1 duration-200 z-50 transform -translate-x-4 lg:translate-x-0"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="grid grid-cols-12 gap-0">
                {/* Categories Grid */}
                <div className={`${promos.length > 0 ? 'col-span-9' : 'col-span-12'} p-6`}>
                    <div className="grid grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <div key={category.id} className="space-y-4">
                                {/* Category Header */}
                                <Link
                                    to={category.url || '#'}
                                    className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider hover:text-primary transition-colors group"
                                >
                                    {category.label}
                                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>

                                {/* Subcategory Items */}
                                <div className="space-y-2">
                                    {category.children?.map((subItem) => (
                                        <Link
                                            key={subItem.id}
                                            to={subItem.url || '#'}
                                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary hover:translate-x-1 transition-all py-1"
                                        >
                                            {subItem.imageUrl && (
                                                <img
                                                    src={subItem.imageUrl}
                                                    alt=""
                                                    className="w-6 h-6 rounded object-cover"
                                                />
                                            )}
                                            <span className="font-medium">{subItem.label}</span>
                                            {subItem.badge && (
                                                <span className="bg-accent text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase">
                                                    {subItem.badge}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links Row */}
                    {item.description && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs text-slate-500 font-medium">{item.description}</p>
                        </div>
                    )}
                </div>

                {/* Promo Sidebar */}
                {promos.length > 0 && (
                    <div className="col-span-3 bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-r-2xl border-l border-slate-200">
                        {promos.map((promo) => (
                            <Link
                                key={promo.id}
                                to={promo.url || '#'}
                                className="block group"
                            >
                                {promo.imageUrl && (
                                    <div className="rounded-xl overflow-hidden mb-4 shadow-lg">
                                        <img
                                            src={promo.imageUrl}
                                            alt={promo.label}
                                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <h4 className="font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                    {promo.label}
                                </h4>
                                {promo.description && (
                                    <p className="text-xs text-slate-500 mb-3">{promo.description}</p>
                                )}
                                <span className="inline-flex items-center gap-1 text-xs font-black text-primary uppercase tracking-wider">
                                    Shop Now
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
