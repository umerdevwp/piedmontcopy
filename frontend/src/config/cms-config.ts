
import {
    Layout, Type, Image as ImageIcon,
    CheckCircle2, RefreshCw, Layers,
    MousePointer2, Settings2, User
} from 'lucide-react';

export type FieldType = 'text' | 'textarea' | 'image' | 'color' | 'select' | 'toggle' | 'number' | 'repeater';

export interface FieldDefinition {
    name: string;
    label: string;
    type: FieldType;
    defaultValue?: any;
    options?: { label: string; value: string }[]; // For select inputs
    fields?: FieldDefinition[]; // For repeater fields
    group?: 'content' | 'style' | 'advanced';
    description?: string;
}

export interface BlockDefinition {
    type: string;
    label: string;
    icon: any;
    description: string;
    isPremium?: boolean;
    fields: FieldDefinition[];
}

export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
    hero: {
        type: 'hero',
        label: 'Hero Block',
        icon: Layout,
        description: 'Full-width banner with title and CTA',
        fields: [
            // Content Tab
            { name: 'title', label: 'Main Headline', type: 'text', defaultValue: 'Welcome', group: 'content' },
            { name: 'subtitle', label: 'Sub-Headline', type: 'textarea', defaultValue: 'Add a description...', group: 'content' },
            { name: 'buttonText', label: 'Button Label', type: 'text', defaultValue: 'Get Started', group: 'content' },
            { name: 'bgImage', label: 'Background Image', type: 'image', group: 'content' },

            // Style Tab
            { name: 'overlayOpacity', label: 'Overlay Opacity', type: 'number', defaultValue: 30, group: 'style', description: '0-100%' },
            { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff', group: 'style' }
        ]
    },
    text: {
        type: 'text',
        label: 'Rich Text',
        icon: Type,
        description: 'WYSIWYG content block',
        fields: [
            { name: 'body', label: 'Content', type: 'textarea', defaultValue: '<p>Start writing...</p>', group: 'content' },

            {
                name: 'maxWidth', label: 'Max Width', type: 'select', defaultValue: '4xl', group: 'style', options: [
                    { label: 'Small (2xl)', value: '2xl' },
                    { label: 'Medium (4xl)', value: '4xl' },
                    { label: 'Large (6xl)', value: '6xl' },
                    { label: 'Full Width', value: 'full' }
                ]
            }
        ]
    },
    'hero-slider': {
        type: 'hero-slider',
        label: 'Hero Slider',
        icon: RefreshCw,
        description: 'Multi-slide interactive hero',
        isPremium: true,
        fields: [
            {
                name: 'slides',
                label: 'Slides',
                type: 'repeater',
                group: 'content',
                defaultValue: [{ title: 'New Slide', subtitle: 'Description', buttonText: 'Action' }],
                fields: [
                    { name: 'title', label: 'Headline', type: 'text', defaultValue: 'Slide Title' },
                    { name: 'subtitle', label: 'Description', type: 'textarea', defaultValue: 'Slide description' },
                    { name: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Learn More' },
                    { name: 'bgImage', label: 'Background', type: 'image' },
                    { name: 'tag', label: 'Top Tag', type: 'text', defaultValue: 'New' }
                ]
            },
            { name: 'autoPlay', label: 'Auto Play', type: 'toggle', defaultValue: true, group: 'advanced' },
            { name: 'interval', label: 'Interval (sec)', type: 'number', defaultValue: 5, group: 'advanced' }
        ]
    },
    parallax: {
        type: 'parallax',
        label: 'Parallax Banner',
        icon: MousePointer2,
        description: 'Scrolling depth effect',
        isPremium: true,
        fields: [
            { name: 'title', label: 'Headline', type: 'text', defaultValue: 'Parallax Title', group: 'content' },
            { name: 'subtitle', label: 'Subtitle', type: 'text', defaultValue: 'Scroll to see the magic', group: 'content' },
            { name: 'imageUrl', label: 'Background Image', type: 'image', group: 'content' },
            { name: 'enabled', label: 'Enable Effect', type: 'toggle', defaultValue: true, group: 'advanced' },
            { name: 'height', label: 'Height (px)', type: 'number', defaultValue: 600, group: 'style' }
        ]
    },
    'premium-list': {
        type: 'premium-list',
        label: 'Premium List',
        icon: Settings2,
        description: 'Features, services, or steps',
        isPremium: true,
        fields: [
            {
                name: 'style',
                label: 'List Style',
                type: 'select',
                defaultValue: 'grid',
                group: 'style',
                options: [
                    { label: 'Grid', value: 'grid' },
                    { label: 'Checklist', value: 'checklist' },
                    { label: 'Numbered', value: 'numbered' },
                    { label: 'Cards', value: 'cards' },
                    { label: 'Glassmorphism', value: 'glass' }
                ]
            },
            {
                name: 'items',
                label: 'List Items',
                type: 'repeater',
                group: 'content',
                defaultValue: [{ title: 'New Item', desc: 'Description' }],
                fields: [
                    { name: 'title', label: 'Title', type: 'text', defaultValue: 'Feature' },
                    { name: 'desc', label: 'Description', type: 'textarea', defaultValue: 'Details' }
                ]
            }
        ]
    },
    'section-layout': {
        type: 'section-layout',
        label: 'Column Layout',
        icon: Layers,
        description: 'Structural container',
        isPremium: true,
        fields: [
            // Simplified layout control for now
            {
                name: 'layoutType',
                label: 'Column Structure',
                type: 'select',
                defaultValue: '50-50',
                group: 'content',
                options: [
                    { label: 'Two Columns (50/50)', value: '50-50' },
                    { label: 'Three Columns (33/33/33)', value: '33-33-33' },
                    { label: 'Offset Left (66/33)', value: '66-33' },
                    { label: 'Offset Right (33/66)', value: '33-66' },
                    { label: 'Full Width (100)', value: '100' }
                ]
            },
            { name: 'bgColor', label: 'Background Color', type: 'color', defaultValue: 'transparent', group: 'style' },
            {
                name: 'padding', label: 'Vertical Padding', type: 'select', defaultValue: 'py-12', group: 'style', options: [
                    { label: 'None', value: 'py-0' },
                    { label: 'Small', value: 'py-8' },
                    { label: 'Medium', value: 'py-12' },
                    { label: 'Large', value: 'py-24' }
                ]
            }
        ]
    }
};
