const PhdService = require('../services/phd.service');

const PhdController = {
  // 1. Get Scholar Profile by Registration Number
  getProfile: async (req, res, next) => {
    try {
      const regNo = req.params.regNo;
      const profile = await PhdService.getScholarProfile(regNo);
      if (profile) {
        return res.json({ success: true, found: true, profile, source: 'mysql' });
      }
      return res.json({ success: true, found: false, profile: null });
    } catch (err) {
      next(err);
    }
  },

  // 2. Get All Registered Scholar Master Profiles
  getAllProfiles: async (req, res, next) => {
    try {
      const list = await PhdService.getAllMasterProfiles();
      return res.json({ success: true, data: list, count: list.length, source: 'mysql' });
    } catch (err) {
      next(err);
    }
  },

  // 3. Get All Monthly Progress Report Submissions
  getAllSubmissions: async (req, res, next) => {
    try {
      const list = await PhdService.getAllSubmissions();
      return res.json({ success: true, data: list, source: 'mysql' });
    } catch (err) {
      next(err);
    }
  },

  // 3b. Get Submissions for a Specific Scholar (History)
  getScholarSubmissions: async (req, res, next) => {
    try {
      const regNo = req.params.regNo;
      const list = await PhdService.getScholarSubmissions(regNo);
      return res.json({ success: true, data: list, count: list.length, source: 'mysql' });
    } catch (err) {
      next(err);
    }
  },

  // 4. Save Monthly Progress Report Submission
  saveSubmission: async (req, res, next) => {
    try {
      const record = await PhdService.saveMonthlySubmission(req.body);
      return res.json({ success: true, data: record });
    } catch (err) {
      if (err.code === 'DUPLICATE_SUBMISSION' || err.code === 'ER_DUP_ENTRY' || err.status === 409) {
        return res.status(409).json({
          success: false,
          error: 'DUPLICATE_SUBMISSION',
          message: err.message || 'A monthly progress report for this month has already been submitted for this scholar. Duplicate submissions are not allowed.',
          existingId: err.existingId || null,
          createdAt: err.createdAt || null
        });
      }
      next(err);
    }
  },

  // 5. Delete Submission by ID
  deleteSubmission: async (req, res, next) => {
    try {
      const id = req.params.id;
      await PhdService.deleteSubmission(id);
      return res.json({ success: true, message: 'Record deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  // 6. Admin Login Authentication
  adminLogin: async (req, res, next) => {
    try {
      const { username, password } = req.body || {};
      const result = await PhdService.verifyAdminCredentials(username, password);
      if (result.valid) {
        return res.json({
          success: true,
          message: 'Authentication successful',
          user: result.user
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative email address or password'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PhdController;
