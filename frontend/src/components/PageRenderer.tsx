
import { CheckCircle2, ArrowRight } from 'lucide-react';
import {
    HeroSlider,
    ParallaxBlock,
    TestimonialSlider,
    PremiumList,
    ContentMedia
} from './PremiumBlocks';

const HeroBlock = ({ content }: { content: any }) => (
    <div className="relative py-24 px-8 overflow-hidden bg-slate-900 text-white rounded-[3rem] my-8 shadow-2xl">
        {content.bgImage && (
            <img src={content.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                {content.title}
            </h1>
            <p className="text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                {content.subtitle}
            </p>
            {content.buttonText && (
                <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 mx-auto uppercase tracking-widest">
                    {content.buttonText}
                    <ArrowRight className="h-5 w-5" />
                </button>
            )}
        </div>
    </div>
);

const TextBlock = ({ content }: { content: any }) => (
    <div className="py-12 px-8 max-w-4xl mx-auto prose prose-slate prose-xl prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: content.body }} />
    </div>
);

const FeaturesBlock = ({ content }: { content: any }) => (
    <div className="py-20 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
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
    <div className="py-12 px-8 my-8">
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            {content.columns.map((col: any, idx: number) => (
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
    );
};

export default function PageRenderer({ blocks }: { blocks: any[] }) {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className="space-y-4">
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
