import { Users, Award, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1504270997636-07ddf848bcd6?auto=format&fit=crop&q=80&w=2000"
                        alt="Office background"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                        We Bring Your Ideas to Life
                    </h1>
                    <p className="text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                        PiedmontCopy has been the trusted printing partner for businesses and creatives for over 20 years. Quality, speed, and precision are in our DNA.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-24 sm:py-32 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                                More Than Just a Print Shop
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                We believe that print is an art form. Whether it's a simple business card or a complex marketing brochure, every piece that leaves our shop carries our reputation. We combine traditional craftsmanship with cutting-edge technology to deliver results that exceed expectations.
                            </p>

                            <div className="space-y-4">
                                {[
                                    'State-of-the-art digital and offset printing',
                                    'Eco-friendly sustainable paper options',
                                    'Expert design consultation team',
                                    'Fast turnaround and reliable shipping'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-1 rounded-full">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10">
                                <Link to="/services/custom-printing" className="text-primary font-bold hover:text-primary/80 inline-flex items-center gap-2">
                                    Explore Our Services <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-200">
                                <img
                                    src="https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?auto=format&fit=crop&q=80&w=1000"
                                    alt="Printing press"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
                                <p className="font-serif text-xl italic text-slate-600">
                                    "Quality is never an accident. It is always the result of intelligent effort."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
                        {[
                            { id: 1, name: 'Years in Business', value: '25+', icon: Clock },
                            { id: 2, name: 'Projects Completed', value: '50k+', icon: CheckCircle2 },
                            { id: 3, name: 'Happy Clients', value: '10k+', icon: Users },
                            { id: 4, name: 'Awards Won', value: '15', icon: Award },
                        ].map((stat) => (
                            <div key={stat.id} className="mx-auto flex flex-col gap-y-4 items-center">
                                <div className="bg-blue-50 p-4 rounded-full mb-2">
                                    <stat.icon className="h-8 w-8 text-primary" />
                                </div>
                                <dt className="text-base leading-7 text-slate-600">{stat.name}</dt>
                                <dd className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* Team/CTA Section */}
            <div className="py-24 sm:py-32 bg-slate-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                        Ready to start your next project?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300 mb-10">
                        Our team of experts is ready to help you choose the right materials and finishes for your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
                            Browse Products
                        </Link>
                        <Link to="/contact" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-colors">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
