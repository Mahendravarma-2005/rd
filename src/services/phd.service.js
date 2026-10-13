const PhdModel = require('../models/phd.model');

const PhdService = {
  /**
   * Get Scholar Profile by Registration Number
   */
  getScholarProfile: async (regNo) => {
    if (!regNo || typeof regNo !== 'string') return null;
    return await PhdModel.getScholarProfile(regNo.trim());
  },

  /**
   * Get All Master Scholar Profiles
   */
  getAllMasterProfiles: async () => {
    return await PhdModel.getAllMasterProfiles();
  },

  /**
   * Get All Monthly Progress Report Submissions
   */
  getAllSubmissions: async () => {
    return await PhdModel.getAllSubmissions();
  },

  /**
   * Get All Monthly Progress Report Submissions for a Specific Scholar
   */
  getScholarSubmissions: async (regNo) => {
    if (!regNo || typeof regNo !== 'string') return [];
    return await PhdModel.getSubmissionsByScholar(regNo.trim());
  },

  /**
   * Validate and Save Monthly Progress Report Submission
   */
  saveMonthlySubmission: async (payload) => {
    if (!payload || !payload.regNo || !payload.scholarName) {
      const err = new Error('Registration No and Scholar Name are required');
      err.status = 400;
      throw err;
    }

    const record = {
      ...payload,
      id: payload.id || 'rec_' + Date.now(),
      createdAt: payload.createdAt || new Date().toISOString()
    };

    await PhdModel.saveMonthlySubmission(record);
    return record;
  },

  /**
   * Delete Monthly Submission by ID
   */
  deleteSubmission: async (id) => {
    if (!id) {
      const err = new Error('Submission ID is required');
      err.status = 400;
      throw err;
    }
    return await PhdModel.deleteSubmission(id);
  },

  /**
   * Verify Administrative Credentials
   */
  verifyAdminCredentials: async (username, password) => {
    return await PhdModel.verifyAdminCredentials(username, password);
  }
};

module.exports = PhdService;
