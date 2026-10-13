const db = require('../config/db');

const PortalLoginModel = {
  /**
   * Find super admin user by employee ID
   */
  findByEmployeeId: async (employeeId) => {
    const [rows] = await db.query(
      'SELECT id, employee_id, email, password_hash, role, temp_password_hash, temp_password_expires, requires_reset FROM portal_login WHERE employee_id = ?',
      [employeeId]
    );
    return rows[0] || null;
  },

  /**
   * Set temporary password hash with expiration date and mark requires_reset
   */
  setTempPassword: async (employeeId, tempHash, expiresAt) => {
    const [result] = await db.query(
      'UPDATE portal_login SET temp_password_hash = ?, temp_password_expires = ?, requires_reset = 1 WHERE employee_id = ?',
      [tempHash, expiresAt, employeeId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Update permanent password and clear temporary credentials
   */
  updatePassword: async (employeeId, passwordHash) => {
    const [result] = await db.query(
      'UPDATE portal_login SET password_hash = ?, temp_password_hash = NULL, temp_password_expires = NULL, requires_reset = 0 WHERE employee_id = ?',
      [passwordHash, employeeId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = PortalLoginModel;
