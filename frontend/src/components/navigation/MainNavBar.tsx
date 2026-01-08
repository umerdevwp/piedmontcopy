import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Printer, ChevronDown, ArrowRight, Package, Settings } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { type NavigationItem } from './types';
import { MegaMenu } from './MegaMenu';
import { useSearch } from '../../hooks/useSearch';

interface MainNavBarProps {
    items: NavigationItem[];
    onMobileMenuToggle: () => void;
    isMobileMenuOpen: boolean;
}

export default function MainNavBar({ items, onMobileMenuToggle, isMobileMenuOpen }: MainNavBarProps) {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { results, isLoading } = useSearch(searchQuery);
    const navigate = useNavigate();

    const cartItems = useCartStore((state) => state.items);
    const { user, isAuthenticated } = useAuthStore();
    const navRef = useRef<HTMLElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close menu/search when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActiveMenu(null);
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuEnter = (id: number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveMenu(id);
    };

    const handleMenuLeave = () => {
        timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    const hasResults = results.products.length > 0 || results.services.length > 0;

    return (
        <nav ref={navRef} className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 relative">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-black text-xl text-primary shrink-0">
                        <Printer className="h-7 w-7 text-accent" />
                        <span className="hidden sm:block">PiedmontCopy</span>
                    </Link>

                    {/* Desktop Categories */}
                    <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-4xl mx-8">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className=""
                                onMouseEnter={() => handleMenuEnter(item.id)}
                                onMouseLeave={handleMenuLeave}
                            >
                                <Link
                                    to={item.url || '#'}
                                    className={`flex items-center gap-1 px-3 py-2 text-sm font-bold rounded-lg transition-colors ${activeMenu === item.id
                                        ? 'bg-slate-100 text-primary'
                                        : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                                        }`}
                                >
                                    {item.label}
                                    {item.children && item.children.length > 0 && (
                                        <ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === item.id ? 'rotate-180' : ''}`} />
                                    )}
                                    {item.badge && (
                                        <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase ml-1">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>

                                {/* Mega Menu Dropdown */}
                                {item.children && item.children.length > 0 && activeMenu === item.id && (
                                    <MegaMenu
                                        item={item}
                                        onMouseEnter={() => handleMenuEnter(item.id)}
                                        onMouseLeave={handleMenuLeave}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`p-2.5 rounded-full transition-all duration-300 ${isSearchOpen ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-100 text-slate-600'}`}
                            >
                                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </button>

                            {isSearchOpen && (
                                <div className="absolute top-full right-0 mt-4 w-[380px] sm:w-[500px] bg-white border border-slate-200 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 animate-in fade-in slide-in-from-top-4 duration-300 z-[60]">
                                    <form onSubmit={handleSearchSubmit} className="relative p-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="What are you looking for?"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all"
                                            autoFocus
                                        />
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        {isLoading && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </form>

                                    {(hasResults || (searchQuery.length >= 2 && !isLoading)) && (
                                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2 mt-2">
                                            {results.products.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                        <Package className="h-3 w-3" /> Products
                                                    </div>
                                                    <div className="space-y-1">
                                                        {results.products.map(product => (
                                                            <Link
                                                                key={product.id}
                                                                to={`/products/${product.slug}`}
                                                                onClick={() => setIsSearchOpen(false)}
                                                                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                                                            >
                                                                <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                                                    {product.imageUrl ? (
                                                                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                                                                    ) : (
                                                                        <div className="h-full w-full flex items-center justify-center text-slate-300 font-bold text-xs uppercase">No Img</div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm font-black text-slate-900 truncate group-hover:text-primary transition-colors">
                                                                        {product.name}
                                                                    </div>
                                                                    <div className="text-[10px] font-bold text-slate-400 uppercase">From ${product.basePrice}</div>
                                                                </div>
                                                                <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all mr-2" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {results.services.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                        <Settings className="h-3 w-3" /> Services
                                                    </div>
                                                    <div className="space-y-1">
                                                        {results.services.map(service => (
                                                            <Link
                                                                key={service.id}
                                                                to={`/services/${service.slug}`}
                                                                onClick={() => setIsSearchOpen(false)}
                                                                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                                                            >
                                                                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                                                    <ArrowRight className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm font-black text-slate-900 truncate group-hover:text-primary transition-colors">
                                                                        {service.title}
                                                                    </div>
                                                                    <div className="text-[10px] font-bold text-primary uppercase">Expert Solution</div>
                                                                </div>
                                                                <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all mr-2" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {!hasResults && searchQuery.length >= 2 && !isLoading && (
                                                <div className="p-8 text-center bg-slate-50 rounded-[1.5rem] mt-2">
                                                    <div className="text-sm font-bold text-slate-500 mb-1">No matches for "{searchQuery}"</div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Try adjusting your terms</div>
                                                </div>
                                            )}

                                            {hasResults && (
                                                <button
                                                    onClick={() => handleSearchSubmit()}
                                                    className="w-full mt-2 p-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                                >
                                                    View All Results <ArrowRight className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* User */}
                        {isAuthenticated() ? (
                            <Link
                                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-wider"
                            >
                                <User className="h-4 w-4" />
                                <span>{user?.role === 'admin' ? 'Admin' : 'Account'}</span>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                            >
                                <User className="h-4 w-4" />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={onMobileMenuToggle}
                            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
