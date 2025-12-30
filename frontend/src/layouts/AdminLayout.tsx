
import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, LogOut, Printer, MonitorCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Toaster } from 'sonner';

export default function AdminLayout() {
    const { isAdmin, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/login');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin()) return null;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: MonitorCheck, label: 'Services', path: '/admin/services' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: FileText, label: 'Content', path: '/admin/content' },
        {
            icon: Settings,
            label: 'Settings',
            path: '/admin/settings',
            subItems: [
                { label: 'System', path: '/admin/settings' },
                { label: 'Theme', path: '/admin/settings/theme' }
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex text-slate-900">
            <Toaster position="top-right" richColors />

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 transition-all duration-300">
                <div className="p-6 border-b border-slate-800 flex items-center gap-2 font-bold text-xl">
                    <Printer className="h-6 w-6 text-primary" />
                    <span>Admin Panel</span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isMainActive = location.pathname.startsWith(item.path);

                        return (
                            <div key={item.path} className="space-y-1">
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isMainActive
                                        ? 'bg-primary text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>

                                {item.subItems && isMainActive && (
                                    <div className="ml-9 space-y-1 py-1">
                                        {item.subItems.map(sub => {
                                            const isSubActive = location.pathname === sub.path;
                                            return (
                                                <Link
                                                    key={sub.path}
                                                    to={sub.path}
                                                    className={`block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${isSubActive
                                                        ? 'text-white bg-white/10'
                                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                                        }`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
                            {user?.email[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}
