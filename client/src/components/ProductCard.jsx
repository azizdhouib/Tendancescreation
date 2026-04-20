import { Link } from 'react-router-dom';
import { FiShoppingBag, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { settings } = useSettings();

  const hasComposition =
    product.bouquetOptions &&
    (product.bouquetOptions.bouquet?.length > 0 ||
      product.bouquetOptions.chocolat?.length > 0 ||
      product.bouquetOptions.parfum?.length > 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasComposition) {
      toast('Personnalisez ce bouquet sur la fiche produit', { icon: '✨' });
      return;
    }
    const defaultColor = product.colors?.[0] || null;
    addItem(product, 1, defaultColor, null);
    toast.success(`${product.name} ajouté au panier`);
  };

  const basePath = import.meta.env.BASE_URL || '/';
  const defaultImages = [`${basePath}bouquet.PNG`, `${basePath}cadeau enfant.PNG`];
  const imageUrl = product.images?.[0] 
    ? product.images[0] 
    : defaultImages[product._id?.charCodeAt(0) % 2 || 0];

  return (
    <div className="card group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {(product.isFeatured || product.is_featured) && (
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: settings.accentColor }}
          >
            Coup de coeur
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-800">
              Rupture de stock
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <Link
            to={`/produit/${product._id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white py-2 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            Voir
          </Link>
          {product.stock > 0 && !hasComposition && (
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: settings.buttonColor }}
            >
              <FiShoppingBag className="w-4 h-4" />
              Ajouter
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">
          {product.category?.name || 'Catégorie'}
        </p>
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span 
            className="font-semibold text-lg"
            style={{ color: settings.buttonColor }}
          >
            {product.price?.toFixed(2)} €
          </span>
          {product.colors?.length > 0 && (
            <div className="flex -space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-[8px] text-gray-600">+{product.colors.length - 3}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
