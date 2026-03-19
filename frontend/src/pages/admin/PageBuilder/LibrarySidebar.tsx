import React from 'react';
import {
    Layout, Columns, Type, Image as ImageIcon,
    Video, MousePointer2, Box, List as ListIcon,
    SeparatorHorizontal, MousePointerClick, Hash, Quote
} from 'lucide-react';

import { useDraggable } from '@dnd-kit/core';

const ELEMENTS = [
    {
        category: 'Layout',
        items: [
            { type: 'section', label: 'Section', icon: Layout },
            { type: 'row', label: 'Row / Grid', icon: Columns },
            { type: 'spacer', label: 'Spacer', icon: SeparatorHorizontal },
            { type: 'divider', label: 'Divider', icon: Box },
        ]
    },
    {
        category: 'Text',
        items: [
            { type: 'heading', label: 'Heading', icon: Type },
            { type: 'paragraph', label: 'Paragraph', icon: MousePointer2 },
            { type: 'list', label: 'Bullet List', icon: ListIcon },
            { type: 'iconList', label: 'Icon List', icon: ListIcon },
        ]
    },
    {
        category: 'Media',
        items: [
            { type: 'image', label: 'Image', icon: ImageIcon },
            { type: 'gallery', label: 'Gallery', icon: ImageIcon },
            { type: 'video', label: 'Video', icon: Video },
            { type: 'iconBox', label: 'Icon Box', icon: MousePointerClick },
        ]
    },
    {
        category: 'Interactive',
        items: [
            { type: 'button', label: 'Button', icon: MousePointerClick },
            { type: 'counter', label: 'Counter', icon: Hash },
            { type: 'testimonial', label: 'Testimonial', icon: Quote },
            { type: 'form', label: 'Contact Form', icon: Box },
            { type: 'accordion', label: 'Accordion', icon: ListIcon },
            { type: 'tabs', label: 'Tabs Layout', icon: Layout },
            { type: 'modal', label: 'Modal / Popup', icon: Box },

        ]
    }
];

export const LibrarySidebar: React.FC = () => {
    return (
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Elements Library</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Drag elements onto canvas</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {ELEMENTS.map((cat) => (
                    <div key={cat.category}>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-l-2 border-primary pl-3">
                            {cat.category}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {cat.items.map((item) => (
                                <DraggableItem key={item.type} {...item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

const DraggableItem: React.FC<{ type: string; label: string; icon: any }> = ({ type, label, icon: Icon }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `library-${type}`,
        data: { type, isLibraryItem: true }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50
                hover:bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-grab active:cursor-grabbing group
                ${isDragging ? 'opacity-50 ring-2 ring-primary border-primary' : ''}
            `}
        >
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                {label}
            </span>
        </div>
    );
};
