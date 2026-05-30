-- Active: 1779298779123@@127.0.0.1@5433@tmdt_database
--- Drop existing tables if they exist
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallet_journals CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS seller_wallets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;
DROP TABLE IF EXISTS shipper_profiles CASCADE;
DROP TABLE IF EXISTS seller_bank_accounts CASCADE;
DROP TABLE IF EXISTS seller_profiles CASCADE;
DROP TABLE IF EXISTS buyer_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS platform_transactions CASCADE;
DROP TABLE IF EXISTS platform_wallets CASCADE;
DROP TABLE IF EXISTS payment_provider_events CASCADE;
DROP TABLE IF EXISTS return_requests CASCADE;
DROP TABLE IF EXISTS processed_webhooks CASCADE;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'BUYER',
    status account_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uniq_users_email_active ON users (email)
WHERE
    deleted_at IS NULL;

CREATE UNIQUE INDEX uniq_users_phone_active ON users (phone)
WHERE
    deleted_at IS NULL;

CREATE TABLE buyer_profiles (
    buyer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE seller_profiles (
    seller_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    store_description TEXT,
    platform_fee_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    status seller_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE seller_bank_accounts (
    bank_account_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seller_id INT NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (seller_id) REFERENCES seller_profiles (seller_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_seller_primary_bank ON seller_bank_accounts (seller_id)
WHERE
    is_primary = TRUE;

CREATE TABLE shipper_profiles (
    shipper_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    status shipper_status NOT NULL DEFAULT 'WORKING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE admin_profiles (
    admin_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    role admin_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 0),
    stock_quantity INT CHECK (
        stock_quantity IS NULL
        OR stock_quantity >= 0
    ),
    status product_status NOT NULL DEFAULT 'HIDDEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (seller_id) REFERENCES seller_profiles (seller_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE SET NULL,
    CHECK (
        (
            stock_quantity = 0
            AND status = 'OUT_OF_STOCK'
        )
        OR (
            stock_quantity IS NULL
            OR stock_quantity > 0
        )
    )
);

CREATE TABLE product_images (
    image_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

CREATE TABLE carts (
    cart_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyer_id INT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (buyer_id) REFERENCES buyer_profiles (buyer_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    cart_item_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (cart_id) REFERENCES carts (cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    UNIQUE (cart_id, product_id)
);

CREATE TABLE orders (
    order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    total_amount BIGINT NOT NULL CHECK (total_amount >= 0),
    payment_method payment_method NOT NULL,
    shipping_fee BIGINT NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    platform_fee BIGINT NOT NULL DEFAULT 0,
    seller_amount BIGINT GENERATED ALWAYS AS (total_amount - platform_fee) STORED,
    shipping_address TEXT NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    status order_status NOT NULL DEFAULT 'WAITING_SELLER_CONFIRMATION',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (buyer_id) REFERENCES buyer_profiles (buyer_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES seller_profiles (seller_id) ON DELETE CASCADE,
    CHECK (
        platform_fee >= 0
        AND platform_fee <= total_amount
    )
);

CREATE TABLE order_items (
    order_item_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price BIGINT NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

CREATE TABLE shipments (
    shipment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    shipper_id INT,
    tracking_code VARCHAR(255),
    status shipment_status NOT NULL DEFAULT 'ASSIGNED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (shipper_id) REFERENCES shipper_profiles (shipper_id) ON DELETE SET NULL
);

CREATE TABLE payments (
    payment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'PENDING',
    amount BIGINT NOT NULL CHECK (amount > 0),
    transaction_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
);

CREATE TABLE payment_provider_events (
    event_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    provider VARCHAR(100) NOT NULL,
    provider_event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    order_id INT,
    raw_payload JSONB NOT NULL,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_event_id),
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE SET NULL
);

CREATE TABLE platform_wallets (
    wallet_id INT PRIMARY KEY DEFAULT 1 CHECK (wallet_id = 1),
    escrow_balance BIGINT NOT NULL DEFAULT 0,
    revenue_balance BIGINT NOT NULL DEFAULT 0,
    reserve_balance BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        escrow_balance >= 0
        AND revenue_balance >= 0
        AND reserve_balance >= 0
    )
);

INSERT INTO
    platform_wallets (wallet_id)
VALUES (1)
ON CONFLICT DO NOTHING;

CREATE TABLE platform_transactions (
    platform_txn_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    txn_type platform_txn_type NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    ref_order_id INT,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (ref_order_id) REFERENCES orders (order_id) ON DELETE SET NULL
);

CREATE TABLE seller_wallets (
    seller_id INT PRIMARY KEY,
    pending_balance BIGINT NOT NULL DEFAULT 0,
    available_balance BIGINT NOT NULL DEFAULT 0,
    reserved_balance BIGINT NOT NULL DEFAULT 0,
    withdrawing_balance BIGINT NOT NULL DEFAULT 0,
    on_hold_balance BIGINT NOT NULL DEFAULT 0,
    lifetime_earned BIGINT NOT NULL DEFAULT 0,
    lifetime_withdrawn BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (seller_id) REFERENCES seller_profiles (seller_id) ON DELETE CASCADE,
    CHECK (
        pending_balance >= 0
        AND available_balance >= 0
        AND reserved_balance >= 0
        AND withdrawing_balance >= 0
        AND on_hold_balance >= 0
    )
);

CREATE TABLE withdrawal_requests (
    withdrawal_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seller_id INT NOT NULL,
    bank_account_id INT NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    withdrawal_fee BIGINT NOT NULL DEFAULT 0,
    net_payout BIGINT GENERATED ALWAYS AS (amount - withdrawal_fee) STORED,
    status withdrawal_status NOT NULL DEFAULT 'PENDING',
    transfer_reference VARCHAR(255),
    provider_response TEXT,
    provider_status VARCHAR(255),
    failure_reason TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (seller_id) REFERENCES seller_profiles (seller_id) ON DELETE CASCADE,
    FOREIGN KEY (bank_account_id) REFERENCES seller_bank_accounts (bank_account_id) ON DELETE CASCADE
);

CREATE TABLE wallet_journals (
    journal_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    seller_id INT NOT NULL,
    txn_type wallet_txn_type NOT NULL,
    total_amount BIGINT NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    ref_order_id INT,
    ref_withdrawal_id INT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (seller_id) REFERENCES seller_profiles (seller_id) ON DELETE CASCADE,
    FOREIGN KEY (ref_order_id) REFERENCES orders (order_id) ON DELETE SET NULL,
    FOREIGN KEY (ref_withdrawal_id) REFERENCES withdrawal_requests (withdrawal_id) ON DELETE SET NULL
);

CREATE TABLE wallet_transactions (
    wallet_txn_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    txn_type wallet_txn_type NOT NULL,
    seller_id INT NOT NULL,
    journal_id INT NOT NULL,
    affected_balance wallet_balance_type NOT NULL,
    delta BIGINT NOT NULL CHECK (delta <> 0),
    balance_before BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    ref_order_id INT,
    ref_withdrawal_id INT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (seller_id) REFERENCES seller_profiles (seller_id) ON DELETE CASCADE,
    FOREIGN KEY (journal_id) REFERENCES wallet_journals (journal_id) ON DELETE CASCADE,
    FOREIGN KEY (ref_order_id) REFERENCES orders (order_id) ON DELETE SET NULL,
    FOREIGN KEY (ref_withdrawal_id) REFERENCES withdrawal_requests (withdrawal_id) ON DELETE SET NULL
);

CREATE TABLE return_requests (
    return_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    buyer_id INT NOT NULL,
    reason TEXT NOT NULL,
    status return_status NOT NULL DEFAULT 'REQUESTED',
    admin_note TEXT,
    refund_amount BIGINT CHECK (refund_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES buyer_profiles (buyer_id) ON DELETE CASCADE
);

CREATE TABLE processed_webhooks (
    provider VARCHAR(255) NOT NULL,
    event_id VARCHAR(255) NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (provider, event_id)
);