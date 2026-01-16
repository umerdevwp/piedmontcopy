
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Loader2, Book, Copy, Layers, Scan, Layout, MonitorCheck, Printer, Phone, Upload, Star } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import Pagination from '../../components/Pagination';
import ProductImage from '../../components/ProductImage';

const ICON_MAP: Record<string, any> = {
    Book, Copy, Layers, Scan, Layout, MonitorCheck, Printer, Phone
};

interface ServiceImageType {
    id: number;
    url: string;
    isFeatured: boolean;
}

interface Service {
    id: number;
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    features: string[];
    imageUrl: string;
    icon: string;
    category: string;
    startingPrice?: number;
    images: ServiceImageType[];
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
    const { token, logout } = useAuthStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        description: '',
        longDescription: '',
        features: [] as string[],
        icon: 'Printer',
        category: 'General',
        startingPrice: '',
        newImages: [] as File[],
        existingImages: [] as ServiceImageType[],
        deleteImageIds: [] as number[],
        featuredImageIndex: 0,
        featuredImageId: null as number | null
    });

    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        fetchServices();
    }, [page]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/services?page=${page}&limit=10`);
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    navigate('/login');
                }
                throw new Error('Failed to fetch services');
            }
            const result = await response.json();
            setServices(result.data || []);
            setMeta(result.meta || { total: 0, totalPages: 0 });
        } catch (error) {
            toast.error('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                newImages: [...prev.newImages, ...filesArray]
            }));
        }
    };

    const removeNewImage = (index: number) => {
        setFormData(prev => {
            const updatedImages = prev.newImages.filter((_, i) => i !== index);
            let newFeaturedIndex = prev.featuredImageIndex;
            if (prev.featuredImageIndex === index) newFeaturedIndex = 0;
            if (prev.featuredImageIndex > index) newFeaturedIndex--;

            return {
                ...prev,
                newImages: updatedImages,
                featuredImageIndex: newFeaturedIndex
            };
        });
    };

    const markExistingForDeletion = (id: number) => {
        setFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter(img => img.id !== id),
            deleteImageIds: [...prev.deleteImageIds, id],
            featuredImageId: prev.featuredImageId === id ? null : prev.featuredImageId
        }));
    };

    const setFeaturedNew = (index: number) => {
        setFormData(prev => ({
            ...prev,
            featuredImageIndex: index,
            featuredImageId: null
        }));
    };

    const setFeaturedExisting = (id: number) => {
        setFormData(prev => ({
            ...prev,
            featuredImageId: id,
            featuredImageIndex: -1
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingService
                ? `/api/services/${editingService.id}`
                : '/api/services';

            const method = editingService ? 'PUT' : 'POST';

            const submitData = new FormData();
            submitData.append('slug', formData.slug);
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('longDescription', formData.longDescription);
            submitData.append('icon', formData.icon);
            submitData.append('category', formData.category);
            submitData.append('startingPrice', formData.startingPrice.toString());

            // Append features as JSON
            submitData.append('features', JSON.stringify(formData.features));

            // Append images
            formData.newImages.forEach((file) => {
                submitData.append('images', file);
            });

            if (editingService) {
                if (formData.deleteImageIds.length > 0) {
                    submitData.append('deleteImageIds', JSON.stringify(formData.deleteImageIds));
                }
                if (formData.featuredImageId) {
                    submitData.append('featuredImageId', formData.featuredImageId.toString());
                }
            } else {
                if (formData.featuredImageIndex >= 0) {
                    submitData.append('featuredImageIndex', formData.featuredImageIndex.toString());
                }
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to save service');
            }

            toast.success(editingService ? 'Service updated!' : 'Service created!');
            setShowModal(false);
            resetForm();
            fetchServices();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete service');

            toast.success('Service deleted!');
            fetchServices();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        const featuredImg = service.images?.find(img => img.isFeatured);

        setFormData({
            slug: service.slug,
            title: service.title,
            description: service.description,
            longDescription: service.longDescription,
            features: service.features,
            icon: service.icon,
            category: service.category || 'General',
            startingPrice: service.startingPrice?.toString() || '',
            newImages: [],
            existingImages: service.images || [],
            deleteImageIds: [],
            featuredImageIndex: -1,
            featuredImageId: featuredImg ? featuredImg.id : (service.images?.[0]?.id || null)
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingService(null);
        setFormData({
            slug: '',
            title: '',
            description: '',
            longDescription: '',
            features: [],
            icon: 'Printer',
            category: 'General',
            startingPrice: '',
            newImages: [],
            existingImages: [],
            deleteImageIds: [],
            featuredImageIndex: 0,
            featuredImageId: null
        });
        setNewFeature('');
    };

    const addFeature = () => {
        if (!newFeature.trim()) return;
        setFormData({
            ...formData,
            features: [...formData.features, newFeature.trim()]
        });
        setNewFeature('');
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index)
        });
    };

    if (loading && services.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-slate-50 min-h-screen pb-20 p-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Services</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Solutions & Capabilities CMS</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-bold active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    NEW SERVICE
                </button>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all duration-300">
                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                                <ProductImage src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-sm">
                                    {(() => {
                                        const Icon = ICON_MAP[service.icon] || Printer;
                                        return <Icon className="h-6 w-6 text-primary" />;
                                    })()}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <h2 className="text-xl font-black text-slate-900 leading-tight">{service.title}</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(service)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed mb-6">
                                    {service.description}
                                </p>
                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{service.category}</span>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                                        {service.features.length} Features
                                    </span>
                                </div>
                                <div className="mt-4 text-xl font-black text-slate-900">
                                    ${Number(service.startingPrice || 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                    <Pagination
                        currentPage={page}
                        totalPages={meta?.totalPages || 0}
                        totalItems={meta?.total || 0}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full flex flex-col max-h-full border border-white/20">
                        <div className="flex items-center justify-between p-8 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {editingService ? 'Update Service' : 'Create New Service'}
                                </h2>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Service Content Management</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Service Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                            placeholder="e.g., Professional Book Binding"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL Slug</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                            placeholder="book-binding"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                                        >
                                            <option value="General">General</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Business">Business</option>
                                            <option value="Corporate">Corporate</option>
                                            <option value="Events">Events</option>
                                            <option value="Personal">Personal</option>
                                        </select>
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Starting Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.startingPrice}
                                            onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                            placeholder="99.00"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Icon Representation</label>
                                        <select
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                                        >
                                            {Object.keys(ICON_MAP).map(icon => (
                                                <option key={icon} value={icon}>{icon}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Image Gallery Section */}
                            <div className="group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Service Imagery</label>
                                <div className="relative mb-8">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="border-3 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center bg-slate-50 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-primary">
                                            <Upload className="h-8 w-8" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">Click to Upload Images</h4>
                                        <p className="text-xs text-slate-400 font-medium">SVG, PNG, JPG or GIF (Max. 5MB)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {formData.existingImages.map((img) => (
                                        <div key={img.id} className="relative group/img aspect-square bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm">
                                            <ProductImage src={img.url} alt="service" className="w-full h-full object-cover rounded-xl" />
                                            <button
                                                type="button"
                                                onClick={() => setFeaturedExisting(img.id)}
                                                className={`absolute top-4 left-4 p-1.5 rounded-lg backdrop-blur-md border transition-all ${formData.featuredImageId === img.id
                                                    ? 'bg-yellow-400/90 border-yellow-400 text-white'
                                                    : 'bg-black/30 border-white/20 text-white/50 hover:bg-yellow-400 hover:text-white hover:border-yellow-400'
                                                    }`}
                                                title="Set as Featured"
                                            >
                                                <Star className="h-4 w-4 fill-current" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => markExistingForDeletion(img.id)}
                                                className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {formData.newImages.map((file, idx) => (
                                        <div key={idx} className="relative group/img aspect-square bg-white p-2 rounded-2xl border-2 border-primary/20 shadow-sm">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-xl" />
                                            <button
                                                type="button"
                                                onClick={() => setFeaturedNew(idx)}
                                                className={`absolute top-4 left-4 p-1.5 rounded-lg backdrop-blur-md border transition-all ${formData.featuredImageIndex === idx
                                                    ? 'bg-yellow-400/90 border-yellow-400 text-white'
                                                    : 'bg-black/30 border-white/20 text-white/50 hover:bg-yellow-400 hover:text-white hover:border-yellow-400'
                                                    }`}
                                                title="Set as Featured"
                                            >
                                                <Star className="h-4 w-4 fill-current" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute top-4 right-4 p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <div className="absolute bottom-2 inset-x-2 text-center">
                                                <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">New</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Short Catchy Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                    placeholder="Brief summary for list view..."
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Long Narrative (Markdown/Rich Text)</label>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.longDescription}
                                    onChange={(value) => setFormData({ ...formData, longDescription: value })}
                                    placeholder="Detailed overview for the service page..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Service Features</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.features.map((feature, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-sm border border-primary/10 group/feat">
                                            {feature}
                                            <button type="button" onClick={() => removeFeature(idx)} className="hover:text-red-500 transition-colors">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        placeholder="Add a standout feature..."
                                        className="flex-1 px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-lg shadow-slate-900/10"
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-8 py-5 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-widest text-xs"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingService ? 'COMMIT SERVICE UPDATES' : 'INITIALIZE NEW SERVICE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

