import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { BuilderProvider, useBuilder } from './PageBuilder/BuilderContext';
import { Toolbar } from './PageBuilder/Toolbar';
import { LibrarySidebar } from './PageBuilder/LibrarySidebar';
import { Canvas } from './PageBuilder/Canvas';
import { PropertyInspector } from './PageBuilder/PropertyInspector';
import { Loader2 } from 'lucide-react';
import {
    DndContext,
    closestCorners,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragOverlay,
    type DragEndEvent
} from '@dnd-kit/core';

import { Navigator } from './PageBuilder/Navigator';

const EditorShell = ({ onSave, page, setIsPublished, setPageTitle, setPageSlug }: any) => {
    const { addElement, moveElement, setLayout } = useBuilder();

    const [activeItem, setActiveItem] = useState<any>(null);

    useEffect(() => {
        if (page?.content) {
            setLayout(page.content);
        }
    }, [page, setLayout]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event: any) => {
        if (event.active.data.current?.isLibraryItem) {
            setActiveItem(event.active.data.current);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveItem(null);
        const { active, over } = event;
        if (!over) return;

        if (active.data.current?.isLibraryItem) {
            const { type } = active.data.current;
            addElement(type);
            toast.success(`Node Added: ${type.toUpperCase()}`);
        } else {
            const activeId = active.id as string;
            const overId = over.id as string;
            moveElement(activeId, overId);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 font-sans">
                <Toolbar
                    onSave={onSave}
                    pageTitle={page?.title}
                    setPageTitle={setPageTitle}
                    pageSlug={page?.slug}
                    setPageSlug={setPageSlug}
                    isPublished={page?.isPublished}
                    setIsPublished={setIsPublished}
                />

                <div className="flex flex-1 overflow-hidden">
                    <LibrarySidebar />
                    <Navigator />
                    <Canvas />
                    <div className="w-[400px] border-l border-slate-200 bg-white h-full overflow-hidden shadow-2xl z-20">
                        <PropertyInspector />
                    </div>
                </div>
            </div>

            <DragOverlay dropAnimation={null}>
                {activeItem ? (
                    <div className="bg-primary text-white px-4 py-2 rounded-xl shadow-2xl border border-white/20 flex items-center gap-2 opacity-90 scale-105 pointer-events-none">
                        <div className="h-6 w-6 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-[10px] font-black uppercase tracking-widest">{activeItem.type[0]}</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{activeItem.type}</span>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

const AdminPageEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, logout } = useAuthStore();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPage();
        } else {
            setPage({
                title: 'New Page',
                slug: 'new-page',
                content: []
            });
            setLoading(false);
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            const response = await fetch(`/api/pages/admin/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPage(data);
            } else if (response.status === 401) {
                logout();
                navigate('/login');
                toast.error('Session expired. Please login again.');
            }
        } catch (error) {
            toast.error('Failed to fetch page data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (content: any, isPublishedOverride?: boolean) => {
        try {
            const method = id ? 'PUT' : 'POST';
            const url = id
                ? `/api/pages/admin/${id}`
                : '/api/pages/admin';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: page.title,
                    slug: page.slug,
                    content,
                    isPublished: isPublishedOverride !== undefined ? isPublishedOverride : (page.isPublished || false)
                })
            });

            if (response.ok) {
                const savedPage = await response.json();
                setPage(savedPage);
                toast.success('Page persisted to server successfully');
                if (!id) {
                    navigate(`/admin/content/edit/${savedPage.id}`);
                }
            } else if (response.status === 401) {
                logout();
                navigate('/login');
                toast.error('Session expired. Please login again.');
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(`Persistence Failed: ${errorData.error || response.statusText}`);
            }
        } catch (error: any) {
            toast.error(`Network Error: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <BuilderProvider>
            <EditorShell
                onSave={handleSave}

                page={page}
                setIsPublished={(isPublished: boolean) => setPage({ ...page!, isPublished })}
                setPageTitle={(title: string) => {
                    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setPage({ ...page!, title, slug: id ? page.slug : slug });
                }}
                setPageSlug={(slug: string) => {
                    setPage({ ...page!, slug });
                }}
            />
        </BuilderProvider>
    );
};

export default AdminPageEditor;
