
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Loader2, Trash2, Edit3, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import Pagination from '../../components/Pagination';

interface Order {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    shippingAddress: any;
    user?: {
        email: string;
        fullName?: string | null;
        phone?: string | null;
        address?: string | null;
    };
    items: Array<{
        id: number;
        quantity: number;
        subtotal: number;
        configurations: any;
        fileUrl?: string;
        files?: Array<{ name: string; url: string; type: string }>;
        product: {
            id: number;
            name: string;
            imageUrl: string;
        };
    }>;
}

const STATUS_OPTIONS = ['received', 'processing', 'printing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
    received: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    printing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Order | null>(null);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
    const { token, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/orders/admin/all?page=${page}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    navigate('/login');
                    throw new Error('Unauthorized - please login again');
                }
                throw new Error('Failed to fetch orders');
            }
            const result = await response.json();
            setOrders(result.data || []);
            setMeta(result.meta || { total: 0, totalPages: 0 });
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (order: Order) => {
        setEditData(JSON.parse(JSON.stringify(order)));
        setSelectedOrder(null);
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!editData) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/orders/admin/${editData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });

            if (!response.ok) throw new Error('Failed to update order');

            toast.success('Order synchronized successfully');
            setIsEditing(false);
            setEditData(null);
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleItemUpdate = (index: number, field: string, value: any) => {
        if (!editData) return;
        const newItems = [...editData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Recalculate total if subtotal changes (basic manual adjustment for admin)
        const newTotal = newItems.reduce((acc, item) => acc + parseFloat(item.subtotal.toString()), 0);

        setEditData({ ...editData, items: newItems, totalAmount: newTotal });
    };

    const handleConfigUpdate = (itemIdx: number, key: string, newValue: string) => {
        if (!editData) return;
        const newItems = [...editData.items];
        const newConfigs = { ...newItems[itemIdx].configurations, [key]: newValue };
        newItems[itemIdx] = { ...newItems[itemIdx], configurations: newConfigs };
        setEditData({ ...editData, items: newItems });
    };

    const removeConfigKey = (itemIdx: number, key: string) => {
        if (!editData) return;
        const newItems = [...editData.items];
        const newConfigs = { ...newItems[itemIdx].configurations };
        delete newConfigs[key];
        newItems[itemIdx] = { ...newItems[itemIdx], configurations: newConfigs };
        setEditData({ ...editData, items: newItems });
    };

    const [addingParamTo, setAddingParamTo] = useState<number | null>(null);
    const [newParamLabel, setNewParamLabel] = useState('');

    const confirmAddParam = (idx: number) => {
        if (!editData || !newParamLabel) return;
        const newItems = [...editData.items];
        const newConfigs = { ...newItems[idx].configurations, [newParamLabel]: 'Pending' };
        newItems[idx] = { ...newItems[idx], configurations: newConfigs };
        setEditData({ ...editData, items: newItems });
        setAddingParamTo(null);
        setNewParamLabel('');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;

        try {
            const response = await fetch(`/api/orders/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete order');

            toast.success('Order deleted successfully');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Logs</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 italic">Real-time fulfillment pipeline</p>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-4 py-2 rounded-full">
                    Pool: {meta?.total || 0} units
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requester</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-slate-900 tracking-tight">#{order.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-slate-900 mb-0.5">
                                            {order.shippingAddress?.firstName ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : order.shippingAddress?.name || 'Guest User'}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.user?.email || order.shippingAddress?.email}</div>
                                    </td>
                                    <td className="px-8 py-6 text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">
                                        ${parseFloat(order.totalAmount.toString()).toFixed(2)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-800'} shadow-sm`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setSelectedOrder(order); setIsEditing(false); setEditData(null); }}
                                                className="h-10 w-10 flex items-center justify-center text-slate-400 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(order)}
                                                className="h-10 w-10 flex items-center justify-center text-slate-400 hover:bg-amber-50 hover:text-amber-500 rounded-xl transition-all"
                                                title="Edit Order"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="h-10 w-10 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                                title="Delete Order"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={meta?.totalPages || 0}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                />
            </div>

            {/* Order Detail / Edit Modal */}
            {(selectedOrder || editData) && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-10 border-b border-slate-50 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {isEditing ? 'Sync Protocol' : 'System Order'} #{isEditing ? editData?.id : selectedOrder?.id}
                                </h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">
                                    {isEditing ? 'Editing Order Payload' : `Logged on ${new Date(selectedOrder?.createdAt || '').toLocaleString()}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={loading}
                                            className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2"
                                        >
                                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                            COMMIT SYNC
                                        </button>
                                        <button
                                            onClick={() => { setIsEditing(false); setEditData(null); }}
                                            className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                            {/* Fulfillment Status Edit (Only in Edit Mode) */}
                            {isEditing && editData && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Status</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                        {STATUS_OPTIONS.map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setEditData({ ...editData, status })}
                                                className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${editData.status === status
                                                    ? STATUS_COLORS[status] + ' ring-2 ring-primary/20'
                                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Items Section */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Procurement Items</h3>
                                <div className="space-y-4">
                                    {(isEditing ? editData?.items : selectedOrder?.items)?.map((item, idx) => (
                                        <div key={item.id} className={`flex items-start gap-6 p-6 rounded-[2rem] border transition-all ${isEditing ? 'bg-white border-amber-200 shadow-lg shadow-amber-500/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="h-20 w-20 rounded-[1.5rem] object-cover shadow-sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-black text-slate-900 text-lg mb-1">{item.product.name}</div>

                                                {isEditing ? (
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleItemUpdate(idx, 'quantity', parseInt(e.target.value) || 0)}
                                                                className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-xs outline-none focus:border-amber-400 transition-all"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Subtotal ($)</label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={item.subtotal}
                                                                onChange={(e) => handleItemUpdate(idx, 'subtotal', parseFloat(e.target.value) || 0)}
                                                                className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-xs outline-none focus:border-amber-400 transition-all text-primary"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Units Requested: {item.quantity}</div>
                                                )}

                                                {/* Configurations */}
                                                <div className="mt-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">DNA Parameters</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => setAddingParamTo(idx)}
                                                                className="text-[8px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1 group/btn"
                                                            >
                                                                <Edit3 className="h-2.5 w-2.5 group-hover/btn:rotate-12 transition-transform" />
                                                                INSERT PARAMETER
                                                            </button>
                                                        )}
                                                    </div>

                                                    {isEditing && addingParamTo === idx && (
                                                        <div className="flex items-center gap-2 animate-in zoom-in duration-200">
                                                            <input
                                                                autoFocus
                                                                placeholder="LABEL (e.g. SIZE)"
                                                                value={newParamLabel}
                                                                onChange={(e) => setNewParamLabel(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && confirmAddParam(idx)}
                                                                className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-[9px] font-black uppercase outline-none w-32"
                                                            />
                                                            <button
                                                                onClick={() => confirmAddParam(idx)}
                                                                className="p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                                                            >
                                                                <Save className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => setAddingParamTo(null)}
                                                                className="p-1.5 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(item.configurations).map(([key, value]: [string, any]) => (
                                                            <div key={key} className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden group/conf">
                                                                <span className="bg-slate-50 px-3 py-1.5 text-slate-400 font-black text-[9px] uppercase tracking-tighter border-r border-slate-100">{key}</span>
                                                                {isEditing ? (
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            type="text"
                                                                            value={typeof value === 'object' ? value.name : value}
                                                                            onChange={(e) => handleConfigUpdate(idx, key, e.target.value)}
                                                                            className="px-3 py-1.5 text-slate-900 font-black text-[9px] uppercase outline-none focus:bg-amber-50 w-24"
                                                                        />
                                                                        <button
                                                                            onClick={() => removeConfigKey(idx, key)}
                                                                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="px-3 py-1.5 text-slate-900 font-black text-[9px] uppercase">{typeof value === 'object' ? value.name : value}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Files Display in Item */}
                                                    {item.files && item.files.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                                                            {item.files.map((file, fidx) => (
                                                                <a
                                                                    key={fidx}
                                                                    href={file.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all group/art"
                                                                >
                                                                    {file.type.includes('image') ? (
                                                                        <img src={file.url} className="h-4 w-4 object-cover rounded shadow-sm" alt="Artwork" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                    <span className="text-[9px] font-black uppercase tracking-widest">{file.name}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {!isEditing && (
                                                <div className="font-black text-slate-900 text-2xl">
                                                    ${parseFloat(item.subtotal.toString()).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Profile & Shipping Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Credentials</h3>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2">
                                        <div className="text-sm font-black text-slate-900">{(isEditing ? editData?.user?.fullName : selectedOrder?.user?.fullName) || 'No Full Name Provided'}</div>
                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{(isEditing ? editData?.user?.email : selectedOrder?.user?.email)}</div>
                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{(isEditing ? editData?.user?.phone : selectedOrder?.user?.phone) || 'No Phone on file'}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics Terminal</h3>
                                    <div className={`p-6 rounded-[2rem] border space-y-2 ${isEditing ? 'bg-white border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                                        {isEditing && editData ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editData.shippingAddress.name || (editData.shippingAddress.firstName ? editData.shippingAddress.firstName + ' ' + editData.shippingAddress.lastName : '')}
                                                    onChange={(e) => setEditData({ ...editData, shippingAddress: { ...editData.shippingAddress, name: e.target.value } })}
                                                    className="w-full bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-sm font-black outline-none focus:border-amber-400"
                                                    placeholder="Receiver Name"
                                                />
                                                <textarea
                                                    value={editData.shippingAddress.address || editData.shippingAddress.street}
                                                    onChange={(e) => setEditData({ ...editData, shippingAddress: { ...editData.shippingAddress, address: e.target.value } })}
                                                    className="w-full bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:border-amber-400"
                                                    placeholder="Street Address"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editData.shippingAddress.city}
                                                        onChange={(e) => setEditData({ ...editData, shippingAddress: { ...editData.shippingAddress, city: e.target.value } })}
                                                        className="flex-1 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:border-amber-400"
                                                        placeholder="City"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editData.shippingAddress.zip}
                                                        onChange={(e) => setEditData({ ...editData, shippingAddress: { ...editData.shippingAddress, zip: e.target.value } })}
                                                        className="w-24 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-xs font-bold outline-none focus:border-amber-400"
                                                        placeholder="Zip"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-sm font-black text-slate-900">
                                                    {selectedOrder?.shippingAddress?.firstName ? `${selectedOrder.shippingAddress.firstName} ${selectedOrder.shippingAddress.lastName}` : (selectedOrder?.shippingAddress?.name || 'Guest')}
                                                </div>
                                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                                    {selectedOrder?.shippingAddress?.address || selectedOrder?.shippingAddress?.street}<br />
                                                    {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state && `${selectedOrder.shippingAddress.state}, `}{selectedOrder?.shippingAddress?.zip}
                                                </div>
                                                <div className="text-[11px] font-black text-primary uppercase tracking-widest">{selectedOrder?.shippingAddress?.email}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Final Valuation */}
                            <div className="pt-10 border-t border-slate-100 flex items-center justify-between shrink-0 mb-4">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Value Generated</div>
                                <div className={`text-4xl font-black ${isEditing ? 'text-amber-500' : 'text-primary'}`}>
                                    ${parseFloat((isEditing ? editData?.totalAmount : selectedOrder?.totalAmount)?.toString() || '0').toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
