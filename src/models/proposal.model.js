const db = require('../config/db');

const ProposalModel = {
  // Admins
  findAdminByEmpCode: async (empCode) => {
    const [rows] = await db.query('SELECT * FROM admins WHERE emp_code = ?', [empCode]);
    return rows[0] || null;
  },

  updateAdminTempPassword: async (empCode, tempHash, expires) => {
    await db.query(
      'UPDATE admins SET temp_password_hash = ?, temp_password_expires = ?, requires_reset = 1 WHERE emp_code = ?',
      [tempHash, expires, empCode]
    );
  },

  updateAdminPassword: async (empCode, newHash) => {
    await db.query(
      'UPDATE admins SET password_hash = ?, temp_password_hash = NULL, temp_password_expires = NULL, requires_reset = 0 WHERE emp_code = ?',
      [newHash, empCode]
    );
  },

  // Proposals
  getProposals: async (filters = {}) => {
    let query = 'SELECT * FROM proposals';
    const params = [];
    const conditions = [];

    if (filters.empCode) {
      conditions.push('emp_code = ?');
      params.push(String(filters.empCode).trim());
    }
    if (filters.piName) {
      conditions.push('LOWER(TRIM(pi_name)) = LOWER(?)');
      params.push(String(filters.piName).trim());
    }
    if (filters.piPhone) {
      conditions.push('pi_phone = ?');
      params.push(String(filters.piPhone).trim());
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';
    const [proposals] = await db.query(query, params);

    for (const prop of proposals) {
      const [copis] = await db.query('SELECT name FROM copis WHERE proposal_id = ?', [prop.id]);
      prop.copis = copis.map(c => c.name);
      prop.coPis = prop.copis;
    }
    return proposals;
  },

  getProposalById: async (id) => {
    const [rows] = await db.query('SELECT * FROM proposals WHERE id = ?', [id]);
    if (!rows[0]) return null;
    const prop = rows[0];
    const [copis] = await db.query('SELECT name FROM copis WHERE proposal_id = ?', [prop.id]);
    prop.copis = copis.map(c => c.name);
    prop.coPis = prop.copis;
    return prop;
  },

  createProposalWithCoPIs: async (data, trackingNumber) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(`
        INSERT INTO proposals 
        (emp_code, pi_name, pi_phone, pi_email, pi_department, title, tracking_number, duration, date, industrial_collab, industry_name, funding_type, funding_agency, project_scheme, proposed_amount, status, submission_end_date, sanction_order_number, sanctioned_amount, reviewed_by_expert, reviewer_name, reviewer_address, presentation_date, section_number, scientist_name, feedback_file_name, feedback_text, proof_file_name, proof_file_type, proof_file_path, proof_file_size, proof_file_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.empCode || data.emp_code,
        data.piName || data.pi_name,
        data.piPhone || data.pi_phone,
        data.piEmail || data.pi_email || '',
        data.piDepartment || data.pi_department || '',
        data.title,
        trackingNumber,
        data.duration,
        data.date || new Date().toISOString().split('T')[0],
        data.industrialCollab || data.industrial_collab || 'No',
        data.industryName || data.industry_name || null,
        data.fundingType || data.funding_type,
        data.fundingAgency || data.funding_agency,
        data.projectScheme || data.project_scheme,
        data.proposedAmount || data.proposed_amount,
        data.status || 'submitted',
        data.submissionEndDate || data.submission_end_date || null,
        data.sanctionOrderNumber || data.sanction_order_number || null,
        data.sanctionedAmount || data.sanctioned_amount || null,
        data.reviewedByExpert || data.reviewed_by_expert || 'No',
        data.reviewerName || data.reviewer_name || null,
        data.reviewerAddress || data.reviewer_address || null,
        data.presentationDate || data.presentation_date || null,
        data.sectionNumber || data.section_number || null,
        data.scientistName || data.scientist_name || null,
        data.feedbackFileName || data.feedback_file_name || null,
        data.feedbackText || data.feedback_text || null,
        data.proofFileName || data.proof_file_name || null,
        data.proofFileType || data.proof_file_type || null,
        data.proofFilePath || data.proof_file_path || null,
        data.proofFileSize || data.proof_file_size || null,
        data.proofFileData || data.proof_file_data || null
      ]);

      const proposalId = result.insertId;
      const copisList = Array.isArray(data.copis) ? data.copis : (Array.isArray(data.coPis) ? data.coPis : []);
      for (const name of copisList) {
        if (name && name.trim()) {
          await conn.query('INSERT INTO copis (proposal_id, name) VALUES (?, ?)', [proposalId, name.trim()]);
        }
      }
      await conn.commit();
      return { id: proposalId, trackingNumber };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  updateProposal: async (id, updateFields, updateValues) => {
    await db.query(`UPDATE proposals SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
    return { success: true };
  }
};

module.exports = ProposalModel;
