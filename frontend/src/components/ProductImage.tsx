import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ProductImageProps {
    src?: string;
    alt: string;
    className?: string;
}

export default function ProductImage({ src, alt, className = "" }: ProductImageProps) {
    const [error, setError] = useState(false);

    // Generate a consistent color based on the product name
    const getPlaceholderColor = (text: string) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, 70%, 90%)`;
    };

    const getTextColor = (text: string) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, 70%, 30%)`;
    };

    if (!src || error) {
        return (
            <div
                className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 ${className}`}
                style={{
                    backgroundColor: alt ? getPlaceholderColor(alt) : '#f1f5f9',
                    color: alt ? getTextColor(alt) : '#94a3b8'
                }}
            >
                <ImageOff className="h-1/3 w-1/3 opacity-40 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 px-2 text-center">
                    {alt || 'No Image'}
                </span>
            </div>
        );
    }

    // For professional deployment, we use relative paths that are proxied in dev 
    // and handled by Nginx/Apache in production. VITE_API_URL can be used as an 
    // override if proxy is not configured.
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const imageSrc = (src.startsWith('/') && !src.startsWith('http')) ? `${baseUrl}${src}` : src;

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            referrerPolicy="no-referrer"
        />
    );
}
