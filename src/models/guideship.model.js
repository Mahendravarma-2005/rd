const db = require('../config/db');

const GuideshipModel = {
  // Admin Users
  findAdminById: async (employeeId) => {
    const [rows] = await db.query('SELECT * FROM admin_users WHERE employee_id = ?', [employeeId]);
    return rows[0] || null;
  },

  updateAdminPassword: async (employeeId, passwordHash, isTemp = false) => {
    await db.query('UPDATE admin_users SET password_hash = ?, is_temp_password = ? WHERE employee_id = ?', [
      passwordHash,
      isTemp ? 1 : 0,
      employeeId
    ]);
  },

  // Settings
  getAllSettings: async () => {
    const [rows] = await db.query('SELECT config_key, config_value FROM settings');
    const settings = {};
    rows.forEach(r => { settings[r.config_key] = r.config_value; });
    return settings;
  },

  saveSetting: async (key, val) => {
    await db.query(
      'INSERT INTO settings (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)',
      [key, val]
    );
  },

  // Guides
  getAllGuides: async () => {
    const [rows] = await db.query('SELECT * FROM guides ORDER BY guide_name ASC');
    return rows;
  },

  getGuideById: async (employeeId) => {
    const [rows] = await db.query('SELECT * FROM guides WHERE employee_id = ?', [employeeId]);
    return rows[0] || null;
  },

  createGuide: async (guide) => {
    const allocDate = guide.allocated_date || new Date().toISOString().split('T')[0];
    await db.query(
      'INSERT INTO guides (employee_id, guide_name, department, designation, in_service, remarks, ft_count, pt_count, awarded_count, allocated_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)',
      [
        guide.employee_id, guide.guide_name, guide.department, guide.designation,
        guide.in_service || 'No', guide.remarks, parseInt(guide.ft_count || 0),
        parseInt(guide.pt_count || 0), allocDate
      ]
    );
  },

  updateGuide: async (guide) => {
    await db.query(
      'UPDATE guides SET guide_name = ?, department = ?, designation = ?, in_service = ?, remarks = ?, ft_count = ?, pt_count = ?, awarded_count = ?, allocated_date = COALESCE(NULLIF(?, ""), allocated_date, CURDATE()) WHERE employee_id = ?',
      [
        guide.guide_name, guide.department, guide.designation, guide.in_service || 'No',
        guide.remarks, parseInt(guide.ft_count || 0), parseInt(guide.pt_count || 0),
        parseInt(guide.awarded_count || 0), guide.allocated_date || null, guide.employee_id
      ]
    );
  },

  deleteGuide: async (employeeId) => {
    await db.query('DELETE FROM guides WHERE employee_id = ?', [employeeId]);
  },

  getDashboardStats: async () => {
    const [[{ totalScholars }]] = await db.query('SELECT (SUM(ft_count) + SUM(pt_count)) AS totalScholars FROM guides');
    const [deptRows] = await db.query('SELECT department, COUNT(*) AS guideCount FROM guides GROUP BY department');
    const [[{ awardedCount }]] = await db.query('SELECT SUM(awarded_count) AS awardedCount FROM guides');
    return {
      totalScholars: totalScholars || 0,
      deptBreakdown: deptRows,
      awardedCount: awardedCount || 0
    };
  },

  getAnalyticsMetrics: async () => {
    const [deptRows] = await db.query(`
      SELECT department, SUM(ft_count) AS ft_count, SUM(pt_count) AS pt_count
      FROM guides GROUP BY department
    `);
    const [[{ activeGuides }]] = await db.query("SELECT COUNT(*) AS activeGuides FROM guides WHERE in_service = 'Yes'");
    const [[{ totalProposals }]] = await db.query("SELECT COUNT(*) AS totalProposals FROM supervisor_applications");
    const [[{ totalPapers }]] = await db.query("SELECT COUNT(*) AS totalPapers FROM publications");
    return {
      deptRows,
      activeGuides: activeGuides || 0,
      totalProposals: totalProposals || 0,
      totalPapers: totalPapers || 0
    };
  },

  // Supervisor Applications
  getPendingCount: async () => {
    const [[result]] = await db.query("SELECT COUNT(*) AS pendingCount FROM supervisor_applications WHERE status = 'Pending'");
    return result ? result.pendingCount : 0;
  },

  createApplicationWithPubs: async (appData, publications) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [res] = await conn.query(`
        INSERT INTO supervisor_applications 
        (faculty_name, employee_id, email, designation, level, joining_date, department, school, thesis_title, phd_award_date, phd_institute, phd_publications, other_publications)
        VALUES (?, ?, ?, ?, ?, ?, ?, '', '', ?, ?, '', '')
      `, [
        appData.faculty_name, appData.employee_id, appData.email, appData.designation,
        appData.level, appData.joining_date || null, appData.department,
        appData.phd_award_date, appData.phd_institute
      ]);

      const appId = res.insertId;
      for (const pub of publications) {
        if (!pub.paper_title) continue;
        await conn.query(`
          INSERT INTO supervisor_publications 
          (application_id, paper_title, authors, corresponding_author, journal_title, doi, paper_index, h_index, quartile, impact_factor, submission_date, revision_date, acceptance_date, scope_db_since, review_comments, apc_charges)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          appId, pub.paper_title, pub.authors || '', pub.corresponding_author || '',
          pub.journal_title || '', pub.doi || '', pub.paper_index || '', pub.h_index ? parseInt(pub.h_index) : null,
          pub.quartile || '', pub.impact_factor || '', pub.submission_date || null, pub.revision_date || null,
          pub.acceptance_date || null, pub.scope_db_since || '', pub.review_comments || '', pub.apc_charges || ''
        ]);
      }

      await conn.commit();
      return appId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  getAllApplicationsWithPubs: async () => {
    const [proposals] = await db.query('SELECT * FROM supervisor_applications ORDER BY created_at DESC');
    for (const p of proposals) {
      const [pubs] = await db.query('SELECT * FROM supervisor_publications WHERE application_id = ?', [p.id]);
      p.publications = pubs;
    }
    return proposals;
  },

  evaluateApplication: async (applicationId, action, remarks, scorePoints, allocatedDate) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [[appDetails]] = await conn.query('SELECT * FROM supervisor_applications WHERE id = ?', [applicationId]);
      if (!appDetails || appDetails.status !== 'Pending') {
        throw new Error("Application not found or already processed.");
      }
      const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
      await conn.query(
        'UPDATE supervisor_applications SET status = ?, score_points = ?, dean_remarks = ? WHERE id = ?', 
        [newStatus, scorePoints || 0, remarks || '', applicationId]
      );

      if (action === 'approve') {
        const finalAllocDate = allocatedDate || new Date().toISOString().split('T')[0];
        await conn.query(`
          INSERT INTO guides (employee_id, guide_name, department, designation, in_service, remarks, allocated_date)
          VALUES (?, ?, ?, ?, 'Yes', ?, ?)
          ON DUPLICATE KEY UPDATE 
            guide_name = VALUES(guide_name), 
            department = VALUES(department), 
            designation = VALUES(designation), 
            in_service = 'Yes', 
            allocated_date = COALESCE(VALUES(allocated_date), allocated_date, CURDATE())
        `, [
          appDetails.employee_id, appDetails.faculty_name, appDetails.department,
          appDetails.designation, `Recognized via Proposal #${applicationId}. Ph.D. from ${appDetails.phd_institute || 'N/A'}.`,
          finalAllocDate
        ]);
      }

      await conn.commit();
      return { success: true, newStatus, appDetails };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = GuideshipModel;
