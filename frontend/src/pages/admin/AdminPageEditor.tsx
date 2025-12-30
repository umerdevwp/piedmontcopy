
import { useState, useEffect } from 'react';
import {
    Save, ChevronLeft, Trash2, GripVertical,
    Type, Image as ImageIcon, Box, Layout,
    CheckCircle2, Monitor, Smartphone, Tablet,
    Settings2, X, RefreshCw, User, Plus, Layers, MousePointer2
} from 'lucide-react';
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
type BlockType = 'hero' | 'text' | 'features' | 'image' | 'hero-slider' | 'parallax' | 'premium-list' | 'testimonials' | 'content-media' | 'section-layout';

interface Block {
    id: string;
    type: BlockType;
    content: any;
}

const DEFAULT_BLOCKS: Record<BlockType, any> = {
    hero: { title: 'Welcome to our Page', subtitle: 'This is a beautiful sub-headline.', buttonText: 'Get Started', bgImage: '' },
    text: { body: '<p>Start typing your professional content here...</p>' },
    features: { items: [{ icon: 'Zap', title: 'Fast Delivery', desc: 'We deliver your prints in record time.' }] },
    image: { url: '', caption: '' },
    'hero-slider': { slides: [{ title: 'Elevate Your Brand', subtitle: 'Creative printing solutions for modern businesses.', buttonText: 'Explore Now', bgImage: '', tag: 'Premium' }] },
    'parallax': { title: 'Dynamic Experience', subtitle: 'Be captivated by our visual effects.', imageUrl: '', enabled: true },
    'premium-list': { style: 'grid', items: [{ title: 'Quality Prints', desc: 'Industry leading resolution' }, { title: 'Fast Turnaround', desc: 'Same day shipping available' }] },
    'testimonials': { items: [{ author: 'John Doe', quote: 'PiedmontCopy transformed our marketing materials. Highly recommended!' }] },
    'content-media': { title: 'The Perfect Partner', body: '<p>We work closely with you to bring your ideas to life with stunning clarity.</p>', imageUrl: '', buttonText: 'Learn More', swap: false },
    'section-layout': { columns: [{ width: '1/2', blocks: [] }, { width: '1/2', blocks: [] }] }
};

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
        const newBlock = {
            id: Math.random().toString(36).substring(7),
            type,
            content: JSON.parse(JSON.stringify(DEFAULT_BLOCKS[type]))
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
            }
        } catch (error) {
            toast.error('Failed to save page');
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Basic</p>
                    {[
                        { type: 'hero', icon: Layout, label: 'Hero Block', desc: 'Heading & CTA' },
                        { type: 'text', icon: Type, label: 'Rich Text', desc: 'Content & HTML' },
                        { type: 'image', icon: ImageIcon, label: 'Image Block', desc: 'Full width visual' },
                        { type: 'features', icon: CheckCircle2, label: 'Features', desc: 'List of icons' }
                    ].map((b: any) => (
                        <button key={b.type} onClick={() => addBlock(b.type)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-slate-50 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                            <b.icon className="h-5 w-5 text-primary" />
                            <div className="text-left">
                                <p className="font-bold text-slate-700 text-sm">{b.label}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{b.desc}</p>
                            </div>
                        </button>
                    ))}

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-2 italic">Premium Experience</p>
                    {[
                        { type: 'hero-slider', icon: RefreshCw, label: 'Hero Slider', desc: 'Multi-slide motion', dark: true },
                        { type: 'section-layout', icon: Layers, label: 'Column Layout', desc: 'Divided sections' },
                        { type: 'parallax', icon: MousePointer2, label: 'Parallax Effect', desc: 'Depth & scroll' },
                        { type: 'premium-list', icon: Settings2, label: 'Premium List', desc: '5+ Visual styles' },
                        { type: 'testimonials', icon: User, label: 'Reviews Slider', desc: 'Client feedback' },
                        { type: 'content-media', icon: Layout, label: 'Content Media', desc: 'Balanced layout' }
                    ].map((b: any) => (
                        <button key={b.type} onClick={() => addBlock(b.type)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${b.dark ? 'bg-slate-900 border-slate-800 hover:bg-black' : 'bg-white border-slate-50 hover:border-primary'}`}>
                            <b.icon className="h-5 w-5 text-primary" />
                            <div className="text-left">
                                <p className={`font-bold text-sm ${b.dark ? 'text-white' : 'text-slate-700'}`}>{b.label}</p>
                                <p className="text-[9px] text-slate-400 font-medium">{b.desc}</p>
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
                    <div className={`bg-white shadow-2xl rounded-[3rem] transition-all duration-500 overflow-hidden flex flex-col min-h-[600px] border border-slate-200 ${viewport === 'desktop' ? 'w-full max-w-5xl' : viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'}`}>
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
                            {/* Generic Title & Subtitle for many blocks */}
                            {(selectedBlock.type === 'hero' || selectedBlock.type === 'parallax' || selectedBlock.type === 'content-media') && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Main Headline</label>
                                        <textarea value={selectedBlock.content.title} onChange={(e) => updateBlockContent({ title: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 h-24" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sub-Headline / Description</label>
                                        <textarea value={selectedBlock.content.subtitle} onChange={(e) => updateBlockContent({ subtitle: e.target.value })} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium text-slate-500 h-32" />
                                    </div>
                                </>
                            )}

                            {/* Hero Slider Specific Slider Editor */}
                            {selectedBlock.type === 'hero-slider' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Manage Slides</label>
                                        <button onClick={() => updateBlockContent({ slides: [...selectedBlock.content.slides, { ...DEFAULT_BLOCKS['hero-slider'].slides[0] }] })} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Plus className="h-3 w-3" /> Add Slide</button>
                                    </div>
                                    {selectedBlock.content.slides.map((slide: any, idx: number) => (
                                        <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative">
                                            <button onClick={() => updateBlockContent({ slides: selectedBlock.content.slides.filter((_: any, i: number) => i !== idx) })} className="absolute right-4 top-4 p-1 text-slate-300 hover:text-red-500"><X className="h-4 w-4" /></button>
                                            <div className="space-y-2">
                                                <input type="text" value={slide.title} placeholder="Slide Title" onChange={(e) => {
                                                    const newSlides = [...selectedBlock.content.slides];
                                                    newSlides[idx].title = e.target.value;
                                                    updateBlockContent({ slides: newSlides });
                                                }} className="w-full bg-white px-4 py-2 rounded-xl text-sm font-bold border-none" />
                                                <input type="text" value={slide.bgImage} placeholder="Background Image URL" onChange={(e) => {
                                                    const newSlides = [...selectedBlock.content.slides];
                                                    newSlides[idx].bgImage = e.target.value;
                                                    updateBlockContent({ slides: newSlides });
                                                }} className="w-full bg-white px-4 py-2 rounded-xl text-[10px] border-none" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* List Style Toggle */}
                            {selectedBlock.type === 'premium-list' && (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">UI Architecture</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['grid', 'checklist', 'numbered', 'cards', 'glass'].map(style => (
                                            <button key={style} onClick={() => updateBlockContent({ style })} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedBlock.content.style === style ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-transparent text-slate-400 hober:border-slate-200'}`}>
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Parallax Toggle */}
                            {selectedBlock.type === 'parallax' && (
                                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">Enable Motion Effect</span>
                                    <button onClick={() => updateBlockContent({ enabled: !selectedBlock.content.enabled })} className={`w-12 h-6 rounded-full transition-all relative ${selectedBlock.content.enabled ? 'bg-primary' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedBlock.content.enabled ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            )}

                            {/* Column Layout Editor */}
                            {selectedBlock.type === 'section-layout' && (
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Column Configuration</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: '50 / 50', cols: ['1/2', '1/2'] },
                                            { label: '33 / 33 / 33', cols: ['1/3', '1/3', '1/3'] },
                                            { label: '66 / 33', cols: ['2/3', '1/3'] },
                                            { label: '100', cols: ['1'] }
                                        ].map(config => (
                                            <button key={config.label} onClick={() => updateBlockContent({ columns: config.cols.map(w => ({ width: w, blocks: [] })) })} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary transition-all text-[10px] font-black uppercase text-slate-500">{config.label}</button>
                                        ))}
                                    </div>
                                    <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                                        <p className="text-[10px] text-primary font-black uppercase leading-relaxed italic">The nested dragging experience is being optimized. For now, configure the structure here and use basic blocks for best results.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}

