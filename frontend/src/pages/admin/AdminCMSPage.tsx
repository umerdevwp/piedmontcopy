import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
    Plus, Search, FileText,
    Edit3, Trash2, Loader2,
    Calendar, Globe
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface Page {
    id: number;
    slug: string;
    title: string;
    isPublished: boolean;
    updatedAt: string;
}

const AdminCMSPage = () => {
    const navigate = useNavigate();
    const { token, logout } = useAuthStore();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/pages/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPages(data);
            } else if (response.status === 401) {
                logout();
                navigate('/login');
                toast.error('Session expired. Please login again.');
            }
        } catch (error) {
            toast.error('Failed to fetch pages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this page?')) return;

        try {
            const response = await fetch(`/api/pages/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Page deleted successfully');
                setPages(pages.filter(p => p.id !== id));
            } else if (response.status === 401) {
                logout();
                navigate('/login');
                toast.error('Session expired. Please login again.');
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
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Content Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Design and manage your website pages with ease.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/content/new')}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group uppercase tracking-widest"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    Create New Page
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pages</p>
                        <p className="text-2xl font-black text-slate-900">{pages.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <Globe className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published</p>
                        <p className="text-2xl font-black text-slate-900">{pages.filter(p => p.isPublished).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated</p>
                        <p className="text-lg font-black text-slate-900">{pages.length > 0 ? new Date(pages[0].updatedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Content Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                        <input
                            type="text"
                            placeholder="Search by title or slug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">URL Slug</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Modified</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Synchronizing Content...</p>
                                    </td>
                                </tr>
                            ) : filteredPages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching pages found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPages.map((page) => (
                                    <tr key={page.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900">{page.title}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-100">
                                                /{page.slug}
                                            </code>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-500">{new Date(page.updatedAt).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${page.isPublished
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {page.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right space-x-2">
                                            <Link
                                                to={`/p/${page.slug}?preview=true`}
                                                target="_blank"
                                                className="p-2.5 inline-flex bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg rounded-xl transition-all"
                                                title="View Public Page"
                                            >
                                                <Globe className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => navigate(`/admin/content/edit/${page.id}`)}
                                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all"
                                                title="Edit in Page Builder"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all"
                                                title="Delete Page"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCMSPage;
