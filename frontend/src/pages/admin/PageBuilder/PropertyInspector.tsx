import React from 'react';
import { useBuilder } from './BuilderContext';
import { Settings2, Trash2 } from 'lucide-react';
import { PropManager } from './PropertyEditors';

export const PropertyInspector: React.FC = () => {
    const {
        layout,
        selectedElementId,
        updateElementProps,
        updateElementStyles,
        removeElement
    } = useBuilder();

    const selectedElement = findElementById(layout, selectedElementId);

    if (!selectedElement) {
        return (
            <aside className="w-[400px] bg-white flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                    <Settings2 className="h-10 w-10" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">No Selection</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-[200px] leading-relaxed">
                    Select an element on the canvas or navigator to configure its properties
                </p>
            </aside>
        );
    }

    return (
        <aside className="w-[400px] bg-white flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                        <Settings2 size={16} />
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-slate-900 tracking-tight uppercase leading-none">
                            {selectedElement.type} Settings
                        </h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Node: {selectedElement.id.slice(0, 8)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => removeElement(selectedElement.id)}
                    className="p-2.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all"
                    title="Delete Element"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                <PropManager
                    element={selectedElement}
                    onChange={updateElementProps}
                    onStyleChange={updateElementStyles}
                />
            </div>
        </aside>
    );
};

const findElementById = (elements: any[], id: string | null): any | null => {
    if (!id) return null;
    for (const el of elements) {
        if (el.id === id) return el;
        if (el.children) {
            const found = findElementById(el.children, id);
            if (found) return found;
        }
    }
    return null;
};
