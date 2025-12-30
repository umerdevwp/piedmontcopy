
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageRenderer from '../components/PageRenderer';
import { Loader2 } from 'lucide-react';

export default function DynamicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPage = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/pages/${slug}`);
                if (!response.ok) throw new Error('Page not found');
                const data = await response.json();
                setPage(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchPage();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
                <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8">Page Not Found</p>
                <a href="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl">
                    Back to Home
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto py-12 px-6">
            <PageRenderer blocks={typeof page.content === 'string' ? JSON.parse(page.content) : page.content} />
        </div>
    );
}
