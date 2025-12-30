
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50 border-t border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                Showing page {currentPage} of {totalPages} ({totalItems} total items)
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                    {/* Only show up to 5 page buttons to keep it clean */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((p, i, arr) => {
                            const showDots = i > 0 && p !== arr[i - 1] + 1;
                            return (
                                <div key={p} className="flex items-center gap-1">
                                    {showDots && <span className="text-slate-300 text-[10px] font-black px-1">...</span>}
                                    <button
                                        onClick={() => onPageChange(p)}
                                        className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${currentPage === p
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                </div>
                            );
                        })
                    }
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
