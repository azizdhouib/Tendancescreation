# Site E-commerce de Bouquets Personnalisés

Un site e-commerce élégant et moderne pour une boutique vendant des bouquets personnalisés composés de chocolat, parfum et tapis de prière musulman.

## 🌸 Aperçu

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Base de données**: MongoDB
- **Authentification**: JWT

## 🎨 Fonctionnalités

### Site public
- ✅ Page d'accueil avec hero section et présentation des catégories
- ✅ Page boutique avec filtres par catégorie
- ✅ Page produit détaillée avec sélection de couleurs
- ✅ Panier avec gestion des quantités
- ✅ Formulaire de commande
- ✅ Design responsive et animations élégantes

### Back-office Admin
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des produits (CRUD complet avec upload d'images)
- ✅ Gestion des catégories
- ✅ Gestion des commandes avec mise à jour du statut
- ✅ **Personnalisation des couleurs du site en temps réel**
- ✅ Authentification JWT sécurisée

### Fonctionnalités bonus
- ✅ Gestion des stocks
- ✅ Système de mise en avant produit (featured)
- ✅ Couleurs dynamiques injectées depuis le back-office

## 📋 Prérequis

- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn

## 🚀 Installation

### 1. Cloner ou télécharger le projet

```bash
cd "boutique moez"
```

### 2. Configuration du Backend

```bash
cd server

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Modifier le fichier .env selon vos besoins:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/boutique-moez
# - JWT_SECRET=votre_secret_jwt_super_securise

# Initialiser la base de données avec des données de test
npm run seed
```

### 3. Configuration du Frontend

```bash
cd ../client

# Installer les dépendances
npm install
```

## 🏃 Lancement

### Démarrer MongoDB

Assurez-vous que MongoDB est en cours d'exécution sur votre machine.

### Démarrer le Backend

```bash
cd server
npm run dev
```

Le serveur démarre sur http://localhost:5000

### Démarrer le Frontend

Dans un nouveau terminal:

```bash
cd client
npm run dev
```

Le site est accessible sur http://localhost:3000

## 🔐 Accès Admin

Après avoir exécuté `npm run seed` dans le dossier server:

- **URL**: http://localhost:3000/admin
- **Email**: admin@boutiquemoez.com
- **Mot de passe**: admin123

## 📁 Structure du Projet

```
boutique moez/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── context/        # Contextes React (Cart, Auth, Settings)
│   │   ├── pages/          # Pages du site
│   │   │   └── admin/      # Pages d'administration
│   │   ├── services/       # Services API
│   │   ├── App.jsx         # Application principale
│   │   └── main.jsx        # Point d'entrée
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Express
│   ├── config/             # Configuration (DB)
│   ├── controllers/        # Logique métier
│   ├── middleware/         # Middlewares (auth, upload)
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes API
│   ├── uploads/            # Images uploadées
│   ├── index.js            # Point d'entrée serveur
│   ├── seed.js             # Script d'initialisation
│   └── package.json
│
└── README.md
```

## 🎨 Personnalisation des Couleurs

Le site utilise un système de couleurs dynamique. Depuis le back-office (`/admin/parametres`), vous pouvez modifier:

- **Couleur principale**: Éléments décoratifs
- **Couleur secondaire**: Arrière-plans légers
- **Couleur des boutons**: Boutons et liens
- **Couleur de fond**: Arrière-plan général
- **Couleur d'accent**: Badges et mises en avant

Les couleurs sont stockées en base de données et appliquées dynamiquement via des variables CSS.

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription admin
- `GET /api/auth/me` - Profil utilisateur

### Produits
- `GET /api/products` - Liste des produits (avec filtres)
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/:id` - Modifier une catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes (admin)
- `PUT /api/orders/:id/status` - Mettre à jour le statut (admin)

### Paramètres du site
- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Modifier les paramètres (admin)

## 🛠 Technologies Utilisées

### Frontend
- React 18
- React Router DOM 6
- Tailwind CSS
- Axios
- React Icons
- React Hot Toast

### Backend
- Express.js
- Mongoose (MongoDB ODM)
- JWT (jsonwebtoken)
- Bcrypt.js
- Multer (upload fichiers)
- CORS

## 📝 Notes

- Les images sont stockées localement dans le dossier `server/uploads/`
- Pour la production, pensez à utiliser un service de stockage cloud (AWS S3, Cloudinary, etc.)
- Le système de paiement n'est pas implémenté (commande sans paiement)
- Changez le `JWT_SECRET` en production

## 👤 Auteur


## 📄 Licence

Ce projet est sous licence MIT.
