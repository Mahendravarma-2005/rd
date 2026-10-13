const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

// Multi-App Login (ProjectPi + Student Publication)
router.post(
  ['/api/auth/login', '/student-publication/api/auth/login', '/project-pi/api/auth/login'],
  AuthController.login
);

// Publication: Get Current User Profile
router.get(
  ['/api/auth/me', '/student-publication/api/auth/me'],
  authenticateJWT,
  AuthController.me
);

// Publication: Create Admin User (Super Admin only)
router.post(
  ['/api/auth/create-admin-user', '/student-publication/api/auth/create-admin-user'],
  authenticateJWT,
  AuthController.createAdminUser
);

// ProjectPi: Forgot Password & Reset Password
router.post(
  ['/api/auth/forgot-password', '/project-pi/api/auth/forgot-password'],
  AuthController.forgotPassword
);

router.post(
  ['/api/auth/reset-password', '/project-pi/api/auth/reset-password'],
  AuthController.resetPassword
);

// Server Instance / Boot Check (Used by clients to detect server restart and clear sessions)
router.get(
  ['/api/auth/server-instance', '/student-publication/api/auth/server-instance', '/project-pi/api/auth/server-instance'],
  AuthController.getServerInstance
);

// Central Landing Portal Super Admin (portal_login)
router.post(
  ['/api/portal/login', '/api/central-admin/login'],
  AuthController.portalLogin
);

router.post(
  ['/api/portal/forgot-password', '/api/central-admin/forgot-password'],
  AuthController.portalForgotPassword
);

router.post(
  ['/api/portal/reset-password', '/api/central-admin/reset-password'],
  AuthController.portalResetPassword
);

// Portal User OTP Authentication (Guideship, ProjectPi, Ph.D Full-Time Tracking)
router.post(
  [
    '/api/auth/otp/send',
    '/api/auth/otp/generate',
    '/guideship/api/auth/otp/send',
    '/project-pi/api/auth/otp/send',
    '/phd-tracking/api/auth/otp/send'
  ],
  AuthController.sendOtp
);

router.post(
  [
    '/api/auth/otp/verify',
    '/guideship/api/auth/otp/verify',
    '/project-pi/api/auth/otp/verify',
    '/phd-tracking/api/auth/otp/verify'
  ],
  AuthController.verifyOtp
);

module.exports = router;
