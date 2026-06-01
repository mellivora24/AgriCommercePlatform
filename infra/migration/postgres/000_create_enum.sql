-- drop existing enums if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS account_status CASCADE;
DROP TYPE IF EXISTS seller_status CASCADE;
DROP TYPE IF EXISTS shipper_status CASCADE;
DROP TYPE IF EXISTS admin_role CASCADE;
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS shipment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS wallet_balance_type CASCADE;
DROP TYPE IF EXISTS wallet_txn_type CASCADE;
DROP TYPE IF EXISTS withdrawal_status CASCADE;
DROP TYPE IF EXISTS return_status CASCADE;
DROP TYPE IF EXISTS platform_txn_type CASCADE;

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM (
    'ADMIN',
    'BUYER',
    'SELLER',
    'SHIPPER',
    'GUEST'
);

CREATE TYPE account_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'BANNED',
    'DELETED'
);

CREATE TYPE seller_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'SUSPENDED'
);

CREATE TYPE shipper_status AS ENUM (
    'WORKING',
    'ON_LEAVE'
);

CREATE TYPE admin_role AS ENUM (
    'SUPER_ADMIN',
    'SUPPORT_ADMIN',
    'FINANCE_ADMIN'
);

CREATE TYPE product_status AS ENUM (
    'HIDDEN',
    'AVAILABLE',
    'OUT_OF_STOCK',
    'PENDING'
);

CREATE TYPE order_status AS ENUM (
    'PENDING_PAYMENT',
    'PAID',
    'WAITING_SELLER_CONFIRMATION',
    'SELLER_CONFIRMED',
    'SHIPPING',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
    'RETURN_REQUESTED',
    'REFUNDED'
);

CREATE TYPE shipment_status AS ENUM (
    'ASSIGNED',
    'PICKED_UP',
    'DELIVERING',
    'DELIVERED',
    'RETURNING',
    'RETURNED'
);

CREATE TYPE payment_method AS ENUM (
    'ONLINE',
    'COD'
);

CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'WAITING_COD_COLLECTION'
);

CREATE TYPE wallet_balance_type AS ENUM (
    'PENDING',
    'AVAILABLE',
    'RESERVED',
    'WITHDRAWING',
    'ON_HOLD'
);

CREATE TYPE wallet_txn_type AS ENUM (
    'ORDER_PENDING',
    'ORDER_RELEASED',
    'ORDER_REFUNDED',
    'WITHDRAWAL_REQUESTED',
    'WITHDRAWAL_COMPLETED',
    'WITHDRAWAL_FAILED',
    'WITHDRAWAL_CANCELLED',
    'RESERVE_HOLD',
    'RESERVE_RELEASE',
    'MANUAL_CREDIT',
    'MANUAL_DEBIT'
);

CREATE TYPE withdrawal_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);

CREATE TYPE return_status AS ENUM (
    'REQUESTED',
    'APPROVED',
    'REJECTED',
    'RETURNING',
    'RECEIVED',
    'REFUNDED'
);

CREATE TYPE platform_txn_type AS ENUM (
    'ESCROW_IN',
    'ESCROW_OUT_SELLER',
    'ESCROW_OUT_REFUND',
    'FEE_EARNED',
    'MANUAL_ADJUST'
);
