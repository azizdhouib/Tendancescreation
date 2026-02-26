-- Fonction pour décrémenter le stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity
  WHERE id = product_id AND stock >= quantity;
END;
$$ LANGUAGE plpgsql;
