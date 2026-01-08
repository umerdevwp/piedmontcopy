
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DesignToolPage from './pages/DesignToolPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AboutPage from './pages/AboutPage';
import SearchResultsPage from './pages/SearchResultsPage';

import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminThemeSettingsPage from './pages/admin/AdminThemeSettingsPage';
import AdminCMSPage from './pages/admin/AdminCMSPage';
import AdminPageEditor from './pages/admin/AdminPageEditor';
import AdminNavigationPage from './pages/admin/AdminNavigationPage';
import DynamicPage from './pages/DynamicPage';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:slug" element={<ProductDetailsPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="design-tool" element={<DesignToolPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="p/:slug" element={<DynamicPage />} />
          <Route path="*" element={<div className="p-20 text-center font-bold text-2xl">404 - Not Found</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="customers" element={<AdminUsersPage />} />
          <Route path="content" element={<AdminCMSPage />} />
          <Route path="content/new" element={<AdminPageEditor />} />
          <Route path="content/edit/:id" element={<AdminPageEditor />} />
          <Route path="navigation" element={<AdminNavigationPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="settings/theme" element={<AdminThemeSettingsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
