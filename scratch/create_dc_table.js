const projectDir = 'c:/Users/mahen/OneDrive/Desktop/rd';
const mysql = require(projectDir + '/node_modules/mysql2/promise');
const config = require(projectDir + '/src/config/environment');

async function migrate() {
  const conn = await mysql.createConnection(config.DB);
  console.log('Connected to MySQL vignan_rd database.');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS dc_meetings_attended (
      id INT AUTO_INCREMENT PRIMARY KEY,
      submission_id VARCHAR(60) NOT NULL,
      scholar_id VARCHAR(50) NOT NULL,
      dc_name VARCHAR(150) NOT NULL,
      last_dc_date DATE NULL,
      comments TEXT,
      regulation VARCHAR(20) NOT NULL DEFAULT 'R22',
      rating VARCHAR(50) NOT NULL,
      recommendations VARCHAR(100) DEFAULT 'Pre-synopsis',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (submission_id),
      INDEX (scholar_id),
      CONSTRAINT fk_dc_submission FOREIGN KEY (submission_id) REFERENCES monthly_submissions(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ Table dc_meetings_attended created/verified successfully.');

  const [cols] = await conn.query('DESCRIBE dc_meetings_attended');
  console.log('dc_meetings_attended columns:', cols.map(c => `${c.Field} (${c.Type})`));

  await conn.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
