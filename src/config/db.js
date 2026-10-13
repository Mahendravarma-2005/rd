const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./environment');

let pool = null;
let isConnecting = false;

async function initDB() {
  if (isConnecting || pool) return pool;
  isConnecting = true;
  try {
    // 1. Ensure database exists
    const rootConn = await mysql.createConnection({
      host: config.DB.host,
      port: config.DB.port,
      user: config.DB.user,
      password: config.DB.password
    });
    try {
      await rootConn.query('SET GLOBAL max_allowed_packet = 67108864');
    } catch (e) {
      // Ignored if permissions don't allow SET GLOBAL
    }
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await rootConn.end();

    // 2. Establish connection pool
    pool = mysql.createPool(config.DB);

    // 3. Test Connection and verify packet size
    const testConn = await pool.getConnection();
    try {
      await testConn.query('SET GLOBAL max_allowed_packet = 67108864');
      await testConn.query('SET SESSION max_allowed_packet = 67108864');
    } catch (e) {}
    console.log('\n\x1b[32m%s\x1b[0m', `✅ Connected to unified MySQL Database: ${config.DB.database} (max_allowed_packet: 64MB)`);
    testConn.release();

    // 4. Auto-verify & bootstrap tables if missing
    await autoBootstrapTables();

    return pool;
  } catch (err) {
    console.error('\n\x1b[31m%s\x1b[0m', `⚠️ MySQL Database Connection Notice: ${err.message}`);
    console.log('   Retrying connection in 5 seconds... Ensure MySQL is running on port 3306 (user: root).\n');
    pool = null;
    setTimeout(initDB, 5000);
    throw err;
  } finally {
    isConnecting = false;
  }
}

async function autoBootstrapTables() {
  if (!pool) return;
  try {
    const [rows] = await pool.query("SHOW TABLES LIKE 'users'");
    if (rows.length === 0) {
      console.log('📦 Initializing tables in vignan_rd from merged_vignan_rd.sql...');
      const sqlPath = path.join(__dirname, '../../merged_vignan_rd.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        const statements = sql
          .replace(/--.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//gm, '')
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const statement of statements) {
          try {
            await pool.query(statement);
          } catch (e) {
            // Ignore minor duplicate statement errors
          }
        }
        console.log('✅ Successfully initialized all tables + views in vignan_rd');
      }
    }
    
    // Ensure all 5 proof columns exist in proposals table (Self-Healing Migration)
    const proofColumns = [
      "ALTER TABLE proposals ADD COLUMN proof_file_name VARCHAR(255) NULL",
      "ALTER TABLE proposals ADD COLUMN proof_file_type VARCHAR(100) NULL",
      "ALTER TABLE proposals ADD COLUMN proof_file_path VARCHAR(500) NULL",
      "ALTER TABLE proposals ADD COLUMN proof_file_size BIGINT NULL",
      "ALTER TABLE proposals ADD COLUMN proof_file_data LONGTEXT NULL"
    ];
    for (const alterQuery of proofColumns) {
      try {
        await pool.query(alterQuery);
      } catch (e) {
        // Ignore if column already exists
      }
    }
  } catch (e) {
    // Continue silently
  }
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(config.DB);
  }
  return pool;
}

module.exports = {
  initDB,
  getPool,
  query: (sql, params) => getPool().query(sql, params),
  getConnection: () => getPool().getConnection()
};
