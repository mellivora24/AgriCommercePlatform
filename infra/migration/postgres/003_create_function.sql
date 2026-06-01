--- drop all existing functions and triggers if they exist
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
DROP TRIGGER IF EXISTS trg_buyer_profiles_updated_at ON buyer_profiles;
DROP TRIGGER IF EXISTS trg_seller_profiles_updated_at ON seller_profiles;
DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS trg_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS trg_sync_product_status ON products;
DROP TRIGGER IF EXISTS trg_validate_shipment_status_transition ON shipments;
DROP TRIGGER IF EXISTS trg_sync_product_stock_status ON products;
DROP TRIGGER IF EXISTS trg_wallet_transactions_no_update ON wallet_transactions;
DROP TRIGGER IF EXISTS trg_platform_transactions_no_update ON platform_transactions;
DROP TRIGGER IF EXISTS trg_wallet_journals_no_update ON wallet_journals;
DROP TRIGGER IF EXISTS trg_approve_return_request ON return_requests;
DROP TRIGGER IF EXISTS trg_reject_return_request ON return_requests;
DROP TRIGGER IF EXISTS trg_refund_order ON orders;
DROP TRIGGER IF EXISTS trg_confirm_cod_collection ON payments;
DROP TRIGGER IF EXISTS trg_create_seller_wallet ON seller_profiles;
DROP TRIGGER IF EXISTS trg_prevent_self_buy ON orders;
DROP TRIGGER IF EXISTS trg_deduct_stock_on_order ON order_items;

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

CREATE OR REPLACE FUNCTION fn_validate_shipment_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    IF NOT (
        (OLD.status = 'ASSIGNED'   AND NEW.status = 'PICKED_UP')
     OR (OLD.status = 'PICKED_UP'  AND NEW.status = 'DELIVERING')
     OR (OLD.status = 'DELIVERING' AND NEW.status IN ('DELIVERED', 'RETURNING'))
     OR (OLD.status = 'RETURNING'  AND NEW.status = 'RETURNED')
    ) THEN
        RAISE EXCEPTION
            'Không thể chuyển trạng thái vận đơn từ % sang %',
            OLD.status, NEW.status;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_shipment_status_transition
BEFORE UPDATE OF status ON shipments
FOR EACH ROW
EXECUTE FUNCTION fn_validate_shipment_status_transition();

CREATE OR REPLACE FUNCTION fn_sync_product_stock_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.stock_quantity IS NULL THEN
        RETURN NEW;
    END IF;

    IF NEW.stock_quantity <= 0 THEN
        NEW.status := 'OUT_OF_STOCK';
    ELSIF NEW.status = 'OUT_OF_STOCK' AND NEW.stock_quantity > 0 THEN
        NEW.status := 'AVAILABLE';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_product_stock_status
BEFORE UPDATE OF stock_quantity ON products
FOR EACH ROW
EXECUTE FUNCTION fn_sync_product_stock_status();

CREATE OR REPLACE FUNCTION fn_prevent_ledger_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Bảng này không cho phép cập nhật hoặc xóa để đảm bảo tính toàn vẹn của dữ liệu lịch sử giao dịch';
END;
$$;

CREATE TRIGGER trg_wallet_transactions_no_update
BEFORE UPDATE OR DELETE ON wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_ledger_modification();

CREATE TRIGGER trg_platform_transactions_no_update
BEFORE UPDATE OR DELETE ON platform_transactions
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_ledger_modification();

CREATE TRIGGER trg_wallet_journals_no_update
BEFORE UPDATE OR DELETE ON wallet_journals
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_ledger_modification();

CREATE OR REPLACE FUNCTION fn_approve_return_request(
    p_return_id INT,
    p_admin_note TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_return return_requests%ROWTYPE;
BEGIN
    SELECT *
    INTO v_return
    FROM return_requests
    WHERE return_id = p_return_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy yêu cầu hoàn trả %', p_return_id;
    END IF;

    IF v_return.status <> 'REQUESTED' THEN
        RAISE EXCEPTION
            'Trạng thái yêu cầu hoàn trả % là %, dự kiến REQUESTED',
            p_return_id, v_return.status;
    END IF;

    UPDATE return_requests
    SET status = 'APPROVED',
        admin_note = p_admin_note,
        updated_at = NOW()
    WHERE return_id = p_return_id;

    UPDATE orders
    SET status = 'RETURN_REQUESTED'
    WHERE order_id = v_return.order_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_reject_return_request(
    p_return_id INT,
    p_admin_note TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_return return_requests%ROWTYPE;
BEGIN
    SELECT *
    INTO v_return
    FROM return_requests
    WHERE return_id = p_return_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy yêu cầu hoàn trả %', p_return_id;
    END IF;

    IF v_return.status <> 'REQUESTED' THEN
        RAISE EXCEPTION
            'Trạng thái yêu cầu hoàn trả % là %, dự kiến REQUESTED',
            p_return_id, v_return.status;
    END IF;

    UPDATE return_requests
    SET status = 'REJECTED',
        admin_note = p_admin_note,
        updated_at = NOW()
    WHERE return_id = p_return_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_refund_order(
    p_order_id        INT,
    p_refund_amount   BIGINT,
    p_idempotency_key VARCHAR(255)
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_order             orders%ROWTYPE;
    v_pending_before    BIGINT;
    v_available_before  BIGINT;
    v_journal_id        INT;
BEGIN
    IF EXISTS (
        SELECT 1
        FROM wallet_journals
        WHERE idempotency_key = p_idempotency_key
    ) THEN
        RETURN;
    END IF;

    SELECT *
    INTO v_order
    FROM orders
    WHERE order_id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy đơn hàng %', p_order_id;
    END IF;

    IF v_order.status NOT IN ('RETURN_REQUESTED', 'DELIVERED', 'COMPLETED') THEN
        RAISE EXCEPTION
            'Trạng thái đơn hàng % là %, không thể hoàn tiền',
            p_order_id, v_order.status;
    END IF;

    UPDATE orders
    SET status = 'REFUNDED'
    WHERE order_id = p_order_id;

    SELECT pending_balance, available_balance
    INTO v_pending_before, v_available_before
    FROM seller_wallets
    WHERE seller_id = v_order.seller_id
    FOR UPDATE;

    IF v_available_before >= p_refund_amount THEN
        UPDATE seller_wallets
        SET available_balance = available_balance - p_refund_amount
        WHERE seller_id = v_order.seller_id;

        INSERT INTO wallet_journals (
            seller_id,
            txn_type,
            total_amount,
            idempotency_key,
            ref_order_id
        ) VALUES (
            v_order.seller_id,
            'ORDER_REFUNDED',
            p_refund_amount,
            p_idempotency_key,
            p_order_id
        )
        RETURNING journal_id INTO v_journal_id;

        INSERT INTO wallet_transactions (
            txn_type,
            seller_id,
            journal_id,
            affected_balance,
            delta,
            balance_before,
            balance_after,
            ref_order_id
        ) VALUES (
            'ORDER_REFUNDED',
            v_order.seller_id,
            v_journal_id,
            'AVAILABLE',
            -p_refund_amount,
            v_available_before,
            v_available_before - p_refund_amount,
            p_order_id
        );
    ELSE
        RAISE EXCEPTION
            'Seller % không đủ số dư để hoàn tiền',
            v_order.seller_id;
    END IF;

    UPDATE platform_wallets
    SET revenue_balance = GREATEST(revenue_balance - v_order.platform_fee, 0),
        updated_at      = NOW()
    WHERE wallet_id = 1;

    INSERT INTO platform_transactions (
        txn_type,
        amount,
        ref_order_id,
        idempotency_key,
        notes
    ) VALUES (
        'ESCROW_OUT_REFUND',
        p_refund_amount,
        p_order_id,
        p_idempotency_key || '_platform',
        'Refund to customer'
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_confirm_cod_collection(
    p_order_id        INT,
    p_transaction_id  VARCHAR(255),
    p_idempotency_key VARCHAR(255)
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_payment payments%ROWTYPE;
BEGIN
    SELECT *
    INTO v_payment
    FROM payments
    WHERE order_id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy thanh toán cho đơn hàng %', p_order_id;
    END IF;

    IF v_payment.method <> 'COD' THEN
        RAISE EXCEPTION 'Đơn hàng % không phải là phương thức COD', p_order_id;
    END IF;

    IF v_payment.status <> 'WAITING_COD_COLLECTION' THEN
        RAISE EXCEPTION
            'Trạng thái thanh toán là %, dự kiến WAITING_COD_COLLECTION',
            v_payment.status;
    END IF;

    UPDATE payments
    SET status = 'COMPLETED',
        transaction_id = p_transaction_id,
        updated_at = NOW()
    WHERE payment_id = v_payment.payment_id;

    PERFORM fn_confirm_payment(
        p_order_id,
        'COD',
        p_transaction_id,
        p_idempotency_key
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_create_seller_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO seller_wallets (seller_id)
    VALUES (NEW.seller_id)
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_seller_wallet
AFTER INSERT ON seller_profiles
FOR EACH ROW
EXECUTE FUNCTION fn_create_seller_wallet();

CREATE OR REPLACE FUNCTION fn_prevent_self_buy()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_seller_user_id INT;
    v_buyer_user_id  INT;
BEGIN
    SELECT user_id
    INTO v_seller_user_id
    FROM seller_profiles
    WHERE seller_id = NEW.seller_id;

    SELECT user_id
    INTO v_buyer_user_id
    FROM buyer_profiles
    WHERE buyer_id = NEW.buyer_id;

    IF v_seller_user_id = v_buyer_user_id THEN
        RAISE EXCEPTION 'Người bán không thể mua sản phẩm của chính mình';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prevent_self_buy
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_self_buy();

CREATE OR REPLACE FUNCTION fn_deduct_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id
      AND stock_quantity IS NOT NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Không tìm thấy sản phẩm %', NEW.product_id;
    END IF;

    IF (
        SELECT stock_quantity
        FROM products
        WHERE product_id = NEW.product_id
    ) < 0 THEN
        RAISE EXCEPTION
            'Sản phẩm % không đủ số lượng tồn kho', NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_deduct_stock_on_order
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION fn_deduct_stock_on_order();

DROP TRIGGER IF EXISTS trg_update_seller_wallet_on_order_status ON orders;

CREATE OR REPLACE FUNCTION fn_update_seller_wallet_on_order_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_seller_amount  BIGINT;
    v_pending_before BIGINT;
    v_avail_before   BIGINT;
    v_journal_id     INT;
BEGIN
    v_seller_amount := NEW.seller_amount;

    IF NEW.status = 'SELLER_CONFIRMED' AND OLD.status <> 'SELLER_CONFIRMED' THEN

        SELECT pending_balance
        INTO v_pending_before
        FROM seller_wallets
        WHERE seller_id = NEW.seller_id
        FOR UPDATE;

        UPDATE seller_wallets
        SET pending_balance = pending_balance + v_seller_amount
        WHERE seller_id = NEW.seller_id;

        INSERT INTO wallet_journals (
            seller_id, txn_type, total_amount, idempotency_key, ref_order_id
        ) VALUES (
            NEW.seller_id,
            'ORDER_PENDING',
            v_seller_amount,
            'confirm_' || NEW.order_id,
            NEW.order_id
        )
        RETURNING journal_id INTO v_journal_id;

        INSERT INTO wallet_transactions (
            txn_type, seller_id, journal_id,
            affected_balance, delta, balance_before, balance_after, ref_order_id
        ) VALUES (
            'ORDER_PENDING',
            NEW.seller_id, v_journal_id,
            'PENDING', v_seller_amount,
            v_pending_before, v_pending_before + v_seller_amount,
            NEW.order_id
        );

    ELSIF NEW.status = 'DELIVERED' AND OLD.status <> 'DELIVERED' THEN

        SELECT pending_balance, available_balance
        INTO v_pending_before, v_avail_before
        FROM seller_wallets
        WHERE seller_id = NEW.seller_id
        FOR UPDATE;

        UPDATE seller_wallets
        SET pending_balance   = pending_balance   - v_seller_amount,
            available_balance = available_balance + v_seller_amount
        WHERE seller_id = NEW.seller_id;

        INSERT INTO wallet_journals (
            seller_id, txn_type, total_amount, idempotency_key, ref_order_id
        ) VALUES (
            NEW.seller_id,
            'ORDER_RELEASED',
            v_seller_amount,
            'deliver_' || NEW.order_id,
            NEW.order_id
        )
        RETURNING journal_id INTO v_journal_id;

        INSERT INTO wallet_transactions (
            txn_type, seller_id, journal_id,
            affected_balance, delta, balance_before, balance_after, ref_order_id
        ) VALUES
        (
            'ORDER_RELEASED',
            NEW.seller_id, v_journal_id,
            'PENDING', -v_seller_amount,
            v_pending_before, v_pending_before - v_seller_amount,
            NEW.order_id
        ),
        (
            'ORDER_RELEASED',
            NEW.seller_id, v_journal_id,
            'AVAILABLE', v_seller_amount,
            v_avail_before, v_avail_before + v_seller_amount,
            NEW.order_id
        );

    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_seller_wallet_on_order_status ON orders;

CREATE TRIGGER trg_update_seller_wallet_on_order_status
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_update_seller_wallet_on_order_status();

DROP TRIGGER IF EXISTS trg_update_seller_wallet_on_order_status ON orders;

CREATE TRIGGER trg_update_seller_wallet_on_order_status
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_update_seller_wallet_on_order_status();

CREATE OR REPLACE FUNCTION fn_create_seller_profile_on_register()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.role = 'SELLER' THEN
        INSERT INTO seller_profiles (user_id, store_name, status)
        VALUES (
            NEW.user_id,
            COALESCE(NEW.nickname, 'Store_' || NEW.user_id),
            'PENDING'
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_seller_profile_on_register ON users;

CREATE TRIGGER trg_create_seller_profile_on_register
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION fn_create_seller_profile_on_register();