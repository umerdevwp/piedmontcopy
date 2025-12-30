
import { BarChart, Users, Package, ShoppingBag } from 'lucide-react';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Orders"
                    value="124"
                    change="+12%"
                    icon={ShoppingBag}
                    color="text-blue-600 bg-blue-100"
                />
                <DashboardCard
                    title="Total Revenue"
                    value="$12,450"
                    change="+8%"
                    icon={BarChart}
                    color="text-green-600 bg-green-100"
                />
                <DashboardCard
                    title="Products"
                    value="45"
                    change="+2"
                    icon={Package}
                    color="text-purple-600 bg-purple-100"
                />
                <DashboardCard
                    title="Total Users"
                    value="890"
                    change="+24%"
                    icon={Users}
                    color="text-orange-600 bg-orange-100"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-gray-500 text-sm">
                    No recent activity to show (Mock).
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ title, value, change, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {change}
                </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
}
