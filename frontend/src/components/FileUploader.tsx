import { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Upload Your Design</h3>

            {!file ? (
                <label
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                        isDragging ? "border-accent bg-accent/5" : "border-slate-300 hover:bg-slate-50"
                    )}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PDF, PNG, JPG or AI (MAX. 50MB)</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png,.ai" />
                </label>
            ) : (
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded shadow-sm">
                            <FileText className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Ready
                        </span>
                        <button
                            onClick={() => setFile(null)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
