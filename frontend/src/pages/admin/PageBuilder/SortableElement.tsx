import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Settings2, Copy } from 'lucide-react';
import { useBuilder, type ElementProps } from './BuilderContext';
import * as Icons from 'lucide-react';


interface SortableElementProps {
    element: ElementProps;
}

export const SortableElement: React.FC<SortableElementProps> = ({ element }) => {
    const { selectedElementId, selectElement, removeElement, addElement, updateElementProps } = useBuilder();
    const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number } | null>(null);



    const isSelected = selectedElementId === element.id;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: element.id, data: { type: element.type, isContainer: !!element.children } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    // Define type-specific visual styles
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'section': return { border: 'hover:border-blue-400', ring: 'ring-blue-500', badge: 'bg-blue-500', text: 'Section' };
            case 'row': return { border: 'hover:border-purple-400', ring: 'ring-purple-500', badge: 'bg-purple-500', text: 'Row' };
            case 'column': return { border: 'hover:border-emerald-400', ring: 'ring-emerald-500', badge: 'bg-emerald-500', text: 'Column' };
            default: return { border: 'hover:border-slate-300', ring: 'ring-slate-500', badge: 'bg-slate-500', text: type };
        }
    };

    const visuals = getTypeStyles(element.type);

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                e.stopPropagation();
                selectElement(element.id);
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenu({ x: e.clientX, y: e.clientY });
            }}
            className={`
                group relative transition-all duration-200 border border-transparent
                ${isSelected ? `ring-2 ${visuals.ring} ring-inset z-10` : `hover:border-dashed ${visuals.border}`}
            `}
        >
            {/* Context Menu Portal-like overlay */}
            {contextMenu && (
                <>
                    <div
                        className="fixed inset-0 z-[100]"
                        onClick={() => setContextMenu(null)}
                    />
                    <div
                        className="fixed z-[101] bg-white border border-slate-100 rounded-xl shadow-2xl p-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addElement(element.type);
                                setContextMenu(null);
                            }}

                            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-all"
                        >
                            <Copy size={14} /> Duplicate
                        </button>
                        <div className="h-px bg-slate-50 my-1" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeElement(element.id);
                                setContextMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50/50 rounded-lg transition-all"
                        >
                            <Trash2 size={14} /> Delete Element
                        </button>
                    </div>
                </>
            )}

            {/* Element Label Badge */}
            <div className={`
                absolute left-0 -top-3 h-5 px-2 rounded-t-lg text-[9px] font-black uppercase tracking-widest text-white flex items-center justify-center z-20 pointer-events-none transition-opacity duration-200
                ${visuals.badge}
                ${isSelected || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}>
                {visuals.text}
            </div>

            {/* Sidebar Controls */}
            <div className={`
                absolute -left-8 top-0 flex flex-col items-center gap-1 transition-opacity z-20
                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}>
                <div
                    {...listeners}
                    {...attributes}
                    className={`p-1.5 rounded-lg shadow-sm cursor-grab active:cursor-grabbing text-white ${visuals.badge}`}
                >
                    <GripVertical className="h-3 w-3" />
                </div>
                {isSelected && (
                    <button
                        onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:text-red-500 hover:border-red-200 text-slate-400 transition-colors"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className={`
                ${isDragging ? 'invisible' : ''}
                ${element.type !== 'column' ? 'pl-2' : ''} 
            `}>
                <ElementRenderer element={element} updateElementProps={updateElementProps} />

            </div>

            {/* Quick Settings Icon */}
            {isSelected && (
                <div className={`absolute right-2 top-2 p-1.5 bg-white shadow-lg rounded-lg border border-slate-100 text-slate-400`}>
                    <Settings2 className="h-3 w-3" />
                </div>
            )}
        </div>
    );
};

const ElementRenderer: React.FC<{ element: ElementProps; updateElementProps: (id: string, props: any) => void }> = ({ element, updateElementProps }) => {

    const { type, props, children, styles } = element;
    const { deviceMode } = useBuilder();


    // Droppable logic for containers
    const isContainer = ['section', 'row', 'column'].includes(type);
    const { setNodeRef: setDroppableRef } = useDroppable({
        id: `${element.id}-droppable`,
        disabled: !isContainer,
        data: {
            type: type,
            isContainer: true
        }
    });

    const getCommonStyles = (p: any) => {
        const baseStyles = {
            fontFamily: p.fontFamily || "'Outfit', 'Inter', sans-serif",
            fontSize: p.fontSize,
            fontWeight: p.fontWeight,
            lineHeight: p.lineHeight || '1.5',
            letterSpacing: p.letterSpacing || '-0.01em',
            textTransform: p.textTransform as any,
            fontStyle: p.fontStyle,
            textDecoration: p.textDecoration,
            color: p.color,
            textAlign: p.textAlign,
            maxWidth: p.maxWidth,
            padding: p.padding,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            ...(p.textShadow && (p.textShadow.x !== '0px' || p.textShadow.y !== '0px') ? {
                textShadow: `${p.textShadow.x} ${p.textShadow.y} ${p.textShadow.blur} ${p.textShadow.color}`
            } : {})
        };

        // Merge device specific styles
        const deviceStyles = styles?.[deviceMode] || {};
        return { ...baseStyles, ...deviceStyles };
    };


    const renderChildren = () => {
        if (!children) return null;
        if (children.length === 0) {
            return (
                <div className="flex h-full w-full items-center justify-center p-4 border border-dashed border-slate-200/50 rounded-xl bg-slate-50/20 text-xs text-slate-300 font-bold uppercase tracking-widest min-h-[60px]">
                    Drop {type === 'row' ? 'Column' : 'Item'} Here
                </div>
            );
        }
        return (
            <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {children.map(child => <SortableElement key={child.id} element={child} />)}
            </SortableContext>
        );
    };

    switch (type) {
        case 'section':
            return (
                <section
                    ref={setDroppableRef}
                    className="w-full relative py-12 border-b border-slate-50 last:border-0 bg-white/50 backdrop-blur-sm"
                    style={{
                        padding: props.padding,
                        backgroundColor: props.background,
                        maxWidth: props.width === 'boxed' ? '1200px' : 'none',
                        margin: '0 auto'
                    }}
                >
                    <div className="min-h-[100px] flex flex-col gap-4">
                        {renderChildren()}
                    </div>
                </section>
            );

        case 'row':
            return (
                <div
                    ref={setDroppableRef}
                    className="grid p-6 gap-8 bg-slate-50/20 rounded-3xl border border-dashed border-slate-100 transition-all"
                    style={{
                        gridTemplateColumns: `repeat(${props.columns || 1}, 1fr)`,
                        gap: props.gap || '32px',
                        alignItems: props.verticalAlign || 'start'
                    }}
                >
                    {renderChildren()}
                </div>
            );

        case 'column':
            return (
                <div
                    ref={setDroppableRef}
                    className="min-h-[80px] border border-dashed border-slate-200 rounded-3xl transition-all p-4 bg-white/30 h-full flex flex-col"
                    style={{
                        padding: props.padding,
                        backgroundColor: props.background
                    }}
                >
                    <div className="flex flex-col gap-4 flex-1">
                        {renderChildren()}
                    </div>
                </div>
            );

        case 'heading':
            const HeadingTag = (props.tag || 'h2') as any;
            const headingLevels: Record<string, string> = {
                h1: 'text-5xl md:text-6xl font-black mb-4',
                h2: 'text-4xl md:text-5xl font-black mb-3',
                h3: 'text-3xl md:text-4xl font-black mb-3',
                h4: 'text-2xl md:text-3xl font-bold mb-2',
                h5: 'text-xl md:text-2xl font-bold mb-1',
                h6: 'text-lg md:text-xl font-bold mb-1'
            };
            return (
                <HeadingTag
                    className={`${headingLevels[props.tag || 'h2']} tracking-tight leading-[1.1] p-4 outline-none focus:ring-2 focus:ring-primary/20 rounded-lg transition-all`}
                    style={getCommonStyles(props)}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e: React.FocusEvent<HTMLElement>) => {
                        updateElementProps(element.id, { text: e.currentTarget.innerText });
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.currentTarget as HTMLElement).blur();
                        }
                    }}
                >
                    {props.text}
                </HeadingTag>
            );


        case 'paragraph':
            return (
                <p
                    className={`text-lg text-slate-600 p-4 leading-relaxed outline-none focus:ring-2 focus:ring-primary/20 rounded-lg transition-all ${props.dropCap ? 'first-letter:text-6xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-primary first-letter:leading-none' : ''}`}
                    style={{
                        ...getCommonStyles(props),
                        columns: props.columns > 1 ? props.columns : 'auto'
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e: React.FocusEvent<HTMLParagraphElement>) => {
                        updateElementProps(element.id, { text: e.currentTarget.innerText });
                    }}
                >
                    {props.text}
                </p>
            );


        case 'spacer':
            return <div style={{ height: props.height }} className="w-full flex items-center justify-center border-y border-slate-50 text-[10px] text-slate-300 uppercase font-black bg-slate-50/30">Vertical Flux Field: {props.height}</div>;

        case 'divider':
            return (
                <div className="p-8 w-full">
                    <div
                        className="opacity-30"
                        style={{
                            borderTopStyle: props.style as any,
                            borderTopWidth: props.thickness || '1px',
                            borderTopColor: props.color || '#e2e8f0',
                            width: props.width || '100%',
                            margin: props.margin || '0 auto'
                        }}
                    />
                </div>
            );

        case 'iconBox':
            const BoxIcon = (Icons as any)[props.icon || 'Star'];
            const alignmentClass = props.alignment === 'center' ? 'items-center text-center' : props.alignment === 'right' ? 'items-end text-right' : 'items-start text-left';

            return (
                <div className={`p-10 flex flex-col ${alignmentClass} group/iconbox bg-white rounded-[2rem] border border-slate-100 shadow-sm`}>
                    <div
                        className="rounded-3xl mb-6 transition-transform group-hover/iconbox:scale-110"
                        style={{
                            backgroundColor: props.background?.color || `${props.iconColor || '#3b82f6'}10`,
                            color: props.iconColor || '#3b82f6',
                            padding: props.background?.padding || '20px',
                            borderRadius: props.background?.shape === 'circle' ? '9999px' : '28px'
                        }}
                    >
                        {BoxIcon && <BoxIcon size={parseInt(props.iconSize) || 36} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{props.title}</h3>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{props.text}</p>
                </div>
            );

        case 'list':
            return (
                <ul className="list-none pl-6 py-6 space-y-4 font-sans" style={getCommonStyles(props)}>
                    {props.items?.map((item: any, i: number) => (
                        <li key={i} className="flex items-start gap-4">
                            <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-slate-600 font-medium text-lg">{item.text}</span>
                        </li>
                    ))}
                </ul>
            );

        case 'iconList':
            return (
                <ul className={`p-6 font-sans ${props.layout === 'horizontal' ? 'flex flex-wrap gap-10' : 'space-y-6'}`}>
                    {props.items?.map((item: any, i: number) => {
                        const ListIcon = (Icons as any)[item.icon || props.icon || 'Check'];
                        return (
                            <li key={i} className={`flex items-center gap-4 ${props.iconPosition === 'right' ? 'flex-row-reverse' : ''}`}>
                                <div className="p-2 rounded-xl bg-slate-50 text-primary" style={{ color: props.iconColor || props.color }}>
                                    {ListIcon && <ListIcon size={parseInt(props.iconSize) || 20} strokeWidth={2.5} />}
                                </div>
                                <span className="text-lg font-bold text-slate-800 tracking-tight" style={getCommonStyles(props)}>{item.text}</span>
                            </li>
                        );
                    })}
                </ul>
            );

        case 'image':
            return (
                <div className="p-6">
                    <div
                        className="relative group/img overflow-hidden shadow-2xl"
                        style={{
                            borderRadius: props.border?.radius || '32px',
                            border: props.border?.width && props.border?.width !== '0px' ? `${props.border.width} ${props.border.style} ${props.border.color}` : 'none',
                            boxShadow: props.boxShadow,
                            opacity: (props.opacity || 100) / 100
                        }}
                    >
                        {props.url ? (
                            <img
                                src={props.url}
                                alt={props.alt}
                                className="w-full h-auto object-cover transition-all duration-500"
                                style={{
                                    filter: `brightness(${props.filters?.brightness || 100}%) contrast(${props.filters?.contrast || 100}%) saturate(${props.filters?.saturation || 100}%) blur(${props.filters?.blur || 0}px)`
                                }}
                            />
                        ) : (
                            <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                                <Icons.Image size={48} className="mb-4 opacity-40" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Image Node Ready</span>
                            </div>
                        )}
                        {props.caption?.text && (
                            <div className="p-4 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest bg-slate-50/90 backdrop-blur-md border-t border-slate-100">
                                {props.caption.text}
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'video':
            return (
                <div className="p-6">
                    <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-2xl border border-white/10">
                        {props.url ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                <Icons.PlayCircle size={80} strokeWidth={1} className="text-white opacity-40 animate-pulse" />
                                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{props.source} Engine Stream Active</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-white/30">
                                <Icons.Video size={56} strokeWidth={1.5} className="mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Video Stream Node</span>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'gallery':
            return (
                <div
                    className="p-6 grid"
                    style={{
                        gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
                        gap: props.gap || '32px'
                    }}
                >
                    {props.images?.length > 0 ? (
                        props.images.map((img: any, i: number) => (
                            <div key={i} className={`relative group overflow-hidden rounded-[2rem] bg-slate-100 shadow-lg ${props.aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}`}>
                                <img src={img.url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity capitalize text-white font-bold text-xs tracking-widest">
                                    Slide {i + 1}
                                </div>
                            </div>
                        ))
                    ) : (
                        [1, 2, 3].map(n => (
                            <div key={n} className={`bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-200 ${props.aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}`}>
                                <Icons.Image size={32} strokeWidth={1.5} />
                            </div>
                        ))
                    )}
                </div>
            );

        case 'button':
            const btnBg = props.colors?.normal.bg || '#3b82f6';
            const btnText = props.colors?.normal.text || '#ffffff';
            return (
                <div className="p-8" style={{ textAlign: props.alignment as any }}>
                    <div
                        className={`
                            inline-flex items-center justify-center gap-3 transition-all px-12 py-5 rounded-2xl shadow-xl shadow-primary/10 border-2 border-transparent
                            ${props.width === 'full' ? 'w-full' : 'w-auto'}
                        `}
                        style={{
                            backgroundColor: btnBg,
                            ...getCommonStyles(props),
                            color: btnText,
                        }}
                    >
                        {props.icon?.name && <Icons.Star size={20} strokeWidth={3} />}
                        <span className="font-black uppercase tracking-[0.2em]">{props.text}</span>
                        <Icons.ArrowRight size={16} className="ml-2 opacity-50" />
                    </div>
                </div>
            );

        case 'form':
            return (
                <div className="p-12 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50 m-8 shadow-inner">
                    <div className="flex items-center gap-4 mb-8 text-slate-400">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                            <Icons.Layout size={24} className="text-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Dynamic Engine</span>
                            <span className="text-xs font-bold text-slate-900">Form Node: {props.formId || 'Global_Contact'}</span>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {props.fields?.map((f: any) => (
                            <div key={f.id} className="h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-between px-6 shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label || 'Input Node'}</span>
                                <div className="h-2 w-2 rounded-full bg-slate-100" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.2em] shadow-2xl opacity-80 border-b-4 border-slate-950">
                        {props.submitButton?.text || 'Submit Payload'}
                    </div>
                </div>
            );

        case 'accordion':
            return (
                <div className="p-8 space-y-4">
                    {props.items?.map((item: any, i: number) => (
                        <div key={i} className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-lg border-b-4 border-slate-50">
                            <div className="w-full p-8 flex justify-between items-center bg-slate-50/20">
                                <span className="font-black text-slate-900 uppercase tracking-tight text-sm">{item.title}</span>
                                <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                    <Icons.Plus size={16} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="text-center pt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-slate-100" />
                        Accordion Layout Master
                        <div className="h-px w-12 bg-slate-100" />
                    </div>
                </div>
            );

        case 'tabs':
            return (
                <div className="p-8 w-full">
                    <div className="flex bg-slate-50 p-2 rounded-[1.5rem] mb-8 overflow-x-auto gap-3 border border-slate-100">
                        {props.items?.map((item: any, i: number) => (
                            <div
                                key={i}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all whitespace-nowrap ${i === 0 ? 'bg-white border-primary/20 text-primary shadow-sm' : 'border-transparent text-slate-300'}`}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>
                    <div className="h-40 bg-white border border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 shadow-sm">
                        <Icons.Sparkles size={32} className="text-primary/20" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Content Pipeline Node</span>
                    </div>
                </div>
            );

        case 'counter':
            return (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-6xl font-black tabular-nums tracking-tighter text-slate-900">
                            {props.prefix}{props.number}{props.suffix}
                        </span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                        {props.title}
                    </span>
                </div>
            );

        case 'testimonial':
            return (
                <div className="p-12 max-w-2xl mx-auto">
                    {props.items?.map((item: any, i: number) => (
                        <div key={i} className="text-center">
                            <div className="mb-8 relative inline-block">
                                <div className="absolute -top-4 -left-4 text-primary/10">
                                    <Icons.Quote size={60} />
                                </div>
                                <p className="text-2xl font-bold text-slate-800 leading-relaxed italic relative z-10">
                                    "{item.text}"
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <img src={item.avatar} className="h-16 w-16 rounded-full border-4 border-white shadow-xl" />
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.author}</h4>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'modal':
            return (
                <div className="p-12 flex justify-center">
                    <div className="bg-slate-900 text-white rounded-[2rem] p-8 flex items-center gap-6 shadow-2xl border-4 border-slate-800 scale-110">
                        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <Icons.Maximize size={28} className="text-primary animate-pulse" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">Trigger Pipeline</div>
                            <div className="text-lg font-black tracking-tight">{props.trigger?.text || 'Launch Interface'}</div>
                        </div>
                    </div>
                </div>
            );

        default:
            return <div className="p-10 m-4 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] text-center italic">Void Node {type}</div>;
    }
};

