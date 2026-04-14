const { Pool } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: '',
  host: 'localhost',
  database: '',
  password: '@',
  port: ,
});

// Verificamos que la conexión funciona correctamente al arrancar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error conectando a la base de datos PostgreSQL:', err.stack);
  }
  console.log('Conexión exitosa a la base de datos PostgreSQL (savelobby)');
  release();
});

module.exports = pool;
