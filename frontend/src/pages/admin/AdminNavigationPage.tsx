import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
    Plus, Save, X,
    Image as ImageIcon
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    DragOverlay
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAuthStore } from '../../store/useAuthStore';
import { SortableNavigationItem } from './components/SortableNavigationItem';

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
    { value: 'footer-brand', label: 'Brand Section', color: 'bg-gray-100 text-gray-700' },
    { value: 'footer-column', label: 'Footer Column', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'footer-link', label: 'Footer Link', color: 'bg-teal-100 text-teal-700' },
    { value: 'footer-newsletter', label: 'Newsletter', color: 'bg-yellow-100 text-yellow-700' }
];

const ALL_NAV_TYPES = [...HEADER_TYPES, ...FOOTER_TYPES];

export default function AdminNavigationPage() {
    const [items, setItems] = useState<AgentNavigationItem[]>([]);
    const [scope, setScope] = useState<'header' | 'footer'>('header');
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [activeId, setActiveId] = useState<number | null>(null);
    const { token } = useAuthStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const currentTypes = scope === 'header' ? HEADER_TYPES : FOOTER_TYPES;

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/navigation/all?scope=${scope}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setItems(data);

            // Auto expand items with children on load
            const parents = data.filter((i: any) => i.parentId === null).map((i: any) => i.id);
            setExpandedItems(new Set(parents));
        } catch (error) {
            toast.error('Failed to load navigation items');
        } finally {
            setLoading(false);
        }
    }, [scope, token]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

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

    const getFlattenedItems = useCallback((itemsList: AgentNavigationItem[], parentId: number | null = null, level = 0): (AgentNavigationItem & { level: number })[] => {
        return itemsList
            .filter(i => i.parentId === parentId)
            .sort((a, b) => a.position - b.position)
            .reduce((acc: any[], item) => {
                acc.push({ ...item, level });
                if (expandedItems.has(item.id)) {
                    acc.push(...getFlattenedItems(itemsList, item.id, level + 1));
                }
                return acc;
            }, []);
    }, [expandedItems]);

    const flattenedItems = useMemo(() => getFlattenedItems(items), [items, getFlattenedItems]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = flattenedItems.findIndex(i => i.id === active.id);
        const newIndex = flattenedItems.findIndex(i => i.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const overItem = items.find(i => i.id === over.id);
        const activeItem = items.find(i => i.id === active.id);

        if (!overItem || !activeItem) return;

        const newParentId = overItem.parentId;

        // Reorder items
        const itemsToUpdate: { id: number; position: number; parentId?: number | null }[] = [];

        const siblingsInNewParent = items.filter(i => i.parentId === newParentId && i.id !== activeItem.id)
            .sort((a, b) => a.position - b.position);

        const overIndexInSiblings = siblingsInNewParent.findIndex(s => s.id === overItem.id);
        const insertionIndex = oldIndex < newIndex ? overIndexInSiblings + 1 : overIndexInSiblings;

        siblingsInNewParent.splice(insertionIndex, 0, activeItem);

        siblingsInNewParent.forEach((item, index) => {
            itemsToUpdate.push({
                id: item.id,
                position: index,
                parentId: item.id === activeItem.id ? newParentId : undefined
            });
        });

        // Optimistic update
        setItems(prev => prev.map(i => {
            const update = itemsToUpdate.find(u => u.id === i.id);
            if (update) return { ...i, position: update.position, parentId: update.parentId !== undefined ? update.parentId : i.parentId };
            return i;
        }));

        try {
            const response = await fetch('/api/navigation/reorder/bulk', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ items: itemsToUpdate })
            });

            if (!response.ok) throw new Error('Failed to reorder');
            toast.success('Architecture synchronized');
        } catch (error) {
            toast.error('Sync failure. Rolling back.');
            fetchItems();
        }
    };

    const getParentOptions = () => {
        const validParentTypes = scope === 'header' ? ['main', 'mega-category'] : ['footer-column'];
        return items
            .filter(i => validParentTypes.includes(i.type))
            .map(i => ({ value: i.id, label: `${i.label} (${i.type})` }));
    };

    if (loading && items.length === 0) {
        return (
            <div className="p-20 flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full shadow-lg" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Navigation Engine</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                            Live Sync Active
                        </span>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Core system hierarchy management</p>
                    </div>

                    <div className="flex gap-2 mt-8 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200/50 backdrop-blur-sm">
                        <button
                            onClick={() => setScope('header')}
                            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${scope === 'header' ? 'bg-white text-primary shadow-xl shadow-slate-200/50 scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            Header Tree
                        </button>
                        <button
                            onClick={() => setScope('footer')}
                            className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${scope === 'footer' ? 'bg-white text-primary shadow-xl shadow-slate-200/50 scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            Footer Tree
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setIsCreating(true);
                        setEditingItem({ label: '', type: 'main', url: '', position: items.length, isActive: true } as any);
                    }}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-slate-900/10 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Initialize Node
                </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mb-10">
                {currentTypes.map(t => (
                    <span key={t.value} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-transparent hover:border-white/50 transition-all cursor-default ${t.color}`}>
                        {t.label}
                    </span>
                ))}
            </div>

            {/* Items List */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                {items.length === 0 && !loading ? (
                    <div className="p-32 text-center">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
                            <Plus className="h-10 w-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Architectural Vacuum</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] max-w-xs mx-auto flex flex-col gap-1">
                            <span>No navigation items found.</span>
                            <span>Initialization required.</span>
                        </p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={flattenedItems.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="divide-y divide-slate-50">
                                {flattenedItems.map((item) => {
                                    const typeInfo = ALL_NAV_TYPES.find(t => t.value === item.type);
                                    const hasChildren = items.some(i => i.parentId === item.id);

                                    return (
                                        <SortableNavigationItem
                                            key={item.id}
                                            item={item}
                                            level={item.level}
                                            hasChildren={hasChildren}
                                            expanded={expandedItems.has(item.id)}
                                            onToggle={toggleExpand}
                                            onEdit={setEditingItem}
                                            onDelete={handleDelete}
                                            typeColor={typeInfo?.color}
                                            typeLabel={typeInfo?.label}
                                        />
                                    );
                                })}
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeId ? (
                                <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] rounded-3xl border-2 border-primary overflow-hidden scale-105 transition-transform">
                                    <div className="p-6 flex items-center gap-6">
                                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <ImageIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">
                                                {items.find(i => i.id === activeId)?.label}
                                            </div>
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest">Reconfiguring Hierarchy...</div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
                        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full shadow-2xl" />
                    </div>
                )}
            </div>

            {/* Modals */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between p-10 border-b border-slate-50">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {item?.id ? 'Synchronize Node' : 'Initialize Protocol'}
                        </h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1 italic">Authorized Personnel Only</p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Label */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Label</label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all"
                                placeholder="e.g., Marketing Engine"
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Functional Tier</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all appearance-none cursor-pointer"
                            >
                                {navTypes.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Parent */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Nexus</label>
                            <select
                                value={formData.parentId || ''}
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? Number(e.target.value) : null })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Root Level Architecture</option>
                                {parentOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* URL */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Redirection Link</label>
                            <input
                                type="text"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all"
                                placeholder="/pathway/to/destination"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset URL (Optional)</label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all"
                            placeholder="https://cloud.cdn/asset.webp"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Badge</label>
                            <input
                                type="text"
                                value={formData.badge}
                                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all"
                                placeholder="NEW / SALE / HOT"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ordinal Index</label>
                            <input
                                type="number"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contextual Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary outline-none font-bold text-sm transition-all resize-none"
                            placeholder="Briefly explain the purpose of this node..."
                        />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div>
                            <span className="font-black text-slate-900 text-sm uppercase tracking-tight block">Public Visibility</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Determine if node is exposed on client-side</span>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={`relative w-16 h-8 rounded-full transition-all duration-500 shadow-inner ${formData.isActive ? 'bg-primary' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 ease-out ${formData.isActive ? 'left-9' : 'left-2'}`} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 p-10 border-t border-slate-50 bg-slate-50/20">
                    <button
                        onClick={onClose}
                        className="px-10 py-5 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
                    >
                        Abort
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={!formData.label}
                        className="flex-1 max-w-[300px] flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        <Save className="h-4 w-4" />
                        Finalize Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
