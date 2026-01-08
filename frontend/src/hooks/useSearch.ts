import { useState, useEffect } from 'react';

export interface SearchResultItem {
    id: number;
    name?: string;
    title?: string;
    slug: string;
    imageUrl?: string;
    icon?: string;
    basePrice?: string;
}

export interface SearchResults {
    products: SearchResultItem[];
    services: SearchResultItem[];
}

export function useSearch(query: string, delay: number = 300) {
    const [results, setResults] = useState<SearchResults>({ products: [], services: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults({ products: [], services: [] });
            return;
        }

        const handler = setTimeout(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Search failed');
                const data = await response.json();
                setResults(data);
            } catch (err: any) {
                setError(err.message);
                setResults({ products: [], services: [] });
            } finally {
                setIsLoading(false);
            }
        }, delay);

        return () => clearTimeout(handler);
    }, [query, delay]);

    return { results, isLoading, error };
}
