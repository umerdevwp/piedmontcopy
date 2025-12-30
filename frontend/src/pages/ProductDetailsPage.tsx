import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, ChevronDown, Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '../store/useCartStore';
import ProductImage from '../components/ProductImage';

interface OptionValue {
    id: number;
    name: string;
    priceModifier: number;
}

interface ProductOption {
    id: number;
    name: string;
    type: string;
    values: OptionValue[];
}

interface ProductImage {
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
    imageUrl: string;
    images: ProductImage[];
    options: ProductOption[];
}

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [activeImage, setActiveImage] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; type: string }>>([]);
    const [uploading, setUploading] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        fetch(`/api/products/${slug}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                // Set default selections
                const defaults: Record<number, number> = {};
                data.options?.forEach((opt: ProductOption) => {
                    if (opt.values.length > 0) {
                        defaults[opt.id] = opt.values[0].id;
                    }
                });
                setSelectedOptions(defaults);

                // Set active image
                if (data.images && data.images.length > 0) {
                    const featured = data.images.find((img: ProductImage) => img.isFeatured);
                    setActiveImage(featured ? featured.url : data.images[0].url);
                } else {
                    setActiveImage(data.imageUrl);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch product:', err);
                setLoading(false);
            });
    }, [slug]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));

        try {
            const response = await fetch('/api/uploads/artwork', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setUploadedFiles(prev => [...prev, ...data.files]);
            toast.success('Artwork uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload artwork');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (url: string) => {
        setUploadedFiles(prev => prev.filter(f => f.url !== url));
    };

    const calculatePrice = () => {
        if (!product) return 0;
        let total = Number(product.basePrice);

        product.options?.forEach(option => {
            const selectedValueId = selectedOptions[option.id];
            const selectedValue = option.values.find(v => v.id === selectedValueId);
            if (selectedValue) {
                total += Number(selectedValue.priceModifier);
            }
        });

        return total;
    };

    const handleAddToCart = () => {
        if (!product) return;

        const configurations: Record<string, any> = {};
        product.options?.forEach(option => {
            const selectedValueId = selectedOptions[option.id];
            const selectedValue = option.values.find(v => v.id === selectedValueId);
            if (selectedValue) {
                configurations[option.name] = selectedValue;
            }
        });

        addToCart({
            id: crypto.randomUUID(),
            productId: product.id.toString(),
            productName: product.name,
            productImageUrl: product.imageUrl,
            quantity: 1,
            configurations,
            files: uploadedFiles,
            totalPrice: calculatePrice()
        } as any);

        setUploadedFiles([]); // Clear after add
        toast.success(`Added ${product.name} to cart`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
            </div>
        );
    }

    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : [{ id: 0, url: product.imageUrl, isFeatured: true }];

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        <span>Products</span>
                        <span>/</span>
                        <span className="text-primary">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-100 rounded-2xl overflow-hidden aspect-[4/3] shadow-inner relative group">
                            {/* Main Active Image with Fade Effect */}
                            <div key={activeImage} className="w-full h-full animate-fade-in">
                                <ProductImage src={activeImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm border border-slate-200">
                                PREMIUM QUALITY
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                                {galleryImages.map((img) => (
                                    <div
                                        key={img.id}
                                        onClick={() => setActiveImage(img.url)}
                                        className={`aspect-square bg-slate-50 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${activeImage === img.url ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/50'}`}
                                    >
                                        <ProductImage src={img.url} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div
                                className="text-slate-600 leading-relaxed text-sm rich-text-content"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </div>

                    {/* Right: Configurator */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-lg">★</span>)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">(150+ Reviews)</span>
                                </div>
                            </div>

                            {/* Options */}
                            {product.options && product.options.length > 0 && (
                                <div className="space-y-8">
                                    {product.options.map(option => (
                                        <div key={option.id} className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <label className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                                    {option.name}
                                                </label>
                                                <span className="text-xs text-primary font-bold">REQUIRED</span>
                                            </div>
                                            {option.type === 'select' ? (
                                                <div className="relative group">
                                                    <select
                                                        value={selectedOptions[option.id] || ''}
                                                        onChange={(e) => setSelectedOptions({
                                                            ...selectedOptions,
                                                            [option.id]: Number(e.target.value)
                                                        })}
                                                        className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Select an option...</option>
                                                        {option.values.map(value => (
                                                            <option key={value.id} value={value.id}>
                                                                {value.name} {value.priceModifier !== 0 ? `(${value.priceModifier > 0 ? '+' : ''}$${Number(value.priceModifier).toFixed(2)})` : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                        <ChevronDown className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {option.values.map(value => {
                                                        const isSelected = selectedOptions[option.id] === value.id;
                                                        return (
                                                            <button
                                                                key={value.id}
                                                                onClick={() => setSelectedOptions({
                                                                    ...selectedOptions,
                                                                    [option.id]: value.id
                                                                })}
                                                                className={`relative p-4 text-left border-2 rounded-xl transition-all duration-200 group ${isSelected
                                                                    ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-md'
                                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                                                    }`}
                                                            >
                                                                <div className="font-bold text-slate-900 group-hover:text-primary transition-colors mb-1 text-sm md:text-base">
                                                                    {value.name}
                                                                </div>
                                                                {value.priceModifier !== 0 && (
                                                                    <div className={`text-[10px] font-black uppercase tracking-widest ${value.priceModifier > 0 ? 'text-slate-400' : 'text-green-600'}`}>
                                                                        {value.priceModifier > 0 ? `+$${Number(value.priceModifier).toFixed(2)}` : `-$${Math.abs(Number(value.priceModifier)).toFixed(2)}`}
                                                                    </div>
                                                                )}
                                                                {isSelected && (
                                                                    <div className="absolute top-2 right-2 h-4 w-4 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                                                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* File Upload Section */}
                            <div className="space-y-4 pt-4">
                                <label className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Design File
                                </label>

                                <input
                                    type="file"
                                    id="artwork-upload"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.ai,.psd,.jpg,.jpeg,.png,.zip"
                                />

                                <label
                                    htmlFor="artwork-upload"
                                    className={`relative group block overflow-hidden border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${uploading ? 'bg-slate-50 border-primary/20 cursor-wait' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'}`}
                                >
                                    <div className="relative z-10">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${uploading ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
                                            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 mb-1">
                                            {uploading ? 'Uploading Process...' : 'Upload Your Artwork'}
                                        </p>
                                        <p className="text-xs text-slate-500">PDF, AI, or High-Res Images (Zip for multiple)</p>
                                    </div>
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </label>

                                {/* Professionally Listed Uploaded Files */}
                                {uploadedFiles.length > 0 && (
                                    <div className="space-y-2 mt-4">
                                        {uploadedFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group/file animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                                                        {file.type.includes('image') ? (
                                                            <img src={file.url} className="h-full w-full object-cover rounded-md" alt="Preview" />
                                                        ) : (
                                                            <FileText className="h-4 w-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="truncate">
                                                        <div className="text-xs font-bold text-slate-900 truncate">{file.name}</div>
                                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">READY FOR PRINT</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(file.url)}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Loader2 className="h-4 w-4 hidden group-hover/file:block group-hover/file:animate-spin" /> {/* Just a visual marker or X */}
                                                    <X className="h-4 w-4 block group-hover/file:hidden" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Estimated Total</span>
                                        <div className="text-right">
                                            <div className="text-4xl font-black">${calculatePrice().toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">SHIPPING CALCULATED AT CHECKOUT</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-white text-primary hover:bg-slate-100 py-4 px-6 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                    >
                                        NEXT: ADD TO CART
                                    </button>
                                    <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Quality Guarantee
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Secure Checkout
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
