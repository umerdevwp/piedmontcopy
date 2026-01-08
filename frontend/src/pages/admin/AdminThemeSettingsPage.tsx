
import { useState, useEffect } from 'react';
import { Palette, Save, RefreshCw, CheckCircle2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { hexToHSL, hslToHex } from '../../utils/theme';
import { useTheme } from '../../components/ThemeProvider';

export default function AdminThemeSettingsPage() {
    const { token } = useAuthStore();
    const { refreshTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [primaryColor, setPrimaryColor] = useState('#007fb1');
    const [accentColor, setAccentColor] = useState('#ff6900');
    const [backgroundColor, setBackgroundColor] = useState('#f8fafc');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();

            const p = data['theme_primary'];
            const a = data['theme_accent'];
            const b = data['theme_background'];

            if (p) setPrimaryColor(hslToHex(p));
            if (a) setAccentColor(hslToHex(a));
            if (b) setBackgroundColor(hslToHex(b));

        } catch (error) {
            toast.error('Failed to load theme settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates = {
                theme_primary: hexToHSL(primaryColor),
                theme_accent: hexToHSL(accentColor),
                theme_background: hexToHSL(backgroundColor),
            };

            await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            toast.success('Theme updated successfully');
            refreshTheme();
        } catch (error) {
            toast.error('Failed to save theme');
        } finally {
            setIsSaving(false);
        }
    };

    const resetDefaults = () => {
        setPrimaryColor('#007fb1');
        setAccentColor('#ff6900');
        setBackgroundColor('#f8fafc');
    };

    if (isLoading) return <div className="p-8"><RefreshCw className="animate-spin h-8 w-8 text-slate-400" /></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                        <Palette className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Theme Customization</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tailor the visual experience of your store</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={resetDefaults}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm font-bold text-slate-600 text-sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 font-bold text-sm disabled:opacity-50"
                    >
                        {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Color Pickers */}
                <div className="space-y-6">
                    <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
                        <h3 className="text-xl font-black text-slate-900 mb-6">Colors</h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-black text-slate-900 text-sm italic">Primary Color</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Buttons, Links, Highlights</p>
                                </div>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-12 w-12 rounded-xl border-4 border-slate-50 cursor-pointer shadow-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-black text-slate-900 text-sm italic">Accent Color</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Banners, Icons, Alerts</p>
                                </div>
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="h-12 w-12 rounded-xl border-4 border-slate-50 cursor-pointer shadow-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-black text-slate-900 text-sm italic">Background</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Page Background Contrast</p>
                                </div>
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="h-12 w-12 rounded-xl border-4 border-slate-50 cursor-pointer shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Card */}
                <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-black text-slate-900 mb-8 w-full text-left">Real-time Preview</h3>

                    <div className="w-full p-8 rounded-[2rem] border-2 border-slate-50 shadow-inner" style={{ backgroundColor }}>
                        <div className="h-12 w-32 rounded-xl mb-4 mx-auto shadow-lg flex items-center justify-center text-white font-black text-xs uppercase tracking-tighter" style={{ backgroundColor: primaryColor }}>
                            Primary Button
                        </div>
                        <div className="flex gap-2 justify-center mb-6">
                            <div className="h-8 w-8 rounded-lg shadow-md" style={{ backgroundColor: accentColor }}></div>
                            <div className="h-8 w-8 rounded-lg shadow-md opacity-50" style={{ backgroundColor: primaryColor }}></div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Theme Visualized</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">HSL Engine Synchronized</span>
                </div>
            </div>
        </div>
    );
}
