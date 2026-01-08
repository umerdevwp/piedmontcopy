import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight,
    GripVertical, Eye, EyeOff, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

import type { NavigationItem } from '../../components/navigation/types';

interface AgentNavigationItem extends NavigationItem {
    parent?: { id: number; label: string } | null;
}

const HEADER_TYPES = [
    { value: 'utility', label: 'Utility Bar Link', color: 'bg-blue-100 text-blue-700' },
    { value: 'main', label: 'Main Category', color: 'bg-green-100 text-green-700' },
    { value: 'mega-category', label: 'Mega Menu Category', color: 'bg-purple-100 text-purple-700' },
    { value: 'mega-item', label: 'Mega Menu Item', color: 'bg-orange-100 text-orange-700' },
    { value: 'promo', label: 'Promotional Block', color: 'bg-pink-100 text-pink-700' }
];

const FOOTER_TYPES = [
    { value: 'footer-brand', label: 'Brand Section', color: 'bg-gray-100 text-gray-700' }, // Maybe unused if hardcoded?
    { value: 'footer-column', label: 'Footer Column', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'footer-link', label: 'Footer Link', color: 'bg-teal-100 text-teal-700' },
    { value: 'footer-newsletter', label: 'Newsletter', color: 'bg-yellow-100 text-yellow-700' }
];

// Combine for backward compatibility lookup or dynamic usage
const ALL_NAV_TYPES = [...HEADER_TYPES, ...FOOTER_TYPES];

export default function AdminNavigationPage() {
    const [items, setItems] = useState<AgentNavigationItem[]>([]);
    const [scope, setScope] = useState<'header' | 'footer'>('header');
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const { token } = useAuthStore();

    const currentTypes = scope === 'header' ? HEADER_TYPES : FOOTER_TYPES;

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/navigation/all?scope=${scope}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            toast.error('Failed to load navigation items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [scope]);

    const handleSave = async (item: Partial<AgentNavigationItem>) => {
        const itemWithScope = { ...item, scope };
        try {
            const isNew = !item.id;
            const url = isNew ? '/api/navigation' : `/api/navigation/${item.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(itemWithScope)
            });

            if (!response.ok) throw new Error('Failed to save');

            toast.success(isNew ? 'Item created!' : 'Item updated!');
            setEditingItem(null);
            setIsCreating(false);
            fetchItems();
        } catch (error) {
            toast.error('Failed to save navigation item');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this item and all its children?')) return;

        try {
            const response = await fetch(`/api/navigation/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete');

            toast.success('Item deleted!');
            fetchItems();
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

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



    const getParentOptions = () => {
        const validParentTypes = scope === 'header' ? ['main', 'mega-category'] : ['footer-column'];
        return items
            .filter(i => validParentTypes.includes(i.type))
            .map(i => ({ value: i.id, label: `${i.label} (${i.type})` }));
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Navigation Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Configure your site's mega menu and navigation links</p>

                    <div className="flex gap-2 mt-6 bg-slate-100 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setScope('header')}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${scope === 'header' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Header Navigation
                        </button>
                        <button
                            onClick={() => setScope('footer')}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${scope === 'footer' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Footer Navigation
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setIsCreating(true);
                        setEditingItem({ label: '', type: 'main', url: '', position: items.length } as any);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="h-4 w-4" />
                    Add Item
                </button>
            </div>

            {/* Type Legend */}
            <div className="flex flex-wrap gap-2 mb-6">
                {currentTypes.map(t => (
                    <span key={t.value} className={`px-3 py-1 rounded-full text-xs font-bold ${t.color}`}>
                        {t.label}
                    </span>
                ))}
            </div>

            {/* Items List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {items.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-400 font-medium">No navigation items yet. Add your first item above.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {items
                            .filter(i => !i.parentId)
                            .sort((a, b) => a.position - b.position)
                            .map((item) => (
                                <NavigationItemRow
                                    key={item.id}
                                    item={item}
                                    allItems={items}
                                    level={0}
                                    expanded={expandedItems.has(item.id)}
                                    expandedItems={expandedItems}
                                    onToggle={toggleExpand}
                                    onEdit={(i) => setEditingItem(i)}
                                    onDelete={handleDelete}
                                />
                            ))}
                    </div>
                )}
            </div>

            {/* Edit/Create Modal */}
            {(editingItem || isCreating) && (
                <NavigationItemModal
                    item={editingItem}
                    parentOptions={getParentOptions()}
                    navTypes={currentTypes}
                    onSave={handleSave}
                    onClose={() => {
                        setEditingItem(null);
                        setIsCreating(false);
                    }}
                />
            )}
        </div>
    );
}

// Row Component
function NavigationItemRow({
    item,
    allItems,
    level,
    expanded,
    expandedItems,
    onToggle,
    onEdit,
    onDelete
}: {
    item: NavigationItem;
    allItems: NavigationItem[];
    level: number;
    expanded: boolean;
    expandedItems: Set<number>;
    onToggle: (id: number) => void;
    onEdit: (item: NavigationItem) => void;
    onDelete: (id: number) => void;
}) {
    const children = allItems.filter(i => i.parentId === item.id).sort((a, b) => a.position - b.position);
    const typeInfo = ALL_NAV_TYPES.find(t => t.value === item.type);

    return (
        <>
            <div
                className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${level > 0 ? 'bg-slate-50/50' : ''
                    }`}
                style={{ paddingLeft: `${16 + level * 32}px` }}
            >
                {/* Expand Toggle */}
                {children.length > 0 ? (
                    <button onClick={() => onToggle(item.id)} className="p-1 hover:bg-slate-200 rounded">
                        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                ) : (
                    <div className="w-6" />
                )}

                {/* Drag Handle */}
                <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />

                {/* Image Preview */}
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />
                ) : (
                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-slate-300" />
                    </div>
                )}

                {/* Label & Type */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.label}</span>
                        {item.badge && (
                            <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
                                {item.badge}
                            </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${typeInfo?.color || 'bg-slate-100 text-slate-600'}`}>
                            {typeInfo?.label || item.type}
                        </span>
                    </div>
                    {item.url && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <ExternalLink className="h-3 w-3" />
                            {item.url}
                        </div>
                    )}
                </div>

                {/* Active Toggle */}
                <button
                    className={`p-2 rounded-lg transition-colors ${item.isActive ? 'text-green-600 bg-green-50' : 'text-slate-300 bg-slate-50'}`}
                    title={item.isActive ? 'Active' : 'Inactive'}
                >
                    {item.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                {/* Actions */}
                <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Children */}
            {expanded && children.map((child) => (
                <NavigationItemRow
                    key={child.id}
                    item={child}
                    allItems={allItems}
                    level={level + 1}
                    expanded={expandedItems.has(child.id)}
                    expandedItems={expandedItems}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
}

// Modal Component
function NavigationItemModal({
    item,
    parentOptions,
    navTypes,
    onSave,
    onClose
}: {
    item: NavigationItem | null;
    parentOptions: { value: number; label: string }[];
    navTypes: { value: string; label: string }[];
    onSave: (item: Partial<NavigationItem>) => void;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState({
        id: item?.id,
        label: item?.label || '',
        url: item?.url || '',
        type: item?.type || 'main',
        parentId: item?.parentId || null,
        position: item?.position || 0,
        icon: item?.icon || '',
        imageUrl: item?.imageUrl || '',
        description: item?.description || '',
        badge: item?.badge || '',
        isActive: item?.isActive !== false
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-900">
                        {item?.id ? 'Edit Navigation Item' : 'Add Navigation Item'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Label */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Label *
                        </label>
                        <input
                            type="text"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                            placeholder="e.g., Business Cards"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Type *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                        >
                            {navTypes.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Parent */}
                    {(formData.type === 'mega-category' || formData.type === 'mega-item' || formData.type === 'promo') && (
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Parent Category
                            </label>
                            <select
                                value={formData.parentId || ''}
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? Number(e.target.value) : null })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                            >
                                <option value="">None (Top Level)</option>
                                {parentOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* URL */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            URL
                        </label>
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                            placeholder="/products/business-cards"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Image URL
                        </label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Badge */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Badge
                            </label>
                            <input
                                type="text"
                                value={formData.badge}
                                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                                placeholder="NEW, SALE, etc."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Position
                            </label>
                            <input
                                type="number"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium resize-none"
                            placeholder="Short description for promos..."
                        />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <span className="font-bold text-slate-700">Visible on Site</span>
                        <button
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.isActive ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={!formData.label}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
