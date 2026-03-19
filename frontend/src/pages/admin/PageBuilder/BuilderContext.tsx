import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface ElementStyles {
    desktop: React.CSSProperties;
    tablet?: React.CSSProperties;
    mobile?: React.CSSProperties;
}

export interface ElementProps {
    id: string;
    type: string;
    props: any;
    styles?: ElementStyles;
    children?: ElementProps[];
}

interface BuilderContextType {
    layout: ElementProps[];
    selectedElementId: string | null;
    deviceMode: DeviceMode;
    history: ElementProps[][];
    historyIndex: number;
    setDeviceMode: (mode: DeviceMode) => void;
    selectElement: (id: string | null) => void;
    addElement: (type: string, parentId?: string, position?: number) => void;
    updateElementProps: (id: string, newProps: any) => void;
    updateElementStyles: (id: string, styles: Partial<React.CSSProperties>, device?: DeviceMode) => void;
    removeElement: (id: string) => void;
    moveElement: (activeId: string, overId: string) => void;
    undo: () => void;
    redo: () => void;
    saveToHistory: (newLayout: ElementProps[]) => void;
    setLayout: React.Dispatch<React.SetStateAction<ElementProps[]>>;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [layout, setLayout] = useState<ElementProps[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
    const [history, setHistory] = useState<ElementProps[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);


    const saveToHistory = useCallback((newLayout: ElementProps[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newLayout)));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const selectElement = useCallback((id: string | null) => {
        setSelectedElementId(id);
    }, []);

    const updateElementInLayout = (elements: ElementProps[], id: string, newProps: any): ElementProps[] => {
        return elements.map(el => {
            if (el.id === id) {
                return { ...el, props: { ...el.props, ...newProps } };
            }
            if (el.children) {
                return { ...el, children: updateElementInLayout(el.children, id, newProps) };
            }
            return el;
        });
    };

    const updateElementStylesInLayout = (elements: ElementProps[], id: string, newStyle: Partial<React.CSSProperties>, device: DeviceMode): ElementProps[] => {
        return elements.map(el => {
            if (el.id === id) {
                const styles = el.styles || { desktop: {} };
                const deviceStyle = styles[device] || {};
                return {
                    ...el,
                    styles: {
                        ...styles,
                        [device]: { ...deviceStyle, ...newStyle }
                    }
                };
            }
            if (el.children) {
                return { ...el, children: updateElementStylesInLayout(el.children, id, newStyle, device) };
            }
            return el;
        });
    };

    const removeElementFromLayout = (elements: ElementProps[], id: string): ElementProps[] => {

        return elements
            .filter(el => el.id !== id)
            .map(el => ({
                ...el,
                children: el.children ? removeElementFromLayout(el.children, id) : undefined
            }));
    };

    const findContainer = (id: string, items: ElementProps[]): string | undefined => {
        if (items.find(item => item.id === id)) {
            return 'root';
        }
        for (const item of items) {
            if (item.children) {
                if (item.children.find(child => child.id === id)) {
                    return item.id;
                }
                const found = findContainer(id, item.children);
                if (found) return found;
            }
        }
        return undefined;
    };

    const getItem = (id: string, items: ElementProps[] = layout): ElementProps | undefined => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = getItem(id, item.children);
                if (found) return found;
            }
        }
        return undefined;
    };


    const addElement = useCallback((type: string, parentId?: string, index?: number) => {
        const newElement: ElementProps = {
            id: uuidv4(),
            type,
            props: getDefaultProps(type),
            children: ['section', 'row', 'column', 'div'].includes(type) ? [] : undefined
        };

        setLayout((prev) => {
            let newLayout = [...prev];

            if (!parentId || parentId === 'root') {
                if (typeof index === 'number') {
                    newLayout.splice(index, 0, newElement);
                } else {
                    newLayout.push(newElement);
                }
            } else {
                const addRecursively = (items: ElementProps[]): ElementProps[] => {
                    return items.map(item => {
                        if (item.id === parentId) {
                            const newChildren = [...(item.children || [])];
                            if (typeof index === 'number') {
                                newChildren.splice(index, 0, newElement);
                            } else {
                                newChildren.push(newElement);
                            }
                            return { ...item, children: newChildren };
                        }
                        if (item.children) {
                            return { ...item, children: addRecursively(item.children) };
                        }
                        return item;
                    });
                };
                newLayout = addRecursively(newLayout);
            }

            saveToHistory(newLayout);
            return newLayout;
        });
        setSelectedElementId(newElement.id);
    }, [saveToHistory]);

    const updateElementProps = useCallback((id: string, newProps: any) => {
        const newLayout = updateElementInLayout(layout, id, newProps);
        setLayout(newLayout);
        saveToHistory(newLayout);
    }, [layout, saveToHistory]);

    const updateElementStyles = useCallback((id: string, newStyle: Partial<React.CSSProperties>, device?: DeviceMode) => {
        const targetDevice = device || deviceMode;
        const newLayout = updateElementStylesInLayout(layout, id, newStyle, targetDevice);
        setLayout(newLayout);
        saveToHistory(newLayout);
    }, [layout, deviceMode, saveToHistory]);

    const removeElement = useCallback((id: string) => {

        const newLayout = removeElementFromLayout(layout, id);
        setLayout(newLayout);
        saveToHistory(newLayout);
        if (selectedElementId === id) setSelectedElementId(null);
    }, [layout, selectedElementId, saveToHistory]);

    const moveElement = useCallback((activeId: string, overId: string) => {
        setLayout((items) => {
            const activeContainerId = findContainer(activeId, items);
            let overContainerId;

            if (overId.endsWith('-droppable')) {
                overContainerId = overId.replace('-droppable', '');
            } else {
                overContainerId = findContainer(overId, items);
            }

            if (!activeContainerId || !overContainerId || activeContainerId === overContainerId && activeId === overId) {
                return items;
            }

            // Find the arrays we are moving between
            const getContainerChildren = (containerId: string): ElementProps[] => {
                if (containerId === 'root') return items;
                return getItem(containerId, items)?.children || [];
            };

            const activeItems = getContainerChildren(activeContainerId);
            const overItems = getContainerChildren(overContainerId);

            const activeIndex = activeItems.findIndex(i => i.id === activeId);
            let overIndex;

            if (overId.endsWith('-droppable')) {
                overIndex = overItems.length + 1; // Append to end
            } else {
                overIndex = overItems.findIndex(i => i.id === overId);
            }

            let newLayout = JSON.parse(JSON.stringify(items)); // Deep copy for safety

            // Helper to update children of a specific container in the newLayout tree
            const setContainerChildren = (containerId: string, newChildren: ElementProps[]) => {
                if (containerId === 'root') {
                    newLayout = newChildren;
                } else {
                    const updateRecursive = (list: ElementProps[]): ElementProps[] => {
                        return list.map(item => {
                            if (item.id === containerId) {
                                return { ...item, children: newChildren };
                            }
                            if (item.children) {
                                return { ...item, children: updateRecursive(item.children) };
                            }
                            return item;
                        });
                    };
                    newLayout = updateRecursive(newLayout);
                }
            };

            if (activeContainerId === overContainerId) {
                const newChildren = arrayMove(activeItems, activeIndex, overIndex);
                setContainerChildren(activeContainerId, newChildren);
            } else {
                newLayout = removeElementFromLayout(newLayout, activeId);

                // Add to destination
                const addToDest = (list: ElementProps[]): ElementProps[] => {
                    return list.map(item => {
                        if (item.id === overContainerId) {
                            const targetChildren = [...(item.children || [])];
                            let insertIndex = overIndex;

                            // If overIndex is out of bounds (which it depends on removed items logic), clamp it
                            // Since we are moving between DIFFERENT containers, overIndex (from overItems) is mostly valid
                            // BUT if we dropped onto the container itself, we set overIndex to length + 1
                            if (insertIndex > targetChildren.length) insertIndex = targetChildren.length;
                            if (insertIndex < 0) insertIndex = 0;

                            // Get the original item (before it was styled/mutated? No, just get from state)
                            const itemToMove = getItem(activeId, items)!;
                            if (itemToMove) {
                                targetChildren.splice(insertIndex, 0, itemToMove);
                            }

                            return { ...item, children: targetChildren };
                        }
                        if (item.children) {
                            return { ...item, children: addToDest(item.children) };
                        }
                        return item;
                    });
                };

                if (overContainerId === 'root') {
                    const itemToMove = getItem(activeId, items)!;
                    if (itemToMove) {
                        let insertIndex = overIndex;
                        if (insertIndex > newLayout.length) insertIndex = newLayout.length;
                        if (insertIndex < 0) insertIndex = 0;
                        newLayout.splice(insertIndex, 0, itemToMove);
                    }
                } else {
                    newLayout = addToDest(newLayout);
                }
            }

            saveToHistory(newLayout);
            return newLayout;
        });
    }, [saveToHistory]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setLayout(JSON.parse(JSON.stringify(history[newIndex])));
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setLayout(JSON.parse(JSON.stringify(history[newIndex])));
        }
    }, [history, historyIndex]);

    const value = useMemo(() => ({
        layout,
        selectedElementId,
        deviceMode,
        history,
        historyIndex,
        setDeviceMode,
        selectElement,
        addElement,
        updateElementProps,
        updateElementStyles,
        removeElement,
        moveElement,
        undo,
        redo,
        saveToHistory,
        setLayout
    }), [layout, selectedElementId, deviceMode, history, historyIndex, selectElement, addElement, updateElementProps, updateElementStyles, removeElement, moveElement, undo, redo, saveToHistory]);


    return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
};

export const useBuilder = () => {
    const context = useContext(BuilderContext);
    if (!context) throw new Error('useBuilder must be used within a BuilderProvider');
    return context;
};

const getDefaultProps = (type: string) => {
    const commonTypography = {
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0px',
        textTransform: 'none',
        fontStyle: 'normal',
        textDecoration: 'none',
        color: '#0f172a',
        textAlign: 'left'
    };

    switch (type) {
        case 'section':
            return { padding: '80px 0', background: 'transparent', width: 'boxed' };
        case 'row':
            return { columns: 1, gap: '20px', verticalAlign: 'center' };
        case 'column':
            return { padding: '20px', background: 'transparent' };
        case 'heading':
            return {
                text: 'New Heading',
                tag: 'h2',
                ...commonTypography,
                fontSize: '32px',
                fontWeight: '700',
                textShadow: { x: '0px', y: '0px', blur: '0px', color: 'transparent' },
                gradient: { enabled: false, stops: [{ color: '#3b82f6', pos: 0 }, { color: '#8b5cf6', pos: 100 }] },
                animation: 'none',
                link: { url: '', target: '_self' }
            };
        case 'paragraph':
            return {
                text: 'Add your custom text here...',
                ...commonTypography,
                columns: 1,
                dropCap: false,
                maxWidth: '100%',
                selectionColor: '#bfdbfe'
            };
        case 'list':
            return {
                items: [{ text: 'List item one' }, { text: 'List item two' }],
                listType: 'bullet',
                icon: 'Check',
                iconColor: '#3b82f6',
                iconSize: '16px',
                spacing: '12px',
                ...commonTypography,
                animation: 'stagger'
            };
        case 'image':
            return {
                url: '',
                alt: '',
                title: '',
                size: 'full',
                width: 'auto',
                height: 'auto',
                objectFit: 'cover',
                objectPosition: 'center',
                border: { width: '0px', style: 'solid', color: '#e2e8f0', radius: '12px' },
                boxShadow: 'none',
                opacity: 100,
                hover: { effect: 'none', overlay: 'transparent' },
                link: { url: '', target: '_self' },
                lightbox: false,
                lazyLoad: true,
                caption: { text: '', style: {} },
                filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0 }
            };
        case 'gallery':
            return {
                images: [],
                layoutType: 'grid',
                columns: 3,
                gap: '20px',
                aspectRatio: 'square',
                hoverEffect: 'zoom',
                lightbox: true,
                pagination: 'none'
            };
        case 'video':
            return {
                url: '',
                source: 'youtube',
                aspectRatio: '16:9',
                autoplay: false,
                loop: false,
                muted: false,
                controls: true,
                poster: ''
            };
        case 'iconBox':
            return {
                title: 'Strategic Advantage',
                text: 'Our proprietary algorithm scales exponentially with user demand.',
                icon: 'Zap',
                iconColor: '#3b82f6',
                iconSize: '48px',
                alignment: 'center',
                background: { color: '#3b82f610', padding: '32px', shape: 'rounded' }
            };
        case 'counter':
            return {
                number: 99,
                suffix: '+',
                title: 'Projects Completed',
                duration: 2000,
                color: '#3b82f6',
                fontSize: '48px'
            };
        case 'testimonial':
            return {
                items: [
                    {
                        text: "Antigravity has completely transformed our workflow. The precision is unmatched.",
                        author: "Sarah Chen",
                        role: "CTO, TechScale",
                        avatar: "https://i.pravatar.cc/150?u=sarah"
                    }
                ],
                autoplay: true,
                style: 'modern'
            };
        case 'iconList':
            return {
                items: [{ icon: 'Check', text: 'Stunning Visuals' }, { icon: 'Check', text: 'Premium Assets' }],
                layout: 'vertical',
                iconPosition: 'left',
                spacing: '16px',
                divider: false,
                animation: 'stagger'
            };
        case 'spacer':
            return { height: '40px' };
        case 'divider':
            return { style: 'solid', thickness: '1px', color: '#e2e8f0', width: '100%', margin: '20px auto' };
        case 'button':
            return {
                text: 'Click Here',
                link: { type: 'url', url: '#', target: '_self' },
                buttonType: 'primary',
                size: 'medium',
                width: 'auto',
                alignment: 'left',
                icon: { name: '', position: 'left' },
                ...commonTypography,
                fontWeight: '600',
                colors: {
                    normal: { bg: '#3b82f6', text: '#ffffff', border: 'transparent' },
                    hover: { bg: '#2563eb', text: '#ffffff', border: 'transparent' }
                },
                border: { width: '0px', style: 'solid', radius: '8px' },
                padding: { vertical: '12px', horizontal: '24px' },
                shadow: { normal: 'none', hover: '0 10px 15px -3px rgba(0,0,0,0.1)' },
                hoverEffect: 'none',
                animation: 'none',
                tooltip: '',
                disabled: false
            };
        case 'form':
            return {
                formId: 'contact-form',
                fields: [
                    { id: 'f1', type: 'text', label: 'Name', placeholder: 'Enter your name', required: true, width: 'full' },
                    { id: 'f2', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true, width: 'full' }
                ],
                submitButton: { text: 'Send Message', buttonType: 'primary', size: 'large', width: 'full' },
                action: { type: 'email', value: 'admin@example.com' },
                messages: { success: 'Thank you for your message!', error: 'Something went wrong.' },
                spamProtection: { reCAPTCHA: false, honeypot: true },
                styling: { fieldBg: '#f8fafc', fieldBorder: '#e2e8f0', spacing: '20px' }
            };
        case 'accordion':
            return {
                items: [
                    { title: 'Question 1', content: 'Answer text goes here...', isOpen: true },
                    { title: 'Question 2', content: 'Answer text goes here...', isOpen: false }
                ],
                behavior: { allowMultiple: false, firstOpen: true, scrollToActive: true },
                icon: { collapsed: 'Plus', expanded: 'Minus', position: 'right' },
                styling: {
                    activeBg: '#f1f5f9',
                    inactiveBg: 'transparent',
                    titleColor: '#0f172a',
                    contentPadding: '20px',
                    borderColor: '#e2e8f0'
                }
            };
        case 'tabs':
            return {
                activeTab: 0,
                layout: 'horizontal',
                alignment: 'left',
                items: [
                    { title: 'Tab 1', content: 'Tab 1 content...' },
                    { title: 'Tab 2', content: 'Tab 2 content...' }
                ],
                mobileBehavior: 'accordion',
                styling: {
                    activeColor: '#3b82f6',
                    inactiveColor: '#64748b',
                    contentPadding: '24px',
                    showUnderline: true
                }
            };
        case 'modal':
            return {
                trigger: { type: 'button', text: 'Open Modal', delay: 0, scroll: 0 },
                settings: {
                    width: 'medium',
                    height: 'auto',
                    position: 'center',
                    animation: 'zoom-in'
                },
                overlay: { color: 'rgba(0,0,0,0.5)', blur: true },
                closeOn: { overlay: true, esc: true, auto: 0 },
                cookie: { enabled: false, days: 30 }
            };
        default:
            return {};
    }
};
