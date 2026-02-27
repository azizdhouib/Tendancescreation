import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';
import { ordersAPI } from '../services/api';
import Loading from '../components/Loading';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const confirmPayment = async () => {
      if (orderId) {
        try {
          await ordersAPI.confirmPayment(orderId);
          setConfirmed(true);
        } catch (error) {
          console.error('Error confirming payment:', error);
        }
      }
      setLoading(false);
    };

    confirmPayment();
  }, [orderId]);

  if (loading) {
    return <Loading fullScreen message="Confirmation du paiement..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#10B98120' }}
        >
          <FiCheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-4">
          Paiement réussi !
        </h1>

        <p className="text-gray-600 mb-8">
          Merci pour votre commande ! Vous allez recevoir un email de confirmation avec les détails de votre commande.
        </p>

        <div 
          className="bg-white rounded-2xl p-6 shadow-sm mb-8"
          style={{ borderLeft: `4px solid ${settings.buttonColor}` }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${settings.primaryColor}30` }}
            >
              <FiPackage className="w-6 h-6" style={{ color: settings.buttonColor }} />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Votre commande</p>
              <p className="font-semibold text-gray-800">
                {orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : 'En cours de traitement'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            to="/boutique"
            className="block w-full py-4 rounded-full text-white font-medium transition-all hover:shadow-lg"
            style={{ backgroundColor: settings.buttonColor }}
          >
            Continuer mes achats
          </Link>
          <Link 
            to="/"
            className="block w-full py-4 rounded-full border border-gray-200 text-gray-700 font-medium transition-all hover:bg-gray-50"
          >
            Retour à l'accueil
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Une question ? Contactez-nous à{' '}
          <a 
            href="mailto:contact@tendancecreations.com" 
            className="underline"
            style={{ color: settings.buttonColor }}
          >
            contact@tendancecreations.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
