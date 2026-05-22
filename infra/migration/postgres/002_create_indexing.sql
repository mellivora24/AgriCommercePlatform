--- drop existing indexes if they exist
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_status;
DROP INDEX IF EXISTS idx_products_seller;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_orders_buyer;
DROP INDEX IF EXISTS idx_orders_seller;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_order_items_order;
DROP INDEX IF EXISTS idx_payments_order;
DROP INDEX IF EXISTS idx_payments_status;
DROP INDEX IF EXISTS idx_shipments_shipper;
DROP INDEX IF EXISTS idx_wallet_journals_seller;
DROP INDEX IF EXISTS idx_wallet_transactions_seller;
DROP INDEX IF EXISTS idx_returns_order;
DROP INDEX IF EXISTS idx_provider_events_order;


CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_products_seller ON products (seller_id);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_orders_buyer ON orders (buyer_id);
CREATE INDEX idx_orders_seller ON orders (seller_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_payments_order ON payments (order_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_shipments_shipper ON shipments (shipper_id);
CREATE INDEX idx_wallet_journals_seller ON wallet_journals (seller_id);
CREATE INDEX idx_wallet_transactions_seller ON wallet_transactions (seller_id);
CREATE INDEX idx_returns_order ON return_requests (order_id);
CREATE INDEX idx_provider_events_order ON payment_provider_events (order_id);