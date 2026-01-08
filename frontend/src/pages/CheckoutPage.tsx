import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate, Link } from 'react-router-dom';
import {
    Check, CreditCard, Loader2, ShieldCheck, Truck, Lock,
    Mail, User, MapPin, Globe, Hash, Calendar, Phone,
    ChevronLeft, CreditCard as CardIcon, ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSandbox, setIsSandbox] = useState(false);
    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.fullName?.split(' ')[0] || '',
        lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
        address: user?.address || '',
        city: '',
        zip: '',
        cardName: user?.fullName || '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    useEffect(() => {
        // Check if sandbox mode is active
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                // Settings API returns an object now (Record<string, string>)
                const sandboxValue = data['sandbox_mode'];
                setIsSandbox(sandboxValue === 'true');
            })
            .catch(console.error);
    }, []);

    // ... (rest of code)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items,
                    shippingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        city: formData.city,
                        zip: formData.zip,
                        email: formData.email
                    },
                    totalAmount: total,
                    userId: user?.id
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // checks for FK constraint violation which implies stale cart items
                if (data.details && data.details.includes('Foreign key constraint violated')) {
                    throw new Error('Some items in your cart are no longer available. Please clear your cart and try again.');
                }
                throw new Error(data.details || data.error || 'Failed to place order');
            }

            // Success
            setIsProcessing(false);
            clearCart();
            toast.success(`Order #${data.id} placed successfully!`);
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            setIsProcessing(false);
            toast.error(error.message || 'Failed to place order. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link to="/cart" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Cart
                    </Link>
                    <div className="flex items-center gap-3">
                        <Lock className="h-4 w-4 text-slate-300" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Secure 256-Bit SSL Checkout</span>
                    </div>
                </div>
            </div>

            {isSandbox && (
                <div className="bg-amber-500 text-white py-3">
                    <div className="container mx-auto px-4 flex items-center justify-center gap-3">
                        <ShieldAlert className="h-5 w-5 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">SANDBOX MODE ACTIVE - No real payment will be processed</span>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Leftside: Form */}
                    <div className="lg:col-span-8 space-y-8">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Shipping Information */}
                            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <Truck className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shipping Details</h2>
                                        <p className="text-sm text-slate-400 font-medium">Where should we send your premium prints?</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <User className="h-3 w-3" /> First Name
                                        </label>
                                        <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <User className="h-3 w-3" /> Last Name
                                        </label>
                                        <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="Doe" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> Email Address
                                        </label>
                                        <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <MapPin className="h-3 w-3" /> Delivery Address
                                        </label>
                                        <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="123 Luxury Printing St." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Globe className="h-3 w-3" /> City
                                        </label>
                                        <input required name="city" value={formData.city} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="New York" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Hash className="h-3 w-3" /> ZIP Code
                                        </label>
                                        <input required name="zip" value={formData.zip} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="10001" />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Information */}
                            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className={`absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all ${isSandbox ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                    <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-amber-100">
                                        <CardIcon className="h-5 w-5 text-amber-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sandbox Mode: Payment Processing Bypassed</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Detail</h2>
                                            <p className="text-sm text-slate-400 font-medium">Encrypted & Secure Transaction</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <img src="https://img.icons8.com/color/48/visa.png" className="h-8 grayscale hover:grayscale-0 transition-all cursor-crosshair" alt="Visa" />
                                        <img src="https://img.icons8.com/color/48/mastercard.png" className="h-8 grayscale hover:grayscale-0 transition-all cursor-crosshair" alt="Mastercard" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <User className="h-3 w-3" /> Name on Card
                                        </label>
                                        <input required={!isSandbox} name="cardName" value={formData.cardName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="FULL NAME" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <CreditCard className="h-3 w-3" /> Card Number
                                        </label>
                                        <div className="relative">
                                            <input required={!isSandbox} name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="0000 0000 0000 0000" />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <CardIcon className="h-4 w-4 text-slate-300" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Calendar className="h-3 w-3" /> Expiry Date
                                        </label>
                                        <input required={!isSandbox} name="expiry" value={formData.expiry} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="MM / YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Lock className="h-3 w-3" /> CVC Code
                                        </label>
                                        <input required={!isSandbox} name="cvc" value={formData.cvc} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary/20 focus:bg-white transition-all text-sm font-bold text-slate-900" placeholder="000" />
                                    </div>
                                </div>
                            </section>
                        </form>
                    </div>

                    {/* Rightside: Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[80px]" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-8 tracking-tight">Order Summary</h3>

                                <div className="space-y-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start gap-4 py-3 border-b border-white/5">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-black text-white uppercase tracking-tighter truncate">{item.productName}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Quantity: {item.quantity}</div>
                                            </div>
                                            <div className="text-sm font-black text-white">${(item.totalPrice * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Subtotal Value</span>
                                        <span className="text-base font-bold text-white">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Premium Shipping</span>
                                        <span className="text-base font-bold text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Processing Tax (8%)</span>
                                        <span className="text-base font-bold text-white">${tax.toFixed(2)}</span>
                                    </div>

                                    <div className="h-px bg-white/10 my-8" />

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Total Value</span>
                                            <div className="text-xs text-slate-500 font-black uppercase tracking-widest mt-1">ALL TAXES INCLUDED</div>
                                        </div>
                                        <div className="text-4xl font-black text-white tracking-tighter">
                                            <span className="text-xl text-primary align-top mt-1 inline-block mr-1">$</span>
                                            {total.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-primary text-white py-5 px-8 rounded-2xl font-black text-xs shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            <span>Place Order Now</span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-10 grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 group transition-colors hover:bg-white/10">
                                        <ShieldCheck className="h-4 w-4 text-green-400" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Quality Verified</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 group transition-colors hover:bg-white/10">
                                        <Lock className="h-4 w-4 text-primary" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Data Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-8 bg-white rounded-[2rem] border border-slate-200">
                            <div className="flex items-start gap-4">
                                <Phone className="h-5 w-5 text-slate-300 mt-1" />
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Priority Support</h4>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Need help with your order? Our elite team is standing by.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
