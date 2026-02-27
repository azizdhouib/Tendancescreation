-- Ajouter les colonnes pour Stripe à la table orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Mettre à jour les valeurs possibles du status
-- Les statuts possibles: pending_payment, paid, processing, shipped, delivered, cancelled

-- Policy pour permettre la mise à jour du statut après paiement
DROP POLICY IF EXISTS "Allow update order status" ON orders;
CREATE POLICY "Allow update order status" ON orders 
  FOR UPDATE USING (true) 
  WITH CHECK (true);
