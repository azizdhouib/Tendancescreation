import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiPackage, FiGrid, FiSettings, FiShoppingCart, 
  FiLogOut, FiMenu, FiX, FiChevronLeft 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/admin/produits', icon: FiPackage, label: 'Produits' },
    { path: '/admin/categories', icon: FiGrid, label: 'Catégories' },
    { path: '/admin/commandes', icon: FiShoppingCart, label: 'Commandes' },
    { path: '/admin/parametres', icon: FiSettings, label: 'Paramètres' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <span className="font-semibold">Administration</span>
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <FiChevronLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://wxynwbuvmxuurbimbpbn.supabase.co/storage/v1/object/public/product-images/logo.jpg" 
                alt="Tendance&Creations"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive(item.path, item.exact)
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={isActive(item.path, item.exact) ? { backgroundColor: settings.buttonColor } : {}}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors mb-2"
          >
            <FiChevronLeft className="w-5 h-5" />
            <span className="font-medium">Voir le site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
