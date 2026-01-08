import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Globe, Share2, MapPin, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const SETTING_GROUPS = [
    {
        title: 'Brand Information',
        icon: Globe,
        fields: [
            { key: 'site_description', label: 'Site Description', type: 'textarea' },
            { key: 'footer_copyright', label: 'Copyright Text', type: 'text' }
        ]
    },
    {
        title: 'Contact Information',
        icon: MapPin,
        fields: [
            { key: 'contact_phone', label: 'Phone Number', type: 'text' },
            { key: 'contact_email', label: 'Email Address', type: 'text' },
            { key: 'contact_address', label: 'Physical Address', type: 'text' }
        ]
    },
    {
        title: 'Social Media',
        icon: Share2,
        fields: [
            { key: 'social_facebook', label: 'Facebook URL', type: 'url' },
            { key: 'social_twitter', label: 'Twitter URL', type: 'url' },
            { key: 'social_instagram', label: 'Instagram URL', type: 'url' },
            { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url' }
        ]
    },
    {
        title: 'System Configuration',
        icon: ShieldAlert,
        fields: [
            {
                key: 'sandbox_mode',
                label: 'Sandbox Mode (Payment Testing)',
                type: 'toggle',
                description: 'Enable to bypass real payments during development'
            }
        ]
    }
];

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore();

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load settings');
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('Failed to save');
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Settings</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage site-wide content and configuration</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </button>
            </div>

            <div className="space-y-8">
                {SETTING_GROUPS.map((group, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <group.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className="font-bold text-lg text-slate-900">{group.title}</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-6">
                            {group.fields.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        {field.label}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={settings[field.key] || ''}
                                            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium resize-none"
                                        />
                                    ) : field.type === 'toggle' ? (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setSettings({ ...settings, [field.key]: settings[field.key] === 'true' ? 'false' : 'true' })}
                                                className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${settings[field.key] === 'true' ? 'bg-primary' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${settings[field.key] === 'true' ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                            <span className="text-sm font-bold text-slate-600">
                                                {settings[field.key] === 'true' ? 'Active' : 'Disabled'}
                                            </span>
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={settings[field.key] || ''}
                                            onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
