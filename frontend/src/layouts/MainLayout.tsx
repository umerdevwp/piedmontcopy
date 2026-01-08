import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navigation } from '../components/navigation';
import Footer from '../components/footer/Footer';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-gray-50">
            <Toaster position="top-center" richColors />

            {/* New Navigation System */}
            <Navigation />

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
