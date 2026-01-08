import { Link } from 'react-router-dom';
import { Globe, Building2, Users, Handshake, Phone } from 'lucide-react';
import { type NavigationItem } from './types';

const iconMap: Record<string, any> = {
    Globe, Building2, Users, Handshake, Phone
};

interface TopUtilityBarProps {
    items: NavigationItem[];
}

export default function TopUtilityBar({ items }: TopUtilityBarProps) {
    return (
        <div className="bg-slate-900 text-slate-300 text-xs">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-9">
                    {/* Left Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {items.map((item) => {
                            const IconComponent = item.icon ? iconMap[item.icon] : null;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.url || '#'}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
                                >
                                    {IconComponent && <IconComponent className="h-3 w-3" />}
                                    {item.label}
                                    {item.badge && (
                                        <span className="bg-accent text-white text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right - Help & Phone */}
                    <div className="flex items-center gap-6 ml-auto">
                        <Link to="/help" className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors font-medium">
                            <Phone className="h-3 w-3" />
                            Help & Support
                        </Link>
                        <span className="font-bold text-white"> 510-655-3030</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
