import React, { useState, useRef } from 'react';
import { X, MoveHorizontal } from 'lucide-react';
import { ColorEditor, Label } from './PropertyEditors';

interface GradientStop {
    color: string;
    pos: number;
}

interface GradientEditorProps {
    value: { enabled: boolean; type?: 'linear' | 'radial'; angle?: number; stops: GradientStop[] };
    onChange: (val: any) => void;
}

export const GradientEditor: React.FC<GradientEditorProps> = ({ value, onChange }) => {
    const [selectedStopIndex, setSelectedStopIndex] = useState(0);
    const barRef = useRef<HTMLDivElement>(null);

    // Default to linear gradient if undefined
    const stops = value.stops || [{ color: '#3b82f6', pos: 0 }, { color: '#8b5cf6', pos: 100 }];
    const angle = value.angle || 90;

    const handleStopChange = (index: number, newValues: Partial<GradientStop>) => {
        const newStops = [...stops];
        newStops[index] = { ...newStops[index], ...newValues };
        newStops.sort((a, b) => a.pos - b.pos);
        onChange({ ...value, stops: newStops });
    };

    const removeStop = (index: number) => {
        if (stops.length <= 2) return;
        const newStops = stops.filter((_, i) => i !== index);
        onChange({ ...value, stops: newStops });
        setSelectedStopIndex(0);
    };

    const handleBarClick = (e: React.MouseEvent) => {
        if (!barRef.current) return;
        const rect = barRef.current.getBoundingClientRect();
        const percent = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));

        const newStops = [...stops, { color: '#ffffff', pos: Math.round(percent) }];
        newStops.sort((a, b) => a.pos - b.pos);
        onChange({ ...value, stops: newStops });
    };

    const gradientString = `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.pos}%`).join(', ')})`;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={value.enabled}
                        onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <Label>Enable Gradient</Label>
                </div>
                {value.enabled && (
                    <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100">
                        <button onClick={() => onChange({ ...value, type: 'linear' })} className={`p-1 rounded ${!value.type || value.type === 'linear' ? 'bg-white shadow text-primary' : 'text-slate-400'}`}>
                            <MoveHorizontal size={12} />
                        </button>
                    </div>
                )}
            </div>

            {value.enabled && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Preview Bar */}
                    <div
                        ref={barRef}
                        className="h-8 w-full rounded-xl cursor-crosshair relative shadow-inner border border-slate-200"
                        style={{ background: gradientString }}
                        onClick={handleBarClick}
                    >
                        {stops.map((stop, i) => (
                            <div
                                key={i}
                                className={`absolute top-0 bottom-0 w-3 -ml-1.5 border-2 bg-white cursor-ew-resize hover:scale-110 transition-transform shadow-lg rounded-full z-10 flex items-center justify-center ${selectedStopIndex === i ? 'border-primary scale-125 z-20' : 'border-slate-300'}`}
                                style={{ left: `${stop.pos}%` }}
                                onClick={(e) => { e.stopPropagation(); setSelectedStopIndex(i); }}
                            >
                                <div className="h-1.5 w-1.5 rounded-full" style={{ background: stop.color }} />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Focus Stop</Label>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500">Stop #{selectedStopIndex + 1}</span>
                                    <button onClick={() => removeStop(selectedStopIndex)} className="text-red-400 hover:text-red-500 disabled:opacity-30" disabled={stops.length <= 2}>
                                        <X size={12} />
                                    </button>
                                </div>
                                <ColorEditor
                                    value={stops[selectedStopIndex].color}
                                    onChange={(c) => handleStopChange(selectedStopIndex, { color: c })}
                                    label="Color"
                                />
                                <div>
                                    <Label>Position ({stops[selectedStopIndex].pos}%)</Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={stops[selectedStopIndex].pos}
                                        onChange={(e) => handleStopChange(selectedStopIndex, { pos: parseInt(e.target.value) })}
                                        className="w-full accent-primary h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Global Settings</Label>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 h-full">
                                <div>
                                    <Label>Angle ({angle}deg)</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="relative h-8 w-8 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                                            <div className="absolute h-full w-0.5 bg-primary/20 rotate-[0deg]" style={{ transform: `rotate(${angle}deg)` }} />
                                            <div className="absolute top-0 w-1.5 h-1.5 bg-primary rounded-full shadow-sm" style={{ transformOrigin: 'center 16px', transform: `rotate(${angle}deg)` }} />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={angle}
                                            onChange={(e) => onChange({ ...value, angle: parseInt(e.target.value) })}
                                            className="flex-1 accent-primary h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
