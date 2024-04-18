const { Pool } = require('pg');

const pool = new Pool({
  user: 'quiz',
  password: 'quiz11111111',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'Decadis'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool
};