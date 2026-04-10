const pool = require('./db');

const initDatabase = async () => {
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'usuario', -- Por defecto todos son 'usuario', tú serás 'admin'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(createUsersTable);
    console.log("✅ Tabla 'users' lista en la base de datos.");
    
    // Cerramos la conexión para que el script termine automáticamente
    process.exit(0); 
  } catch (error) {
    console.error("❌ Error creando la tabla:", error);
    process.exit(1);
  }
};

initDatabase();