CREATE DATABASE IF NOT EXISTS gaming_web
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gaming_web;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category ENUM('hardware', 'games', 'merch') NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255) NOT NULL DEFAULT 'img/placeholder-product.png',
  description TEXT NOT NULL,
  specs JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO products (name, category, price, image, description, specs)
VALUES
  ('Alienware Aurora', 'hardware', 2499.00, 'img/placeholder-product.png', 'High-performance gaming desktop with RTX 4090', JSON_ARRAY('Intel i9', 'RTX 4090', '64GB RAM', '2TB SSD')),
  ('Razer Blade 16', 'hardware', 3199.00, 'img/placeholder-product.png', 'Ultra-thin gaming laptop with RTX 4080', JSON_ARRAY('Intel i9', 'RTX 4080', '32GB RAM', '1TB SSD')),
  ('Legion Pro Keyboard', 'hardware', 199.00, 'img/placeholder-product.png', 'Mechanical gaming keyboard with RGB lighting', JSON_ARRAY('Mechanical Switches', 'RGB Lighting', 'Wireless', 'Programmable')),
  ('Zenithal Legends', 'games', 59.99, 'img/placeholder-product.png', 'Epic fantasy MMORPG with rich storyline', JSON_ARRAY('Multiplayer', 'PvP', 'Co-op', 'Cross-Platform')),
  ('Digital Arena Pass', 'merch', 29.99, 'img/placeholder-product.png', 'Season pass with exclusive in-game items', JSON_ARRAY('12-Month Access', 'Exclusive Skins', 'Weekly Rewards', 'Premium Support')),
  ('Zenithal Merch Bundle', 'merch', 89.99, 'img/placeholder-product.png', 'Limited edition merchandise collection', JSON_ARRAY('T-Shirt', 'Hoodie', 'Cap', 'Stickers')),
  ('Ultimate Gaming Rig', 'hardware', 5999.00, 'img/placeholder-product.png', 'Custom built ultimate gaming PC', JSON_ARRAY('Intel i9-13900K', 'RTX 4090', '128GB RAM', '4TB NVMe SSD')),
  ('Quantum Quest', 'games', 49.99, 'img/placeholder-product.png', 'Sci-fi adventure game with stunning visuals', JSON_ARRAY('Single Player', '4K Support', 'Ray Tracing', '120 FPS'));