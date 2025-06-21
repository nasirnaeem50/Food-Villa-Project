// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import SearchResults from './pages/SearchResults';
import SearchPage from './pages/SearchPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginModal from './components/LoginModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/admin/AdminDashboard';
import FoodManagement from './pages/admin/FoodManagement';
import AddFoodItem from './pages/admin/AddFoodItem';
import OrderManagement from './pages/admin/OrderManagement';
import ProtectedRoute from './components/ProtectedRoute';
import StaffManagement from './pages/admin/StaffManagement';
import UserManagement from './pages/admin/UserManagement';
import CustomerList from './pages/admin/CustomerList';
import AddUser from './pages/admin/AddUser';
import PromotionManagement from './pages/admin/PromotionManagement';
import PromotionForm from './pages/admin/PromotionForm';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import Settings from './pages/admin/Settings';
// CHANGE: Import useSettings and SettingsProvider
import { SettingsProvider, useSettings } from './context/SettingsContext';
import LoadingSpinner from './components/LoadingSpinner';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const PublicLayout = ({ onLoginClick }) => {
  return (
    <>
      <Header onLoginClick={onLoginClick} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const AdminLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

const toastConfig = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "colored"
};

const AppContent = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  // CHANGE: Get settings from the context now.
  const { settings, loading } = useSettings();

  // REMOVE: All local state and effects for settings have been moved to the context provider.
  // const [settings, setSettings] = useState(...)
  // useEffect(() => { ... // apply theme }, [settings.theme]);
  // useEffect(() => { ... // save to localStorage }, [settings]);

  // Check for maintenance mode
  useEffect(() => {
    if (settings.maintenanceMode) {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/admin') && !currentPath.includes('login')) {
        // A simple redirect might be better to avoid full page reloads.
        // For now, this preserves original behavior.
        window.location.href = '/admin/dashboard';
      }
    }
  }, [settings.maintenanceMode]);

  // ADD: A loading state while settings are loaded for the first time.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
      <Router>
        <div className={`App min-h-screen flex flex-col transition-colors duration-200 ${
          settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <ToastContainer {...toastConfig} />
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout onLoginClick={() => setShowLoginModal(true)} />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="search-page" element={<SearchPage />} />
              <Route path="cart" element={<Cart />} />
              {/* CHANGE: Simplified the checkout route. The component will get settings from context. */}
              <Route path="checkout" element={<Checkout />} />
              <Route path="profile" element={<Profile />} />
              <Route path="order/:id" element={<OrderDetails />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Admin Routes (Your existing admin routes are preserved) */}
            <Route path="/admin" element={<AdminLayout />}>
               <Route path="dashboard" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <AdminDashboard /> </ProtectedRoute> } />
              <Route path="food-management" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <FoodManagement /> </ProtectedRoute> } />
              <Route path="food-management/add" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <AddFoodItem /> </ProtectedRoute> } />
              <Route path="food-management/edit/:id" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <AddFoodItem /> </ProtectedRoute> } />
              <Route path="order-management" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <OrderManagement /> </ProtectedRoute> } />
              <Route path="order-management/:id" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <OrderDetails adminView={true} /> </ProtectedRoute> } />
              <Route path="promotions" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <PromotionManagement /> </ProtectedRoute> } />
              <Route path="promotions/add" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <PromotionForm /> </ProtectedRoute> } />
              <Route path="promotions/edit/:id" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <PromotionForm /> </ProtectedRoute> } />
              <Route path="analytics" element={ <ProtectedRoute allowedRoles={['admin', 'moderator']}> <AnalyticsDashboard /> </ProtectedRoute> } />
              <Route path="staff" element={ <ProtectedRoute allowedRoles={['admin']}> <StaffManagement /> </ProtectedRoute> } />
              <Route path="users" element={ <ProtectedRoute allowedRoles={['admin']}> <UserManagement /> </ProtectedRoute> } />
              <Route path="users/add" element={ <ProtectedRoute allowedRoles={['admin']}> <AddUser /> </ProtectedRoute> } />
              <Route path="customers" element={ <ProtectedRoute allowedRoles={['admin']}> <CustomerList /> </ProtectedRoute> } />
              <Route path="settings" element={ <ProtectedRoute allowedRoles={['admin']}> <Settings /> </ProtectedRoute> } />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
          />
        </div>
      </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      {/* CHANGE: SettingsProvider now wraps CartProvider and AppContent */}
      <SettingsProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;