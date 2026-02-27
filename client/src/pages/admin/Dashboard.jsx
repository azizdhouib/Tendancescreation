import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiGrid, FiTrendingUp } from 'react-icons/fi';
import { productsAPI, categoriesAPI, ordersAPI } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import Loading from '../../components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          productsAPI.getAllAdmin(),
          categoriesAPI.getAllAdmin(),
          ordersAPI.getAll()
        ]);

        const orders = ordersRes.data;
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);

        setStats({
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          orders: orders.length,
          revenue
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { 
      label: 'Produits', 
      value: stats.products, 
      icon: FiPackage, 
      link: '/admin/produits',
      color: settings.primaryColor
    },
    { 
      label: 'Catégories', 
      value: stats.categories, 
      icon: FiGrid, 
      link: '/admin/categories',
      color: settings.secondaryColor
    },
    { 
      label: 'Commandes', 
      value: stats.orders, 
      icon: FiShoppingCart, 
      link: '/admin/commandes',
      color: settings.buttonColor
    },
    { 
      label: 'Revenus', 
      value: `${stats.revenue.toFixed(2)} €`, 
      icon: FiTrendingUp, 
      link: '/admin/commandes',
      color: settings.accentColor
    },
  ];

  const statusColors = {
    pending_payment: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-teal-100 text-teal-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending_payment: 'En attente de paiement',
    paid: 'Payée',
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Tableau de bord
      </h1>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}30` }}
              >
                <stat.icon 
                  className="w-6 h-6"
                  style={{ color: stat.color }}
                />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg text-gray-800">
              Commandes récentes
            </h2>
            <Link 
              to="/admin/commandes"
              className="text-sm font-medium"
              style={{ color: settings.buttonColor }}
            >
              Voir tout
            </Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucune commande pour le moment
          </div>
        ) : (
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
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customerInfo?.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {order.total?.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
