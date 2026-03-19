import React, { useState } from 'react';
import {
    Save, RotateCcw, RotateCw, Monitor,
    Tablet, Smartphone, ChevronLeft, LayoutTemplate, X, Check,
    Sparkles, Zap, Briefcase, Box, Layers, ShoppingBag, Info, Calendar, Utensils, GraduationCap, FileText
} from 'lucide-react';
import { useBuilder } from './BuilderContext';
import { useNavigate } from 'react-router-dom';
import { PremadeTemplates } from './Templates';

interface ToolbarProps {
    onSave: (layout: any, isPublished?: boolean) => void;
    pageTitle?: string;
    setPageTitle: (title: string) => void;
    pageSlug?: string;
    setPageSlug: (slug: string) => void;
    isPublished?: boolean;
    setIsPublished: (isPublished: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    onSave,
    pageTitle,
    setPageTitle,
    pageSlug,
    setPageSlug,
    isPublished,
    setIsPublished
}) => {
    const { undo, redo, historyIndex, history, layout, deviceMode, setDeviceMode, setLayout, saveToHistory } = useBuilder();
    const navigate = useNavigate();
    const [showTemplates, setShowTemplates] = useState(false);

    const applyTemplate = (templateContent: any) => {
        // Deep clone and ideally regen IDs, but for now direct set with history save
        const newLayout = JSON.parse(JSON.stringify(templateContent));
        setLayout(newLayout);
        saveToHistory(newLayout);
        setShowTemplates(false);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Landing': return <Zap size={18} />;
            case 'Agency': return <Briefcase size={18} />;
            case 'Product': return <Box size={18} />;
            case 'Portfolio': return <Layers size={18} />;
            case 'Services': return <Sparkles size={18} />;
            case 'E-commerce': return <ShoppingBag size={18} />;
            case 'Corporate': return <Info size={18} />;
            case 'Events': return <Calendar size={18} />;
            case 'Restaurant': return <Utensils size={18} />;
            case 'Education': return <GraduationCap size={18} />;
            case 'Content': return <FileText size={18} />;
            default: return <LayoutTemplate size={18} />;
        }
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-50">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/admin/content')}
                    className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="h-10 w-px bg-slate-100 mx-2" />
                <div className="flex flex-col">
                    <input
                        type="text"
                        value={pageTitle || ''}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="text-lg font-black text-slate-900 bg-transparent border-none outline-none p-0 focus:ring-0 w-64 placeholder:text-slate-200"
                        placeholder="Page Title..."
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400">/p/</span>
                        <input
                            type="text"
                            value={pageSlug || ''}
                            onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))}
                            className="text-[10px] font-black text-primary bg-transparent border-none outline-none p-0 focus:ring-0 w-48 placeholder:text-slate-200 uppercase tracking-widest"
                            placeholder="url-slug..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
                {[
                    { id: 'desktop', icon: Monitor },
                    { id: 'tablet', icon: Tablet },
                    { id: 'mobile', icon: Smartphone }
                ].map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setDeviceMode(mode.id as any)}
                        className={`
                            p-2.5 rounded-xl transition-all flex items-center justify-center
                            ${deviceMode === mode.id
                                ? 'bg-white text-primary shadow-sm scale-110'
                                : 'text-slate-400 hover:text-slate-600'}
                        `}
                    >
                        <mode.icon className="h-4 w-4" />
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-100 transition-all border border-purple-100"
                >
                    <LayoutTemplate size={14} />
                    <span>Templates</span>
                </button>

                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-2.5 hover:bg-white hover:shadow-sm disabled:opacity-30 rounded-xl transition-all text-slate-600"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2.5 hover:bg-white hover:shadow-sm disabled:opacity-30 rounded-xl transition-all text-slate-600"
                    >
                        <RotateCw className="h-4 w-4" />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-100 mx-2" />

                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isPublished ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {isPublished ? 'Live' : 'Draft'}
                    </span>
                    <button
                        onClick={() => setIsPublished(!isPublished)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublished ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <button
                    onClick={() => onSave(layout, isPublished)}
                    className="bg-primary text-white h-12 px-8 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group uppercase tracking-widest"
                >
                    <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Persist Changes
                </button>
            </div>

            {/* Templates Modal */}
            {showTemplates && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <Sparkles className="text-primary" /> Premium Templates
                                </h3>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Select a starting point for your dynamic page</p>
                            </div>
                            <button
                                onClick={() => setShowTemplates(false)}
                                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {PremadeTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="group relative flex flex-col bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                {getCategoryIcon(template.category)}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                                {template.category}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2 truncate group-hover:text-primary transition-colors">{template.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-1">{template.description}</p>
                                        <button
                                            onClick={() => applyTemplate(template.content)}
                                            className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <Check size={14} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            Apply Template
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Antigravity Premium Asset Registry v2.0</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

