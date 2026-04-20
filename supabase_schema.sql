-- Tables pour Tendance&Creations

-- Table des catégories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  bouquet_options JSONB DEFAULT NULL,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE,
  items JSONB NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT DEFAULT '',
  customer_notes TEXT DEFAULT '',
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres du site
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_color TEXT DEFAULT '#9B4D96',
  secondary_color TEXT DEFAULT '#E85A8B',
  button_color TEXT DEFAULT '#D4548A',
  background_color TEXT DEFAULT '#FDF5F8',
  accent_color TEXT DEFAULT '#F5A623',
  site_name TEXT DEFAULT 'Tendance&Creations',
  slogan TEXT DEFAULT 'Des bouquets personnalisés pour des cadeaux uniques',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour générer le numéro de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'CMD-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || (SELECT COUNT(*) + 1 FROM orders);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer le numéro de commande automatiquement
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Fonction pour générer le slug automatiquement
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer le slug des catégories
CREATE TRIGGER set_category_slug
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();

-- Activer Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read settings" ON site_settings FOR SELECT USING (true);

-- Policies pour insertion publique (commandes)
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Policies pour les admins (tout accès)
CREATE POLICY "Allow admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insérer les données initiales
INSERT INTO site_settings (primary_color, secondary_color, button_color, background_color, accent_color, site_name, slogan)
VALUES ('#9B4D96', '#E85A8B', '#D4548A', '#FDF5F8', '#F5A623', 'Tendance&Creations', 'Des bouquets personnalisés pour des cadeaux uniques');

INSERT INTO categories (name, description) VALUES
  ('Bouquet Chocolat', 'Bouquets gourmands composés de délicieux chocolats artisanaux'),
  ('Bouquet Parfum', 'Bouquets élégants avec parfums de luxe'),
  ('Bouquet Tapis de Prière', 'Bouquets spirituels avec tapis de prière musulman'),
  ('Composer son bouquet', 'Choisissez le type de bouquet, de chocolat et de parfum');

-- Insérer les produits (on récupère les IDs des catégories)
DO $$
DECLARE
  cat_chocolat UUID;
  cat_parfum UUID;
  cat_tapis UUID;
  cat_composer UUID;
BEGIN
  SELECT id INTO cat_chocolat FROM categories WHERE name = 'Bouquet Chocolat';
  SELECT id INTO cat_parfum FROM categories WHERE name = 'Bouquet Parfum';
  SELECT id INTO cat_tapis FROM categories WHERE name = 'Bouquet Tapis de Prière';
  SELECT id INTO cat_composer FROM categories WHERE name = 'Composer son bouquet';

  INSERT INTO products (name, description, price, category_id, colors, bouquet_options, stock, is_featured) VALUES
    ('Bouquet Douceur Chocolatée', 'Un magnifique bouquet composé de chocolats fins belges, enveloppé dans du papier kraft et orné de rubans satinés.', 89.99, cat_chocolat, '[{"name": "Rose Poudré", "hex": "#E8B4B8"}, {"name": "Beige Doré", "hex": "#D4A574"}]', NULL, 15, true),
    ('Bouquet Prestige Cacao', 'Une création d''exception avec une sélection de chocolats noirs et au lait premium.', 129.99, cat_chocolat, '[{"name": "Or", "hex": "#C9A87C"}, {"name": "Champagne", "hex": "#F7E7CE"}]', NULL, 10, true),
    ('Bouquet Senteur Royale', 'Un bouquet élégant contenant un parfum de créateur accompagné de fleurs séchées.', 159.99, cat_parfum, '[{"name": "Rose Ancien", "hex": "#C4A4A4"}, {"name": "Doré", "hex": "#D4AF37"}]', NULL, 8, true),
    ('Bouquet Parfum Oriental', 'Une composition raffinée avec un parfum aux notes orientales.', 189.99, cat_parfum, '[{"name": "Bordeaux", "hex": "#722F37"}, {"name": "Or Rose", "hex": "#B76E79"}]', NULL, 5, false),
    ('Bouquet Spirituel', 'Un bouquet unique combinant un tapis de prière de qualité supérieure.', 119.99, cat_tapis, '[{"name": "Vert Émeraude", "hex": "#50C878"}, {"name": "Blanc Nacré", "hex": "#FDEEF4"}]', NULL, 12, true),
    ('Bouquet Bénédiction', 'Une création spéciale avec tapis de prière brodé, chapelet et dates premium.', 149.99, cat_tapis, '[{"name": "Turquoise", "hex": "#40E0D0"}, {"name": "Ivoire", "hex": "#FFFFF0"}]', NULL, 7, false),
    ('Mon bouquet sur mesure', 'Composez votre bouquet : choisissez le style floral, le type de chocolat et la famille olfactive du parfum.', 99.99, cat_composer, '[]', '{"bouquet": ["Roses rouges", "Roses blanches", "Tulipes", "Mixte saisonnier"], "chocolat": ["Chocolat au lait", "Chocolat noir", "Praliné", "Sans chocolat"], "parfum": ["Floral", "Boisé / musqué", "Oriental", "Frais / agrumes"]}', 30, true);
END $$;
