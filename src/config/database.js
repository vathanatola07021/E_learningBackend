const mysql = require('mysql2/promise');
const env = require('./env');

let pool = null;
let isDbConnected = false;

try {
  pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    waitForConnections: true,
    connectionLimit: env.db.connectionLimit,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
} catch (err) {
  console.error('[MySQL Pool Error]', err.message);
}

/**
 * Test connectivity to the MySQL server
 */
async function testConnection() {
  if (!pool) return false;
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isDbConnected = true;
    console.log(`[Database] MySQL connected successfully to database "${env.db.database}" on ${env.db.host}:${env.db.port}`);
    return true;
  } catch (error) {
    isDbConnected = false;
    console.warn(`[Database Warning] Could not connect to MySQL at ${env.db.host}:${env.db.port} (${error.code || error.message}).`);
    console.warn('[Database Notice] Running with in-memory seed dataset fallback. Start MySQL (XAMPP, Laragon, or Docker) and run `npm run db:init` to activate MySQL persistence.');
    return false;
  }
}

/**
 * Execute query on MySQL with parameters
 */
async function query(sql, params = []) {
  if (!pool || !isDbConnected) {
    throw new Error('DATABASE_NOT_CONNECTED');
  }
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  pool,
  query,
  testConnection,
  getIsDbConnected: () => isDbConnected,
  setIsDbConnected: (val) => { isDbConnected = val; },
};
