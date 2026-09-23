-- ============================================
-- NEXO WEB CHAT - ESQUEMA DE BASE DE DATOS
-- MySQL 8.0+
-- ============================================

CREATE DATABASE IF NOT EXISTS nexo_webchat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexo_webchat;

-- ============================================
-- TABLA: users (Agentes, Supervisores, Admins)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'supervisor', 'agent') NOT NULL DEFAULT 'agent',
    status ENUM('available', 'busy', 'break', 'offline') DEFAULT 'offline',
    active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rol (rol),
    INDEX idx_status (status),
    INDEX idx_active (active)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: customers (Clientes de Frávega)
-- ============================================
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(150),
    phone VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dni (dni),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: orders (Pedidos)
-- ============================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    product VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    delivery_method VARCHAR(50),
    estimated_delivery DATE,
    status ENUM('preparing', 'shipping', 'delivered', 'delayed', 'cancelled') DEFAULT 'preparing',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_order_number (order_number),
    INDEX idx_customer (customer_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: conversations (Conversaciones de Chat)
-- ============================================
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    agent_id INT NULL,
    order_id INT NULL,
    subject VARCHAR(255),
    reason VARCHAR(255),
    status ENUM('waiting', 'active', 'on_hold', 'closed') DEFAULT 'waiting',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    csat_score TINYINT NULL CHECK (csat_score BETWEEN 1 AND 5),
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_agent (agent_id),
    INDEX idx_customer (customer_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: messages (Mensajes)
-- ============================================
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_type ENUM('customer', 'agent', 'system', 'bot') NOT NULL,
    sender_id INT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: quick_replies (Respuestas Rápidas)
-- ============================================
CREATE TABLE quick_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    shortcut VARCHAR(30),
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (active)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: knowledge_base (Base de Conocimiento)
-- ============================================
CREATE TABLE knowledge_base (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    keywords VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FULLTEXT INDEX ft_search (title, content, keywords),
    INDEX idx_category (category),
    INDEX idx_active (active)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: escalations (Escalaciones)
-- ============================================
CREATE TABLE escalations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NULL,
    created_by INT NOT NULL,
    assigned_to INT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'resolved', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: quality_reviews (Evaluaciones de Calidad)
-- ============================================
CREATE TABLE quality_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    score TINYINT NOT NULL CHECK (score BETWEEN 1 AND 10),
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_reviewer (reviewer_id)
) ENGINE=InnoDB;
