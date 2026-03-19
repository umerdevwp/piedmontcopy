import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageRenderer } from '../components/PageRenderer';
import { Loader2, AlertCircle } from 'lucide-react';

export default function DynamicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPage();
    }, [slug]);

    const fetchPage = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams(window.location.search);
            const isPreview = params.get('preview') === 'true';
            const response = await fetch(`/api/pages/${slug}${isPreview ? '?preview=true' : ''}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Page not found');
                }
                throw new Error('Failed to load page');
            }

            const data = await response.json();
            setPage(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-red-500">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                    {error === 'Page not found' ? 'Node Not Located' : 'Signal Interference'}
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest max-w-sm">
                    {error === 'Page not found'
                        ? 'The requested dynamic asset does not exist in the current registry.'
                        : 'An error occurred while attempting to retrieve the dynamic protocol.'}
                </p>
                <a
                    href="/"
                    className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
                >
                    Return to Hub
                </a>
            </div>
        );
    }

    return <PageRenderer layout={page.content} title={page.title} />;
}
