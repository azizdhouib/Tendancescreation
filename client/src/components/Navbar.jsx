import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { settings } = useSettings();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/boutique', label: 'Boutique' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://wxynwbuvmxuurbimbpbn.supabase.co/storage/v1/object/public/product-images/logo.jpg" 
              alt={settings.siteName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-serif text-xl font-semibold text-gray-800">
              {settings.siteName}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-button'
                    : 'text-gray-600 hover:text-button'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/panier"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <FiShoppingBag className="w-6 h-6 text-gray-700" />
              {itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-medium"
                  style={{ backgroundColor: settings.buttonColor }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary/20 text-button'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
