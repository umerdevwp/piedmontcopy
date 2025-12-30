import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, RotateCcw, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import ProductImage from '../components/ProductImage';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
    const navigate = useNavigate();
    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-slate-50">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
                    <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                        <ShoppingBag className="h-20 w-20 text-slate-200 stroke-[1.5]" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Your cart is empty</h1>
                <p className="text-slate-500 font-medium mb-10 max-w-sm text-center leading-relaxed">It looks like you haven't discovered our premium range yet. Let's change that.</p>
                <Link to="/products" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                    Start Exploring
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 pt-16 pb-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                                <div className="h-1 w-6 bg-primary rounded-full" />
                                Review Your Order
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
                        </div>
                        <div className="flex items-center gap-8 border-l border-slate-100 pl-8 hidden md:flex">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items count</div>
                                <div className="text-2xl font-black text-slate-900">{items.reduce((acc, item) => acc + item.quantity, 0)}</div>
                            </div>
                            <div className="h-10 w-px bg-slate-100" />
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total value</div>
                                <div className="text-2xl font-black text-primary">${subtotal.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-primary/10 flex flex-col md:flex-row gap-8 relative">
                                {/* Product Image Wrapper */}
                                <div className="relative shrink-0">
                                    <div className="w-full md:w-48 aspect-square bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <ProductImage src={item.productImageUrl || ''} alt={item.productName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -top-3 -left-3 h-10 w-10 bg-white shadow-lg rounded-full flex items-center justify-center border-2 border-slate-50 text-slate-400 group-hover:text-primary transition-colors">
                                        <ShoppingCart className="h-4 w-4" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1 group-hover:text-primary transition-colors">
                                                    {item.productName}
                                                </h3>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Product ID: {item.productId.substring(0, 8)}...</div>
                                            </div>
                                            <div className="text-2xl font-black text-slate-900">
                                                ${(item.totalPrice * item.quantity).toFixed(2)}
                                            </div>
                                        </div>

                                        {/* Configuration Pills */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {Object.entries(item.configurations).map(([key, value]) => (
                                                <div key={key} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{key}</span>
                                                    <span className="text-[10px] font-bold text-slate-700">{typeof value === 'object' ? (value as any).name : value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Uploaded Artwork */}
                                        {item.files && item.files.length > 0 && (
                                            <div className="space-y-2 mb-6">
                                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Attached Designs</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.files.map((file, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl">
                                                            {file.type.includes('image') ? (
                                                                <img src={file.url} className="h-5 w-5 object-cover rounded shadow-sm" alt="Preview" />
                                                            ) : (
                                                                <div className="h-5 w-5 bg-white rounded flex items-center justify-center">
                                                                    <div className="text-[6px] font-black text-primary">PDF</div>
                                                                </div>
                                                            )}
                                                            <span className="text-[9px] font-bold text-slate-700 max-w-[100px] truncate">{file.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100 gap-4">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="h-10 w-10 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="text-lg font-black text-slate-900 w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="h-10 w-10 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="group/del flex items-center gap-2 px-5 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                                        >
                                            <Trash2 className="h-4 w-4 group-hover/del:scale-110 transition-transform" />
                                            Delete Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden backdrop-blur-xl border border-white/10">
                            {/* Visual Accents */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-[100px]" />

                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-10 tracking-tight">Order Summary</h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between text-slate-400">
                                        <span className="font-bold text-xs uppercase tracking-widest">Subtotal Value</span>
                                        <span className="font-black text-white text-lg">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span className="font-bold text-xs uppercase tracking-widest">Premium Shipping</span>
                                        <span className={`font-black uppercase text-[10px] px-3 py-1 rounded-full ${shipping === 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-white'}`}>
                                            {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span className="font-bold text-xs uppercase tracking-widest">Estimated Tax (8%)</span>
                                        <span className="font-black text-white text-lg">${tax.toFixed(2)}</span>
                                    </div>

                                    <div className="h-px bg-white/5 my-8"></div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Final Amount</div>
                                            <span className="text-sm text-slate-500 font-bold">ALL INCLUSIVE</span>
                                        </div>
                                        <div className="text-5xl font-black text-white tracking-tighter">
                                            <span className="text-2xl text-primary align-top mt-1 inline-block mr-1">$</span>
                                            {total.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-primary text-white py-5 px-8 rounded-[2rem] font-black text-base shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-5 w-5" />
                                </button>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-2 mt-12 pt-12 border-t border-white/5">
                                    <div className="flex flex-col items-center gap-2 text-center group">
                                        <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <ShieldCheck className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Secure Payment</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 text-center group">
                                        <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Truck className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Fast Delivery</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 text-center group">
                                        <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <RotateCcw className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Promo/Info */}
                        <div className="mt-6 p-6 bg-white rounded-[2rem] border border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 text-center">Need Assistance?</p>
                            <p className="text-xs text-slate-600 text-center font-medium px-4">Our premium support team is ready to help with your print configuration.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
