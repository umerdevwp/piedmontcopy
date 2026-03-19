import React, { useState } from 'react';
import { useBuilder, type DeviceMode } from './BuilderContext';
import {
    Monitor, Tablet, Smartphone,
    AlignCenter, AlignLeft, AlignRight, AlignJustify,
    Plus, Layers, Type, PaintBucket, Settings,
    Upload, X, Sparkles, Move
} from 'lucide-react';


interface PropEditorProps {

    value: any;
    onChange: (value: any) => void;
    label?: string;
}

export const DeviceIcon: React.FC<{ device: DeviceMode }> = ({ device }) => {
    if (device === 'tablet') return <Tablet size={10} className="text-primary/50" />;
    if (device === 'mobile') return <Smartphone size={10} className="text-primary/50" />;
    return <Monitor size={10} className="text-primary/50" />;
};

export const Label: React.FC<{ children: React.ReactNode; device?: DeviceMode }> = ({ children, device }) => (
    <div className="flex items-center justify-between mb-2 ml-1">
        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">{children}</label>
        {device && <DeviceIcon device={device} />}
    </div>
);

export const TypographyEditor: React.FC<PropEditorProps> = ({ value, onChange }) => {
    const handleChange = (key: string, val: any) => onChange({ ...value, [key]: val });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label>Font Size</Label>
                    <input
                        type="text"
                        value={value.fontSize || ''}
                        onChange={(e) => handleChange('fontSize', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                        placeholder="16px"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Line Height</Label>
                    <input
                        type="text"
                        value={value.lineHeight || ''}
                        onChange={(e) => handleChange('lineHeight', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                        placeholder="1.5"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Text Alignment</Label>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {['left', 'center', 'right', 'justify'].map(align => (
                        <button
                            key={align}
                            onClick={() => handleChange('textAlign', align)}
                            className={`flex-1 p-2 rounded-lg transition-all flex items-center justify-center ${value.textAlign === align ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {align === 'left' ? <AlignLeft size={14} /> : align === 'center' ? <AlignCenter size={14} /> : align === 'right' ? <AlignRight size={14} /> : <AlignJustify size={14} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label>Weight</Label>
                    <select
                        value={value.fontWeight}
                        onChange={(e) => handleChange('fontWeight', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                    >
                        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Transform</Label>
                    <select
                        value={value.textTransform}
                        onChange={(e) => handleChange('textTransform', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                    >
                        {['none', 'uppercase', 'lowercase', 'capitalize'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export const ColorEditor: React.FC<PropEditorProps> = ({ value, onChange, label = "Color" }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-3 items-center bg-slate-50 border border-slate-200 p-2 rounded-xl">
            <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded-lg overflow-hidden cursor-pointer border-0 p-0"
            />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{value}</span>
        </div>
    </div>
);

export const ShadowEditor: React.FC<PropEditorProps> = ({ value = { x: '0px', y: '0px', blur: '0px', color: '#000000' }, onChange }) => {
    const handleChange = (key: string, val: any) => onChange({ ...value, [key]: val });
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                    <Label>X</Label>
                    <input type="text" value={value.x || '0px'} onChange={(e) => handleChange('x', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold" />
                </div>
                <div className="space-y-1">
                    <Label>Y</Label>
                    <input type="text" value={value.y || '0px'} onChange={(e) => handleChange('y', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold" />
                </div>
                <div className="space-y-1">
                    <Label>Blur</Label>
                    <input type="text" value={value.blur || '0px'} onChange={(e) => handleChange('blur', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold" />
                </div>
            </div>
            <ColorEditor value={value.color} onChange={(val) => handleChange('color', val)} label="Shadow Color" />
        </div>
    );
};

export const BorderEditor: React.FC<PropEditorProps> = ({ value = { width: '0px', radius: '0px', style: 'solid', color: 'transparent' }, onChange }) => {
    const handleChange = (key: string, val: any) => onChange({ ...value, [key]: val });

    // Parse radius if it's a string vs object for compatibility
    const getRadius = (corner: string) => {
        if (typeof value.radius === 'object') return value.radius[corner] || '0px';
        return value.radius || '0px'; // Fallback for legacy single string
    };

    const handleRadiusChange = (corner: string, val: string) => {
        const current = typeof value.radius === 'object' ? value.radius : { tl: value.radius, tr: value.radius, bl: value.radius, br: value.radius };
        handleChange('radius', { ...current, [corner]: val });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Border Style</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Width</span>
                        <input type="text" value={value.width || '0px'} onChange={(e) => handleChange('width', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Style</span>
                        <select value={value.style || 'solid'} onChange={(e) => handleChange('style', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold">
                            {['solid', 'dashed', 'dotted', 'none'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <ColorEditor value={value.color} onChange={(val) => handleChange('color', val)} label="Border Color" />

            <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label>Corner Radius</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <input type="text" value={getRadius('tl')} onChange={(e) => handleRadiusChange('tl', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 text-[10px] font-bold" />
                        <div className="absolute left-2 top-2 h-4 w-4 border-t-2 border-l-2 border-slate-400 rounded-tl-md"></div>
                    </div>
                    <div className="relative">
                        <input type="text" value={getRadius('tr')} onChange={(e) => handleRadiusChange('tr', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 text-[10px] font-bold" />
                        <div className="absolute left-2 top-2 h-4 w-4 border-t-2 border-r-2 border-slate-400 rounded-tr-md"></div>
                    </div>
                    <div className="relative">
                        <input type="text" value={getRadius('bl')} onChange={(e) => handleRadiusChange('bl', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 text-[10px] font-bold" />
                        <div className="absolute left-2 top-1.5 h-4 w-4 border-b-2 border-l-2 border-slate-400 rounded-bl-md"></div>
                    </div>
                    <div className="relative">
                        <input type="text" value={getRadius('br')} onChange={(e) => handleRadiusChange('br', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 text-[10px] font-bold" />
                        <div className="absolute left-2 top-1.5 h-4 w-4 border-b-2 border-r-2 border-slate-400 rounded-br-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LinkEditor: React.FC<PropEditorProps> = ({ value = { type: 'url', url: '', target: '_self' }, onChange }) => {
    const handleChange = (key: string, val: any) => onChange({ ...value, [key]: val });
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Link Type</Label>
                <select
                    value={value.type || 'url'}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                >
                    {['url', 'email', 'phone', 'anchor', 'file'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <Label>{value.type === 'email' ? 'Email Address' : value.type === 'phone' ? 'Phone Number' : 'Destination'}</Label>
                <input
                    type="text"
                    value={value.url || ''}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                    placeholder={value.type === 'email' ? 'hello@example.com' : 'https://...'}
                />
            </div>
            {value.type === 'url' && (
                <div className="space-y-2">
                    <Label>Target</Label>
                    <select value={value.target || '_self'} onChange={(e) => handleChange('target', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none">
                        <option value="_self">Same Window</option>
                        <option value="_blank">New Tab</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export const FormFieldManager: React.FC<PropEditorProps> = ({ value = [], onChange }) => {
    const addField = () => {
        const newField = { id: Math.random().toString(36).substr(2, 9), type: 'text', label: 'New Field', placeholder: '', required: false, width: 'full' };
        onChange([...value, newField]);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {value.map((field: any, i: number) => (
                    <div key={field.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 relative group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-center bg-white/50 -mx-2 -mt-2 p-2 rounded-xl mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Field #{i + 1}</span>
                            <button
                                onClick={() => onChange(value.filter((_: any, idx: number) => idx !== i))}
                                className="h-6 w-6 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                                <AlignCenter size={10} className="rotate-45" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label>Label</Label>
                                <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => {
                                        const newFields = [...value];
                                        newFields[i] = { ...newFields[i], label: e.target.value };
                                        onChange(newFields);
                                    }}
                                    className="w-full bg-white border border-slate-100 rounded-xl p-2.5 text-xs font-bold outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Type</Label>
                                    <select
                                        value={field.type}
                                        onChange={(e) => {
                                            const newFields = [...value];
                                            newFields[i] = { ...newFields[i], type: e.target.value };
                                            onChange(newFields);
                                        }}
                                        className="w-full bg-white border border-slate-100 rounded-xl p-2.5 text-xs font-bold outline-none"
                                    >
                                        {['text', 'email', 'textarea', 'number', 'phone', 'select', 'checkbox'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Width</Label>
                                    <select
                                        value={field.width}
                                        onChange={(e) => {
                                            const newFields = [...value];
                                            newFields[i] = { ...newFields[i], width: e.target.value };
                                            onChange(newFields);
                                        }}
                                        className="w-full bg-white border border-slate-100 rounded-xl p-2.5 text-xs font-bold outline-none"
                                    >
                                        <option value="full">Full Width</option>
                                        <option value="half">Half</option>
                                        <option value="third">Third</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={addField}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:border-primary/30 hover:text-primary transition-all uppercase tracking-widest bg-slate-50/50 hover:bg-white flex items-center justify-center gap-2"
            >
                <Plus size={14} /> Add Form Field
            </button>
        </div>
    );
};

export const TabAccordionManager: React.FC<PropEditorProps> = ({ value = [], onChange }) => {
    const addItem = () => {
        const newItem = { title: 'New Item', content: 'Item content goes here...', isOpen: false };
        onChange([...value, newItem]);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {value.map((item: any, i: number) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 relative group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-center bg-white/50 -mx-2 -mt-2 p-2 rounded-xl mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Item #{i + 1}</span>
                            <button
                                onClick={() => onChange(value.filter((_: any, idx: number) => idx !== i))}
                                className="h-6 w-6 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                                <AlignCenter size={10} className="rotate-45" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label>Title</Label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                        const newItems = [...value];
                                        newItems[i] = { ...newItems[i], title: e.target.value };
                                        onChange(newItems);
                                    }}
                                    className="w-full bg-white border border-slate-100 rounded-xl p-2.5 text-xs font-bold outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Content</Label>
                                <textarea
                                    value={item.content}
                                    onChange={(e) => {
                                        const newItems = [...value];
                                        newItems[i] = { ...newItems[i], content: e.target.value };
                                        onChange(newItems);
                                    }}
                                    className="w-full bg-white border border-slate-100 rounded-xl p-2.5 text-xs font-bold outline-none min-h-[80px] resize-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={addItem}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:border-primary/30 hover:text-primary transition-all uppercase tracking-widest bg-slate-50/50 hover:bg-white flex items-center justify-center gap-2"
            >
                <Plus size={14} /> Add New Item
            </button>
        </div>
    );
};

export const MediaUploader: React.FC<PropEditorProps & { accept?: string }> = ({ value, onChange, label = "Source", accept = "image/*" }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In a real app, this would upload to server. Here we use ObjectURL for preview.
            const url = URL.createObjectURL(file);
            onChange(url);
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 bg-white border-0 rounded-lg p-2 text-xs font-mono text-slate-600 outline-none shadow-sm"
                        placeholder="https://..."
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors shadow-sm"
                        title="Upload File"
                    >
                        <Upload size={14} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </div>
                {value && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-200 group">
                        {accept.includes('video') ? (
                            <video src={value} className="w-full h-full object-cover" />
                        ) : (
                            <img src={value} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onChange('')} className="p-1.5 bg-white/20 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors">
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const PropManager: React.FC<{
    element: any;
    onChange: (id: string, newProps: any) => void;
    onStyleChange: (id: string, styles: any) => void;
}> = ({ element, onChange, onStyleChange }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');
    const { deviceMode } = useBuilder();

    const handlePropChange = (key: string, val: any) => {
        onChange(element.id, { [key]: val });
    };

    const handleStyleChange = (key: string, val: any) => {
        onStyleChange(element.id, { [key]: val });
    };

    const currentStyles = element.styles?.[deviceMode] || {};

    const renderContentTab = () => (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            {/* Element Specific Content Controls */}
            {element.type === 'heading' || element.type === 'paragraph' ? (
                <div className="space-y-4">
                    <Label>Content</Label>
                    <textarea
                        value={element.props.text || ''}
                        onChange={(e) => handlePropChange('text', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 ring-primary/20 outline-none h-32 resize-none"
                    />
                    {element.type === 'heading' && (
                        <div className="space-y-2">
                            <Label>Tag</Label>
                            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handlePropChange('tag', tag)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${element.props.tag === tag ? 'bg-white shadow text-primary' : 'text-slate-300 hover:text-slate-500'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : null}

            {element.type === 'image' && (
                <div className="space-y-6">
                    <MediaUploader value={element.props.url} onChange={(v) => handlePropChange('url', v)} />
                    <div className="space-y-2">
                        <Label>Alt Text</Label>
                        <input
                            type="text"
                            value={element.props.alt || ''}
                            onChange={(e) => handlePropChange('alt', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold outline-none"
                            placeholder="SEO description..."
                        />
                    </div>
                </div>
            )}

            {element.type === 'button' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Button Text</Label>
                        <input
                            type="text"
                            value={element.props.text || ''}
                            onChange={(e) => handlePropChange('text', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none"
                        />
                    </div>
                    <LinkEditor value={element.props.link} onChange={(val) => handlePropChange('link', val)} />
                </div>
            )}

            {element.type === 'iconBox' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <input
                            type="text"
                            value={element.props.title || ''}
                            onChange={(e) => handlePropChange('title', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <textarea
                            value={element.props.text || ''}
                            onChange={(e) => handlePropChange('text', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none h-24 resize-none"
                        />
                    </div>
                </div>
            )}

            {/* List/Section managers */}
            {element.type === 'form' && <FormFieldManager value={element.props.fields} onChange={(v) => handlePropChange('fields', v)} />}
            {(element.type === 'accordion' || element.type === 'tabs') && <TabAccordionManager value={element.props.items} onChange={(v) => handlePropChange('items', v)} />}
        </div>
    );

    const renderStyleTab = () => (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {/* Typography Section */}
            {(['heading', 'paragraph', 'button', 'list', 'iconList'].includes(element.type)) && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Type size={14} className="text-primary" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Typography</span>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label device={deviceMode}>Font Size</Label>
                                <input
                                    type="text"
                                    value={currentStyles.fontSize || element.props.fontSize || ''}
                                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                                    placeholder="16px"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label device={deviceMode}>Line Height</Label>
                                <input
                                    type="text"
                                    value={currentStyles.lineHeight || element.props.lineHeight || ''}
                                    onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none"
                                    placeholder="1.5"
                                />
                            </div>
                        </div>
                        <ColorEditor value={currentStyles.color || element.props.color} onChange={(v) => handleStyleChange('color', v)} label="Text Color" />

                        <div className="space-y-2">
                            <Label device={deviceMode}>Alignment</Label>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                                {['left', 'center', 'right', 'justify'].map(align => (
                                    <button
                                        key={align}
                                        onClick={() => handleStyleChange('textAlign', align)}
                                        className={`flex-1 p-2 rounded-lg transition-all flex items-center justify-center ${(currentStyles.textAlign || element.props.textAlign) === align ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {align === 'left' ? <AlignLeft size={14} /> : align === 'center' ? <AlignCenter size={14} /> : align === 'right' ? <AlignRight size={14} /> : <AlignJustify size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Layout Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Move size={14} className="text-primary" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Dimensions & Spacing</span>
                </div>
                <div className="space-y-2">
                    <Label device={deviceMode}>Padding</Label>
                    <input
                        type="text"
                        value={currentStyles.padding || element.props.padding || ''}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold outline-none"
                        placeholder="20px or 20px 40px"
                    />
                </div>
                {element.type !== 'section' && (
                    <div className="space-y-2">
                        <Label device={deviceMode}>Margin</Label>
                        <input
                            type="text"
                            value={currentStyles.margin || element.props.margin || ''}
                            onChange={(e) => handleStyleChange('margin', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold outline-none"
                            placeholder="0px auto"
                        />
                    </div>
                )}
            </div>

            {/* Background & Borders */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <PaintBucket size={14} className="text-primary" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Design</span>
                </div>
                {element.props.background !== undefined && <ColorEditor value={currentStyles.backgroundColor || currentStyles.background || element.props.background} onChange={(v) => handleStyleChange('backgroundColor', v)} label="Background" />}
                <BorderEditor value={currentStyles.border || element.props.border} onChange={(v) => handleStyleChange('border', v)} />
            </div>
        </div>
    );

    const renderAdvancedTab = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Effects</span>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label device={deviceMode}>Opacity</Label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0" max="100"
                                value={currentStyles.opacity !== undefined ? (currentStyles.opacity as number) * 100 : (element.props.opacity || 100)}
                                onChange={(e) => handleStyleChange('opacity', parseInt(e.target.value) / 100)}
                                className="flex-1 accent-primary h-1 bg-slate-200 rounded"
                            />
                            <span className="text-[10px] font-mono font-bold text-slate-400 w-8">
                                {currentStyles.opacity !== undefined ? Math.round((currentStyles.opacity as number) * 100) : (element.props.opacity || 100)}%
                            </span>
                        </div>
                    </div>
                    <ShadowEditor value={currentStyles.boxShadow || element.props.boxShadow} onChange={(v) => handleStyleChange('boxShadow', v)} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Settings size={14} className="text-primary" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Technical</span>
                </div>
                <div className="space-y-2">
                    <Label>CSS Class</Label>
                    <input
                        type="text"
                        value={element.props.className || ''}
                        onChange={(e) => handlePropChange('className', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none"
                        placeholder="custom-class"
                    />
                </div>
                <div className="space-y-2">
                    <Label device={deviceMode}>Z-Index</Label>
                    <input
                        type="number"
                        value={currentStyles.zIndex || ''}
                        onChange={(e) => handleStyleChange('zIndex', parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold outline-none"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Tabs Header */}
            <div className="flex p-2 gap-2 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                {[
                    { id: 'content', icon: Layers, label: 'Content' },
                    { id: 'style', icon: PaintBucket, label: 'Style' },
                    { id: 'advanced', icon: Settings, label: 'Adv.' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all
                            ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                : 'text-slate-400 hover:bg-white hover:text-slate-600'}
                        `}
                    >
                        <tab.icon size={13} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeTab === 'content' && renderContentTab()}
                {activeTab === 'style' && renderStyleTab()}
                {activeTab === 'advanced' && renderAdvancedTab()}
            </div>
        </div>
    );
};

