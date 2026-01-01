
import { CheckCircle2, ArrowRight } from 'lucide-react';
import {
    HeroSlider,
    ParallaxBlock,
    TestimonialSlider,
    PremiumList,
    ContentMedia
} from './PremiumBlocks';

const HeroBlock = ({ content }: { content: any }) => (
    <div className="relative py-32 px-8 overflow-hidden bg-slate-900 shadow-2xl" style={{ color: content.textColor || '#ffffff' }}>
        {content.bgImage && (
            <img src={content.bgImage} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: (content.overlayOpacity || 30) / 100 }} alt="" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                {content.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
                {content.subtitle}
            </p>
            {content.buttonText && (
                <button className="px-12 py-6 bg-primary text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 mx-auto uppercase tracking-widest">
                    {content.buttonText}
                    <ArrowRight className="h-6 w-6" />
                </button>
            )}
        </div>
    </div>
);

const TextBlock = ({ content }: { content: any }) => (
    <div className={`py-12 px-8 mx-auto prose prose-slate prose-xl prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed ${content.maxWidth === 'full' ? 'max-w-none' : `max-w-${content.maxWidth || '4xl'}`}`}>
        <div dangerouslySetInnerHTML={{ __html: content.body }} />
    </div>
);

const FeaturesBlock = ({ content }: { content: any }) => (
    <div className="max-w-7xl mx-auto py-20 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.items.map((item: any, idx: number) => (
            <div key={idx} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
        ))}
    </div>
);

const ImageBlock = ({ content }: { content: any }) => (
    <div className="max-w-7xl mx-auto py-12 px-8 my-8">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl">
            <img src={content.url} className="w-full h-auto object-cover max-h-[600px]" alt={content.caption} />
            {content.caption && (
                <div className="p-6 bg-white text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    {content.caption}
                </div>
            )}
        </div>
    </div>
);

const SectionBlock = ({ content }: { content: any }) => {
    // Handle simplified layoutType if present
    const columns = content.layoutType ? (
        content.layoutType === '50-50' ? [{ width: '1/2', blocks: [] }, { width: '1/2', blocks: [] }] :
            content.layoutType === '33-33-33' ? [{ width: '1/3', blocks: [] }, { width: '1/3', blocks: [] }, { width: '1/3', blocks: [] }] :
                content.layoutType === '66-33' ? [{ width: '2/3', blocks: [] }, { width: '1/3', blocks: [] }] :
                    content.layoutType === '33-66' ? [{ width: '1/3', blocks: [] }, { width: '2/3', blocks: [] }] :
                        [{ width: 'full', blocks: [] }]
    ) : content.columns;

    // Use the stored columns if they have content (legacy/advanced), otherwise use layoutType logic implies structure
    // Since we simplified the editor to just "Structure" select, we might lose nested blocks if we purely switch. 
    // For now, let's treat 'columns' as the source of truth if it exists and has blocks.
    // Actually, the new schema doesn't even edit `columns` array directly, it uses `layoutType`.
    // So we should map layoutType to grid classes.

    return (
        <div
            className={`${content.padding || 'py-12'} px-8`}
            style={{ backgroundColor: content.bgColor || 'transparent' }}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* 
                   Render the calculated columns structure.
                   We fallback to empty array to prevent crashes if something is invalid.
                */}
                {(columns || []).map((col: any, idx: number) => (
                    <div
                        key={idx}
                        className={`
                            md:col-span-${col.width === '1/2' ? 6 : col.width === '1/3' ? 4 : col.width === '2/3' ? 8 : 12}
                        `}
                    >
                        <PageRenderer blocks={col.blocks} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function PageRenderer({ blocks }: { blocks: any[] }) {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div>
            {blocks.map((block) => {
                switch (block.type) {
                    case 'hero': return <HeroBlock key={block.id} content={block.content} />;
                    case 'text': return <TextBlock key={block.id} content={block.content} />;
                    case 'features': return <FeaturesBlock key={block.id} content={block.content} />;
                    case 'image': return <ImageBlock key={block.id} content={block.content} />;
                    case 'hero-slider': return <HeroSlider key={block.id} content={block.content} />;
                    case 'parallax': return <ParallaxBlock key={block.id} content={block.content} />;
                    case 'testimonials': return <TestimonialSlider key={block.id} content={block.content} />;
                    case 'premium-list': return <PremiumList key={block.id} content={block.content} />;
                    case 'content-media': return <ContentMedia key={block.id} content={block.content} />;
                    case 'section-layout': return <SectionBlock key={block.id} content={block.content} />;
                    default: return null;
                }
            })}
        </div>
    );
}
