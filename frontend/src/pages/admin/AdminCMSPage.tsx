
import { useState, useEffect } from 'react';
import {
    FileText, Plus, Edit, Trash2, Search,
    Layout, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminCMSPage() {
    const { token } = useAuthStore();
    const navigate = useNavigate();
    const [pages, setPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/pages');
            const data = await response.json();
            setPages(data);
        } catch (error) {
            toast.error('Failed to load pages');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const response = await fetch(`/api/pages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success('Page deleted');
                fetchPages();
            }
        } catch (error) {
            toast.error('Failed to delete page');
        }
    };

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                        <Layout className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Content Management</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Create & Edit Dynamic Store Pages</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/admin/content/new')}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 font-bold"
                >
                    <Plus className="h-5 w-5" />
                    Create New Page
                </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search pages by title or slug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        Total {filteredPages.length} Pages
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Page Title</th>
                                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Slug</th>
                                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Updated</th>
                                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">Loading pages...</td>
                                </tr>
                            ) : filteredPages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">No pages found.</td>
                                </tr>
                            ) : filteredPages.map((page) => (
                                <tr key={page.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-slate-700">{page.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <code className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">/p/{page.slug}</code>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm text-slate-400 font-medium whitespace-nowrap">
                                            {new Date(page.updatedAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/p/${page.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                title="View Live"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </a>
                                            <button
                                                onClick={() => navigate(`/admin/content/edit/${page.id}`)}
                                                className="p-2 text-slate-400 hover:text-secondary transition-colors"
                                                title="Edit Builder"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
