export interface OptionValue {
    id: string; // Keep as string for frontend flexibility, though DB is int
    name: string;
    priceModifier: number; // e.g., 5.00 (flat add) or 0 (base)
    multiplier?: number; // e.g., 1.5 (50% markup)
}

export interface ProductOption {
    id: string;
    name: string;
    type: 'select' | 'radio' | 'text';
    values: OptionValue[];
}

export interface ProductImage {
    id: number;
    url: string;
    isFeatured: boolean;
    productId: number;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string;
    images?: ProductImage[]; // Added images relation
    options: ProductOption[];
}

export interface CartItem {
    id: string; // Unique ID for cart entry
    productId: string;
    productName: string;
    configurations: Record<string, OptionValue>; // Map optionId to OptionValue
    quantity: number;
    totalPrice: number;
    productImageUrl?: string;
    fileUrl?: string;
    files?: Array<{ name: string; url: string; type: string }>;
}

export interface ServiceImage {
    id: number;
    url: string;
    isFeatured: boolean;
    serviceId: number;
}

export interface Service {
    id: number;
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    features: string[];
    imageUrl: string;
    icon: string;
    images?: ServiceImage[]; // Added images relation
    createdAt?: string;
    updatedAt?: string;
}
