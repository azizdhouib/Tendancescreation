-- Options de composition (bouquet / chocolat / parfum) pour les produits "Composer son bouquet"
ALTER TABLE products ADD COLUMN IF NOT EXISTS bouquet_options JSONB DEFAULT NULL;

INSERT INTO categories (name, description)
VALUES (
  'Composer son bouquet',
  'Choisissez le type de bouquet, de chocolat et de parfum'
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, description, price, category_id, colors, bouquet_options, stock, is_featured)
SELECT
  'Mon bouquet sur mesure',
  'Composez votre bouquet : choisissez le style floral, le type de chocolat et la famille olfactive du parfum.',
  99.99,
  c.id,
  '[]'::jsonb,
  '{"bouquet": ["Roses rouges", "Roses blanches", "Tulipes", "Mixte saisonnier"], "chocolat": ["Chocolat au lait", "Chocolat noir", "Praliné", "Sans chocolat"], "parfum": ["Floral", "Boisé / musqué", "Oriental", "Frais / agrumes"]}'::jsonb,
  30,
  true
FROM categories c
WHERE c.name = 'Composer son bouquet'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Mon bouquet sur mesure');
