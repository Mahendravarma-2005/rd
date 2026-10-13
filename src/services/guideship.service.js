const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const GuideshipModel = require('../models/guideship.model');
const mailer = require('../utils/mailer');
const logger = require('../utils/logger');

const toArray = (val) => (!val ? [] : Array.isArray(val) ? val : [val]);

const GuideshipService = {
  submitApplication: async (body) => {
    const {
      faculty_name, employee_id, email, designation, level,
      joining_date, department, phd_award_date, phd_institute
    } = body;

    const appData = {
      faculty_name, employee_id, email, designation, level,
      joining_date, department, phd_award_date, phd_institute
    };

    const paper_titles = toArray(body.paper_title || body['paper_title[]']);
    const authors_list = toArray(body.authors || body['authors[]']);
    const corresponding_authors = toArray(body.corresponding_author || body['corresponding_author[]']);
    const journal_titles = toArray(body.journal_title || body['journal_title[]']);
    const dois = toArray(body.doi || body['doi[]']);
    const paper_indexes = toArray(body.paper_index || body['paper_index[]']);
    const h_indices = toArray(body.h_index || body['h_index[]']);
    const quartiles = toArray(body.quartile || body['quartile[]']);
    const impact_factors = toArray(body.impact_factor || body['impact_factor[]']);
    const submission_dates = toArray(body.submission_date || body['submission_date[]']);
    const revision_dates = toArray(body.revision_date || body['revision_date[]']);
    const acceptance_dates = toArray(body.acceptance_date || body['acceptance_date[]']);
    const scope_dbs = toArray(body.scope_db_since || body['scope_db_since[]']);
    const comments = toArray(body.review_comments || body['review_comments[]']);
    const apcs = toArray(body.apc_charges || body['apc_charges[]']);

    const publications = [];
    for (let i = 0; i < paper_titles.length; i++) {
      if (!paper_titles[i]) continue;
      publications.push({
        paper_title: paper_titles[i],
        authors: authors_list[i] || '',
        corresponding_author: corresponding_authors[i] || '',
        journal_title: journal_titles[i] || '',
        doi: dois[i] || '',
        paper_index: paper_indexes[i] || '',
        h_index: h_indices[i],
        quartile: quartiles[i] || '',
        impact_factor: impact_factors[i] || '',
        submission_date: submission_dates[i] || null,
        revision_date: revision_dates[i] || null,
        acceptance_date: acceptance_dates[i] || null,
        scope_db_since: scope_dbs[i] || '',
        review_comments: comments[i] || '',
        apc_charges: apcs[i] || ''
      });
    }

    return await GuideshipModel.createApplicationWithPubs(appData, publications);
  },

  adminLogin: async (employeeId, rawPassword) => {
    const adminUser = await GuideshipModel.findAdminById(employeeId);
    if (!adminUser) {
      const err = new Error('Invalid Employee ID or password.');
      err.status = 401;
      throw err;
    }

    const match = await bcrypt.compare(rawPassword, adminUser.password_hash);
    if (!match) {
      const err = new Error('Invalid Employee ID or password.');
      err.status = 401;
      throw err;
    }

    return {
      admin: {
        id: adminUser.employee_id,
        name: adminUser.faculty_name,
        role: adminUser.role
      },
      mustChangePassword: !!adminUser.is_temp_password
    };
  },

  adminForgotPassword: async (employeeId) => {
    const empId = parseInt(employeeId, 10);
    const adminUser = await GuideshipModel.findAdminById(empId);
    if (!adminUser) {
      const err = new Error('Employee ID is not registered as an administrator.');
      err.status = 404;
      throw err;
    }

    const settingsMap = await GuideshipModel.getAllSettings();
    const expectedEmail = empId === 1001 
      ? (settingsMap['deanEmail'] || 'dean.rd@vignan.ac.in') 
      : (settingsMap['adeanEmail'] || 'assistant.dean@vignan.ac.in');

    const tempPassword = 'VignanTemp' + Math.floor(1000 + Math.random() * 9000);
    const sha256Hash = crypto.createHash('sha256').update(tempPassword).digest('hex');
    const bcryptHash = await bcrypt.hash(sha256Hash, 10);

    await GuideshipModel.updateAdminPassword(empId, bcryptHash, true);

    try {
      mailer.sendResetEmail(expectedEmail, adminUser.faculty_name, tempPassword)
        .catch(mErr => logger.warn('Mail send notification: ' + mErr.message));
    } catch (mErr) {
      logger.warn('Mail send notification: ' + mErr.message);
    }

    const maskedEmail = expectedEmail.length > 5 
      ? `${expectedEmail.substring(0, 3)}***${expectedEmail.substring(expectedEmail.indexOf('@'))}`
      : expectedEmail;

    return {
      tempPassword,
      maskedEmail
    };
  },

  adminChangePassword: async (employeeId, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const newBcryptHash = await bcrypt.hash(newPassword, salt);
    await GuideshipModel.updateAdminPassword(employeeId, newBcryptHash, false);
    return { success: true };
  },

  updateRecoveryEmails: async (deanEmail, adeanEmail) => {
    await GuideshipModel.saveSetting('deanEmail', deanEmail || '');
    await GuideshipModel.saveSetting('adeanEmail', adeanEmail || '');
    return { success: true };
  },

  getDashboardData: async () => {
    const guides = await GuideshipModel.getAllGuides();
    const stats = await GuideshipModel.getDashboardStats();
    return {
      guides,
      ...stats
    };
  },

  registerGuide: async (data) => {
    return await GuideshipModel.createGuide(data);
  },

  getGuide: async (employeeId) => {
    return await GuideshipModel.getGuideById(employeeId);
  },

  updateGuide: async (data) => {
    return await GuideshipModel.updateGuide(data);
  },

  deleteGuide: async (employeeId) => {
    return await GuideshipModel.deleteGuide(employeeId);
  },

  getProposals: async () => {
    return await GuideshipModel.getAllApplicationsWithPubs();
  },

  evaluateProposal: async (applicationId, action, remarks, scorePoints, allocatedDate) => {
    const result = await GuideshipModel.evaluateApplication(applicationId, action, remarks, scorePoints, allocatedDate);
    const { appDetails } = result;

    if (appDetails && appDetails.email) {
      const emailPayload = {
        toEmail: appDetails.email,
        facultyName: appDetails.faculty_name,
        employeeId: appDetails.employee_id,
        department: appDetails.department,
        designation: appDetails.designation,
        scorePoints: scorePoints || 0,
        deanRemarks: remarks || (action === 'approve' ? 'Recommended and Approved for Ph.D. Guideship' : 'Criteria not fulfilled at this stage.'),
        remarks: remarks || (action === 'approve' ? 'Recommended and Approved for Ph.D. Guideship' : 'Criteria not fulfilled at this stage.'),
        allocatedDate: allocatedDate || new Date().toISOString().split('T')[0],
        applicationId: applicationId
      };

      try {
        if (action === 'approve') {
          mailer.sendApprovalEmail(emailPayload)
            .catch(mErr => logger.warn(`[Guideship Email Warn] Failed sending approval email: ${mErr.message}`));
        } else {
          mailer.sendRejectionEmail(emailPayload)
            .catch(mErr => logger.warn(`[Guideship Email Warn] Failed sending rejection email: ${mErr.message}`));
        }
      } catch (err) {
        logger.warn(`[Guideship Email Warn] Exception invoking mailer: ${err.message}`);
      }
    } else {
      logger.warn(`[Guideship Evaluation] Proposal #${applicationId} has no recipient email. Notification skipped.`);
    }

    return result;
  },

  getAnalytics: async () => {
    const { deptRows, activeGuides, totalProposals, totalPapers } = await GuideshipModel.getAnalyticsMetrics();
    const deptFtCounts = {};
    const deptPtCounts = {};
    deptRows.forEach(r => {
      deptFtCounts[r.department] = parseInt(r.ft_count || 0);
      deptPtCounts[r.department] = parseInt(r.pt_count || 0);
    });

    return {
      deptFtCounts,
      deptPtCounts,
      yearCounts: { '2023': 12, '2024': 18, '2025': 24, '2026': 30 },
      activeGuides,
      totalProposals,
      totalPapers
    };
  },

  getSettings: async () => {
    return await GuideshipModel.getAllSettings();
  },

  saveSettings: async (settingsObj) => {
    for (const [key, val] of Object.entries(settingsObj)) {
      await GuideshipModel.saveSetting(key, val);
    }
    return { success: true };
  }
};

module.exports = GuideshipService;
