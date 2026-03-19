import React from 'react';
import { useBuilder, type ElementProps } from './BuilderContext';
import {
    Layers, ChevronRight, ChevronDown,
    Type, Image, Layout, Columns,
    MousePointerClick, Box, Video
} from 'lucide-react';

export const Navigator: React.FC = () => {
    const { layout } = useBuilder();


    return (
        <aside className="w-64 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-[10px] font-black text-slate-900 tracking-tight uppercase">Navigator</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {layout.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No elements yet</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {layout.map((item) => (
                            <NavigatorItem key={item.id} element={item} depth={0} />
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};

interface NavigatorItemProps {
    element: ElementProps;
    depth: number;
}

const NavigatorItem: React.FC<NavigatorItemProps> = ({ element, depth }) => {
    const { selectedElementId, selectElement } = useBuilder();
    const [isExpanded, setIsExpanded] = React.useState(true);
    const isSelected = selectedElementId === element.id;

    const getIcon = (type: string) => {
        switch (type) {
            case 'section': return Layout;
            case 'row': return Columns;
            case 'column': return Box;
            case 'heading': return Type;
            case 'paragraph': return Type;
            case 'image': return Image;
            case 'video': return Video;
            case 'button': return MousePointerClick;
            default: return Box;
        }
    };

    const Icon = getIcon(element.type);
    const hasChildren = element.children && element.children.length > 0;

    return (
        <div className="flex flex-col">
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    selectElement(element.id);
                }}
                className={`
                    flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group
                    ${isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50 text-slate-600'}
                `}
                style={{ paddingLeft: `${(depth * 12) + 8}px` }}
            >
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-0.5 hover:bg-slate-200 rounded transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                ) : (
                    <div className="w-3.5" />
                )}
                <Icon size={14} className={isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                    {element.type}
                </span>
            </div>
            {hasChildren && isExpanded && (
                <div className="flex flex-col">
                    {element.children!.map((child) => (
                        <NavigatorItem key={child.id} element={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};
