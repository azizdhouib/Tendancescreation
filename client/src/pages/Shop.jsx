import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import { productsAPI, categoriesAPI } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});
  const { settings } = useSettings();

  const selectedCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 12 };
        if (selectedCategory) params.category = selectedCategory;
        
        const response = await productsAPI.getAll(params);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (categoryId) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    params.page = page;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCategoryName = categories.find(c => c._id === selectedCategory)?.name;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Notre Boutique
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de bouquets personnalisés, créés avec passion pour vos moments précieux.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Catégories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                    !selectedCategory 
                      ? 'text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={!selectedCategory ? { backgroundColor: settings.buttonColor } : {}}
                >
                  Tous les produits
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                      selectedCategory === category._id 
                        ? 'text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={selectedCategory === category._id ? { backgroundColor: settings.buttonColor } : {}}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm"
            >
              <FiFilter className="w-5 h-5" />
              <span>Filtres</span>
              {selectedCategory && (
                <span 
                  className="px-2 py-0.5 rounded-full text-xs text-white"
                  style={{ backgroundColor: settings.buttonColor }}
                >
                  1
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filter Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filtres</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      !selectedCategory 
                        ? 'text-white' 
                        : 'text-gray-600 bg-gray-100'
                    }`}
                    style={!selectedCategory ? { backgroundColor: settings.buttonColor } : {}}
                  >
                    Tous les produits
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category._id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        selectedCategory === category._id 
                          ? 'text-white' 
                          : 'text-gray-600 bg-gray-100'
                      }`}
                      style={selectedCategory === category._id ? { backgroundColor: settings.buttonColor } : {}}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active filter */}
            {selectedCategoryName && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">Filtre actif:</span>
                <span 
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: settings.buttonColor }}
                >
                  {selectedCategoryName}
                  <button 
                    onClick={() => handleCategoryChange('')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}

            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">
                  Aucun produit trouvé dans cette catégorie.
                </p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-full font-medium transition-colors ${
                          currentPage === i + 1
                            ? 'text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                        style={currentPage === i + 1 ? { backgroundColor: settings.buttonColor } : {}}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
