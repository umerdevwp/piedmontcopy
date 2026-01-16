import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, Edit2, Trash2,
    ExternalLink, Image as ImageIcon, ChevronDown, ChevronRight
} from 'lucide-react';
import type { NavigationItem } from '../../../components/navigation/types';

interface SortableNavigationItemProps {
    item: NavigationItem;
    level: number;
    hasChildren: boolean;
    expanded: boolean;
    onToggle: (id: number) => void;
    onEdit: (item: NavigationItem) => void;
    onDelete: (id: number) => void;
    typeColor?: string;
    typeLabel?: string;
}

export function SortableNavigationItem({
    item,
    level,
    hasChildren,
    expanded,
    onToggle,
    onEdit,
    onDelete,
    typeColor,
    typeLabel
}: SortableNavigationItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
        paddingLeft: `${16 + level * 32}px`
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 p-4 transition-colors group relative border-b border-slate-50 bg-white hover:bg-slate-50 ${isDragging ? 'shadow-2xl rounded-xl z-50 border-primary/20 bg-slate-50' : ''
                }`}
        >
            {/* Expand Toggle */}
            {hasChildren ? (
                <button
                    onClick={() => onToggle(item.id)}
                    className="p-1 hover:bg-slate-200 rounded shrink-0 transition-colors"
                >
                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
            ) : (
                <div className="w-6 shrink-0" />
            )}

            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-200 rounded transition-colors shrink-0"
            >
                <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
            </div>

            {/* Image Preview */}
            <div className="shrink-0">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover border border-slate-100 shadow-sm" />
                ) : (
                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center border border-slate-100">
                        <ImageIcon className="h-3 w-3 text-slate-300" />
                    </div>
                )}
            </div>

            {/* Label & Type */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 truncate">{item.label}</span>
                    {item.badge && (
                        <span className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                            {item.badge}
                        </span>
                    )}
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${typeColor || 'bg-slate-100 text-slate-600'}`}>
                        {typeLabel || item.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded tabular-nums">
                        Pos: {item.position}
                    </span>
                </div>
                {item.url && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                        <ExternalLink className="h-3 w-3" />
                        {item.url}
                    </div>
                )}
            </div>

            {/* Hidden Marker */}
            {!item.isActive && (
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Hidden</span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    title="Edit Item"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Item"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
