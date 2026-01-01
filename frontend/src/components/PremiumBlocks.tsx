
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { CheckCircle2, ArrowRight, User, Star, Quote } from 'lucide-react';

// --- Parallax Block ---
export const ParallaxBlock = ({ content }: { content: any }) => {
    // Using CSS background-attachment: fixed for robust parallax effect

    return (
        <div className="relative overflow-hidden shadow-2xl group" style={{ height: (content.height || 600) + 'px' }}>
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `url(${content.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: content.enabled ? 'fixed' : 'scroll'
                }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-700" />
            <div className="relative h-full flex items-center justify-center p-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl"
                >
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">{content.title}</h2>
                    <p className="text-xl text-slate-200 font-medium leading-relaxed">{content.subtitle}</p>
                </motion.div>
            </div>
        </div>
    );
};

// --- Hero Slider ---
export const HeroSlider = ({ content }: { content: any }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative overflow-hidden shadow-2xl bg-slate-900 group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {content.slides.map((slide: any, index: number) => (
                        <div key={index} className="relative flex-[0_0_100%] min-w-0 h-[700px]">
                            <img src={slide.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                            <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
                                <AnimatePresence mode="wait">
                                    {selectedIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="max-w-4xl"
                                        >
                                            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                                {slide.tag || 'New Collection'}
                                            </span>
                                            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
                                                {slide.title}
                                            </h1>
                                            <p className="text-xl md:text-2xl text-slate-300 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                                                {slide.subtitle}
                                            </p>
                                            <button className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3 mx-auto uppercase tracking-widest">
                                                {slide.buttonText}
                                                <ArrowRight className="h-5 w-5" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                {content.slides.map((_: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => emblaApi?.scrollTo(idx)}
                        className={`h-2 transition-all duration-500 rounded-full ${selectedIndex === idx ? 'w-12 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Testimonial Slider ---
export const TestimonialSlider = ({ content }: { content: any }) => {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' });

    return (
        <div className="max-w-7xl mx-auto py-24 bg-slate-50 rounded-[4rem] my-12 px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic">What our clients say</h2>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-8">
                    {content.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                            <div className="p-10 bg-white rounded-[3rem] shadow-xl border border-slate-100 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
                                <Quote className="h-10 w-10 text-primary/20 mb-6" />
                                <p className="text-lg text-slate-600 font-medium italic mb-10 leading-relaxed flex-1">
                                    "{item.quote}"
                                </p>
                                <div className="flex items-center gap-4 border-t border-slate-50 pt-8 mt-auto">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900">{item.author}</h4>
                                        <div className="flex text-amber-400 mt-1">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Premium List ---
export const PremiumList = ({ content }: { content: any }) => {
    const styles: Record<string, string> = {
        'grid': 'grid grid-cols-1 md:grid-cols-2 gap-6',
        'checklist': 'space-y-4',
        'numbered': 'space-y-8',
        'cards': 'grid grid-cols-1 md:grid-cols-3 gap-8',
        'glass': 'flex flex-wrap gap-4'
    };

    return (
        <div className={`max-w-7xl mx-auto py-12 ${styles[content.style] || styles.grid}`}>
            {content.items.map((item: any, idx: number) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`
                        ${content.style === 'checklist' ? 'flex items-center gap-4 p-4 rounded-2xl bg-slate-50' :
                            content.style === 'cards' ? 'p-8 bg-white rounded-3xl border border-slate-100 shadow-lg' :
                                content.style === 'glass' ? 'px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white' :
                                    'relative pl-12 py-2'}
                    `}
                >
                    {content.style === 'numbered' && (
                        <span className="absolute left-0 top-0 text-4xl font-black text-primary/20 leading-none">0{idx + 1}</span>
                    )}
                    {content.style === 'checklist' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    <div className="flex flex-col">
                        <h4 className="font-black text-slate-800 tracking-tight">{item.title}</h4>
                        {item.desc && <p className="text-slate-500 text-sm mt-1">{item.desc}</p>}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export const ContentMedia = ({ content }: { content: any }) => (
    <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 py-20 px-8 ${content.swap ? 'md:flex-row-reverse' : ''}`}>
        <div className="flex-1 w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-[3rem] overflow-hidden shadow-2xl relative group"
            >
                <img src={content.imageUrl} className="w-full h-[500px] object-cover" alt="" />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
        </div>
        <div className="flex-1 space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none italic">
                {content.title}
            </h2>
            <div className="text-xl text-slate-500 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: content.body }} />
            {content.buttonText && (
                <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-xl flex items-center gap-3">
                    {content.buttonText}
                    <ArrowRight className="h-5 w-5" />
                </button>
            )}
        </div>
    </div>
);
