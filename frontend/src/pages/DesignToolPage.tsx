import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import {
    Square, Type, Image as ImageIcon, Download, Save, Undo, Redo,
    Circle as CircleIcon, Triangle as TriangleIcon, Pencil,
    Trash2, Layers, Palette, MousePointer2
} from 'lucide-react';
import { toast } from 'sonner';

export default function DesignToolPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // UI State
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushWidth, setBrushWidth] = useState(5);
    const [fillColor, setFillColor] = useState('#2563eb');

    useEffect(() => {
        if (canvasRef.current && wrapperRef.current && !canvas) {
            const newCanvas = new fabric.Canvas(canvasRef.current, {
                width: wrapperRef.current.clientWidth,
                height: 600, // Fixed height for now
                backgroundColor: '#ffffff',
                selection: true
            });

            // Initial Object
            const rect = new fabric.Rect({
                left: 350,
                top: 250,
                fill: '#2563eb',
                width: 100,
                height: 100,
                rx: 10,
                ry: 10
            });
            newCanvas.add(rect);

            // Event Listeners
            newCanvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null));
            newCanvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0] || null));
            newCanvas.on('selection:cleared', () => setSelectedObject(null));

            // Resize observer
            const resizeObserver = new ResizeObserver(() => {
                if (wrapperRef.current) {
                    newCanvas.setDimensions({
                        width: wrapperRef.current.clientWidth,
                        height: 600
                    });
                }
            });
            resizeObserver.observe(wrapperRef.current);

            setCanvas(newCanvas);

            return () => {
                newCanvas.dispose();
                resizeObserver.disconnect();
            };
        }
    }, [canvas]);

    // --- Tools ---

    const addRect = () => {
        if (!canvas) return;
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: fillColor,
            width: 100,
            height: 100
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
    };

    const addCircle = () => {
        if (!canvas) return;
        const circle = new fabric.Circle({
            left: 150,
            top: 150,
            fill: fillColor,
            radius: 50
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
    };

    const addTriangle = () => {
        if (!canvas) return;
        const triangle = new fabric.Triangle({
            left: 200,
            top: 200,
            fill: fillColor,
            width: 100,
            height: 100
        });
        canvas.add(triangle);
        canvas.setActiveObject(triangle);
    };

    const addText = () => {
        if (!canvas) return;
        const text = new fabric.IText('Double click to edit', {
            left: 250,
            top: 250,
            fontFamily: 'Inter',
            fill: '#333333',
            fontSize: 24
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    };

    const toggleDrawingMode = () => {
        if (!canvas) return;
        const newMode = !isDrawingMode;
        setIsDrawingMode(newMode);
        canvas.isDrawingMode = newMode;
        if (newMode) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = brushColor;
            canvas.freeDrawingBrush.width = brushWidth;
        }
    };

    // --- File Upload ---

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canvas || !e.target.files?.[0]) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            fabric.Image.fromURL(data).then((img) => {
                img.scaleToWidth(200);
                canvas.add(img);
                canvas.setActiveObject(img);
            });
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset
    };

    // --- Object Manipulation ---

    const deleteSelected = () => {
        if (!canvas || !selectedObject) return;
        canvas.remove(selectedObject);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        setSelectedObject(null);
    };

    const updateColor = (color: string) => {
        setFillColor(color);
        if (canvas && selectedObject) {
            selectedObject.set('fill', color);
            canvas.requestRenderAll();
        }
    };

    const updateLayer = (direction: 'up' | 'down') => {
        if (!canvas || !selectedObject) return;
        if (direction === 'up') canvas.bringObjectToFront(selectedObject);
        else canvas.sendObjectToBack(selectedObject);
        canvas.requestRenderAll();
    };

    const handleDownload = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // High res
        });
        const link = document.createElement('a');
        link.download = 'piedmont-design.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Design downloaded successfully');
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
            {/* Left Toolbar */}
            <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-3 z-10 shadow-sm overflow-y-auto">
                <ToolButton icon={<MousePointer2 />} label="Select" active={!isDrawingMode} onClick={() => {
                    if (canvas) canvas.isDrawingMode = false;
                    setIsDrawingMode(false);
                }} />

                <div className="w-10 h-px bg-slate-200 my-1" />

                <ToolButton icon={<Square />} label="Rect" onClick={addRect} />
                <ToolButton icon={<CircleIcon />} label="Circle" onClick={addCircle} />
                <ToolButton icon={<TriangleIcon />} label="Triangle" onClick={addTriangle} />

                <div className="w-10 h-px bg-slate-200 my-1" />

                <ToolButton icon={<Type />} label="Text" onClick={addText} />
                <ToolButton icon={<Pencil />} label="Draw" active={isDrawingMode} onClick={toggleDrawingMode} />
                <ToolButton icon={<ImageIcon />} label="Image" onClick={triggerImageUpload} />

                {/* Hidden Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Action Bar */}
                <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="font-semibold text-slate-700">Untitled Design</h2>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">800 x 600 px</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Undo (Coming Soon)">
                            <Undo className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Redo (Coming Soon)">
                            <Redo className="h-5 w-5" />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-2" />
                        <button onClick={() => toast.success('Design saved!')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Save className="h-4 w-4" />
                            Save
                        </button>
                        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Canvas Wrapper */}
                <div className="flex-1 overflow-auto bg-slate-100 p-8 flex items-center justify-center relative">
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div
                        ref={wrapperRef}
                        className="bg-white shadow-2xl relative z-0" // Removed overflow-hidden to allow controls outside if needed, though fabric handles controls inside
                        style={{ width: '800px', height: '600px', flexShrink: 0 }}
                    >
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>

            {/* Right Properties Panel */}
            <div className="w-72 bg-white border-l border-slate-200 flex flex-col z-10 shadow-sm">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">Properties</h3>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto flex-1">
                    {/* Common Properties */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Fill</label>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: fillColor }}></div>
                            <input
                                type="color"
                                value={fillColor}
                                onChange={(e) => updateColor(e.target.value)}
                                className="flex-1 h-10 cursor-pointer rounded-lg"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#2563eb', '#a855f7', '#ec4899', '#000000', '#ffffff', '#94a3b8'].map(color => (
                                <button
                                    key={color}
                                    className="w-8 h-8 rounded-full border border-slate-200 shadow-sm hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => updateColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {isDrawingMode && (
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Brush Settings</label>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Color</span>
                                    </div>
                                    <input
                                        type="color"
                                        value={brushColor}
                                        onChange={(e) => {
                                            setBrushColor(e.target.value);
                                            if (canvas?.freeDrawingBrush) canvas.freeDrawingBrush.color = e.target.value;
                                        }}
                                        className="w-full h-8 rounded cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Width</span>
                                        <span className="text-slate-500">{brushWidth}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="50"
                                        value={brushWidth}
                                        onChange={(e) => {
                                            const w = parseInt(e.target.value);
                                            setBrushWidth(w);
                                            if (canvas?.freeDrawingBrush) canvas.freeDrawingBrush.width = w;
                                        }}
                                        className="w-full accent-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedObject && (
                        <>
                            <div className="h-px bg-slate-200" />

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Arrangement</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => updateLayer('up')} className="px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 text-slate-700 flex items-center justify-center gap-2">
                                        <Layers className="h-4 w-4" /> Forward
                                    </button>
                                    <button onClick={() => updateLayer('down')} className="px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 text-slate-700 flex items-center justify-center gap-2">
                                        <Layers className="h-4 w-4" /> Backward
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Canvas Actions</label>
                                <button
                                    onClick={deleteSelected}
                                    className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Object
                                </button>
                            </div>
                        </>
                    )}

                    {!selectedObject && !isDrawingMode && (
                        <div className="text-center py-10 text-slate-400">
                            <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Select an object to customize properties.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ToolButton({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick: () => void, active?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`
                w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                ${active
                    ? 'bg-primary/10 text-primary ring-2 ring-primary ring-inset'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }
            `}
            title={label}
        >
            <div className="[&>svg]:h-5 [&>svg]:w-5">{icon}</div>
            <span className="text-[9px] font-medium">{label}</span>
        </button>
    );
}
