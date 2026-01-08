import { create } from 'zustand';
import { type NavigationItem, type NavigationState } from '../components/navigation/types';

interface NavigationStore extends NavigationState {
    footerItems: NavigationItem[];
    fetchNavigation: () => Promise<void>;
    fetchFooter: () => Promise<void>;
    getByType: (type: string) => NavigationItem[];
}



export const useNavigationStore = create<NavigationStore>((set, get) => ({
    items: [],
    footerItems: [],
    isLoading: false,
    error: null,

    fetchNavigation: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/navigation/tree?scope=header');
            if (!response.ok) throw new Error('Failed to fetch navigation');
            const data = await response.json();
            set({ items: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchFooter: async () => {
        try {
            const response = await fetch('/api/navigation/tree?scope=footer');
            if (!response.ok) throw new Error('Failed to fetch footer');
            const data = await response.json();
            set({ footerItems: data });
        } catch (error: any) {
            console.error('Footer fetch error:', error);
        }
    },

    getByType: (type: string) => {
        return get().items.filter(item => item.type === type);
    }
}));
