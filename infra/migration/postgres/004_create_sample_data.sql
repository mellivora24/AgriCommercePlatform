-- =====================================================
-- USERS
-- =====================================================

INSERT INTO users (
    email,
    password_hash,
    role,
    status
)
VALUES
(
    'buyer1@gmail.com',
    '$2a$10$dummy',
    'BUYER',
    'ACTIVE'
),
(
    'nongtraiviet@gmail.com',
    '$2a$10$dummy',
    'SELLER',
    'ACTIVE'
),
(
    'greenfarm@gmail.com',
    '$2a$10$dummy',
    'SELLER',
    'ACTIVE'
);

-- =====================================================
-- BUYER
-- =====================================================

INSERT INTO buyer_profiles (
    user_id,
    full_name,
    avatar_url,
    address
)
VALUES
(
    1,
    'Nguyen Van A',
    'https://i.pravatar.cc/300?img=1',
    'Ha Noi'
);

INSERT INTO carts (buyer_id)
VALUES (1);

-- =====================================================
-- SELLERS
-- =====================================================

INSERT INTO seller_profiles (
    user_id,
    store_name,
    store_description,
    status
)
VALUES
(
    2,
    'Nong Trai Viet',
    'Nong san sach tu nha vuon',
    'APPROVED'
),
(
    3,
    'Green Farm',
    'Dac san va trai cay huu co',
    'APPROVED'
);

INSERT INTO seller_wallets (seller_id)
VALUES
(1),
(2);

-- =====================================================
-- BANK ACCOUNTS
-- =====================================================

INSERT INTO seller_bank_accounts (
    seller_id,
    bank_name,
    account_number,
    account_name,
    is_primary
)
VALUES
(
    1,
    'Vietcombank',
    '0123456789',
    'NGUYEN VAN B',
    TRUE
),
(
    2,
    'Techcombank',
    '9876543210',
    'TRAN THI C',
    TRUE
);

-- =====================================================
-- CATEGORIES
-- =====================================================

INSERT INTO categories (
    name,
    description
)
VALUES
(
    'Rau Cu',
    'Rau cu tuoi sach'
),
(
    'Trai Cay',
    'Trai cay theo mua'
),
(
    'Gao',
    'Gao dac san Viet Nam'
),
(
    'Hat Kho',
    'Hat va ngu coc'
),
(
    'Dac San',
    'Dac san vung mien'
);

-- =====================================================
-- PRODUCTS
-- =====================================================

INSERT INTO products (
    seller_id,
    category_id,
    name,
    description,
    price,
    stock_quantity,
    status
)
VALUES

(1,1,'Rau Muong Huu Co','Thu hoach trong ngay',15000,500,'AVAILABLE'),
(1,1,'Cai Ngot Da Lat','Canh tac huu co',25000,300,'AVAILABLE'),
(1,1,'Rau Cai Xanh','Rau sach nha vuon',18000,250,'AVAILABLE'),
(1,1,'Bi Do Ho Lo','Bi do huu co',35000,120,'AVAILABLE'),

(1,2,'Xoai Cat Hoa Loc','Xoai loai 1 Tien Giang',85000,200,'AVAILABLE'),
(1,2,'Thanh Long Ruot Do','Binh Thuan loai 1',45000,350,'AVAILABLE'),
(1,2,'Buoi Da Xanh','Ben Tre dac san',65000,150,'AVAILABLE'),
(1,2,'Cam Cao Phong','Cam ngot Hoa Binh',55000,200,'AVAILABLE'),
(1,2,'Sau Rieng Ri6','Sau rieng mien Tay',120000,100,'AVAILABLE'),
(1,2,'Mit Thai','Mit Thai sieu som',45000,80,'AVAILABLE'),

(2,3,'Gao ST25 5kg','Gao ST25 chat luong cao',220000,100,'AVAILABLE'),
(2,3,'Gao Nang Thom Cho Dao','Dac san An Giang',180000,120,'AVAILABLE'),
(2,3,'Gao Jasmine 5kg','Gao thom mem',165000,140,'AVAILABLE'),

(2,4,'Hat Dieu Rang Muoi','Binh Phuoc loai 1',140000,250,'AVAILABLE'),
(2,4,'Hat Mac Ca','Dak Lak huu co',260000,100,'AVAILABLE'),
(2,4,'Dau Xanh Sach','Nguon goc ro rang',55000,200,'AVAILABLE'),
(2,4,'Dau Den Xanh Long','Dau den loai 1',65000,180,'AVAILABLE'),

(2,5,'Mat Ong Rung U Minh','Nguyen chat 100%',320000,80,'AVAILABLE'),
(2,5,'Kho Ca Loc Dong Thap','Dac san mien Tay',180000,60,'AVAILABLE'),
(2,5,'Tra Shan Tuyet Ha Giang','Tra co thu',250000,90,'AVAILABLE'),
(2,5,'Muoi Tom Tay Ninh','Dac san Tay Ninh',45000,300,'AVAILABLE'),
(2,5,'Banh Pheo Soc Trang','Dac san Soc Trang',35000,150,'AVAILABLE'),

(1,2,'Dua Hau Long An','Dua hau ruot do',25000,0,'OUT_OF_STOCK'),
(2,4,'Hat Sen Say','Hat sen Dong Thap',95000,0,'OUT_OF_STOCK');

-- =====================================================
-- PRODUCT IMAGES
-- =====================================================

INSERT INTO product_images (
    product_id,
    image_url
)
VALUES
(1,'https://picsum.photos/800/600?random=1'),
(2,'https://picsum.photos/800/600?random=2'),
(3,'https://picsum.photos/800/600?random=3'),
(4,'https://picsum.photos/800/600?random=4'),
(5,'https://picsum.photos/800/600?random=5'),
(6,'https://picsum.photos/800/600?random=6'),
(7,'https://picsum.photos/800/600?random=7'),
(8,'https://picsum.photos/800/600?random=8'),
(9,'https://picsum.photos/800/600?random=9'),
(10,'https://picsum.photos/800/600?random=10'),
(11,'https://picsum.photos/800/600?random=11'),
(12,'https://picsum.photos/800/600?random=12'),
(13,'https://picsum.photos/800/600?random=13'),
(14,'https://picsum.photos/800/600?random=14'),
(15,'https://picsum.photos/800/600?random=15'),
(16,'https://picsum.photos/800/600?random=16'),
(17,'https://picsum.photos/800/600?random=17'),
(18,'https://picsum.photos/800/600?random=18'),
(19,'https://picsum.photos/800/600?random=19'),
(20,'https://picsum.photos/800/600?random=20'),
(21,'https://picsum.photos/800/600?random=21'),
(22,'https://picsum.photos/800/600?random=22'),
(23,'https://picsum.photos/800/600?random=23'),
(24,'https://picsum.photos/800/600?random=24');

-- =====================================================
-- CART ITEMS
-- =====================================================

INSERT INTO cart_items (
    cart_id,
    product_id,
    quantity
)
VALUES
(1,5,2),
(1,11,1),
(1,18,1);

-- =====================================================
-- SAMPLE ORDER
-- =====================================================

INSERT INTO orders (
    buyer_id,
    seller_id,
    total_amount,
    shipping_fee,
    platform_fee,
    shipping_address,
    receiver_name,
    receiver_phone,
    status
)
VALUES
(
    1,
    1,
    255000,
    30000,
    25500,
    'Hoan Kiem, Ha Noi',
    'Nguyen Van A',
    '0901234567',
    'COMPLETED'
);

INSERT INTO order_items (
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES
(1,5,2,85000),
(1,1,5,15000);

INSERT INTO payments (
    order_id,
    method,
    status,
    amount,
    transaction_id
)
VALUES
(
    1,
    'ONLINE',
    'COMPLETED',
    255000,
    'TXN_000001'
);

-- =====================================================
-- SHIPMENT
-- =====================================================

INSERT INTO shipments (
    order_id,
    tracking_code,
    status
)
VALUES
(
    1,
    'GHN123456789',
    'DELIVERED'
);

SELECT user_id, email FROM users;
SELECT seller_id, user_id, store_name FROM seller_profiles;