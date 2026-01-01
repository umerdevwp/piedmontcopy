import { useState, useEffect } from 'react';
import { BLOCK_DEFINITIONS, type FieldDefinition } from '../../config/cms-config';
import {
    Save, ChevronLeft, Trash2, GripVertical,
    Box, Layout, Monitor, Smartphone, Tablet,
    X, RefreshCw, Settings2
} from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Block Definitions ---
type BlockType = keyof typeof BLOCK_DEFINITIONS;

interface Block {
    id: string;
    type: BlockType | string; // loosen type to allow for potential legacy or dynamic types
    content: any;
}

// --- Block Definitions Removed (Imported from config) ---

// --- Sortable Item Component ---
function SortableBlock({ block, onSelect, onDelete, isSelected }: { block: Block, onSelect: () => void, onDelete: () => void, isSelected: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onSelect}
            className={`group relative mb-4 p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
        >
            <div {...attributes} {...listeners} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="h-5 w-5 text-slate-400" />
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <div className="ml-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {block.type}
                    </span>
                    <span className="text-xs font-bold text-slate-400">ID: {block.id}</span>
                </div>

                <div className="min-h-[60px] flex items-center justify-center text-slate-300 italic text-sm text-center px-4">
                    {block.type === 'hero' && <div className="font-black text-slate-800">{block.content.title}</div>}
                    {block.type === 'text' && <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: block.content.body }} />}
                    {block.type === 'features' && <div>{block.content.items.length} Features Defined</div>}
                    {block.type === 'image' && <div>Image Block</div>}
                    {block.type === 'hero-slider' && <div className="font-black text-primary">{block.content.slides.length} Slides</div>}
                    {block.type === 'parallax' && <div>Parallax: {block.content.title}</div>}
                    {block.type === 'premium-list' && <div>List Style: {block.content.style}</div>}
                    {block.type === 'testimonials' && <div>{block.content.items.length} Testimonials</div>}
                    {block.type === 'content-media' && <div>{block.content.title}</div>}
                    {block.type === 'section-layout' && <div>Section Layout ({block.content.columns.length} Columns)</div>}
                </div>
            </div>
        </div>
    );
}

export default function AdminPageEditor() {
    const { token } = useAuthStore();
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (id && id !== 'new') {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/pages');
            const data = await response.json();
            const page = data.find((p: any) => p.id === parseInt(id!));
            if (page) {
                setTitle(page.title);
                setSlug(page.slug);
                setBlocks(typeof page.content === 'string' ? JSON.parse(page.content) : page.content);
            }
        } catch (error) {
            toast.error('Failed to load page');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addBlock = (type: BlockType) => {
        const def = BLOCK_DEFINITIONS[type];
        const initialContent: any = {};

        // Initialize defaults from schema
        def.fields.forEach(field => {
            if (field.type === 'repeater' && field.defaultValue) {
                initialContent[field.name] = [...field.defaultValue];
            } else {
                initialContent[field.name] = field.defaultValue;
            }
        });

        const newBlock = {
            id: Math.random().toString(36).substring(7),
            type,
            content: initialContent
        };
        setBlocks([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id);
    };

    const deleteBlock = (blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId));
        if (selectedBlockId === blockId) setSelectedBlockId(null);
    };

    const updateBlockContent = (updates: any) => {
        setBlocks(blocks.map(b => b.id === selectedBlockId ? { ...b, content: { ...b.content, ...updates } } : b));
    };

    // --- Dynamic Field Renderer ---
    const renderField = (field: FieldDefinition, value: any, onChange: (val: any) => void) => {
        switch (field.type) {
            case 'text':
                return (
                    <div className="space-y-2" key={field.name}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{field.label}</label>
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                );
            case 'textarea':
                return (
                    <div className="space-y-2" key={field.name}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{field.label}</label>
                        <textarea
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                        />
                    </div>
                );
            case 'select':
                return (
                    <div className="space-y-2" key={field.name}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{field.label}</label>
                        <select
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-primary/20"
                        >
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'toggle':
                return (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl" key={field.name}>
                        <span className="text-xs font-bold text-slate-600">{field.label}</span>
                        <button
                            onClick={() => onChange(!value)}
                            className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-primary' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                );
            case 'color':
                return (
                    <div className="space-y-2" key={field.name}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{field.label}</label>
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg border border-slate-200 overflow-hidden">
                                <input
                                    type="color"
                                    value={value || '#000000'}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="h-full w-full cursor-pointer scale-150"
                                />
                            </div>
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                                className="flex-1 bg-slate-50 px-4 py-2 rounded-xl text-xs font-mono border-none"
                            />
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <ImageUploader
                        key={field.name}
                        label={field.label}
                        value={value}
                        onChange={onChange}
                    />
                );
            case 'repeater':
                return (
                    <div className="space-y-4" key={field.name}>
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{field.label}</label>
                            <button
                                onClick={() => {
                                    const newItem: any = {};
                                    field.fields?.forEach(f => newItem[f.name] = f.defaultValue);
                                    onChange([...(value || []), newItem]);
                                }}
                                className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold hover:bg-primary/20"
                            >
                                + Add Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(value || []).map((item: any, idx: number) => (
                                <div key={idx} className="p-4 border border-slate-100 rounded-xl relative bg-slate-50/50">
                                    <button
                                        onClick={() => onChange(value.filter((_: any, i: number) => i !== idx))}
                                        className="absolute right-2 top-2 text-slate-300 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                    <div className="space-y-3 pt-2">
                                        {field.fields?.map(subField => (
                                            renderField(subField, item[subField.name], (val) => {
                                                const newValue = [...value];
                                                newValue[idx] = { ...newValue[idx], [subField.name]: val };
                                                onChange(newValue);
                                            })
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSave = async () => {
        if (!title || !slug) return toast.error('Title and Slug are required');
        setIsSaving(true);
        try {
            const method = id && id !== 'new' ? 'PUT' : 'POST';
            const url = id && id !== 'new' ? `/api/pages/${id}` : '/api/pages';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, slug, content: blocks })
            });
            if (response.ok) {
                toast.success('Page saved successfully');
                navigate('/admin/content');
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to save page');
                console.error('Save Error:', errorData);
            }
        } catch (error) {
            toast.error('Failed to save page: Network error');
            console.error('Network Error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    if (isLoading) return <div className="p-8">Loading editor...</div>;

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 -m-8">
            {/* Sidebar: Blocks */}
            <aside className="w-80 bg-white border-r border-slate-100 flex flex-col shadow-sm">
                <div className="p-6 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-primary" />
                        <h2 className="font-black text-slate-800 uppercase tracking-tighter">Blocks</h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Library</p>
                    {Object.values(BLOCK_DEFINITIONS).map((def) => (
                        <button
                            key={def.type}
                            onClick={() => addBlock(def.type as BlockType)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${def.isPremium ? 'bg-slate-900 border-slate-800 hover:bg-black' : 'bg-white border-slate-50 hover:border-primary'}`}
                        >
                            <def.icon className={`h-5 w-5 ${def.isPremium ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                            <div className="text-left">
                                <p className={`font-bold text-sm ${def.isPremium ? 'text-white' : 'text-slate-700'}`}>{def.label}</p>
                                <p className="text-[9px] text-slate-400 font-medium">{def.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Canvas Area */}
            <main className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/admin/content')} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <ChevronLeft className="h-6 w-6 text-slate-400" />
                        </button>
                        <div className="flex flex-col">
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Page Title" className="text-xl font-black text-slate-900 border-none bg-transparent focus:ring-0 p-0 placeholder:text-slate-300" />
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug:</span>
                                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-'))} placeholder="page-slug" className="text-[10px] font-bold text-primary border-none bg-transparent focus:ring-0 p-0 w-32" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setViewport('desktop')} className={`px-4 py-2 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}><Monitor className="h-4 w-4" /></button>
                            <button onClick={() => setViewport('tablet')} className={`px-4 py-2 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}><Tablet className="h-4 w-4" /></button>
                            <button onClick={() => setViewport('mobile')} className={`px-4 py-2 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}><Smartphone className="h-4 w-4" /></button>
                        </div>
                        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl hover:opacity-90 shadow-xl shadow-primary/20 font-bold text-sm disabled:opacity-50">
                            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar">
                    <div className={`bg-white shadow-2xl rounded-[3rem] transition-all duration-500 flex flex-col min-h-[600px] border border-slate-200 ${viewport === 'desktop' ? 'w-full max-w-5xl' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
                        <div className="flex-1 p-8 bg-slate-50/30">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                    {blocks.length === 0 ? (
                                        <div className="h-64 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 gap-4">
                                            <Layout className="h-10 w-10 text-slate-200" />
                                            <p className="font-bold uppercase tracking-widest text-xs">Add a block to build your page</p>
                                        </div>
                                    ) : (
                                        blocks.map((block) => (
                                            <SortableBlock key={block.id} block={block} isSelected={selectedBlockId === block.id} onSelect={() => setSelectedBlockId(block.id)} onDelete={() => deleteBlock(block.id)} />
                                        ))
                                    )}
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right Sidebar: Settings */}
            <aside className="w-96 bg-white border-l border-slate-100 flex flex-col shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <h2 className="font-black text-slate-800 uppercase tracking-tighter">Settings</h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    {!selectedBlock ? (
                        <div className="text-center py-20 px-8">
                            <Layout className="h-12 w-12 text-slate-100 mx-auto mb-6" />
                            <p className="text-slate-300 font-bold text-sm leading-relaxed italic">Select a block on the canvas to customize its content and styles.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2 mb-6 p-4 bg-slate-50 rounded-2xl">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Editing:</div>
                                <div className="font-black text-slate-900">{BLOCK_DEFINITIONS[selectedBlock.type]?.label || 'Unknown Block'}</div>
                            </div>

                            {/* Render Content Fields */}
                            <div className="space-y-6">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-100 pb-2">Content</p>
                                {BLOCK_DEFINITIONS[selectedBlock.type]?.fields.filter(f => f.group === 'content' || !f.group).map(field =>
                                    renderField(field, selectedBlock.content[field.name], (val) => updateBlockContent({ [field.name]: val }))
                                )}
                            </div>

                            {/* Render Style Fields */}
                            {BLOCK_DEFINITIONS[selectedBlock.type]?.fields.some(f => f.group === 'style') && (
                                <div className="space-y-6 pt-6">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-100 pb-2">Appearance</p>
                                    {BLOCK_DEFINITIONS[selectedBlock.type]?.fields.filter(f => f.group === 'style').map(field =>
                                        renderField(field, selectedBlock.content[field.name], (val) => updateBlockContent({ [field.name]: val }))
                                    )}
                                </div>
                            )}

                            {/* Render Advanced Fields */}
                            {BLOCK_DEFINITIONS[selectedBlock.type]?.fields.some(f => f.group === 'advanced') && (
                                <div className="space-y-6 pt-6">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-100 pb-2">Settings</p>
                                    {BLOCK_DEFINITIONS[selectedBlock.type]?.fields.filter(f => f.group === 'advanced').map(field =>
                                        renderField(field, selectedBlock.content[field.name], (val) => updateBlockContent({ [field.name]: val }))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}

