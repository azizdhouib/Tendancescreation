import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiPhone } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://wxynwbuvmxuurbimbpbn.supabase.co/storage/v1/object/public/product-images/logo.jpg" 
                alt={settings.siteName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-serif text-xl font-semibold text-gray-800">
                {settings.siteName}
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              {settings.slogan}
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-primary/20 transition-colors">
                <FiInstagram className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-primary/20 transition-colors">
                <FiFacebook className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-button transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="text-sm text-gray-600 hover:text-button transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/panier" className="text-sm text-gray-600 hover:text-button transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <FiMail className="w-4 h-4" />
                <span>contact@tendancecreations.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600">
                <FiPhone className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {settings.siteName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
