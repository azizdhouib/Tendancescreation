import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiMinus, FiPlus, FiChevronLeft, FiCheck } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [composition, setComposition] = useState({ bouquet: '', chocolat: '', parfum: '' });
  const { addItem } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getOne(id);
        setProduct(response.data);
        if (response.data.colors?.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }
        const bo = response.data.bouquetOptions;
        if (bo) {
          setComposition({
            bouquet: bo.bouquet?.[0] || '',
            chocolat: bo.chocolat?.[0] || '',
            parfum: bo.parfum?.[0] || ''
          });
        } else {
          setComposition({ bouquet: '', chocolat: '', parfum: '' });
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Produit non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const bouquetOpts = product?.bouquetOptions;
  const needsBouquet = bouquetOpts?.bouquet?.length > 0;
  const needsChocolat = bouquetOpts?.chocolat?.length > 0;
  const needsParfum = bouquetOpts?.parfum?.length > 0;

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Ce produit est en rupture de stock');
      return;
    }
    if (needsBouquet && !composition.bouquet) {
      toast.error('Choisissez un type de bouquet');
      return;
    }
    if (needsChocolat && !composition.chocolat) {
      toast.error('Choisissez un type de chocolat');
      return;
    }
    if (needsParfum && !composition.parfum) {
      toast.error('Choisissez un type de parfum');
      return;
    }
    const customBouquet =
      needsBouquet || needsChocolat || needsParfum
        ? {
            bouquet: composition.bouquet || null,
            chocolat: composition.chocolat || null,
            parfum: composition.parfum || null
          }
        : null;
    addItem(product, quantity, selectedColor, customBouquet);
    toast.success(`${product.name} ajouté au panier`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) return <Loading />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Produit non trouvé</h2>
          <Link to="/boutique" className="btn-primary">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const basePath = import.meta.env.BASE_URL || '/';
  const defaultImages = [`${basePath}bouquet.PNG`, `${basePath}cadeau enfant.PNG`];
  const images = product.images?.length > 0 
    ? product.images 
    : [defaultImages[product._id?.charCodeAt(0) % 2 || 0]];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link 
          to="/boutique"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-8"
        >
          <FiChevronLeft className="w-4 h-4" />
          Retour à la boutique
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-sm">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-button shadow-md' 
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <p 
              className="text-sm font-medium mb-2"
              style={{ color: settings.buttonColor }}
            >
              {product.category?.name}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span 
                className="text-3xl font-bold"
                style={{ color: settings.buttonColor }}
              >
                {product.price.toFixed(2)} €
              </span>
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  En stock ({product.stock})
                </span>
              ) : (
                <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Rupture de stock
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Composition bouquet (catégorie composer) */}
            {(needsBouquet || needsChocolat || needsParfum) && (
              <div className="mb-8 space-y-4">
                <h3 className="font-medium text-gray-800">Composez votre bouquet</h3>
                {needsBouquet && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Type de bouquet</label>
                    <select
                      value={composition.bouquet}
                      onChange={(e) => setComposition({ ...composition, bouquet: e.target.value })}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Choisir…</option>
                      {bouquetOpts.bouquet.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
                {needsChocolat && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Type de chocolat</label>
                    <select
                      value={composition.chocolat}
                      onChange={(e) => setComposition({ ...composition, chocolat: e.target.value })}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Choisir…</option>
                      {bouquetOpts.chocolat.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
                {needsParfum && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Type de parfum</label>
                    <select
                      value={composition.parfum}
                      onChange={(e) => setComposition({ ...composition, parfum: e.target.value })}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Choisir…</option>
                      {bouquetOpts.parfum.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-medium text-gray-800 mb-3">
                  Couleur dominante: <span style={{ color: settings.buttonColor }}>{selectedColor?.name}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor?.hex === color.hex 
                          ? 'border-gray-800 scale-110' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.hex === color.hex && (
                        <FiCheck className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-800 mb-3">Quantité</h3>
              <div className="inline-flex items-center bg-white rounded-full border border-gray-200">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus className="w-5 h-5" />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="p-3 hover:bg-gray-100 rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-white font-medium text-lg transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ backgroundColor: settings.buttonColor }}
            >
              <FiShoppingBag className="w-5 h-5" />
              Ajouter au panier
            </button>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${settings.primaryColor}30` }}
                  >
                    <span>🎁</span>
                  </div>
                  Emballage cadeau inclus
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${settings.primaryColor}30` }}
                  >
                    <span>🚚</span>
                  </div>
                  Livraison soignée
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
