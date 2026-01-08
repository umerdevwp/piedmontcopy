import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, User, ShoppingCart, X, Search } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { type NavigationItem } from './types';

interface MobileNavigationProps {
    items: NavigationItem[];
    utilityItems: NavigationItem[];
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNavigation({ items, utilityItems, isOpen, onClose }: MobileNavigationProps) {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const cartItems = useCartStore((state) => state.items);
    const { user, isAuthenticated } = useAuthStore();

    const toggleExpand = (id: number) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <span className="font-black text-lg text-slate-900">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-slate-600" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                    {items.map((item) => (
                        <div key={item.id} className="border-b border-slate-100">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                                onClick={() => item.children && item.children.length > 0 && toggleExpand(item.id)}
                            >
                                <Link
                                    to={item.url || '#'}
                                    onClick={(e) => {
                                        if (item.children && item.children.length > 0) {
                                            e.preventDefault();
                                        } else {
                                            onClose();
                                        }
                                    }}
                                    className="flex items-center gap-2 font-bold text-slate-900"
                                >
                                    {item.label}
                                    {item.badge && (
                                        <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                                {item.children && item.children.length > 0 && (
                                    <ChevronDown
                                        className={`h-5 w-5 text-slate-400 transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''
                                            }`}
                                    />
                                )}
                            </div>

                            {/* Expanded Subitems */}
                            {expandedItems.has(item.id) && item.children && (
                                <div className="bg-slate-50 py-2">
                                    {item.children
                                        .filter(c => c.type !== 'promo')
                                        .map((child) => (
                                            <div key={child.id}>
                                                <Link
                                                    to={child.url || '#'}
                                                    onClick={onClose}
                                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-primary"
                                                >
                                                    {child.label}
                                                    {child.children && child.children.length > 0 && (
                                                        <ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
                                                    )}
                                                </Link>

                                                {/* Third level */}
                                                {child.children && child.children.length > 0 && (
                                                    <div className="pl-4">
                                                        {child.children.map((subChild) => (
                                                            <Link
                                                                key={subChild.id}
                                                                to={subChild.url || '#'}
                                                                onClick={onClose}
                                                                className="flex items-center gap-2 px-6 py-2 text-sm text-slate-500 hover:text-primary"
                                                            >
                                                                {subChild.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 space-y-3">
                    {/* Utility Links */}
                    <div className="flex flex-wrap gap-2">
                        {utilityItems.slice(0, 3).map((item) => (
                            <Link
                                key={item.id}
                                to={item.url || '#'}
                                onClick={onClose}
                                className="text-xs font-bold text-slate-500 hover:text-primary"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link
                            to="/cart"
                            onClick={onClose}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Cart ({cartItems.length})
                        </Link>
                        {isAuthenticated() ? (
                            <Link
                                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                                onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                            >
                                <User className="h-4 w-4" />
                                Account
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                            >
                                <User className="h-4 w-4" />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
