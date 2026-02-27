import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import OrderConfirmed from './pages/OrderConfirmed';
import PaymentSuccess from './pages/PaymentSuccess';

import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import Settings from './pages/admin/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Chargement..." />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <HashRouter>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 2000,
                style: {
                  borderRadius: '12px',
                  padding: '16px',
                },
              }}
              containerStyle={{
                bottom: 40,
              }}
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              } />
              <Route path="/boutique" element={
                <PublicLayout>
                  <Shop />
                </PublicLayout>
              } />
              <Route path="/produit/:id" element={
                <PublicLayout>
                  <Product />
                </PublicLayout>
              } />
              <Route path="/panier" element={
                <PublicLayout>
                  <Cart />
                </PublicLayout>
              } />
              <Route path="/commande-confirmee" element={
                <PublicLayout>
                  <OrderConfirmed />
                </PublicLayout>
              } />
              <Route path="/paiement-reussi" element={
                <PublicLayout>
                  <PaymentSuccess />
                </PublicLayout>
              } />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="produits" element={<Products />} />
                <Route path="categories" element={<Categories />} />
                <Route path="commandes" element={<Orders />} />
                <Route path="parametres" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <PublicLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="font-serif text-4xl font-bold text-gray-800 mb-4">404</h1>
                      <p className="text-gray-600 mb-6">Page non trouvée</p>
                      <a href="/" className="btn-primary">Retour à l'accueil</a>
                    </div>
                  </div>
                </PublicLayout>
              } />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </HashRouter>
  );
};

export default App;
