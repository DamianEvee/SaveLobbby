const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. Middlewares (Configuraciones básicas)
// ==========================================
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../frontend'))); 

// ==========================================
// 2. Conexión e Inicialización de la Base de Datos
// ==========================================
const dbPath = path.join(__dirname, '../database/savelobby.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite de SaveLobby.');
        inicializarTablas();
    }
});

function inicializarTablas() {
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    db.exec(schema, (err) => {
        if (err) {
            console.error('❌ Error al crear las tablas:', err.message);
        } else {
            console.log('✅ Tablas de la base de datos verificadas/creadas correctamente.');
            db.run(`INSERT OR IGNORE INTO users (id, username, password_hash) VALUES (1, 'Invitado', 'sin_contraseña')`);
        }
    });
}

// ==========================================
// 3. Rutas de la API (Endpoints)
// ==========================================
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', message: 'Servidor de SaveLobby funcionando.' });
});

// Ruta para recibir y guardar publicaciones
app.post('/api/posts', (req, res) => {
    const { gameName, content, tags } = req.body;

    if (!gameName || !content || !tags || tags.length === 0) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const slug = gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tagsString = tags.join(','); 
    const userId = 1; 

    db.run(`INSERT OR IGNORE INTO games (name, slug) VALUES (?, ?)`, [gameName, slug], function(err) {
        if (err) return res.status(500).json({ error: 'Error al registrar el juego.' });

        db.get(`SELECT id FROM games WHERE slug = ?`, [slug], (err, row) => {
            if (err || !row) return res.status(500).json({ error: 'Error al obtener el juego.' });
            
            const gameId = row.id;

            db.run(
                `INSERT INTO posts (user_id, game_id, content, tags) VALUES (?, ?, ?, ?)`,
                [userId, gameId, content, tagsString],
                function(err) {
                    if (err) return res.status(500).json({ error: 'Error al guardar la publicación.' });
                    
                    db.run(`UPDATE games SET post_count = post_count + 1 WHERE id = ?`, [gameId]);

                    res.status(201).json({ message: 'Publicación guardada con éxito', postId: this.lastID });
                }
            );
        });
    });
});

// Ruta para cargar el Feed y los Juegos Populares
app.get('/api/feed', (req, res) => {
    const data = {};

    // 1. Obtener el Top 5 de juegos con más publicaciones
    db.all(`SELECT name, post_count FROM games ORDER BY post_count DESC LIMIT 5`, [], (err, games) => {
        if (err) return res.status(500).json({ error: 'Error al cargar los juegos populares.' });
        data.popularGames = games;

        // 2. Obtener las últimas 20 publicaciones para el Feed (Uniendo datos de posts, users y games)
        const query = `
            SELECT posts.content, posts.tags, posts.created_at, users.username, games.name AS gameName 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            JOIN games ON posts.game_id = games.id 
            ORDER BY posts.created_at DESC LIMIT 20
        `;
        db.all(query, [], (err, posts) => {
            if (err) return res.status(500).json({ error: 'Error al cargar las publicaciones.' });
            data.posts = posts;
            
            // Devolver todo en un solo paquete JSON
            res.json(data);
        });
    });
});

// ==========================================
// 4. Redirección Frontend (Soporte PWA)
// ==========================================
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ==========================================
// 5. Arrancar el Servidor
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor de SaveLobby corriendo en http://localhost:${PORT}`);
});