
import { useState, useEffect } from 'react';
import {
    Settings, ShieldAlert, RefreshCw,
    CheckCircle2, AlertCircle, ToggleLeft, ToggleRight,
    ShieldCheck, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminSettingsPage() {
    const { token } = useAuthStore();
    const [settings, setSettings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSandbox = async () => {
        const current = settings.find(s => s.key === 'sandbox_mode');
        const newValue = current?.value === 'true' ? 'false' : 'true';

        setIsSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key: 'sandbox_mode', value: newValue })
            });

            if (!response.ok) throw new Error('Failed to update');

            toast.success(`Sandbox mode ${newValue === 'true' ? 'enabled' : 'disabled'}`);
            fetchSettings();
        } catch (error) {
            toast.error('Failed to update setting');
        } finally {
            setIsSaving(false);
        }
    };

    const isSandboxEnabled = settings.find(s => s.key === 'sandbox_mode')?.value === 'true';

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                        <Settings className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Configure Global Parameters & Development Tools</p>
                    </div>
                </div>
                <button
                    onClick={fetchSettings}
                    className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <RefreshCw className={`h-5 w-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sandbox Mode Card */}
                <div className={`p-10 rounded-[3rem] border-2 transition-all duration-500 ${isSandboxEnabled ? 'bg-amber-50 border-amber-200 shadow-amber-100 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
                    <div className="flex items-start justify-between mb-8">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${isSandboxEnabled ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <ShieldAlert className="h-7 w-7" />
                        </div>
                        <button
                            disabled={isSaving}
                            onClick={handleToggleSandbox}
                            className="relative focus:outline-none group"
                        >
                            {isSandboxEnabled ? (
                                <ToggleRight className="h-12 w-12 text-amber-500 cursor-pointer" />
                            ) : (
                                <ToggleLeft className="h-12 w-12 text-slate-300 cursor-pointer" />
                            )}
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2">Sandbox Mode</h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                        Enable this to bypass real payment gateways. Orders will be marked as <span className="text-amber-600 font-bold uppercase tracking-tighter bg-amber-100 px-2 py-0.5 rounded-md">sandbox_test</span> and no credit cards will be charged.
                    </p>

                    <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-white">
                        {isSandboxEnabled ? (
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-amber-500" />
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Active Development Env</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Production Secure</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coming Soon Card */}
                <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200 border-dashed flex flex-col items-center justify-center text-center opacity-60">
                    <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-6">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-black text-slate-400 mb-2">Advanced Modules</h2>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Available in Enterprise Update</p>
                </div>
            </div>

            {/* Status Footer */}
            <div className="mt-12 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prisma DB Synced</span>
                </div>
                <div className="h-1 w-1 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">API V1-STABLE</span>
                </div>
            </div>
        </div>
    );
}
