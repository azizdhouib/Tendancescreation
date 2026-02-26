require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const SiteSettings = require('./models/SiteSettings');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await SiteSettings.deleteMany({});

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@boutiquemoez.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin créé:', admin.email);

    await SiteSettings.create({
      primaryColor: '#E8B4B8',
      secondaryColor: '#EDD6D1',
      buttonColor: '#D4A574',
      backgroundColor: '#FDF8F5',
      accentColor: '#C9A87C',
      siteName: 'Tendance&Creations',
      slogan: 'Des bouquets personnalisés pour des cadeaux uniques'
    });
    console.log('Paramètres du site créés');

    const categories = await Category.create([
      {
        name: 'Bouquet Chocolat',
        description: 'Bouquets gourmands composés de délicieux chocolats artisanaux',
        image: ''
      },
      {
        name: 'Bouquet Parfum',
        description: 'Bouquets élégants avec parfums de luxe',
        image: ''
      },
      {
        name: 'Bouquet Tapis de Prière',
        description: 'Bouquets spirituels avec tapis de prière musulman',
        image: ''
      }
    ]);
    console.log('Catégories créées');

    const products = await Product.create([
      {
        name: 'Bouquet Douceur Chocolatée',
        description: 'Un magnifique bouquet composé de chocolats fins belges, enveloppé dans du papier kraft et orné de rubans satinés. Parfait pour offrir à une personne gourmande.',
        price: 89.99,
        category: categories[0]._id,
        colors: [
          { name: 'Rose Poudré', hex: '#E8B4B8' },
          { name: 'Beige Doré', hex: '#D4A574' },
          { name: 'Blanc Crème', hex: '#FDF8F5' }
        ],
        stock: 15,
        isFeatured: true,
        images: []
      },
      {
        name: 'Bouquet Prestige Cacao',
        description: 'Une création d\'exception avec une sélection de chocolats noirs et au lait premium. Présentation luxueuse dans une boîte dorée.',
        price: 129.99,
        category: categories[0]._id,
        colors: [
          { name: 'Or', hex: '#C9A87C' },
          { name: 'Champagne', hex: '#F7E7CE' }
        ],
        stock: 10,
        isFeatured: true,
        images: []
      },
      {
        name: 'Bouquet Senteur Royale',
        description: 'Un bouquet élégant contenant un parfum de créateur accompagné de fleurs séchées et de touches dorées.',
        price: 159.99,
        category: categories[1]._id,
        colors: [
          { name: 'Rose Ancien', hex: '#C4A4A4' },
          { name: 'Doré', hex: '#D4AF37' }
        ],
        stock: 8,
        isFeatured: true,
        images: []
      },
      {
        name: 'Bouquet Parfum Oriental',
        description: 'Une composition raffinée avec un parfum aux notes orientales, présentée dans un écrin de soie.',
        price: 189.99,
        category: categories[1]._id,
        colors: [
          { name: 'Bordeaux', hex: '#722F37' },
          { name: 'Or Rose', hex: '#B76E79' }
        ],
        stock: 5,
        isFeatured: false,
        images: []
      },
      {
        name: 'Bouquet Spirituel',
        description: 'Un bouquet unique combinant un tapis de prière de qualité supérieure avec des éléments décoratifs raffinés. Idéal pour l\'Aïd ou le Ramadan.',
        price: 119.99,
        category: categories[2]._id,
        colors: [
          { name: 'Vert Émeraude', hex: '#50C878' },
          { name: 'Blanc Nacré', hex: '#FDEEF4' },
          { name: 'Bleu Nuit', hex: '#191970' }
        ],
        stock: 12,
        isFeatured: true,
        images: []
      },
      {
        name: 'Bouquet Bénédiction',
        description: 'Une création spéciale avec tapis de prière brodé, chapelet et dates premium. Un cadeau significatif pour les occasions religieuses.',
        price: 149.99,
        category: categories[2]._id,
        colors: [
          { name: 'Turquoise', hex: '#40E0D0' },
          { name: 'Ivoire', hex: '#FFFFF0' }
        ],
        stock: 7,
        isFeatured: false,
        images: []
      }
    ]);
    console.log('Produits créés:', products.length);

    console.log('\n✅ Base de données initialisée avec succès!');
    console.log('\n📧 Connexion admin:');
    console.log('   Email: admin@boutiquemoez.com');
    console.log('   Mot de passe: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

seedData();
