import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor
        })),
        customerInfo
      };

      const response = await ordersAPI.create(orderData);
      clearCart();
      toast.success('Commande envoyée avec succès!');
      navigate(`/commande-confirmee?order=${response.data.orderNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${settings.primaryColor}30` }}
          >
            <FiShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-gray-800 mb-4">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 mb-8">
            Découvrez nos magnifiques bouquets personnalisés
          </p>
          <Link to="/boutique" className="btn-primary">
            Voir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Votre Panier
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={`${item.productId}-${item.selectedColor?.hex}`}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || (item.productId?.charCodeAt(0) % 2 === 0 ? '/bouquet.PNG' : '/cadeau enfant.PNG')}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 mb-1 truncate">
                      {item.name}
                    </h3>
                    {item.selectedColor && (
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="text-sm text-gray-500">
                          {item.selectedColor.name}
                        </span>
                      </div>
                    )}
                    <p 
                      className="font-semibold text-lg"
                      style={{ color: settings.buttonColor }}
                    >
                      {item.price.toFixed(2)} €
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="inline-flex items-center bg-gray-100 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedColor?.hex, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-gray-200 rounded-l-full disabled:opacity-50"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedColor?.hex, item.quantity + 1)}
                          className="p-2 hover:bg-gray-200 rounded-r-full"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.selectedColor?.hex)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-semibold text-lg text-gray-800 mb-4">
                Récapitulatif
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span style={{ color: settings.buttonColor }}>
                      {total.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-medium transition-all hover:shadow-lg"
                  style={{ backgroundColor: settings.buttonColor }}
                >
                  Commander
                  <FiArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom complet *"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone *"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Adresse *"
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Ville"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                    className="input-field"
                  />
                  <textarea
                    placeholder="Notes de commande (optionnel)"
                    rows="3"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    className="input-field resize-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full text-white font-medium transition-all hover:shadow-lg disabled:opacity-70"
                    style={{ backgroundColor: settings.buttonColor }}
                  >
                    {loading ? 'Envoi en cours...' : 'Confirmer la commande'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full py-3 text-gray-600 hover:text-gray-800"
                  >
                    Retour
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
