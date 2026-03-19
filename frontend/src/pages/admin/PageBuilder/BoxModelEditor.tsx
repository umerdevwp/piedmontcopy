import React, { useState } from 'react';
import { Lock, Unlock, MousePointer2 } from 'lucide-react';

interface BoxModelValue {
    top: string;
    right: string;
    bottom: string;
    left: string;
}

interface BoxModelEditorProps {
    margin: BoxModelValue;
    padding: BoxModelValue;
    onChange: (type: 'margin' | 'padding', value: BoxModelValue) => void;
}


const InputField = ({ value, onChange, label, className = '' }: { value: string, onChange: (val: string) => void, label?: string, className?: string }) => (
    <div className={`relative group ${className}`}>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-center bg-transparent text-[10px] font-bold text-slate-600 outline-none p-1 focus:text-primary z-10 relative"
            placeholder="-"
        />
        {label && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-slate-300 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 group-focus-within:opacity-0 transition-opacity pointer-events-none">{label}</span>}
    </div>
);

export const BoxModelEditor: React.FC<BoxModelEditorProps> = ({ margin, padding, onChange }) => {
    const [lockMargin, setLockMargin] = useState(false);
    const [lockPadding, setLockPadding] = useState(false);

    const updateSpacing = (type: 'margin' | 'padding', side: keyof BoxModelValue, val: string) => {
        const current = type === 'margin' ? margin : padding;
        const isLocked = type === 'margin' ? lockMargin : lockPadding;

        if (isLocked) {
            onChange(type, { top: val, right: val, bottom: val, left: val });
        } else {
            onChange(type, { ...current, [side]: val });
        }
    };

    return (
        <div className="w-full select-none">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layout Model</span>
                <div className="text-[10px] items-center gap-2 text-slate-300 hidden md:flex">
                    <MousePointer2 size={10} /> Interactive Zones
                </div>
            </div>

            <div className="relative w-full aspect-[4/3] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-8 flex items-center justify-center shadow-inner">

                {/* MARGIN LABEL */}
                <div className="absolute top-2 left-3 text-[9px] font-black text-slate-300 uppercase tracking-widest">Margin</div>

                {/* MARGIN BOX */}
                <div className="relative w-full h-full bg-orange-50/50 border border-orange-200/50 border-dashed rounded-lg flex flex-col items-center justify-between p-1 transition-all hover:bg-orange-50 hover:border-orange-300">

                    {/* Top Margin */}
                    <div className="w-full flex justify-center h-6 -mt-3.5 z-10">
                        <InputField value={margin.top} onChange={(v) => updateSpacing('margin', 'top', v)} className="w-12" />
                    </div>

                    <div className="w-full flex-1 flex justify-between items-center px-1">
                        {/* Left Margin */}
                        <div className="-ml-4 w-8 flex justify-center">
                            <InputField value={margin.left} onChange={(v) => updateSpacing('margin', 'left', v)} className="w-8" />
                        </div>

                        {/* PADDING BOX */}
                        <div className="relative flex-1 h-full mx-6 bg-emerald-50/50 border border-emerald-200/50 border-dashed rounded flex flex-col items-center justify-between p-1 transition-all hover:bg-emerald-50 hover:border-emerald-300">
                            {/* PADDING LABEL */}
                            <div className="absolute top-1 left-2 text-[8px] font-black text-emerald-200 uppercase tracking-widest pointer-events-none">Padding</div>

                            {/* Top Padding */}
                            <div className="w-full flex justify-center -mt-2.5 z-10">
                                <InputField value={padding.top} onChange={(v) => updateSpacing('padding', 'top', v)} className="w-8" />
                            </div>

                            <div className="w-full flex-1 flex justify-between items-center">
                                {/* Left Padding */}
                                <div className="-ml-3 w-6 flex justify-center">
                                    <InputField value={padding.left} onChange={(v) => updateSpacing('padding', 'left', v)} className="w-6" />
                                </div>

                                {/* CONTENT BOX */}
                                <div className="flex-1 self-stretch bg-slate-200/50 border border-slate-300 rounded mx-1.5 flex items-center justify-center text-[10px] font-black text-slate-400">
                                    <div className="w-full text-center opacity-50">CONTENT</div>
                                </div>

                                {/* Right Padding */}
                                <div className="-mr-3 w-6 flex justify-center">
                                    <InputField value={padding.right} onChange={(v) => updateSpacing('padding', 'right', v)} className="w-6" />
                                </div>
                            </div>

                            {/* Bottom Padding */}
                            <div className="w-full flex justify-center -mb-2.5 z-10">
                                <InputField value={padding.bottom} onChange={(v) => updateSpacing('padding', 'bottom', v)} className="w-8" />
                            </div>

                            {/* Lock Padding */}
                            <button
                                onClick={() => setLockPadding(!lockPadding)}
                                className={`absolute bottom-1 right-1 p-0.5 rounded ${lockPadding ? 'text-emerald-500 bg-emerald-100' : 'text-slate-300 hover:text-emerald-400'}`}
                            >
                                {lockPadding ? <Lock size={8} /> : <Unlock size={8} />}
                            </button>
                        </div>

                        {/* Right Margin */}
                        <div className="-mr-4 w-8 flex justify-center">
                            <InputField value={margin.right} onChange={(v) => updateSpacing('margin', 'right', v)} className="w-8" />
                        </div>
                    </div>

                    {/* Bottom Margin */}
                    <div className="w-full flex justify-center h-6 -mb-3.5 z-10">
                        <InputField value={margin.bottom} onChange={(v) => updateSpacing('margin', 'bottom', v)} className="w-12" />
                    </div>

                    {/* Lock Margin */}
                    <button
                        onClick={() => setLockMargin(!lockMargin)}
                        className={`absolute bottom-2 right-2 p-1 rounded ${lockMargin ? 'text-orange-500 bg-orange-100' : 'text-slate-300 hover:text-orange-400'}`}
                    >
                        {lockMargin ? <Lock size={10} /> : <Unlock size={10} />}
                    </button>
                </div>
            </div>
            <div className="flex justify-center gap-2 mt-2">
                {['0px', '20px', '40px', 'auto'].map(p => (
                    <button key={p} onClick={() => onChange('margin', { top: p, right: p, bottom: p, left: p })} className="text-[9px] px-2 py-1 bg-slate-50 border border-slate-100 rounded hover:border-primary hover:text-primary transition-all text-slate-400 font-medium">
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
};
