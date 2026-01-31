
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Loader2, ChevronDown, ChevronUp, Upload, Star, Search } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import ProductImage from '../../components/ProductImage';
import Pagination from '../../components/Pagination';

interface OptionValue {
    id?: number;
    name: string;
    priceModifier: number;
}

interface ProductOption {
    id?: number;
    name: string;
    type: string;
    values: OptionValue[];
}

interface ProductImageType {
    id: number;
    url: string;
    isFeatured: boolean;
}

interface Product {
    id: number;
    slug: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string; // Legacy/Fallback
    images: ProductImageType[];
    options?: ProductOption[];
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
    const { token, logout } = useAuthStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        slug: '',
        name: '',
        description: '',
        basePrice: '',
        options: [] as ProductOption[],
        newImages: [] as File[],
        existingImages: [] as ProductImageType[],
        deleteImageIds: [] as number[],
        featuredImageIndex: 0, // For new images (0-based index in newImages)
        featuredImageId: null as number | null // For existing images
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchProducts();
        }, 300); // 300ms debounce
        return () => clearTimeout(handler);
    }, [page, search]);

    useEffect(() => {
        setPage(1); // Reset to first page on search change
    }, [search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    navigate('/login');
                }
                throw new Error('Failed to fetch products');
            }
            const result = await response.json();
            setProducts(result.data || []);
            setMeta(result.meta || { total: 0, totalPages: 0 });
        } catch (error) {
            toast.error('Failed to fetch products');
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
            // Adjust featured index if needed
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
            featuredImageId: null // Reset existing featured if new one is selected
        }));
    };

    const setFeaturedExisting = (id: number) => {
        setFormData(prev => ({
            ...prev,
            featuredImageId: id,
            featuredImageIndex: -1 // Reset new featured
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : '/api/products';

            const method = editingProduct ? 'PUT' : 'POST';

            const submitData = new FormData();
            submitData.append('slug', formData.slug);
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('basePrice', formData.basePrice);

            // Append options as JSON string
            const optionsPayload = formData.options.map(opt => ({
                name: opt.name,
                type: opt.type,
                values: opt.values.map(val => ({
                    name: val.name,
                    priceModifier: parseFloat(val.priceModifier.toString())
                }))
            }));
            submitData.append('options', JSON.stringify(optionsPayload));

            // Append images
            formData.newImages.forEach((file) => {
                submitData.append('images', file);
            });

            // Append metadata for images
            if (editingProduct) {
                if (formData.deleteImageIds.length > 0) {
                    submitData.append('deleteImageIds', JSON.stringify(formData.deleteImageIds));
                }
                if (formData.featuredImageId) {
                    submitData.append('featuredImageId', formData.featuredImageId.toString());
                }
            }

            // For new products or if we selected a new image as featured
            if (formData.featuredImageIndex >= 0) {
                submitData.append('featuredImageIndex', formData.featuredImageIndex.toString());
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type is set automatically for FormData
                },
                body: submitData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to save product');
            }

            toast.success(editingProduct ? 'Product updated!' : 'Product created!');
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete product');

            toast.success('Product deleted!');
            fetchProducts();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);

        // Find featured image
        const featuredImg = product.images.find(img => img.isFeatured);

        setFormData({
            slug: product.slug,
            name: product.name,
            description: product.description,
            basePrice: product.basePrice.toString(),
            options: product.options || [],
            newImages: [],
            existingImages: product.images || [],
            deleteImageIds: [],
            featuredImageIndex: -1,
            featuredImageId: featuredImg ? featuredImg.id : (product.images[0]?.id || null)
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            slug: '',
            name: '',
            description: '',
            basePrice: '',
            options: [],
            newImages: [],
            existingImages: [],
            deleteImageIds: [],
            featuredImageIndex: 0,
            featuredImageId: null
        });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [
                ...formData.options,
                {
                    name: '',
                    type: 'select',
                    values: [{ name: '', priceModifier: 0 }]
                }
            ]
        });
    };

    const removeOption = (optionIndex: number) => {
        setFormData({
            ...formData,
            options: formData.options.filter((_, i) => i !== optionIndex)
        });
    };

    const updateOption = (optionIndex: number, field: string, value: any) => {
        const newOptions = [...formData.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
        setFormData({ ...formData, options: newOptions });
    };

    const addOptionValue = (optionIndex: number) => {
        const newOptions = [...formData.options];
        newOptions[optionIndex].values.push({ name: '', priceModifier: 0 });
        setFormData({ ...formData, options: newOptions });
    };

    const removeOptionValue = (optionIndex: number, valueIndex: number) => {
        const newOptions = [...formData.options];
        newOptions[optionIndex].values = newOptions[optionIndex].values.filter((_, i) => i !== valueIndex);
        setFormData({ ...formData, options: newOptions });
    };

    const updateOptionValue = (optionIndex: number, valueIndex: number, field: string, value: any) => {
        const newOptions = [...formData.options];
        newOptions[optionIndex].values[valueIndex] = {
            ...newOptions[optionIndex].values[valueIndex],
            [field]: value
        };
        setFormData({ ...formData, options: newOptions });
    };

    if (loading && products.length === 0) {
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Products</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Inventory Management System</p>
                </div>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1 md:justify-end">
                    <div className="relative group w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products by name or alphabet..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-bold active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="h-5 w-5" />
                        NEW PRODUCT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {products.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <Plus className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                        <p className="text-slate-500">Get started by creating your first product.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div key={product.id} className="group bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="relative">
                                            <ProductImage src={product.imageUrl} alt={product.name} className="h-24 w-24 rounded-2xl object-cover shadow-inner ring-4 ring-slate-50 group-hover:ring-primary/10 transition-all" />
                                            <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                                {product.options?.length || 0}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-tighter">ID: {product.id}</span>
                                            </div>
                                            <div className="text-sm text-slate-400 font-medium mb-2 tracking-tight">slug: {product.slug}</div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl font-black text-primary">${Number(product.basePrice).toFixed(2)}</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Base Price</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl md:bg-transparent">
                                        <button
                                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                                            className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${expandedProduct === product.id ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                                }`}
                                        >
                                            {expandedProduct === product.id ? 'CLOSE CONFIG' : 'VIEW CONFIG'}
                                            {expandedProduct === product.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="p-3 text-primary bg-white hover:bg-primary hover:text-white border border-slate-200 rounded-xl transition-all active:scale-95"
                                            title="Edit Product"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-3 text-red-500 bg-white hover:bg-red-500 hover:text-white border border-slate-200 rounded-xl transition-all active:scale-95"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Options View */}
                                {expandedProduct === product.id && (
                                    <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-fade-in">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-1 w-8 bg-primary rounded-full" />
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">Product Configuration</h4>
                                        </div>

                                        {!product.options || product.options.length === 0 ? (
                                            <div className="text-center py-8 text-slate-400 italic font-medium">No custom options configured for this product.</div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {product.options.map((option, idx) => (
                                                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative group/opt">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-full uppercase tracking-tighter">
                                                                {option.type} selector
                                                            </span>
                                                        </div>
                                                        <h5 className="font-bold text-slate-900 group-hover/opt:text-primary transition-colors">{option.name}</h5>
                                                        <div className="mt-4 space-y-2">
                                                            {option.values.map((value, vIdx) => (
                                                                <div key={vIdx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 group/val hover:bg-primary/5 transition-colors">
                                                                    <span className="text-xs font-bold text-slate-600 group-hover/val:text-slate-900 transition-colors uppercase tracking-tight">{value.name}</span>
                                                                    <span className={`text-[10px] font-black px-2 py-1 rounded ${Number(value.priceModifier) > 0 ? 'bg-green-100 text-green-700' :
                                                                        Number(value.priceModifier) < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'
                                                                        }`}>
                                                                        {Number(value.priceModifier) > 0 && '+'}${Number(value.priceModifier).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                            <Pagination
                                currentPage={page}
                                totalPages={meta?.totalPages || 0}
                                totalItems={meta?.total || 0}
                                onPageChange={setPage}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto antialiased">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full flex flex-col max-h-full border border-white/20">
                        <div className="flex items-center justify-between p-8 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {editingProduct ? 'Update Product' : 'Create New Product'}
                                </h2>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Configurator Panel</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-12 overflow-y-auto">
                            {/* Section 1: Visual & Core */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm">01</div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Core Identity</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Product Display Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                                placeholder="e.g., Premium Banners"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">URL Fragment (Slug)</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-900"
                                                placeholder="premium-banners"
                                            />
                                        </div>
                                    </div>
                                    <div className="group md:col-span-2">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Product Gallery</label>

                                        {/* Drop Zone / Upload Button */}
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

                                        {/* Image Gallery Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {/* Existing Images */}
                                            {formData.existingImages.map((img) => (
                                                <div key={img.id} className="relative group/img aspect-square bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm">
                                                    <ProductImage src={img.url} alt="product" className="w-full h-full object-cover rounded-xl" />

                                                    {/* Featured Badge/Button */}
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

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => markExistingForDeletion(img.id)}
                                                        className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* New Images */}
                                            {formData.newImages.map((file, idx) => (
                                                <div key={idx} className="relative group/img aspect-square bg-white p-2 rounded-2xl border-2 border-primary/20 shadow-sm">
                                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-xl" />

                                                    {/* Featured Badge/Button */}
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

                                                    {/* Remove Button */}
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
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Detailed Description</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(value) => setFormData({ ...formData, description: value })}
                                        placeholder="Describe the product details and use cases..."
                                    />
                                </div>
                            </div>

                            {/* Section 2: Pricing */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm">02</div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Economy & Pricing</h3>
                                </div>
                                <div className="max-w-xs group">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Global Base Price ($)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                            className="w-full px-5 py-6 bg-slate-900 text-white rounded-[2rem] focus:ring-4 focus:ring-primary/20 transition-all outline-none font-black text-3xl pl-12"
                                        />
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary text-2xl font-black">$</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Options Extension */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm">03</div>
                                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Custom Configuration Layers</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                    >
                                        <Plus className="h-3 w-3" />
                                        ADD NEW LAYER
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    {formData.options.map((option, optIdx) => (
                                        <div key={optIdx} className="relative group/layer p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-100/50 hover:border-primary/20 transition-all">
                                            <button
                                                type="button"
                                                onClick={() => removeOption(optIdx)}
                                                className="absolute -top-3 -right-3 h-10 w-10 bg-white shadow-lg text-red-400 hover:text-red-600 rounded-full flex items-center justify-center border-2 border-slate-100 hover:scale-110 transition-all"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>

                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                <div className="lg:col-span-4 space-y-6">
                                                    <div className="group">
                                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Layer Label</label>
                                                        <input
                                                            type="text"
                                                            value={option.name}
                                                            onChange={(e) => updateOption(optIdx, 'name', e.target.value)}
                                                            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary transition-all outline-none font-bold text-slate-900 shadow-sm"
                                                            placeholder="e.g., Paper Type"
                                                        />
                                                    </div>
                                                    <div className="group">
                                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">UI Interaction Pattern</label>
                                                        <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1.5 rounded-2xl">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateOption(optIdx, 'type', 'select')}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${option.type === 'select' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                Dropdown
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateOption(optIdx, 'type', 'radio')}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${option.type === 'radio' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                Grid Cards
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="lg:col-span-8 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Values & Premium Surcharges</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addOptionValue(optIdx)}
                                                            className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                                                        >
                                                            + ADD OPTION VALUE
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {option.values.map((value, valIdx) => (
                                                            <div key={valIdx} className="flex items-center gap-3 animate-slide-in">
                                                                <input
                                                                    type="text"
                                                                    value={value.name}
                                                                    onChange={(e) => updateOptionValue(optIdx, valIdx, 'name', e.target.value)}
                                                                    placeholder="Value title"
                                                                    className="flex-1 px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-primary outline-none font-bold text-slate-900 text-sm shadow-sm"
                                                                />
                                                                <div className="relative group/price">
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={value.priceModifier}
                                                                        onChange={(e) => updateOptionValue(optIdx, valIdx, 'priceModifier', parseFloat(e.target.value) || 0)}
                                                                        className={`w-32 px-4 py-3 pl-8 bg-white border-2 border-slate-100 rounded-xl focus:border-primary outline-none font-black text-sm shadow-sm ${Number(value.priceModifier) === 0 ? 'text-slate-400' : 'text-primary'}`}
                                                                    />
                                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-300">$</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeOptionValue(optIdx, valIdx)}
                                                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-12 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-5 border-2 border-slate-100 text-slate-400 font-black rounded-3xl hover:bg-slate-50 hover:text-slate-600 transition-all uppercase tracking-widest text-xs"
                                >
                                    ABORT CHANGES
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-8 py-5 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-widest text-xs active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingProduct ? 'SAVE CHANGES' : 'INITIALIZE NEW PRODUCT'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

