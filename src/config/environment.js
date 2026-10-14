const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Storage Directory for Uploaded Proof Documents & Attachments (Disk / Drive)
const resolvedUploadDir = process.env.UPLOAD_DIR 
  ? path.resolve(process.env.UPLOAD_DIR)
  : (fs.existsSync('C:\\') 
      ? 'C:\\rd_uploads'
      : path.resolve(__dirname, '../../uploads/proofs'));

try {
  if (!fs.existsSync(resolvedUploadDir)) {
    fs.mkdirSync(resolvedUploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('[Environment] Warning: Could not create UPLOAD_DIR at ' + resolvedUploadDir);
}

// Unique Server Process Instance Identity
// Changes every time the server process or system starts/stops.
const SERVER_BOOT_TIME = Date.now();
const SERVER_INSTANCE_ID = SERVER_BOOT_TIME.toString(36) + '-' + crypto.randomBytes(8).toString('hex');

const BASE_JWT_SECRET = process.env.JWT_SECRET || 'vignan_rd_secret_key_2026_local';
const BASE_SESSION_SECRET = process.env.SESSION_SECRET || 'vignan-rd-session-secret-2026';

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SERVER_BOOT_TIME,
  SERVER_INSTANCE_ID,
  UPLOAD_DIR: resolvedUploadDir,
  DB: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'vignan_rd',
    connectionLimit: 15,
    waitForConnections: true,
    queueLimit: 0
  },
  // Dynamically salted with the current server instance ID:
  // Any session cookie or JWT token issued in prior server runs becomes cryptographically
  // invalid the instant the server stops or restarts.
  JWT_SECRET: `${BASE_JWT_SECRET}_boot_${SERVER_INSTANCE_ID}`,
  SESSION_SECRET: `${BASE_SESSION_SECRET}_boot_${SERVER_INSTANCE_ID}`,
  BASE_JWT_SECRET,
  BASE_SESSION_SECRET
};
