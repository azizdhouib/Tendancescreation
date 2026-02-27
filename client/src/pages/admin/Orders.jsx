import { useState, useEffect } from 'react';
import { FiEye, FiX, FiTrash2 } from 'react-icons/fi';
import { ordersAPI } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast.success('Statut mis à jour');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }
    try {
      await ordersAPI.delete(orderId);
      toast.success('Commande supprimée');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const statusOptions = [
    { value: 'pending_payment', label: 'En attente de paiement', color: 'bg-orange-100 text-orange-800' },
    { value: 'paid', label: 'Payée', color: 'bg-green-100 text-green-800' },
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'En préparation', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'shipped', label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Livrée', color: 'bg-teal-100 text-teal-800' },
    { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusInfo = (status) => statusOptions.find(s => s.value === status) || statusOptions[0];

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Commandes
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Commande
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Client
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Articles
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {order.customerInfo?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customerInfo?.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length} article(s)
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {order.total?.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusInfo(order.status).color}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Voir les détails"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                Commande {selectedOrder.orderNumber}
              </h2>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  className="input-field"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-3">Informations client</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Nom:</span>
                    <span className="ml-2 text-gray-800">{selectedOrder.customerInfo?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-800">{selectedOrder.customerInfo?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Téléphone:</span>
                    <span className="ml-2 text-gray-800">{selectedOrder.customerInfo?.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ville:</span>
                    <span className="ml-2 text-gray-800">{selectedOrder.customerInfo?.city || '-'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Adresse:</span>
                    <span className="ml-2 text-gray-800">{selectedOrder.customerInfo?.address}</span>
                  </div>
                  {selectedOrder.customerInfo?.notes && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Notes:</span>
                      <span className="ml-2 text-gray-800">{selectedOrder.customerInfo.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Articles</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => {
                    const itemImage = item.image || `https://wxynwbuvmxuurbimbpbn.supabase.co/storage/v1/object/public/product-images/image${(index % 4) + 1}.jfif`;
                    const itemColor = item.selected_color || item.selectedColor;
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={itemImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          {itemColor && (
                            <div className="flex items-center gap-2 mt-1">
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: itemColor.hex }}
                              />
                              <span className="text-xs text-gray-500">{itemColor.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                          <p className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(2)} €</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-gray-800">Total</span>
                  <span 
                    className="font-bold text-2xl"
                    style={{ color: settings.buttonColor }}
                  >
                    {selectedOrder.total?.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <div className="border-t pt-4 mt-4">
                <button
                  onClick={() => deleteOrder(selectedOrder._id)}
                  className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Supprimer cette commande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
