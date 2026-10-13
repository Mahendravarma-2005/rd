const fs = require('fs');
const path = require('path');
const config = require('../config/environment');
const ProposalModel = require('../models/proposal.model');

function saveBase64ToDisk(base64Data, originalFileName, mimeType) {
  if (!base64Data) return null;
  try {
    const rawData = String(base64Data).trim();
    const mimeMatch = rawData.match(/^data:([^;]+);base64,(.+)$/);
    const base64Content = mimeMatch ? mimeMatch[2] : rawData;
    const resolvedMime = mimeMatch ? mimeMatch[1] : (mimeType || 'application/octet-stream');
    
    const buffer = Buffer.from(base64Content, 'base64');
    const ext = path.extname(originalFileName || '') || '.bin';
    const cleanBase = path.basename(originalFileName || 'proof', ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
    const savedFileName = `proof-${cleanBase}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    
    if (!fs.existsSync(config.UPLOAD_DIR)) {
      fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
    }
    
    const savedFilePath = path.join(config.UPLOAD_DIR, savedFileName);
    fs.writeFileSync(savedFilePath, buffer);
    
    return {
      filePath: savedFilePath,
      fileSize: buffer.length,
      mimeType: resolvedMime,
      fileName: originalFileName || savedFileName
    };
  } catch (err) {
    console.error('[ProposalService] Error saving proof to disk:', err);
    return null;
  }
}

function formatDate(val) {
  if (!val) return '';
  if (typeof val === 'string') {
    if (val.includes('T')) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
    }
    return val;
  }
  if (val instanceof Date && !isNaN(val.getTime())) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return String(val);
}

function formatProposal(prop) {
  const copisList = Array.isArray(prop.copis) ? prop.copis : (Array.isArray(prop.coPis) ? prop.coPis : []);
  return {
    id: prop.id,
    empCode: prop.emp_code || prop.empCode || '',
    emp_code: prop.emp_code || prop.empCode || '',
    piName: prop.pi_name || prop.piName || '',
    pi_name: prop.pi_name || prop.piName || '',
    piPhone: prop.pi_phone || prop.piPhone || '',
    pi_phone: prop.pi_phone || prop.piPhone || '',
    piEmail: prop.pi_email || prop.piEmail || '',
    pi_email: prop.pi_email || prop.piEmail || '',
    piDepartment: prop.pi_department || prop.piDepartment || '',
    pi_department: prop.pi_department || prop.piDepartment || '',
    title: prop.title || '',
    trackingNumber: prop.tracking_number || prop.trackingNumber || '',
    tracking_number: prop.tracking_number || prop.trackingNumber || '',
    duration: prop.duration || '',
    date: formatDate(prop.date),
    industrialCollab: prop.industrial_collab || prop.industrialCollab || 'No',
    industrial_collab: prop.industrial_collab || prop.industrialCollab || 'No',
    industryName: prop.industry_name || prop.industryName || '',
    industry_name: prop.industry_name || prop.industryName || '',
    reviewedByExpert: prop.reviewed_by_expert || prop.reviewedByExpert || 'No',
    reviewed_by_expert: prop.reviewed_by_expert || prop.reviewedByExpert || 'No',
    reviewerName: prop.reviewer_name || prop.reviewerName || '',
    reviewer_name: prop.reviewer_name || prop.reviewerName || '',
    reviewerAddress: prop.reviewer_address || prop.reviewerAddress || '',
    reviewer_address: prop.reviewer_address || prop.reviewerAddress || '',
    fundingType: prop.funding_type || prop.fundingType || '',
    funding_type: prop.funding_type || prop.fundingType || '',
    fundingAgency: prop.funding_agency || prop.fundingAgency || '',
    funding_agency: prop.funding_agency || prop.fundingAgency || '',
    proposedAmount: prop.proposed_amount || prop.proposedAmount || '',
    proposed_amount: prop.proposed_amount || prop.proposedAmount || '',
    projectScheme: prop.project_scheme || prop.projectScheme || '',
    project_scheme: prop.project_scheme || prop.projectScheme || '',
    submissionEndDate: formatDate(prop.submission_end_date || prop.submissionEndDate),
    submission_end_date: formatDate(prop.submission_end_date || prop.submissionEndDate),
    status: prop.status || 'submitted',
    sanctionOrderNumber: prop.sanction_order_number || prop.sanctionOrderNumber || '',
    sanction_order_number: prop.sanction_order_number || prop.sanctionOrderNumber || '',
    sanctionedAmount: prop.sanctioned_amount || prop.sanctionedAmount || '',
    sanctioned_amount: prop.sanctioned_amount || prop.sanctionedAmount || '',
    presentationDate: formatDate(prop.presentation_date || prop.presentationDate),
    presentation_date: formatDate(prop.presentation_date || prop.presentationDate),
    sectionNumber: prop.section_number || prop.sectionNumber || '',
    section_number: prop.section_number || prop.sectionNumber || '',
    scientistName: prop.scientist_name || prop.scientistName || '',
    scientist_name: prop.scientist_name || prop.scientistName || '',
    feedbackFileName: prop.feedback_file_name || prop.feedbackFileName || '',
    feedback_file_name: prop.feedback_file_name || prop.feedbackFileName || '',
    feedbackText: prop.feedback_text || prop.feedbackText || '',
    feedback_text: prop.feedback_text || prop.feedbackText || '',
    proofFileName: prop.proof_file_name || prop.proofFileName || '',
    proof_file_name: prop.proof_file_name || prop.proofFileName || '',
    proofFileType: prop.proof_file_type || prop.proofFileType || '',
    proof_file_type: prop.proof_file_type || prop.proofFileType || '',
    proofFilePath: prop.proof_file_path || prop.proofFilePath || '',
    proof_file_path: prop.proof_file_path || prop.proofFilePath || '',
    proofFileSize: prop.proof_file_size || prop.proofFileSize || 0,
    proof_file_size: prop.proof_file_size || prop.proofFileSize || 0,
    proofFileData: prop.proof_file_data || prop.proofFileData || '',
    proof_file_data: prop.proof_file_data || prop.proofFileData || '',
    copis: copisList,
    coPis: copisList,
    created_at: prop.created_at
  };
}

const ProposalService = {
  getProposals: async (query = {}) => {
    const { empCode, piName, piPhone } = query;
    const rawProposals = await ProposalModel.getProposals({ empCode, piName, piPhone });
    return rawProposals.map(formatProposal);
  },

  getProposalProof: async (id) => {
    return await ProposalModel.getProposalById(id);
  },

  createProposal: async (data) => {
    const piEmail = (data.piEmail || data.pi_email || '').trim().toLowerCase();
    if (piEmail && !piEmail.endsWith('@vignan.ac.in')) {
      throw new Error('Only official Vignan University email IDs (@vignan.ac.in) are permitted.');
    }

    // If client sent base64 proof file, save it directly to drive/disk storage
    if (data.proofFileData && !data.proofFilePath) {
      const saved = saveBase64ToDisk(data.proofFileData, data.proofFileName, data.proofFileType);
      if (saved) {
        data.proofFilePath = saved.filePath;
        data.proofFileSize = saved.fileSize;
        data.proofFileType = saved.mimeType;
        data.proofFileName = saved.fileName;
        data.proofFileData = null; // Do NOT store blob in MySQL
      }
    }

    const trackingNumber = (data.trackingNumber && String(data.trackingNumber).trim())
      ? String(data.trackingNumber).trim()
      : ((data.tracking_number && String(data.tracking_number).trim())
        ? String(data.tracking_number).trim()
        : ('PI-' + Date.now().toString().slice(-6)));
    return await ProposalModel.createProposalWithCoPIs(data, trackingNumber);
  },

  updateProposal: async (id, data) => {
    // If updating with base64 proof file, save directly to drive/disk storage
    if (data.proofFileData && !data.proofFilePath) {
      const saved = saveBase64ToDisk(data.proofFileData, data.proofFileName, data.proofFileType);
      if (saved) {
        data.proofFilePath = saved.filePath;
        data.proofFileSize = saved.fileSize;
        data.proofFileType = saved.mimeType;
        data.proofFileName = saved.fileName;
        data.proofFileData = null; // Do NOT store blob in MySQL
      }
    }

    const updateFields = [];
    const updateValues = [];
    const allowed = [
      'status', 'sanction_order_number', 'sanctioned_amount', 'reviewed_by_expert',
      'reviewer_name', 'reviewer_address', 'presentation_date', 'section_number', 'scientist_name',
      'feedback_text', 'submission_end_date', 'tracking_number', 'feedback_file_name',
      'proof_file_name', 'proof_file_type', 'proof_file_path', 'proof_file_size', 'proof_file_data'
    ];

    for (const [key, val] of Object.entries(data)) {
      const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (allowed.includes(dbKey) && val !== undefined) {
        updateFields.push(`\`${dbKey}\` = ?`);
        updateValues.push(val);
      }
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await ProposalModel.updateProposal(id, updateFields, updateValues);
    }

    return { success: true, message: 'Proposal updated successfully.' };
  }
};

module.exports = ProposalService;
