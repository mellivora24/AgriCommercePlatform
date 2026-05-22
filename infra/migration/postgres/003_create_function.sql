CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_buyer_profiles_updated_at
BEFORE UPDATE ON buyer_profiles
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_seller_profiles_updated_at
BEFORE UPDATE ON seller_profiles
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE FUNCTION fn_sync_product_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.stock_quantity = 0 THEN
        NEW.status := 'OUT_OF_STOCK';

    ELSIF NEW.stock_quantity > 0
          AND NEW.status = 'OUT_OF_STOCK' THEN
        NEW.status := 'AVAILABLE';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_product_status
BEFORE UPDATE OF stock_quantity ON products
FOR EACH ROW
EXECUTE FUNCTION fn_sync_product_status();