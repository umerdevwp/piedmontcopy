import { useEffect, useState } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import TopUtilityBar from './TopUtilityBar';
import MainNavBar from './MainNavBar';
import MobileNavigation from './MobileNavigation';

export default function Navigation() {
    const { items, fetchNavigation, isLoading } = useNavigationStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchNavigation();
    }, [fetchNavigation]);

    // Separate items by type
    const utilityItems = items.filter(item => item.type === 'utility');
    const mainItems = items.filter(item => item.type === 'main');

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    if (isLoading) {
        return (
            <header className="sticky top-0 z-50">
                <div className="bg-slate-900 h-9" />
                <div className="bg-white border-b border-slate-200 h-16 animate-pulse" />
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50">
            {/* Utility Bar - Desktop Only */}
            {utilityItems.length > 0 && <TopUtilityBar items={utilityItems} />}

            {/* Main Navigation */}
            <MainNavBar
                items={mainItems}
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isMobileMenuOpen={isMobileMenuOpen}
            />

            {/* Mobile Navigation Drawer */}
            <MobileNavigation
                items={mainItems}
                utilityItems={utilityItems}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </header>
    );
}
