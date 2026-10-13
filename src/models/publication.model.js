const db = require('../config/db');

const PublicationModel = {
  // Users & Roles
  findUserByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  findUserById: async (id) => {
    const [rows] = await db.query('SELECT id, email FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  getUserRole: async (userId) => {
    const [rows] = await db.query('SELECT role FROM user_roles WHERE user_id = ?', [userId]);
    return rows.length > 0 ? rows[0].role : 'admin';
  },

  createUserWithRole: async (userId, email, passwordHash, role = 'admin') => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const crypto = require('crypto');
      await conn.query('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [userId, email, passwordHash]);
      const roleId = crypto.randomUUID();
      await conn.query('INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)', [roleId, userId, role]);
      await conn.commit();
      return { id: userId, email, role };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Publications
  getAllPublications: async () => {
    const [rows] = await db.query('SELECT * FROM publications ORDER BY created_at DESC');
    return rows;
  },

  createPublication: async (pubData) => {
    await db.query('INSERT INTO publications SET ?', [pubData]);
    return pubData;
  },

  updatePublication: async (id, pubData) => {
    await db.query('UPDATE publications SET ? WHERE id = ?', [pubData, id]);
    return { success: true };
  },

  deletePublication: async (id) => {
    await db.query('DELETE FROM publications WHERE id = ?', [id]);
    return { success: true };
  },

  // Reimbursements
  getAllReimbursements: async () => {
    const [rows] = await db.query('SELECT * FROM reimbursements ORDER BY created_at DESC');
    return rows;
  },

  getLastReimbursementSeq: async (yearPrefix) => {
    const [rows] = await db.query(
      "SELECT id FROM reimbursements WHERE id LIKE ? AND id REGEXP '^[0-9]{4}-[0-9]+$' ORDER BY id DESC LIMIT 1",
      [`${yearPrefix}%`]
    );
    return rows[0] ? rows[0].id : null;
  },

  createReimbursement: async (claimData) => {
    await db.query('INSERT INTO reimbursements SET ?', [claimData]);
    return claimData;
  },

  updateReimbursement: async (id, claimData) => {
    await db.query('UPDATE reimbursements SET ? WHERE id = ?', [claimData, id]);
    return { success: true };
  },

  deleteReimbursement: async (id) => {
    await db.query('DELETE FROM reimbursements WHERE id = ?', [id]);
    return { success: true };
  }
};

module.exports = PublicationModel;
