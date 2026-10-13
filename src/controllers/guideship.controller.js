const GuideshipService = require('../services/guideship.service');
const logger = require('../utils/logger');
const config = require('../config/environment');

const GuideshipController = {
  // Public Apply Form
  renderApplyForm: (req, res) => {
    res.render('apply_recognition.html');
  },

  submitApplication: async (req, res) => {
    try {
      await GuideshipService.submitApplication(req.body);
      res.redirect('/guideship?success=true');
    } catch (err) {
      logger.error('Supervisor application error: ' + err.message);
      res.redirect('/guideship?error=' + encodeURIComponent('Error submitting supervisor application.'));
    }
  },

  // Auth (Direct Access - Login & Forgot Password Pages Removed)
  renderLogin: (req, res) => {
    res.redirect('/dashboard');
  },

  login: async (req, res) => {
    res.redirect('/dashboard');
  },

  logout: (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('vignan_rd_sid');
        res.redirect('/');
      });
    } else {
      res.clearCookie('vignan_rd_sid');
      res.redirect('/');
    }
  },

  renderForgotPassword: (req, res) => {
    res.redirect('/dashboard');
  },

  forgotPassword: async (req, res) => {
    res.redirect('/dashboard');
  },

  changePassword: async (req, res) => {
    const { new_password_hash } = req.body;
    const employee_id = req.session.admin ? req.session.admin.id : null;
    if (!new_password_hash) {
      return res.redirect('/settings?error=' + encodeURIComponent('Missing password details.'));
    }
    try {
      await GuideshipService.adminChangePassword(employee_id, new_password_hash);
      if (req.session) {
        req.session.mustChangePassword = false;
      }
      res.redirect('/settings?password_success=true');
    } catch (err) {
      logger.error('Password update error: ' + err.message);
      res.redirect('/settings?error=' + encodeURIComponent('Error updating password.'));
    }
  },

  updateRecoveryEmails: async (req, res) => {
    const { deanEmail, adeanEmail } = req.body;
    try {
      await GuideshipService.updateRecoveryEmails(deanEmail, adeanEmail);
      res.redirect('/settings?success=true');
    } catch (err) {
      logger.error('Update recovery email error: ' + err.message);
      res.redirect('/settings?error=' + encodeURIComponent('Error updating recovery email credentials.'));
    }
  },

  // Dashboard & Guide Management
  renderDashboard: async (req, res) => {
    try {
      const data = await GuideshipService.getDashboardData();
      res.render('demo_dashboard.html', data);
    } catch (err) {
      logger.error('Dashboard error: ' + err.message);
      res.status(500).send('Error loading Guideship dashboard.');
    }
  },

  renderRegisterGuide: (req, res) => {
    res.render('register_guide.html');
  },

  registerGuide: async (req, res) => {
    try {
      await GuideshipService.registerGuide(req.body);
      res.redirect('/dashboard?success=true');
    } catch (err) {
      res.redirect('/dashboard?error=true');
    }
  },

  renderEditGuide: async (req, res) => {
    try {
      const guide = await GuideshipService.getGuide(req.params.id);
      if (!guide) return res.redirect('/dashboard');
      res.render('edit_guide.html', { guide });
    } catch (err) {
      res.redirect('/dashboard');
    }
  },

  updateGuide: async (req, res) => {
    try {
      await GuideshipService.updateGuide(req.body);
      res.redirect('/dashboard?success=true');
    } catch (err) {
      res.redirect('/dashboard?error=true');
    }
  },

  deleteGuide: async (req, res) => {
    try {
      await GuideshipService.deleteGuide(req.params.id);
      res.redirect('/dashboard?success=true');
    } catch (err) {
      res.redirect('/dashboard?error=true');
    }
  },

  getGuideApi: async (req, res) => {
    try {
      const guide = await GuideshipService.getGuide(req.params.id);
      if (!guide) return res.status(404).json({ error: 'Guide not found' });
      res.json({ guide });
    } catch (err) {
      res.status(500).json({ error: 'Database query failed' });
    }
  },

  // Supervisor Proposals
  renderProposals: async (req, res) => {
    try {
      const proposals = await GuideshipService.getProposals();
      res.render('proposals.html', { proposals });
    } catch (err) {
      logger.error('Proposals error: ' + err.message);
      res.status(500).send('Error loading supervisor recognition proposals.');
    }
  },

  evaluateProposal: async (req, res) => {
    const { application_id, action, remarks, score_points, allocated_date } = req.body;
    try {
      await GuideshipService.evaluateProposal(application_id, action, remarks, score_points, allocated_date);
      res.redirect('/recognition/proposals?success=true');
    } catch (err) {
      logger.error('Evaluate proposal error: ' + err.message);
      res.redirect('/recognition/proposals?error=true');
    }
  },

  // Analytics
  renderAnalytics: async (req, res) => {
    try {
      const analyticsData = await GuideshipService.getAnalytics();
      res.render('rd_analytics.html', analyticsData);
    } catch (err) {
      logger.error('Analytics error: ' + err.message);
      res.status(500).send('Error loading analytics.');
    }
  },

  // Settings
  renderSettings: async (req, res) => {
    try {
      const settings = await GuideshipService.getSettings();
      res.render('settings.html', {
        settings,
        error: req.query.error,
        success: req.query.success
      });
    } catch (err) {
      res.status(500).send('Error loading settings.');
    }
  },

  saveSettings: async (req, res) => {
    try {
      await GuideshipService.saveSettings(req.body);
      res.redirect('/settings?success=true');
    } catch (err) {
      res.redirect('/settings?error=true');
    }
  }
};

module.exports = GuideshipController;
