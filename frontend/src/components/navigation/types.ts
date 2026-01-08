export interface NavigationItem {
    id: number;
    label: string;
    url: string | null;
    type: 'utility' | 'main' | 'mega-category' | 'mega-item' | 'promo';
    parentId: number | null;
    position: number;
    icon: string | null;
    imageUrl: string | null;
    description: string | null;
    badge: string | null;
    isActive: boolean;
    scope: 'header' | 'footer';
    children?: NavigationItem[];
}

export interface NavigationState {
    items: NavigationItem[];
    isLoading: boolean;
    error: string | null;
}
