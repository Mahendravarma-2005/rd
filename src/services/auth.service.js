const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/environment');
const ProposalModel = require('../models/proposal.model');
const PublicationModel = require('../models/publication.model');
const PortalLoginModel = require('../models/portalLogin.model');
const mailer = require('../utils/mailer');
const logger = require('../utils/logger');

const AuthService = {
  // Unified Login
  login: async ({ email, password, empCode }) => {
    // A. ProjectPi Admin Login
    if (empCode && password) {
      const admin = await ProposalModel.findAdminByEmpCode(empCode);
      if (!admin) {
        const error = new Error('Invalid employee code or password.');
        error.status = 401;
        throw error;
      }

      let isValid = await bcrypt.compare(password, admin.password_hash);
      let isTemp = false;

      if (!isValid && admin.temp_password_hash) {
        const now = new Date();
        if (new Date(admin.temp_password_expires) > now) {
          isValid = await bcrypt.compare(password, admin.temp_password_hash);
          if (isValid) isTemp = true;
        }
      }

      if (!isValid) {
        const error = new Error('Invalid employee code or password.');
        error.status = 401;
        throw error;
      }

      const token = jwt.sign(
        { id: admin.id, empCode: admin.emp_code, role: 'admin', bootId: config.SERVER_INSTANCE_ID },
        config.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        token,
        admin: { empCode: admin.emp_code, email: admin.email },
        requiresReset: isTemp || !!admin.requires_reset,
        serverBootId: config.SERVER_INSTANCE_ID
      };
    }

    // B. Student Publication Tracker Login
    if (email && password) {
      const user = await PublicationModel.findUserByEmail(email);
      if (!user) {
        const error = new Error('Invalid email or password.');
        error.status = 400;
        throw error;
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        const error = new Error('Invalid email or password.');
        error.status = 400;
        throw error;
      }

      const role = await PublicationModel.getUserRole(user.id);
      const token = jwt.sign(
        { userId: user.id, email: user.email, role, bootId: config.SERVER_INSTANCE_ID },
        config.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        success: true,
        token,
        user: { id: user.id, email: user.email },
        role,
        serverBootId: config.SERVER_INSTANCE_ID
      };
    }

    const err = new Error('Credentials missing (Email or Employee Code required).');
    err.status = 400;
    throw err;
  },

  getMe: async (userId, role) => {
    const user = await PublicationModel.findUserById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }
    return { 
      userId: user.id, 
      email: user.email, 
      role, 
      serverBootId: config.SERVER_INSTANCE_ID,
      serverBootTime: config.SERVER_BOOT_TIME 
    };
  },

  createAdminUser: async (email, password, requesterRole) => {
    if (requesterRole !== 'super_admin') {
      const err = new Error('Unauthorized: Only super_admin can create admin accounts.');
      err.status = 403;
      throw err;
    }

    const existing = await PublicationModel.findUserByEmail(email);
    if (existing) {
      const err = new Error('User already exists with this email.');
      err.status = 400;
      throw err;
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    return await PublicationModel.createUserWithRole(userId, email, passwordHash, 'admin');
  },

  forgotPassword: async (empCode) => {
    const admin = await ProposalModel.findAdminByEmpCode(empCode);
    if (!admin) {
      const err = new Error('Employee code not registered.');
      err.status = 404;
      throw err;
    }

    const tempPassword = 'Temp' + Math.floor(100000 + Math.random() * 900000);
    const tempHash = await bcrypt.hash(tempPassword, 10);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await ProposalModel.updateAdminTempPassword(empCode, tempHash, expires);
    return {
      message: 'Temporary password generated successfully.',
      tempPasswordNotice: `Temporary password set: ${tempPassword}`
    };
  },

  resetPassword: async (empCode, tempPassword, newPassword) => {
    const admin = await ProposalModel.findAdminByEmpCode(empCode);
    if (!admin) {
      const err = new Error('Admin not found.');
      err.status = 404;
      throw err;
    }

    let isValid = false;
    if (admin.temp_password_hash) {
      isValid = await bcrypt.compare(tempPassword, admin.temp_password_hash);
    }
    if (!isValid) {
      isValid = await bcrypt.compare(tempPassword, admin.password_hash);
    }
    if (!isValid) {
      const err = new Error('Invalid current or temporary password.');
      err.status = 400;
      throw err;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await ProposalModel.updateAdminPassword(empCode, newHash);
    return { message: 'Password reset successfully. You can now login.' };
  },

  // =========================================================================
  // CENTRAL LANDING PORTAL: SUPER ADMIN (PORTAL_LOGIN) AUTHENTICATION
  // =========================================================================

  /**
   * Authenticate Super Admin on Central Landing Portal using Employee ID & Password
   */
  portalLogin: async ({ employeeId, password }) => {
    if (!employeeId || !password) {
      const err = new Error('Employee ID and password are required.');
      err.status = 400;
      throw err;
    }

    const admin = await PortalLoginModel.findByEmployeeId(String(employeeId).trim());
    if (!admin) {
      const err = new Error('Invalid Employee ID or password.');
      err.status = 401;
      throw err;
    }

    // Check permanent password (support raw or client sha256 hash)
    let isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
      isValid = await bcrypt.compare(sha256Hash, admin.password_hash);
    }

    let isTemp = false;
    // If not matching permanent password, check active temporary password
    if (!isValid && admin.temp_password_hash) {
      const now = new Date();
      if (admin.temp_password_expires && new Date(admin.temp_password_expires) > now) {
        isValid = await bcrypt.compare(password, admin.temp_password_hash);
        if (!isValid) {
          const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
          isValid = await bcrypt.compare(sha256Hash, admin.temp_password_hash);
        }
        if (isValid) {
          isTemp = true;
        }
      }
    }

    if (!isValid) {
      const err = new Error('Invalid Employee ID or password.');
      err.status = 401;
      throw err;
    }

    // Generate JWT token with current SERVER_INSTANCE_ID
    const token = jwt.sign(
      {
        id: admin.id,
        employeeId: admin.employee_id,
        email: admin.email,
        role: admin.role || 'super_admin',
        bootId: config.SERVER_INSTANCE_ID
      },
      config.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return {
      success: true,
      token,
      admin: {
        id: admin.id,
        employeeId: admin.employee_id,
        email: admin.email,
        role: admin.role || 'super_admin'
      },
      mustResetPassword: isTemp || !!admin.requires_reset,
      serverBootId: config.SERVER_INSTANCE_ID
    };
  },

  /**
   * Super Admin Forgot Password: Generates temporary password & dispatches via email
   */
  portalForgotPassword: async (employeeId) => {
    if (!employeeId) {
      const err = new Error('Employee ID is required.');
      err.status = 400;
      throw err;
    }

    const admin = await PortalLoginModel.findByEmployeeId(String(employeeId).trim());
    if (!admin) {
      const err = new Error(`Employee ID ${employeeId} is not registered as a Super Administrator.`);
      err.status = 404;
      throw err;
    }

    // Generate temporary password
    const tempPassword = 'VignanTemp' + Math.floor(1000 + Math.random() * 9000);
    const tempHash = await bcrypt.hash(tempPassword, 10);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

    await PortalLoginModel.setTempPassword(admin.employee_id, tempHash, expires);

    // Dispatch email to Dean's Outlook address asynchronously (non-blocking for fast UI response)
    mailer.sendResetEmail(admin.email, 'Dean R&D / Super Admin', tempPassword)
      .catch(mErr => logger.warn(`Failed to dispatch reset email to ${admin.email}: ${mErr.message}`));

    // Mask recipient email for security
    const atIdx = admin.email.indexOf('@');
    const maskedEmail = atIdx > 3
      ? `${admin.email.substring(0, 3)}***${admin.email.substring(atIdx)}`
      : admin.email;

    return {
      success: true,
      message: `A temporary password has been successfully generated and dispatched to ${maskedEmail}.`,
      maskedEmail,
      tempPasswordNotice: tempPassword
    };
  },

  /**
   * Super Admin Reset Password: Validates existing or temp password and saves new permanent password
   */
  portalResetPassword: async ({ employeeId, currentOrTempPassword, newPassword }) => {
    if (!employeeId || !currentOrTempPassword || !newPassword) {
      const err = new Error('Employee ID, current/temporary password, and new password are required.');
      err.status = 400;
      throw err;
    }

    if (newPassword.length < 4) {
      const err = new Error('New password must be at least 4 characters.');
      err.status = 400;
      throw err;
    }

    const admin = await PortalLoginModel.findByEmployeeId(String(employeeId).trim());
    if (!admin) {
      const err = new Error('Super Admin not found.');
      err.status = 404;
      throw err;
    }

    let isValid = false;
    if (admin.temp_password_hash) {
      isValid = await bcrypt.compare(currentOrTempPassword, admin.temp_password_hash);
      if (!isValid) {
        const sha256Hash = crypto.createHash('sha256').update(currentOrTempPassword).digest('hex');
        isValid = await bcrypt.compare(sha256Hash, admin.temp_password_hash);
      }
    }

    if (!isValid) {
      isValid = await bcrypt.compare(currentOrTempPassword, admin.password_hash);
      if (!isValid) {
        const sha256Hash = crypto.createHash('sha256').update(currentOrTempPassword).digest('hex');
        isValid = await bcrypt.compare(sha256Hash, admin.password_hash);
      }
    }

    if (!isValid) {
      const err = new Error('Invalid current or temporary password.');
      err.status = 401;
      throw err;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await PortalLoginModel.updatePassword(admin.employee_id, newHash);

    return {
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    };
  },

  // Portal User OTP Authentication (Mobile & Email for Guideship, ProjectPi, Ph.D Tracking, Ph.D Part-Time)
  generateUserOtp: async ({ empId, email, mobile, portal }) => {
    if (!empId || !String(empId).trim()) {
      const err = new Error('Employee ID / Registration Number is required.');
      err.status = 400;
      throw err;
    }

    const cleanEmpId = String(empId).trim();
    let cleanMobile = String(mobile || '').replace(/[\s\-\(\)\+]/g, '');
    if (cleanMobile.length === 12 && cleanMobile.startsWith('91')) {
      cleanMobile = cleanMobile.substring(2);
    }
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const cleanPortal = String(portal || 'portal').trim().toLowerCase();

    // Require mobile (or email as fallback)
    if (!cleanMobile && !cleanEmail) {
      const err = new Error('Mobile Number is required.');
      err.status = 400;
      throw err;
    }

    if (cleanMobile && !/^\d{10}$/.test(cleanMobile)) {
      const err = new Error('Please enter a valid 10-digit mobile number.');
      err.status = 400;
      throw err;
    }

    // Portal human-readable names
    const portalNames = {
      'guideship': 'Guideship Allotment System (Faculty Recognition)',
      'project-pi': 'Project Proposals Management (ProjectPi)',
      'phd-tracking': 'Ph.D Full-Time Scholars Tracking Portal',
      'full-time-phd': 'Ph.D Full-Time Scholars Tracking Portal'
    };
    const portalDisplayName = portalNames[cleanPortal] || 'VFSTR R&D Portal';

    const db = require('../config/db');

    // For PhD Tracking portal, verify scholar exists in database
    if (cleanPortal === 'phd-tracking' || cleanPortal === 'full-time-phd') {
      const [scholars] = await db.query(
        'SELECT * FROM scholar_profiles WHERE LOWER(TRIM(reg_no)) = LOWER(?) LIMIT 1',
        [cleanEmpId]
      );
      if (!scholars || scholars.length === 0) {
        const err = new Error(`Scholar Registration Number "${cleanEmpId}" was not found in the database. Please check your registration number.`);
        err.status = 404;
        throw err;
      }
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));

    // Save to user_email_otps with 10-minute expiry
    await db.query(`
      INSERT INTO user_email_otps (emp_id, email, mobile, portal, otp_code, expires_at, is_verified)
      VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)
    `, [cleanEmpId, cleanEmail, cleanMobile, cleanPortal, otpCode]);

    // Prominently display the generated OTP in the terminal
    console.log('\n' + '═'.repeat(65));
    console.log(`📱 [PORTAL OTP GENERATED] Portal: ${portalDisplayName}`);
    console.log(`👤 EMP / REG ID:   ${cleanEmpId}`);
    if (cleanMobile) console.log(`📱 MOBILE NUMBER:  +91 ${cleanMobile}`);
    if (cleanEmail)  console.log(`📧 EMAIL ADDRESS:  ${cleanEmail}`);
    console.log(`🔐 OTP CODE:       \x1b[32m\x1b[1m${otpCode}\x1b[0m (Valid for 10 minutes)`);
    console.log('═'.repeat(65) + '\n');

    const maskedMobile = cleanMobile 
      ? `${cleanMobile.substring(0, 2)}******${cleanMobile.substring(8)}`
      : cleanEmail;

    return {
      success: true,
      message: `Verification code generated for ${cleanMobile ? '+91 ' + maskedMobile : cleanEmail}.`,
      mobile: cleanMobile,
      maskedMobile,
      expiresInMinutes: 10,
      devOtp: otpCode
    };
  },

  verifyUserOtp: async ({ empId, email, mobile, portal, otp }) => {
    if (!empId || (!email && !mobile) || !otp) {
      const err = new Error('Employee ID / Registration Number, Mobile Number, and OTP code are required.');
      err.status = 400;
      throw err;
    }

    const cleanEmpId = String(empId).trim();
    let cleanMobile = String(mobile || '').replace(/[\s\-\(\)\+]/g, '');
    if (cleanMobile.length === 12 && cleanMobile.startsWith('91')) {
      cleanMobile = cleanMobile.substring(2);
    }
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const cleanPortal = String(portal || 'portal').trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const db = require('../config/db');

    let query = `
      SELECT * FROM user_email_otps 
      WHERE LOWER(TRIM(emp_id)) = LOWER(?) AND portal = ? AND otp_code = ? AND expires_at >= NOW() AND is_verified = 0
    `;
    const params = [cleanEmpId, cleanPortal, cleanOtp];

    if (cleanMobile) {
      query += ` AND (mobile = ? OR mobile LIKE ?)`;
      params.push(cleanMobile, `%${cleanMobile}`);
    } else if (cleanEmail) {
      query += ` AND LOWER(email) = ?`;
      params.push(cleanEmail);
    }

    query += ` ORDER BY id DESC LIMIT 1`;
    const [rows] = await db.query(query, params);

    if (!rows || rows.length === 0) {
      const err = new Error('Invalid or expired OTP. Please check the code or request a new one.');
      err.status = 400;
      throw err;
    }

    const matchedRecord = rows[0];
    await db.query('UPDATE user_email_otps SET is_verified = 1 WHERE id = ?', [matchedRecord.id]);

    // Fetch scholar profile if applicable
    let scholarProfile = null;
    if (cleanPortal === 'phd-tracking' || cleanPortal === 'full-time-phd') {
      const [sp] = await db.query('SELECT * FROM scholar_profiles WHERE LOWER(TRIM(reg_no)) = LOWER(?) LIMIT 1', [cleanEmpId]);
      scholarProfile = sp[0] || null;
    }

    const token = jwt.sign(
      {
        empId: cleanEmpId,
        mobile: cleanMobile || matchedRecord.mobile,
        email: cleanEmail || matchedRecord.email,
        portal: cleanPortal,
        verified: true,
        bootId: config.SERVER_INSTANCE_ID
      },
      config.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      success: true,
      message: 'OTP verified successfully! Access granted.',
      token,
      user: {
        empId: cleanEmpId,
        mobile: cleanMobile || matchedRecord.mobile,
        email: cleanEmail || matchedRecord.email,
        portal: cleanPortal,
        verifiedAt: new Date().toISOString()
      },
      profile: scholarProfile
    };
  }
};

module.exports = AuthService;
