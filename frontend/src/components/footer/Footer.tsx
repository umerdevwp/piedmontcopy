import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import type { NavigationItem } from '../navigation/types';

export default function Footer() {
    const { footerItems, fetchFooter } = useNavigationStore();
    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchFooter();
        // Fetch global settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Failed to load settings', err));
    }, [fetchFooter]);

    const getColumns = () => {
        return footerItems.filter((item: NavigationItem) => !item.parentId).sort((a: NavigationItem, b: NavigationItem) => a.position - b.position);
    };

    return (
        <footer className="bg-slate-900 text-slate-300 py-16 px-4 border-t border-slate-800">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 font-black text-2xl text-white">
                        <Printer className="h-8 w-8 text-accent" />
                        <span>PiedmontCopy</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                        {settings['site_description'] || 'Premium printing services for your business needs. Quality you can trust, delivered with speed and precision.'}
                    </p>
                    <div className="flex gap-4">
                        {settings['social_facebook'] && (
                            <a href={settings['social_facebook']} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                        )}
                        {settings['social_twitter'] && (
                            <a href={settings['social_twitter']} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                        )}
                        {settings['social_instagram'] && (
                            <a href={settings['social_instagram']} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                        )}
                        {settings['social_linkedin'] && (
                            <a href={settings['social_linkedin']} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Dynamic Columns */}
                {getColumns().map((col: NavigationItem) => (
                    <div key={col.id}>
                        <h4 className="font-black text-white mb-6 uppercase text-xs tracking-[0.2em]">{col.label}</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {col.children?.map((link: NavigationItem) => (
                                <li key={link.id}>
                                    <Link
                                        to={link.url || '#'}
                                        className="hover:text-primary hover:translate-x-1 transition-all inline-flex items-center gap-2"
                                    >
                                        {link.description === 'icon-phone' && <Phone className="h-3 w-3" />}
                                        {link.description === 'icon-mail' && <Mail className="h-3 w-3" />}
                                        {link.description === 'icon-map' && <MapPin className="h-3 w-3" />}
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

            </div>

            {/* Bottom Bar */}
            <div className="container mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <p>{settings['footer_copyright'] || `© ${new Date().getFullYear()} PiedmontCopy. All rights reserved.`}</p>
                <div className="flex gap-6">
                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
