const AuthService = require('../services/auth.service');

const AuthController = {
  login: async (req, res, next) => {
    try {
      const { email, password, empCode } = req.body;
      const result = await AuthService.login({ email, password, empCode });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  me: async (req, res, next) => {
    try {
      const result = await AuthService.getMe(req.user.userId, req.user.role);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  createAdminUser: async (req, res, next) => {
    try {
      const { new_email, new_password } = req.body;
      if (!new_email || !new_password) {
        return res.status(400).json({ message: 'Email and password required.' });
      }
      const user = await AuthService.createAdminUser(new_email, new_password, req.user.role);
      return res.json({ success: true, user_id: user.id, role: user.role });
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { empCode } = req.body;
      if (!empCode) {
        return res.status(400).json({ message: 'Employee Code required.' });
      }
      const result = await AuthService.forgotPassword(empCode);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { empCode, tempPassword, newPassword } = req.body;
      if (!empCode || !tempPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing fields.' });
      }
      const result = await AuthService.resetPassword(empCode, tempPassword, newPassword);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getServerInstance: (req, res) => {
    const config = require('../config/environment');
    return res.json({
      serverBootId: config.SERVER_INSTANCE_ID,
      bootTime: config.SERVER_BOOT_TIME
    });
  },

  // Central Landing Portal Super Admin
  portalLogin: async (req, res, next) => {
    try {
      const { employee_id, employeeId, password } = req.body;
      const targetEmpId = employee_id || employeeId;
      const result = await AuthService.portalLogin({ employeeId: targetEmpId, password });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  portalForgotPassword: async (req, res, next) => {
    try {
      const { employee_id, employeeId } = req.body;
      const targetEmpId = employee_id || employeeId;
      const result = await AuthService.portalForgotPassword(targetEmpId);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  portalResetPassword: async (req, res, next) => {
    try {
      const { employee_id, employeeId, currentOrTempPassword, tempPassword, newPassword } = req.body;
      const targetEmpId = employee_id || employeeId;
      const targetCurrentPass = currentOrTempPassword || tempPassword;
      const result = await AuthService.portalResetPassword({
        employeeId: targetEmpId,
        currentOrTempPassword: targetCurrentPass,
        newPassword
      });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // Portal OTP Authentication (Mobile / Email)
  sendOtp: async (req, res, next) => {
    try {
      const { empId, employee_id, employeeId, regNo, email, mobile, mobileNumber, phone, portal } = req.body;
      const targetEmpId = empId || employee_id || employeeId || regNo;
      const targetMobile = mobile || mobileNumber || phone;
      const result = await AuthService.generateUserOtp({ empId: targetEmpId, email, mobile: targetMobile, portal });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const { empId, employee_id, employeeId, regNo, email, mobile, mobileNumber, phone, portal, otp, otpCode } = req.body;
      const targetEmpId = empId || employee_id || employeeId || regNo;
      const targetMobile = mobile || mobileNumber || phone;
      const targetOtp = otp || otpCode;
      const result = await AuthService.verifyUserOtp({ empId: targetEmpId, email, mobile: targetMobile, portal, otp: targetOtp });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
