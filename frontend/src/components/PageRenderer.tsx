import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';

interface ElementProps {
    id: string;
    type: string;
    props: any;
    children?: ElementProps[];
    styles?: {
        desktop?: React.CSSProperties;
        tablet?: React.CSSProperties;
        mobile?: React.CSSProperties;
    };
}

interface PageRendererProps {
    layout: ElementProps[];
    title?: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const useDeviceMode = () => {
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) setDeviceMode('mobile');
            else if (width < 1024) setDeviceMode('tablet');
            else setDeviceMode('desktop');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return deviceMode;
};

export const PageRenderer: React.FC<PageRendererProps> = ({ layout, title }) => {
    const deviceMode = useDeviceMode();

    useEffect(() => {
        if (title) {
            document.title = `${title} | PiedmontCopy`;
        }
    }, [title]);

    return (
        <div className="w-full min-h-screen bg-white overflow-x-hidden">
            {layout.map((element) => (
                <RenderElement key={element.id} element={element} deviceMode={deviceMode} />
            ))}
        </div>
    );
};

const RenderElement: React.FC<{ element: ElementProps; deviceMode: DeviceMode }> = ({ element, deviceMode }) => {
    const { type, props, children, styles } = element;
    const [activeTab, setActiveTab] = useState(props.activeTab || 0);
    const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const getCommonStyles = (p: any) => {
        const baseStyles = {
            fontFamily: p.fontFamily || "'Outfit', 'Inter', sans-serif",
            fontSize: p.fontSize,
            fontWeight: p.fontWeight,
            lineHeight: p.lineHeight || '1.5',
            letterSpacing: p.letterSpacing || '-0.01em',
            textTransform: p.textTransform as any,
            fontStyle: p.fontStyle,
            textDecoration: p.textDecoration,
            color: p.color,
            textAlign: p.textAlign,
            maxWidth: p.maxWidth,
            padding: p.padding,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            ...(p.textShadow && (p.textShadow.x !== '0px' || p.textShadow.y !== '0px') ? {
                textShadow: `${p.textShadow.x} ${p.textShadow.y} ${p.textShadow.blur} ${p.textShadow.color}`
            } : {})
        };

        const deviceStyles = styles?.[deviceMode] || {};
        return { ...baseStyles, ...deviceStyles };
    };

    const animationClass = props.animation && props.animation !== 'none' ? `animate-${props.animation}` : '';
    const customClass = props.className || '';
    const combinedClass = `${animationClass} ${customClass}`.trim();

    const renderWithLink = (content: React.ReactNode) => {
        if (props.link?.url) {
            return (
                <a
                    href={props.link.url}
                    target={props.link.target || '_self'}
                    rel={props.link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="no-underline block group/link"
                >
                    {content}
                </a>
            );
        }
        return content;
    };

    switch (type) {
        case 'section':
            return (
                <section
                    className={`w-full relative py-20 ${combinedClass}`}
                    style={{
                        ...getCommonStyles(props),
                        backgroundColor: props.background,
                        maxWidth: props.width === 'boxed' ? '1400px' : 'none',
                        margin: '0 auto',
                    }}
                >

                    <div className={props.width === 'boxed' ? 'px-6 md:px-12' : ''}>
                        {children?.map(child => <RenderElement key={child.id} element={child} deviceMode={deviceMode} />)}
                    </div>
                </section>
            );

        case 'row':
            return (
                <div
                    className={`grid w-full ${combinedClass}`}
                    style={{
                        gridTemplateColumns: deviceMode === 'mobile' ? '1fr' : `repeat(${props.columns || 1}, 1fr)`,
                        gap: props.gap || '32px',
                        alignItems: props.verticalAlign || 'start',
                        ...getCommonStyles(props)
                    }}
                >
                    {children?.map(child => <RenderElement key={child.id} element={child} deviceMode={deviceMode} />)}
                </div>
            );

        case 'column':
            return (
                <div
                    className={`w-full flex flex-col ${combinedClass}`}
                    style={{
                        ...getCommonStyles(props),
                        backgroundColor: props.background,
                        gap: '24px',
                    }}
                >

                    {children?.map(child => <RenderElement key={child.id} element={child} deviceMode={deviceMode} />)}
                </div>
            );

        case 'heading':
            const HeadingTag = (props.tag || 'h2') as any;
            const headingLevels: Record<string, string> = {
                h1: 'text-5xl md:text-7xl font-black mb-6',
                h2: 'text-4xl md:text-5xl font-black mb-4',
                h3: 'text-3xl md:text-4xl font-black mb-4',
                h4: 'text-2xl md:text-3xl font-bold mb-3',
                h5: 'text-xl md:text-2xl font-bold mb-2',
                h6: 'text-lg md:text-xl font-bold mb-2'
            };
            return renderWithLink(
                <HeadingTag
                    className={`${headingLevels[props.tag || 'h2']} tracking-tight leading-[1.1] ${combinedClass}`}
                    style={getCommonStyles(props)}
                >
                    {props.text}
                </HeadingTag>
            );

        case 'paragraph':
            return (
                <p
                    className={`text-lg text-slate-600 mb-6 leading-relaxed ${combinedClass} ${props.dropCap ? 'first-letter:text-6xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-primary first-letter:leading-none first-letter:mt-1' : ''}`}
                    style={{
                        ...getCommonStyles(props),
                        columns: props.columns > 1 ? props.columns : 'auto'
                    }}
                >
                    {props.text}
                </p>
            );

        case 'spacer':
            return <div style={{ height: props.height }} className={`w-full ${combinedClass}`} />;

        case 'divider':
            return (
                <div className={`w-full py-8 ${combinedClass}`}>
                    <div
                        className="opacity-20"
                        style={{
                            borderTopStyle: props.style as any,
                            borderTopWidth: props.thickness || '1px',
                            borderTopColor: props.color || '#e2e8f0',
                            width: props.width || '100%',
                            margin: props.margin || '0 auto'
                        }}
                    />
                </div>
            );

        case 'iconBox':
            const BoxIcon = (Icons as any)[props.icon || 'Star'];
            const alignmentClass = props.alignment === 'center' ? 'items-center text-center' : props.alignment === 'right' ? 'items-end text-right' : 'items-start text-left';

            return renderWithLink(
                <div className={`p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col ${alignmentClass} ${combinedClass} group/ib`} style={getCommonStyles(props)}>
                    <div
                        className="rounded-3xl mb-8 flex items-center justify-center transition-all duration-500 group-hover/ib:scale-110 group-hover/ib:rotate-3"
                        style={{
                            backgroundColor: props.background?.color || `${props.iconColor || '#3b82f6'}10`,
                            color: props.iconColor || '#3b82f6',
                            padding: props.background?.padding || '24px',
                            borderRadius: props.background?.shape === 'circle' ? '9999px' : '28px'
                        }}
                    >
                        {BoxIcon && <BoxIcon size={parseInt(props.iconSize) || 40} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover/ib:text-primary transition-colors">{props.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm text-lg">{props.text}</p>
                </div>
            );

        case 'list':
            return (
                <ul className="list-none py-6 space-y-4" style={getCommonStyles(props)}>
                    {props.items?.map((item: any, i: number) => (
                        <li key={i} className={`flex items-start gap-4 ${combinedClass}`}>
                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-slate-600 font-medium text-lg">{item.text}</span>
                        </li>
                    ))}
                </ul>
            );

        case 'iconList':
            return (
                <ul className={`${props.layout === 'horizontal' ? 'flex flex-wrap gap-12' : 'space-y-6'} py-6 ${combinedClass}`}>
                    {props.items?.map((item: any, i: number) => {
                        const ListIcon = (Icons as any)[item.icon || props.icon || 'Check'];
                        return (
                            <li key={i} className={`flex items-center gap-4 group/li ${props.iconPosition === 'right' ? 'flex-row-reverse' : ''}`}>
                                <div
                                    className="p-2.5 rounded-xl bg-slate-50 text-primary group-hover/li:bg-primary group-hover/li:text-white transition-all duration-300"
                                    style={{ color: props.iconColor || props.color }}
                                >
                                    {ListIcon && <ListIcon size={parseInt(props.iconSize) || 20} strokeWidth={2.5} />}
                                </div>
                                <span className="font-bold text-slate-800 text-lg tracking-tight" style={getCommonStyles(props)}>{item.text}</span>
                            </li>
                        );
                    })}
                </ul>
            );

        case 'image':
            return renderWithLink(
                <div
                    className={`w-full relative overflow-hidden group/img transition-all duration-700 ${combinedClass}`}
                    style={{
                        borderRadius: props.border?.radius || '32px',
                        border: props.border?.width && props.border?.width !== '0px' ? `${props.border.width} ${props.border.style} ${props.border.color}` : 'none',
                        boxShadow: props.boxShadow || '0 20px 50px -12px rgba(0,0,0,0.1)',
                        opacity: (props.opacity || 100) / 100,
                        ...getCommonStyles(props)
                    }}
                >
                    {props.url ? (
                        <img
                            src={props.url}
                            alt={props.alt}
                            className={`w-full h-auto transition-transform duration-1000 ease-out ${props.hover?.effect === 'zoom' ? 'group-hover/img:scale-110' : ''}`}
                            style={{
                                objectFit: props.objectFit as any,
                                filter: `brightness(${props.filters?.brightness || 100}%) contrast(${props.filters?.contrast || 100}%) saturate(${props.filters?.saturation || 100}%) blur(${props.filters?.blur || 0}px)`
                            }}
                            loading={props.lazyLoad ? 'lazy' : 'eager'}
                        />
                    ) : null}
                    {props.caption?.text && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover/img:translate-y-0 transition-transform duration-500">
                            <p className="text-white text-sm font-bold tracking-wide text-center uppercase">{props.caption.text}</p>
                        </div>
                    )}
                </div>
            );

        case 'video':
            if (!props.url) return null;
            return (
                <div className={`w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 ring-1 ring-white/10 relative ${combinedClass}`} style={getCommonStyles(props)}>
                    <iframe
                        src={props.source === 'youtube'
                            ? `https://www.youtube.com/embed/${getYouTubeId(props.url)}?autoplay=${props.autoplay ? 1 : 0}&mute=${props.muted ? 1 : 0}&controls=${props.controls ? 1 : 0}&loop=${props.loop ? 1 : 0}`
                            : `https://player.vimeo.com/video/${getVimeoId(props.url)}?autoplay=${props.autoplay ? 1 : 0}&muted=${props.muted ? 1 : 0}&controls=${props.controls ? 1 : 0}&loop=${props.loop ? 1 : 0}`}
                        className="w-full h-full scale-105"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );

        case 'gallery':
            return (
                <div
                    className={`grid w-full ${combinedClass}`}
                    style={{
                        gridTemplateColumns: deviceMode === 'mobile' ? '1fr' : deviceMode === 'tablet' ? 'repeat(2, 1fr)' : `repeat(${props.columns || 3}, 1fr)`,
                        gap: props.gap || '32px',
                        ...getCommonStyles(props)
                    }}
                >
                    {props.images?.map((img: any, i: number) => (
                        <div
                            key={i}
                            className={`relative group/gal overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 ${props.aspectRatio === 'square' ? 'aspect-square' : props.aspectRatio === '16/9' ? 'aspect-video' : 'aspect-[4/5]'}`}
                        >
                            <img
                                src={img.url}
                                alt={img.alt}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover/gal:scale-110"
                            />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/gal:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center text-primary scale-50 group-hover/gal:scale-100 transition-transform duration-500 shadow-xl">
                                    <Icons.Maximize2 size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'button':
            const btnBg = props.colors?.normal.bg || '#3b82f6';
            const btnText = props.colors?.normal.text || '#ffffff';
            const btnBorder = props.colors?.normal.border || btnBg;

            const buttonEl = (
                <div
                    className={`
                        inline-flex items-center justify-center gap-3 transition-all duration-500 group/btn relative overflow-hidden
                        ${props.width === 'full' ? 'w-full' : 'w-auto'}
                        ${props.size === 'small' ? 'px-6 py-3 text-xs' : props.size === 'large' ? 'px-12 py-5 text-lg' : 'px-10 py-4 text-base'}
                        rounded-2xl font-black uppercase tracking-[0.15em] shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:scale-95
                    `}
                    style={{
                        backgroundColor: btnBg,
                        border: `2px solid ${btnBorder}`,
                        ...getCommonStyles(props),
                        color: btnText,
                    }}
                >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                    {props.icon?.name && props.icon.position === 'left' && <Icons.Star className="transition-transform group-hover/btn:-translate-x-1" size={18} strokeWidth={3} />}
                    <span className="relative z-10">{props.text}</span>
                    {props.icon?.name && props.icon.position === 'right' && <Icons.Star className="transition-transform group-hover/btn:translate-x-1" size={18} strokeWidth={3} />}
                </div>
            );

            return (
                <div style={{ textAlign: props.alignment as any }} className="py-4">
                    {props.link?.url ? (
                        <a
                            href={props.link.url}
                            target={props.link.target}
                            className="no-underline inline-block group"
                        >
                            {buttonEl}
                        </a>
                    ) : buttonEl}
                </div>
            );

        case 'form':
            const handleFormSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                setFormSubmitted(true);
                toast.success('Protocol Received: Message transmitted successfully');
            };

            if (formSubmitted) {
                return (
                    <div className="p-12 bg-emerald-50 rounded-[3rem] border border-emerald-100 text-center animate-in zoom-in duration-500">
                        <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-emerald-200">
                            <Icons.Check size={40} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-black text-emerald-900 mb-2 uppercase tracking-tight">Transmission Complete</h3>
                        <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest">We will respond shortly</p>
                        <button onClick={() => setFormSubmitted(false)} className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 hover:text-emerald-600 transition-colors">Submit Another Protocol</button>
                    </div>
                );
            }

            return (
                <form className="p-12 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-3xl mx-auto space-y-8" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-2 gap-8">
                        {props.fields?.map((field: any) => (
                            <div key={field.id} className={deviceMode === 'mobile' ? 'col-span-2' : field.width === 'half' ? 'col-span-1' : 'col-span-2'}>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                                    {field.label}{field.required && <span className="text-primary ml-1">*</span>}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        placeholder={field.placeholder}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[150px] placeholder:text-slate-300 focus:bg-white focus:border-primary/30"
                                        required={field.required}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none h-14 placeholder:text-slate-300 focus:bg-white focus:border-primary/30"
                                        required={field.required}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95"
                    >
                        {props.submitButton?.text || 'Send Protocol'}
                        <Icons.ArrowRight size={20} strokeWidth={3} />
                    </button>
                </form>
            );

        case 'accordion':
            return (
                <div className="max-w-4xl mx-auto py-8 space-y-4 w-full">
                    {props.items?.map((item: any, i: number) => {
                        const isOpen = expandedAccordion === i;
                        return (
                            <div key={i} className={`group/acc border border-slate-100 rounded-[2rem] overflow-hidden bg-white hover:border-primary/20 transition-all duration-500 ${isOpen ? 'shadow-2xl shadow-primary/5' : 'shadow-sm'}`}>
                                <button
                                    onClick={() => setExpandedAccordion(isOpen ? null : i)}
                                    className="w-full p-8 flex justify-between items-center text-left hover:bg-slate-50/50 transition-all"
                                >
                                    <span className={`text-xl font-black tracking-tight transition-colors ${isOpen ? 'text-primary' : 'text-slate-900'}`}>{item.title}</span>
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary text-white rotate-45' : 'bg-slate-50 text-slate-400 rotate-0'}`}>
                                        <Icons.Plus size={20} strokeWidth={3} />
                                    </div>
                                </button>
                                <div
                                    className={`px-8 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 pb-8' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                >
                                    <div className="h-px bg-slate-50 mb-8" />
                                    <div className="text-slate-500 font-medium text-lg leading-relaxed">
                                        {item.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );

        case 'tabs':
            return (
                <div className="max-w-6xl mx-auto py-12 w-full">
                    <div className="flex bg-slate-50 p-2 rounded-[2rem] mb-10 overflow-x-auto gap-2 no-scrollbar">
                        {props.items?.map((item: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`px-10 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap ${i === activeTab ? 'bg-white text-primary shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                    <div className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-100 min-h-[300px] transition-all duration-500">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
                                    {props.items?.[activeTab]?.title}
                                </h4>
                                <div className="text-lg text-slate-500 font-medium leading-relaxed">
                                    {props.items?.[activeTab]?.content}
                                </div>
                            </div>
                            <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center text-primary flex-shrink-0 animate-pulse">
                                <Icons.Sparkles size={40} />
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'modal':
            return (
                <div className="py-12 flex justify-center w-full">
                    <button className="group/modal px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 flex items-center gap-4 active:scale-95 shadow-xl">
                        <Icons.Maximize2 size={20} className="group-hover/modal:rotate-12 transition-transform" />
                        {props.trigger?.text || 'Open Portal'}
                    </button>
                </div>
            );

        case 'counter':
            return (
                <div className="py-20 text-center flex flex-col items-center animate-in zoom-in duration-1000">
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-7xl md:text-9xl font-black tabular-nums tracking-tighter text-slate-900">
                            {props.prefix}{props.number}{props.suffix}
                        </span>
                    </div>
                    <div className="h-1 w-20 bg-primary mb-6" />
                    <span className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-slate-400">
                        {props.title}
                    </span>
                </div>
            );

        case 'testimonial':
            return (
                <div className="py-20 max-w-4xl mx-auto px-6">
                    {props.items?.map((item: any, i: number) => (
                        <div key={i} className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="mb-12 relative inline-block">
                                <div className="absolute -top-10 -left-10 text-primary/10">
                                    <Icons.Quote size={120} />
                                </div>
                                <p className="text-3xl md:text-4xl font-bold text-slate-800 leading-relaxed italic relative z-10 max-w-3xl">
                                    "{item.text}"
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                                    <img src={item.avatar} className="relative h-24 w-24 rounded-full border-4 border-white shadow-2xl object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{item.author}</h4>
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-2">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );

        default:
            return null;
    }
};

const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
};
