import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await uploadFile(file);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('files', file); // API expects 'files' array

        try {
            // Using the existing artwork upload endpoint
            const response = await fetch('/api/uploads/artwork', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            // API returns { files: [{ name, url, type }] }
            if (data.files && data.files.length > 0) {
                onChange(data.files[0].url);
                toast.success('Image uploaded successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    {label}
                </label>
            )}

            {value ? (
                <div className="relative group rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                    <img
                        src={value}
                        alt="Uploaded preview"
                        className="w-full h-48 object-cover transition-opacity group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                        <button
                            onClick={() => window.open(value, '_blank')}
                            className="p-2 bg-white/90 rounded-lg text-slate-600 hover:text-primary shadow-sm"
                            title="View Full Size"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onChange('')}
                            className="p-2 bg-white/90 rounded-lg text-slate-600 hover:text-red-500 shadow-sm"
                            title="Remove Image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group
                        ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50/50 hover:border-primary/50 hover:bg-white'}
                        ${isUploading ? 'pointer-events-none opacity-50' : ''}
                    `}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />

                    {isUploading ? (
                        <>
                            <Loader2 className="h-6 w-6 text-primary animate-spin" />
                            <p className="text-xs font-bold text-slate-400">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
                                <Upload className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">
                                    Click to upload
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                    or drag and drop
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
