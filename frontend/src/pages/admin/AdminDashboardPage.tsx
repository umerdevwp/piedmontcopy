import { useState, useEffect } from 'react';
import {
    Users,
    Package,
    ShoppingBag,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity,
    DollarSign,
    Loader2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
}

interface RecentActivity {
    orders: any[];
    users: any[];
}

interface DailyStat {
    date: string;
    counts: number;
    revenue: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/dashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch dashboard data');
            const data = await response.json();
            setStats(data.stats);
            setRecentActivity(data.recentActivity);
            setDailyStats(data.dailyStats.map((s: any) => ({
                ...s,
                revenue: parseFloat(s.revenue),
                date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            })));
        } catch (error) {
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            className="space-y-8 pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terminal Control</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 italic">Real-time system diagnostics & platform vitality</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        System Live
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue.toLocaleString()}`}
                    change="+12.5%"
                    icon={DollarSign}
                    color="blue"
                    delay={0}
                />
                <StatCard
                    title="Active Orders"
                    value={stats?.totalOrders.toString() || '0'}
                    change="+8%"
                    icon={ShoppingBag}
                    color="purple"
                    delay={0.1}
                />
                <StatCard
                    title="Inventory"
                    value={stats?.totalProducts.toString() || '0'}
                    change="+2"
                    icon={Package}
                    color="orange"
                    delay={0.2}
                />
                <StatCard
                    title="Total Customers"
                    value={stats?.totalUsers.toString() || '0'}
                    change="+24%"
                    icon={Users}
                    color="emerald"
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Revenue Dynamics</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">30-day performance trajectory</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyStats}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Live Activity</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System event log</p>
                        </div>
                        <Activity className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="space-y-6">
                        {recentActivity?.orders.map((order, i) => (
                            <ActivityItem
                                key={`order-${order.id}`}
                                title="New Order Received"
                                subtitle={`Order #${order.id} by ${order.user?.fullName || 'Guest'}`}
                                time={new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                icon={ShoppingBag}
                                color="blue"
                            />
                        ))}
                        {recentActivity?.users.map((user, i) => (
                            <ActivityItem
                                key={`user-${user.id}`}
                                title="New User Registered"
                                subtitle={user.fullName || user.email}
                                time={new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                icon={Users}
                                color="emerald"
                            />
                        ))}
                        {(!recentActivity?.orders.length && !recentActivity?.users.length) && (
                            <div className="text-center py-10">
                                <Clock className="h-10 w-10 text-slate-100 mx-auto mb-3" />
                                <p className="text-slate-400 font-bold text-xs uppercase">No recent events</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Volume Bar Chart */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Intensity</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily unit distribution</p>
                        </div>
                        <BarChart className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="counts" radius={[6, 6, 0, 0]}>
                                    {dailyStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* System Health / Status */}
                <motion.div
                    variants={itemVariants}
                    className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white overflow-hidden relative"
                >
                    <div className="relative z-10 flex flex-col h-full">
                        <h2 className="text-2xl font-black tracking-tight mb-2">Operational Status</h2>
                        <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-8">Global Node Infrastructure</p>

                        <div className="grid grid-cols-2 gap-4 mt-auto">
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-white/40 font-black text-[8px] uppercase tracking-widest mb-1">API Latency</p>
                                <p className="text-xl font-black">24ms</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-white/40 font-black text-[8px] uppercase tracking-widest mb-1">DB Uptime</p>
                                <p className="text-xl font-black">99.98%</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-white/40 font-black text-[8px] uppercase tracking-widest mb-1">Active Sockets</p>
                                <p className="text-xl font-black">1.2k</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-white/40 font-black text-[8px] uppercase tracking-widest mb-1">Worker Load</p>
                                <p className="text-xl font-black">14.2%</p>
                            </div>
                        </div>
                    </div>
                    {/* Abstract background graphics */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] -ml-24 -mb-24" />
                </motion.div>
            </div>
        </motion.div>
    );
}

function StatCard({ title, value, change, icon: Icon, color, delay }: any) {
    const colors: Record<string, string> = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 group hover:border-primary/50 transition-all duration-500"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl border ${colors[color]} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="h-6 w-6" />
                </div>
                {change.startsWith('+') ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">
                        <ArrowUpRight className="h-3 w-3" />
                        {change}
                    </div>
                ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black">
                        <ArrowDownRight className="h-3 w-3" />
                        {change}
                    </div>
                )}
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{title}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </motion.div>
    );
}

function ActivityItem({ title, subtitle, time, icon: Icon, color }: any) {
    const colors: Record<string, string> = {
        blue: "text-blue-600 bg-blue-50",
        emerald: "text-emerald-600 bg-emerald-50",
    };

    return (
        <div className="flex items-center gap-4 group">
            <div className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-black text-slate-900 truncate tracking-tight">{title}</p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{time}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{subtitle}</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="text-lg font-black tracking-tight leading-none">
                        {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : `${p.value} units`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}
