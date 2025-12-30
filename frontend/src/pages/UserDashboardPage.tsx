
import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, Loader2, LayoutDashboard, User, LogOut, Settings, Save, MapPin, Phone, Mail } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Order {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: Array<{
        id: number;
        quantity: number;
        subtotal: number;
        configurations: any;
        product: {
            name: string;
            imageUrl: string;
        };
    }>;
}

const STATUS_ICONS: Record<string, any> = {
    received: Clock,
    processing: Loader2,
    printing: Loader2,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: XCircle
};

const STATUS_COLORS: Record<string, string> = {
    received: 'text-blue-500 bg-blue-50',
    processing: 'text-yellow-500 bg-yellow-50',
    printing: 'text-purple-500 bg-purple-50',
    shipped: 'text-indigo-500 bg-indigo-50',
    delivered: 'text-green-500 bg-green-50',
    cancelled: 'text-red-500 bg-red-50'
};

export default function UserDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { user, token, logout, isAuthenticated, setAuth } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

    const [profileForm, setProfileForm] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchUserOrders();
    }, [isAuthenticated, navigate]);

    const fetchUserOrders = async () => {
        try {
            const response = await fetch('/api/orders/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            toast.error('Could not load your orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch('/api/auth/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileForm)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update profile');

            setAuth(data.user, token!);
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {profileForm.fullName || 'Welcome Back!'}
                                </h1>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <LayoutDashboard className="h-5 w-5 text-primary" />
                                <span className="font-black text-slate-900 text-sm uppercase tracking-widest">Dashboard</span>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <Package className="h-4 w-4" />
                                    My Orders
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <Settings className="h-4 w-4" />
                                    Profile Settings
                                </button>
                            </div>

                            <hr className="my-8 border-slate-100" />

                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</div>
                                    <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'orders' ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Orders</h2>
                                    <Package className="h-5 w-5 text-slate-300" />
                                </div>

                                {orders.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
                                        <Package className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                                        <h3 className="text-xl font-black text-slate-900 mb-2">No orders yet</h3>
                                        <p className="text-slate-500 mb-8 font-medium">Ready to start your next creative project?</p>
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                                        >
                                            Browse Catalog
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => {
                                            const StatusIcon = STATUS_ICONS[order.status] || Clock;
                                            return (
                                                <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-500">
                                                    <div className="p-8">
                                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                                                            <div className="flex items-center gap-4">
                                                                <div className="bg-slate-900 h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                                    <Package className="h-6 w-6" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</div>
                                                                    <div className="text-lg font-black text-slate-900 tracking-tight">#{order.id}</div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-6">
                                                                <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full ${STATUS_COLORS[order.status]} shadow-sm`}>
                                                                    <StatusIcon className={`h-4 w-4 ${order.status === 'processing' || order.status === 'printing' ? 'animate-spin' : ''}`} />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            {order.items.map((item) => (
                                                                <div key={item.id} className="flex gap-6 items-start">
                                                                    <div className="h-24 w-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                                                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 pt-1">
                                                                        <h4 className="font-black text-slate-900 tracking-tight text-lg mb-1">{item.product.name}</h4>
                                                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Quantity: {item.quantity}</p>
                                                                        {item.configurations && (
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {Object.entries(item.configurations).map(([key, val]: [string, any]) => (
                                                                                    <span key={key} className="text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                                                                        {key}: {typeof val === 'object' ? (val as any).name : val}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right pt-1">
                                                                        <div className="text-lg font-black text-slate-900">${parseFloat(item.subtotal.toString()).toFixed(2)}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</span>
                                                                <span className="text-3xl font-black text-primary">${parseFloat(order.totalAmount.toString()).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Settings className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Profile Settings</h2>
                                        <p className="text-sm text-slate-500 font-medium italic">Update your personal information and contact details</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <User className="h-3 w-3" /> Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileForm.fullName}
                                                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <Mail className="h-3 w-3" /> Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <Phone className="h-3 w-3" /> Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <MapPin className="h-3 w-3" /> Global Address
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={profileForm.address}
                                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                                                placeholder="123 Printing Way, Design City, 90210"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                                        >
                                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
