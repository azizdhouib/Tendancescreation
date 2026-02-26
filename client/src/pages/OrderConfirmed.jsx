import { useSearchParams, Link } from 'react-router-dom';
import { FiCheck, FiMail, FiPhone } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';

const OrderConfirmed = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const { settings } = useSettings();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${settings.primaryColor}30` }}
        >
          <FiCheck 
            className="w-10 h-10"
            style={{ color: settings.buttonColor }}
          />
        </div>

        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-4">
          Commande confirmée !
        </h1>

        <p className="text-gray-600 mb-6">
          Merci pour votre commande. Nous avons bien reçu votre demande et nous vous contacterons très bientôt pour confirmer les détails.
        </p>

        {orderNumber && (
          <div 
            className="inline-block px-6 py-3 rounded-2xl mb-8"
            style={{ backgroundColor: `${settings.primaryColor}20` }}
          >
            <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
            <p 
              className="font-semibold text-lg"
              style={{ color: settings.buttonColor }}
            >
              {orderNumber}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Prochaines étapes</h3>
          <ul className="text-left space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                style={{ backgroundColor: settings.buttonColor }}
              >
                1
              </span>
              <span>Nous vérifions la disponibilité des produits</span>
            </li>
            <li className="flex items-start gap-3">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                style={{ backgroundColor: settings.buttonColor }}
              >
                2
              </span>
              <span>Vous recevez une confirmation par email ou téléphone</span>
            </li>
            <li className="flex items-start gap-3">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                style={{ backgroundColor: settings.buttonColor }}
              >
                3
              </span>
              <span>Préparation et livraison de votre bouquet</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link to="/boutique" className="btn-primary">
            Continuer mes achats
          </Link>
          <Link to="/" className="btn-secondary">
            Retour à l'accueil
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          <p className="mb-2">Des questions ?</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:contact@tendancecreations.com" className="flex items-center gap-1 hover:text-gray-700">
              <FiMail className="w-4 h-4" />
              Email
            </a>
            <a href="tel:+33123456789" className="flex items-center gap-1 hover:text-gray-700">
              <FiPhone className="w-4 h-4" />
              Téléphone
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmed;
