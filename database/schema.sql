-- =========================
-- CREATE DATABASE
-- =========================
CREATE DATABASE noel_shop;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    old_price INTEGER,
    gender VARCHAR(20),
    recipient VARCHAR(50),
    stock INTEGER DEFAULT 0,
    sold INTEGER DEFAULT 0,
    category_id INTEGER,
    date_added DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- =========================
-- PRODUCT IMAGES
-- =========================
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER,
    image_url TEXT NOT NULL,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =========================
-- CART
-- =========================
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- CART ITEMS
-- =========================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,

    FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    total_price INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    price INTEGER,
    quantity INTEGER,

    FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- =========================
-- BANNERS
-- =========================
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image_url TEXT,
    link TEXT,
    position VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- REVIEWS
-- =========================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    product_id INTEGER,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


INSERT INTO users (name, email, password, phone, address, role)
VALUES
('Admin Noel', 'admin@noelshop.com', '123456', '0900000001', 'Hà Nội', 'admin'),
('Nguyen Van A', 'user1@gmail.com', '123456', '0900000002', 'Hồ Chí Minh', 'customer'),
('Tran Thi B', 'user2@gmail.com', '123456', '0900000003', 'Đà Nẵng', 'customer');
