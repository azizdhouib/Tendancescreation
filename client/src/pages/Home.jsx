import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiGift, FiHeart, FiTruck, FiStar } from 'react-icons/fi';
import { productsAPI, categoriesAPI } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loading from '../components/Loading';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll({ featured: true, limit: 4 }),
          categoriesAPI.getAll()
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const steps = [
    {
      icon: FiGift,
      title: 'Choisissez',
      description: 'Sélectionnez parmi nos bouquets uniques'
    },
    {
      icon: FiHeart,
      title: 'Personnalisez',
      description: 'Choisissez les couleurs et options'
    },
    {
      icon: FiTruck,
      title: 'Recevez',
      description: 'Livraison soignée à domicile'
    }
  ];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)` 
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Des bouquets{' '}
                <span style={{ color: settings.buttonColor }}>personnalisés</span>{' '}
                pour des cadeaux uniques
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                {settings.slogan}. Chocolat, parfum ou tapis de prière, créez le cadeau parfait pour vos proches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/boutique" className="btn-primary text-center">
                  Découvrir la boutique
                </Link>
                <Link to="/boutique" className="btn-secondary text-center">
                  Voir les collections
                </Link>
              </div>
            </div>
            <div className="relative">
              <div 
                className="absolute -top-8 -right-8 w-64 h-64 rounded-full opacity-30 blur-3xl"
                style={{ backgroundColor: settings.primaryColor }}
              />
              <div 
                className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-30 blur-3xl"
                style={{ backgroundColor: settings.secondaryColor }}
              />
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/bouquet.PNG"
                  alt="Bouquet élégant"
                  className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                <img
                  src="/cadeau enfant.PNG"
                  alt="Cadeau enfant"
                  className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Nos Collections</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Découvrez nos trois univers de bouquets personnalisés, conçus avec amour pour offrir des cadeaux mémorables.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section 
        className="py-20"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${settings.primaryColor}30` }}
                >
                  <step.icon 
                    className="w-7 h-7"
                    style={{ color: settings.buttonColor }}
                  />
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-semibold text-sm"
                  style={{ backgroundColor: settings.buttonColor }}
                >
                  {index + 1}
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-800">
                  Coups de coeur
                </h2>
                <p className="text-gray-600 mt-2">
                  Nos créations les plus appréciées
                </p>
              </div>
              <Link 
                to="/boutique"
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all duration-200"
                style={{ color: settings.buttonColor }}
              >
                Voir tout
                <span>→</span>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/boutique" className="btn-primary">
                Voir tous les produits
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial/Trust Section */}
      <section 
        className="py-20"
        style={{ backgroundColor: `${settings.primaryColor}15` }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className="w-6 h-6 fill-current"
                style={{ color: settings.accentColor }}
              />
            ))}
          </div>
          <blockquote className="font-serif text-2xl md:text-3xl text-gray-800 italic mb-6">
            "Un cadeau magnifique qui a touché le coeur de ma mère. La qualité et l'attention aux détails sont exceptionnelles."
          </blockquote>
          <p className="text-gray-600 font-medium">
            — Fatima K., cliente satisfaite
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
