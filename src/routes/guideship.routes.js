const express = require('express');
const router = express.Router();
const GuideshipController = require('../controllers/guideship.controller');
const { requireGuideshipAdmin } = require('../middlewares/auth.middleware');

// Public Recognition Form
router.get(
  ['/guideship', '/guideship/apply'],
  GuideshipController.renderApplyForm
);

router.post(
  ['/recognition/apply', '/guideship/recognition/apply'],
  GuideshipController.submitApplication
);

// Admin Authentication
router.get(
  ['/admin', '/admin/login', '/guideship/admin', '/guideship/admin/login'],
  GuideshipController.renderLogin
);

router.post(
  ['/admin/login', '/guideship/admin/login'],
  GuideshipController.login
);

router.get(
  ['/admin/logout', '/guideship/admin/logout'],
  GuideshipController.logout
);

router.get(
  ['/admin/forgot-password', '/guideship/admin/forgot-password'],
  GuideshipController.renderForgotPassword
);

router.post(
  ['/admin/forgot-password', '/guideship/admin/forgot-password'],
  GuideshipController.forgotPassword
);

router.post(
  ['/admin/change-password', '/guideship/admin/change-password'],
  requireGuideshipAdmin,
  GuideshipController.changePassword
);

router.post(
  ['/admin/update-recovery-emails', '/guideship/admin/update-recovery-emails'],
  requireGuideshipAdmin,
  GuideshipController.updateRecoveryEmails
);

// Admin Dashboard
router.get(
  ['/dashboard', '/guideship/dashboard'],
  requireGuideshipAdmin,
  GuideshipController.renderDashboard
);

// Guide Management CRUD
router.get(
  ['/guide/register', '/guideship/guide/register'],
  requireGuideshipAdmin,
  GuideshipController.renderRegisterGuide
);

router.post(
  ['/guide/register', '/guideship/guide/register'],
  requireGuideshipAdmin,
  GuideshipController.registerGuide
);

router.get(
  ['/guide/edit/:id', '/guideship/guide/edit/:id'],
  requireGuideshipAdmin,
  GuideshipController.renderEditGuide
);

router.post(
  ['/guide/update', '/guideship/guide/update'],
  requireGuideshipAdmin,
  GuideshipController.updateGuide
);

router.post(
  ['/guide/delete/:id', '/guideship/guide/delete/:id'],
  requireGuideshipAdmin,
  GuideshipController.deleteGuide
);

router.get(
  ['/api/guide/:id', '/guideship/api/guide/:id'],
  requireGuideshipAdmin,
  GuideshipController.getGuideApi
);

// Supervisor Proposals
router.get(
  ['/recognition/proposals', '/guideship/recognition/proposals'],
  requireGuideshipAdmin,
  GuideshipController.renderProposals
);

router.post(
  ['/recognition/proposal/evaluate', '/guideship/recognition/proposal/evaluate'],
  requireGuideshipAdmin,
  GuideshipController.evaluateProposal
);

// Analytics
router.get(
  ['/analytics', '/guideship/analytics'],
  requireGuideshipAdmin,
  GuideshipController.renderAnalytics
);

// Settings
router.get(
  ['/settings', '/guideship/settings'],
  requireGuideshipAdmin,
  GuideshipController.renderSettings
);

router.post(
  ['/settings', '/guideship/settings'],
  requireGuideshipAdmin,
  GuideshipController.saveSettings
);

module.exports = router;
