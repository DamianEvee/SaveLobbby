-- ==========================================
-- SAVE LOBBY - ESQUEMA DE BASE DE DATOS
-- ==========================================

-- 1. Tabla de Usuarios (Identidad única y roles)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL, 
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user', 
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00, -- Para el sistema de donaciones P2P
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Videojuegos (Dinámica)
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- Para URLs amigables (ej. 'elden-ring')
    post_count INTEGER DEFAULT 0, -- Para saber cuáles son los más populares
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Publicaciones (El contenido del foro)
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL, 
    media_url TEXT, -- Ruta a la foto/vídeo en el servidor
    is_private BOOLEAN DEFAULT 0, -- 1 si pertenece a una zona VIP/pago
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);