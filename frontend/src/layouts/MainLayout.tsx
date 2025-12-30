
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, Printer, ChevronDown } from 'lucide-react';
import { Toaster } from 'sonner';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    const { user, isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-gray-50">
            <Toaster position="top-center" richColors />
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Printer className="h-6 w-6 text-accent" />
                        <span>PiedmontCopy</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>

                        {/* Services Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors py-2 font-medium">
                                Services
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute top-full left-0 w-56 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="p-2 space-y-1 shadow-2xl rounded-2xl border border-slate-50">
                                    {[
                                        'Book binding', 'Copying', 'Lamination', 'Scanning',
                                        'Layout design', 'Desktop publishing', 'Custom printing', 'Faxing'
                                    ].map((service) => (
                                        <Link
                                            key={service}
                                            to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors font-bold"
                                        >
                                            {service}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link to="/design-tool" className="hover:text-primary transition-colors">Design Online</Link>
                        <Link to="/about" className="hover:text-primary transition-colors">About</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                            <Search className="h-5 w-5" />
                        </button>
                        <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated() ? (
                            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                                <User className="h-4 w-4" />
                                <span>{user?.role === 'admin' ? 'Admin' : 'My Account'}</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                <User className="h-4 w-4" />
                                <span>Sign In</span>
                            </Link>
                        )}

                        <button
                            className="md:hidden p-2 hover:bg-slate-100 rounded-md"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
                        <Link to="/products" className="block text-sm font-medium text-slate-700">Products</Link>
                        <Link to="/design-tool" className="block text-sm font-medium text-slate-700">Design Online</Link>
                        <Link to="/about" className="block text-sm font-medium text-slate-700">About</Link>
                        <hr />
                        {isAuthenticated() ? (
                            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
                                <User className="h-4 w-4" />
                                <span>My Account</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-widest">
                                <User className="h-4 w-4" />
                                <span>Sign In</span>
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12 px-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                            <Printer className="h-6 w-6 text-accent" />
                            <span>PiedmontCopy</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Premium printing services for your business needs. Quality you can trust.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Products</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link to="/products" className="hover:text-white transition-colors">Business Cards</Link></li>
                            <li><Link to="/products" className="hover:text-white transition-colors">Flyers</Link></li>
                            <li><Link to="/products" className="hover:text-white transition-colors">Brochures</Link></li>
                            <li><Link to="/products" className="hover:text-white transition-colors">Vinyl Banners</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Support</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">File Preparation</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Stay Connected</h4>
                        <p className="text-sm text-slate-400 mb-4">
                            Subscribe to get special offers and design tips.
                        </p>
                        <div className="flex gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-transparent border-none px-3 py-2 text-sm w-full focus:ring-0 text-white"
                            />
                            <button className="bg-primary text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} PiedmontCopy. Premium Printing Solutions.
                </div>
            </footer>
        </div>
    );
}
