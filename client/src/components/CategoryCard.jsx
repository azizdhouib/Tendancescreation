import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const basePath = import.meta.env.BASE_URL || '/';

const categoryImages = {
  'bouquet-chocolat': `${basePath}bouquet.PNG`,
  'bouquet-parfum': `${basePath}cadeau enfant.PNG`,
  'bouquet-tapis-de-priere': `${basePath}cadeau enfant.PNG`
};

const CategoryCard = ({ category }) => {
  const { settings } = useSettings();
  
  const imageUrl = category.image 
    ? category.image 
    : categoryImages[category.slug] || `${basePath}bouquet.PNG`;

  return (
    <Link 
      to={`/boutique?category=${category._id}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
    >
      <img
        src={imageUrl}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
        <h3 className="font-serif text-xl md:text-2xl font-semibold text-white text-center mb-2">
          {category.name}
        </h3>
        <span 
          className="px-4 py-2 rounded-full text-sm font-medium text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          style={{ backgroundColor: settings.buttonColor }}
        >
          Découvrir
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
