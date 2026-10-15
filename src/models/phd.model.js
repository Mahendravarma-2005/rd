const db = require('../config/db');
const bcrypt = require('bcryptjs');

function ensure3YearERA(endOfRA, dateOfJoining, regNo) {
  if (endOfRA) return endOfRA;
  if (dateOfJoining) {
    const d = new Date(dateOfJoining);
    d.setFullYear(d.getFullYear() + 3);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }
  const m = (regNo || '').match(/^(\d{2})/);
  if (m) {
    const yr = 2000 + parseInt(m[1], 10);
    return `${yr + 3}-07-31`;
  }
  const now = new Date();
  now.setFullYear(now.getFullYear() + 3);
  return now.toISOString().split('T')[0];
}

const PhdModel = {
  /**
   * Fetch Permanent Scholar Profile from MySQL
   */
  getScholarProfile: async (regNo) => {
    const clean = (regNo || '').trim();
    if (!clean) return null;

    const [rows] = await db.query(
      `SELECT * FROM scholar_profiles WHERE LOWER(TRIM(reg_no)) = LOWER(?) LIMIT 1`,
      [clean]
    );

    if (rows && rows.length > 0) {
      const r = rows[0];
      let courseDetails = [];
      try {
        const [lastSub] = await db.query(
          `SELECT id FROM monthly_submissions WHERE LOWER(TRIM(reg_no)) = LOWER(?) ORDER BY created_at DESC LIMIT 1`,
          [clean]
        );
        if (lastSub && lastSub.length > 0) {
          const [courses] = await db.query(
            `SELECT course_code as courseCode, course_name as courseName, course_type as courseType, credits, formative_marks as formativeMarks, summative_marks as summativeMarks, grade, cgpa, result, DATE_FORMAT(completion_date, '%Y-%m-%d') as completionDate FROM courses_completed_details WHERE submission_id = ?`,
            [lastSub[0].id]
          );
          courseDetails = courses || [];
        }
      } catch (err) {}

      return {
        regNo: r.reg_no,
        scholarName: r.scholar_name,
        guideName: r.guide_name,
        department: r.department,
        raType: r.ra_type,
        bankAccountNo: r.bank_account_no || '',
        bankName: r.bank_name || 'State Bank of India',
        ifscCode: r.ifsc_code || 'SBIN0001234',
        dateOfJoining: r.date_of_joining ? (r.date_of_joining instanceof Date ? r.date_of_joining.toISOString().split('T')[0] : String(r.date_of_joining).split('T')[0]) : '',
        endOfRA: ensure3YearERA(
          r.end_of_ra ? (r.end_of_ra instanceof Date ? r.end_of_ra.toISOString().split('T')[0] : String(r.end_of_ra).split('T')[0]) : '',
          r.date_of_joining,
          r.reg_no
        ),
        scholarContact: r.scholar_contact || '',
        supervisorContact: r.supervisor_contact || '',
        qualifyingDegree: r.qualifying_degree || '',
        degreePercentage: r.degree_percentage || '',
        degreeClass: r.degree_class || '',
        coursesCompleted: r.courses_completed || 0,
        courseDetails: courseDetails
      };
    }
    return null;
  },

  /**
   * Save or Update Permanent Scholar Profile in MySQL
   */
  saveScholarProfile: async (profile) => {
    await db.query(`
      INSERT INTO scholar_profiles 
      (reg_no, scholar_name, guide_name, department, ra_type, bank_account_no, bank_name, ifsc_code, date_of_joining, end_of_ra, scholar_contact, supervisor_contact, qualifying_degree, degree_percentage, degree_class, courses_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        scholar_name = VALUES(scholar_name),
        guide_name = VALUES(guide_name),
        department = VALUES(department),
        ra_type = VALUES(ra_type),
        bank_account_no = VALUES(bank_account_no),
        bank_name = VALUES(bank_name),
        ifsc_code = VALUES(ifsc_code),
        date_of_joining = VALUES(date_of_joining),
        end_of_ra = VALUES(end_of_ra),
        scholar_contact = VALUES(scholar_contact),
        supervisor_contact = VALUES(supervisor_contact),
        qualifying_degree = COALESCE(NULLIF(VALUES(qualifying_degree), ''), qualifying_degree),
        degree_percentage = COALESCE(NULLIF(VALUES(degree_percentage), ''), degree_percentage),
        degree_class = COALESCE(NULLIF(VALUES(degree_class), ''), degree_class),
        courses_completed = VALUES(courses_completed)
    `, [
      profile.regNo,
      profile.scholarName,
      profile.guideName,
      profile.department,
      profile.raType || 'ERA',
      profile.bankAccountNo || '',
      profile.bankName || 'State Bank of India',
      profile.ifscCode || 'SBIN0001234',
      profile.dateOfJoining || null,
      profile.endOfRA || null,
      profile.scholarContact || '',
      profile.supervisorContact || '',
      profile.qualifyingDegree || null,
      profile.degreePercentage || null,
      profile.degreeClass || null,
      profile.coursesCompleted || 0
    ]);
  },

  /**
   * Save Monthly Progress Report Submission
   */
  saveMonthlySubmission: async (record) => {
    // 0. Prevent duplicate monthly submissions for the same scholar and month
    const cleanRegNo = (record.regNo || '').trim();
    if (!cleanRegNo || !record.currentMonth) {
      const err = new Error('Registration Number and Current Month are required');
      err.status = 400;
      throw err;
    }

    const [existingSubmissions] = await db.query(
      `SELECT id, current_month, created_at FROM monthly_submissions WHERE LOWER(TRIM(reg_no)) = LOWER(?) AND current_month = ?`,
      [cleanRegNo, record.currentMonth]
    );

    if (existingSubmissions && existingSubmissions.length > 0) {
      const existing = existingSubmissions[0];
      // If it exists with a different id, reject duplicate submission
      if (!record.id || record.id !== existing.id) {
        const err = new Error(`A monthly progress report for ${record.currentMonth} has already been submitted by scholar ${cleanRegNo}. Duplicate entries are not permitted.`);
        err.status = 409;
        err.code = 'DUPLICATE_SUBMISSION';
        err.existingId = existing.id;
        err.createdAt = existing.created_at;
        throw err;
      }
    }

    // 1. Update permanent profile
    await PhdModel.saveScholarProfile(record);

    // 2. Insert main submission
    await db.query(`
      INSERT INTO monthly_submissions
      (id, reg_no, scholar_name, guide_name, department, ra_type, bank_account_no, bank_name, ifsc_code, date_of_joining, end_of_ra, scholar_contact, supervisor_contact, qualifying_degree, degree_percentage, degree_class, current_month, forget_thumbs, courses_completed, leaves_taken, avg_spent_stayed, academic_load)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        scholar_name = VALUES(scholar_name),
        guide_name = VALUES(guide_name),
        department = VALUES(department),
        ra_type = VALUES(ra_type),
        bank_account_no = VALUES(bank_account_no),
        bank_name = VALUES(bank_name),
        ifsc_code = VALUES(ifsc_code),
        date_of_joining = VALUES(date_of_joining),
        end_of_ra = VALUES(end_of_ra),
        scholar_contact = VALUES(scholar_contact),
        supervisor_contact = VALUES(supervisor_contact),
        qualifying_degree = VALUES(qualifying_degree),
        degree_percentage = VALUES(degree_percentage),
        degree_class = VALUES(degree_class),
        current_month = VALUES(current_month),
        forget_thumbs = VALUES(forget_thumbs),
        courses_completed = VALUES(courses_completed),
        leaves_taken = VALUES(leaves_taken),
        avg_spent_stayed = VALUES(avg_spent_stayed),
        academic_load = VALUES(academic_load)
    `, [
      record.id,
      record.regNo,
      record.scholarName,
      record.guideName,
      record.department,
      record.raType || 'ERA',
      record.bankAccountNo || '',
      record.bankName || 'State Bank of India',
      record.ifscCode || 'SBIN0001234',
      record.dateOfJoining || null,
      record.endOfRA || null,
      record.scholarContact || '',
      record.supervisorContact || '',
      record.qualifyingDegree || null,
      record.degreePercentage || null,
      record.degreeClass || null,
      record.currentMonth,
      record.forgetThumbs || 0,
      record.coursesCompleted || 0,
      record.leavesTaken || 0,
      record.avgSpentStayed || '',
      record.academicLoad || ''
    ]);

    // 3. Clear existing relations if re-saving same submission id
    await db.query('DELETE FROM journal_papers WHERE submission_id = ?', [record.id]);
    await db.query('DELETE FROM conference_papers WHERE submission_id = ?', [record.id]);
    await db.query('DELETE FROM fdps_attended WHERE submission_id = ?', [record.id]);
    await db.query('DELETE FROM courses_completed_details WHERE submission_id = ?', [record.id]);
    await db.query('DELETE FROM dc_meetings_attended WHERE submission_id = ?', [record.id]);

    // 4. Save Journals
    if (Array.isArray(record.journalPapers)) {
      for (const j of record.journalPapers) {
        if (j.journalName) {
          await db.query(
            `INSERT INTO journal_papers (submission_id, title, journal_name, status, status_date) VALUES (?, ?, ?, ?, ?)`,
            [record.id, j.title || '', j.journalName, j.status || 'Communicated', j.statusDate || null]
          );
        }
      }
    }

    // 5. Save Conferences
    if (Array.isArray(record.conferencePapers)) {
      for (const c of record.conferencePapers) {
        if (c.conferenceName) {
          await db.query(
            `INSERT INTO conference_papers (submission_id, title, conference_name, status, status_date) VALUES (?, ?, ?, ?, ?)`,
            [record.id, c.title || '', c.conferenceName, c.status || 'Communicated', c.statusDate || null]
          );
        }
      }
    }

    // 6. Save Events / FDPs
    const eventList = record.events || record.fdps || [];
    if (Array.isArray(eventList)) {
      for (const f of eventList) {
        if (f.name) {
          await db.query(
            `INSERT INTO fdps_attended (submission_id, name, category, organizer, event_date) VALUES (?, ?, ?, ?, ?)`,
            [record.id, f.name, f.category || 'Workshop', f.organizer || '', f.eventDate || null]
          );
        }
      }
    }

    // 7. Save Courses
    if (Array.isArray(record.courseDetails)) {
      for (const cd of record.courseDetails) {
        if (cd.courseName) {
          const courseType = cd.courseType || 'Internal';
          const cgpaVal = cd.cgpa || '';
          const num = parseFloat(cgpaVal);
          const isNptel = String(courseType).toUpperCase() === 'NPTEL';
          const threshold = isNptel ? 55 : 60;
          const thresholdScale10 = isNptel ? 5.5 : 6.0;
          const isPass = !isNaN(num) && (num > 10 ? num >= threshold : num >= thresholdScale10);
          const resVal = cd.result || (cgpaVal !== '' ? (isPass ? 'Pass' : 'Fail') : '');
          const gradeVal = cd.grade || (cgpaVal ? `${cgpaVal} (${resVal})` : 'Completed');
          await db.query(
            `INSERT INTO courses_completed_details (submission_id, course_code, course_name, course_type, credits, formative_marks, summative_marks, grade, cgpa, result, completion_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [record.id, cd.courseCode || '', cd.courseName, courseType, cd.credits || '', cd.formativeMarks || '', cd.summativeMarks || '', gradeVal, cgpaVal, resVal, cd.completionDate || null]
          );
        }
      }
    }

    // 8. Save DC Meetings Attended
    const dcList = record.dcMeetings || record.dcAttended || [];
    if (Array.isArray(dcList)) {
      for (const dc of dcList) {
        if (dc.dcName || dc.lastDcDate || dc.regulation || dc.comments) {
          await db.query(
            `INSERT INTO dc_meetings_attended (submission_id, scholar_id, dc_name, last_dc_date, comments, regulation, rating, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              record.id,
              record.regNo || '',
              dc.dcName || 'DC Meeting',
              dc.lastDcDate || null,
              dc.comments || '',
              dc.regulation || 'R22',
              dc.rating || '',
              dc.recommendations || 'Pre-synopsis'
            ]
          );
        }
      }
    }

    // 9. Fetch exact database log timestamp
    try {
      const [savedRow] = await db.query(`SELECT created_at FROM monthly_submissions WHERE id = ?`, [record.id]);
      if (savedRow && savedRow.length > 0) {
        record.createdAt = savedRow[0].created_at;
      }
    } catch (e) {}

    return record;
  },

  /**
   * Get All Monthly Submissions for a Specific Scholar
   */
  getSubmissionsByScholar: async (regNo) => {
    const clean = (regNo || '').trim();
    if (!clean) return [];

    const [submissions] = await db.query(
      `SELECT * FROM monthly_submissions WHERE LOWER(TRIM(reg_no)) = LOWER(?) ORDER BY current_month DESC, created_at DESC`,
      [clean]
    );

    const records = [];
    for (const s of submissions) {
      const [journals] = await db.query(
        `SELECT title, journal_name as journalName, status, DATE_FORMAT(status_date, '%Y-%m-%d') as statusDate FROM journal_papers WHERE submission_id = ?`,
        [s.id]
      );
      const [confs] = await db.query(
        `SELECT title, conference_name as conferenceName, status, DATE_FORMAT(status_date, '%Y-%m-%d') as statusDate FROM conference_papers WHERE submission_id = ?`,
        [s.id]
      );
      const [fdps] = await db.query(
        `SELECT name, category, organizer, DATE_FORMAT(event_date, '%Y-%m-%d') as eventDate FROM fdps_attended WHERE submission_id = ?`,
        [s.id]
      );
      const [courses] = await db.query(
        `SELECT course_code as courseCode, course_name as courseName, course_type as courseType, credits, formative_marks as formativeMarks, summative_marks as summativeMarks, grade, cgpa, result, DATE_FORMAT(completion_date, '%Y-%m-%d') as completionDate FROM courses_completed_details WHERE submission_id = ?`,
        [s.id]
      );
      const [dcs] = await db.query(
        `SELECT dc_name as dcName, DATE_FORMAT(last_dc_date, '%Y-%m-%d') as lastDcDate, comments, regulation, rating, recommendations FROM dc_meetings_attended WHERE submission_id = ? ORDER BY id ASC`,
        [s.id]
      );

      records.push({
        id: s.id,
        regNo: s.reg_no,
        scholarName: s.scholar_name,
        guideName: s.guide_name,
        department: s.department,
        raType: s.ra_type,
        bankAccountNo: s.bank_account_no,
        bankName: s.bank_name || 'State Bank of India',
        ifscCode: s.ifsc_code || 'SBIN0001234',
        dateOfJoining: s.date_of_joining ? (s.date_of_joining instanceof Date ? s.date_of_joining.toISOString().split('T')[0] : String(s.date_of_joining).split('T')[0]) : '',
        endOfRA: ensure3YearERA(
          s.end_of_ra ? (s.end_of_ra instanceof Date ? s.end_of_ra.toISOString().split('T')[0] : String(s.end_of_ra).split('T')[0]) : '',
          s.date_of_joining,
          s.reg_no
        ),
        scholarContact: s.scholar_contact,
        supervisorContact: s.supervisor_contact,
        qualifyingDegree: s.qualifying_degree || '',
        degreePercentage: s.degree_percentage || '',
        degreeClass: s.degree_class || '',
        currentMonth: s.current_month,
        forgetThumbs: s.forget_thumbs,
        coursesCompleted: s.courses_completed,
        courseDetails: courses || [],
        leavesTaken: s.leaves_taken,
        avgSpentStayed: s.avg_spent_stayed,
        academicLoad: s.academic_load,
        journalPapers: journals || [],
        conferencePapers: confs || [],
        events: fdps || [],
        fdps: fdps || [],
        dcMeetings: dcs || [],
        createdAt: s.created_at
      });
    }
    return records;
  },

  /**
   * Get All Submissions (with journals, conferences, events, courses, and DC meetings)
   */
  getAllSubmissions: async () => {
    const [submissions] = await db.query(
      `SELECT * FROM monthly_submissions ORDER BY created_at DESC`
    );

    const records = [];
    for (const s of submissions) {
      const [journals] = await db.query(
        `SELECT title, journal_name as journalName, status, DATE_FORMAT(status_date, '%Y-%m-%d') as statusDate FROM journal_papers WHERE submission_id = ?`,
        [s.id]
      );
      const [confs] = await db.query(
        `SELECT title, conference_name as conferenceName, status, DATE_FORMAT(status_date, '%Y-%m-%d') as statusDate FROM conference_papers WHERE submission_id = ?`,
        [s.id]
      );
      const [fdps] = await db.query(
        `SELECT name, category, organizer, DATE_FORMAT(event_date, '%Y-%m-%d') as eventDate FROM fdps_attended WHERE submission_id = ?`,
        [s.id]
      );
      const [courses] = await db.query(
        `SELECT course_code as courseCode, course_name as courseName, course_type as courseType, credits, formative_marks as formativeMarks, summative_marks as summativeMarks, grade, cgpa, result, DATE_FORMAT(completion_date, '%Y-%m-%d') as completionDate FROM courses_completed_details WHERE submission_id = ?`,
        [s.id]
      );
      const [dcs] = await db.query(
        `SELECT dc_name as dcName, DATE_FORMAT(last_dc_date, '%Y-%m-%d') as lastDcDate, comments, regulation, rating, recommendations FROM dc_meetings_attended WHERE submission_id = ? ORDER BY id ASC`,
        [s.id]
      );

      records.push({
        id: s.id,
        regNo: s.reg_no,
        scholarName: s.scholar_name,
        guideName: s.guide_name,
        department: s.department,
        raType: s.ra_type,
        bankAccountNo: s.bank_account_no,
        bankName: s.bank_name || 'State Bank of India',
        ifscCode: s.ifsc_code || 'SBIN0001234',
        dateOfJoining: s.date_of_joining ? (s.date_of_joining instanceof Date ? s.date_of_joining.toISOString().split('T')[0] : String(s.date_of_joining).split('T')[0]) : '',
        endOfRA: ensure3YearERA(
          s.end_of_ra ? (s.end_of_ra instanceof Date ? s.end_of_ra.toISOString().split('T')[0] : String(s.end_of_ra).split('T')[0]) : '',
          s.date_of_joining,
          s.reg_no
        ),
        scholarContact: s.scholar_contact,
        supervisorContact: s.supervisor_contact,
        qualifyingDegree: s.qualifying_degree || '',
        degreePercentage: s.degree_percentage || '',
        degreeClass: s.degree_class || '',
        currentMonth: s.current_month,
        forgetThumbs: s.forget_thumbs,
        coursesCompleted: s.courses_completed,
        courseDetails: courses || [],
        leavesTaken: s.leaves_taken,
        avgSpentStayed: s.avg_spent_stayed,
        academicLoad: s.academic_load,
        journalPapers: journals || [],
        conferencePapers: confs || [],
        events: fdps || [],
        fdps: fdps || [],
        dcMeetings: dcs || [],
        createdAt: s.created_at
      });
    }
    return records;
  },

  /**
   * Delete Submission by ID
   */
  deleteSubmission: async (id) => {
    await db.query(`DELETE FROM monthly_submissions WHERE id = ?`, [id]);
    return true;
  },

  /**
   * Fetch All Master Scholar Profiles
   */
  getAllMasterProfiles: async () => {
    const [rows] = await db.query(`
      SELECT 
        reg_no as regNo,
        scholar_name as scholarName,
        guide_name as guideName,
        department,
        ra_type as raType,
        bank_account_no as bankAccountNo,
        bank_name as bankName,
        ifsc_code as ifscCode,
        DATE_FORMAT(date_of_joining, '%Y-%m-%d') as dateOfJoining,
        DATE_FORMAT(end_of_ra, '%Y-%m-%d') as endOfRA,
        scholar_contact as scholarContact,
        supervisor_contact as supervisorContact,
        qualifying_degree as qualifyingDegree,
        degree_percentage as degreePercentage,
        degree_class as degreeClass,
        courses_completed as coursesCompleted
      FROM scholar_profiles
      ORDER BY reg_no ASC
    `);
    return rows || [];
  },

  /**
   * Admin Authentication (allows Dean credentials and Super Admin check)
   */
  verifyAdminCredentials: async (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check central portal_login first
    const [portalAdmins] = await db.query(
      'SELECT employee_id, password_hash, role FROM portal_login WHERE employee_id = ? OR email = ? LIMIT 1',
      [cleanUser, cleanUser]
    );

    if (portalAdmins && portalAdmins.length > 0) {
      const match = await bcrypt.compare(cleanPass, portalAdmins[0].password_hash);
      if (match) {
        return { valid: true, user: { email: cleanUser, role: portalAdmins[0].role || 'Dean R&D' } };
      }
    }

    // Standard fallback credentials
    const isDean = (cleanUser === 'dean_rd@vignan.ac.in' || cleanUser === 'admin' || cleanUser === '1001');
    const isPass = (cleanPass === '1234' || cleanPass === 'passowrd123' || cleanPass === 'password123' || cleanPass === 'admin123');
    if (isDean && isPass) {
      return { valid: true, user: { email: cleanUser, role: 'Dean R&D' } };
    }

    return { valid: false };
  }
};

module.exports = PhdModel;
