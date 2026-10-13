// UI elements
const tabs = {
  submit: document.getElementById('tabSubmit'),
  view: document.getElementById('tabView'),
  analytics: document.getElementById('tabAnalytics'),
  contentSubmit: document.getElementById('contentSubmit'),
  contentView: document.getElementById('contentView'),
  contentAnalytics: document.getElementById('contentAnalytics')
};

const form = document.getElementById('proposalForm');
const copiContainer = document.getElementById('copiContainer');
const addCopiBtn = document.getElementById('addCopiBtn');
const projectDate = document.getElementById('projectDate');

// Industrial Collab Elements
const collabNo = document.getElementById('collabNo');
const collabYes = document.getElementById('collabYes');
const industrialCollabInput = document.getElementById('industrialCollab');
const collabNameGroup = document.getElementById('collabNameGroup');
const industryNameInput = document.getElementById('industryName');

// Status & Feedback Elements
const statusDropdown = document.getElementById('projectStatus');
const feedbackPanel = document.getElementById('feedbackPanel');
const uploadArea = document.getElementById('uploadArea');
const feedbackFileInput = document.getElementById('feedbackFile');
const fileInfo = document.getElementById('fileInfo');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const removeFileBtn = document.getElementById('removeFileBtn');
const feedbackText = document.getElementById('feedbackText');

// Sanctioned Elements
const sanctionedPanel = document.getElementById('sanctionedPanel');
const sanctionOrderNumberInput = document.getElementById('sanctionOrderNumber');
const sanctionedAmountInput = document.getElementById('sanctionedAmount');

// Search & Filter Elements
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const exportBtn = document.getElementById('exportBtn');

// Details Modal Elements
const detailsModal = document.getElementById('detailsModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalTitle = document.getElementById('modalTitle');
const modalTrackingNumber = document.getElementById('modalTrackingNumber');
const modalInvestigators = document.getElementById('modalInvestigators');
const modalFunding = document.getElementById('modalFunding');
const modalProposedAmount = document.getElementById('modalProposedAmount');
const modalSanctionedSection = document.getElementById('modalSanctionedSection');
const modalSanctionedAmount = document.getElementById('modalSanctionedAmount');
const modalSanctionOrder = document.getElementById('modalSanctionOrder');
const modalAdminFeedbackSection = document.getElementById('modalAdminFeedbackSection');
const modalFeedbackContent = document.getElementById('modalFeedbackContent');

// Export Modal Elements
const exportModal = document.getElementById('exportModal');
const exportModalCloseBtn = document.getElementById('exportModalCloseBtn');
const selectAllCols = document.getElementById('selectAllCols');
const exportColumnsList = document.getElementById('exportColumnsList');
const cancelExportBtn = document.getElementById('cancelExportBtn');
const confirmExportBtn = document.getElementById('confirmExportBtn');

// Login, Forgot, & Reset Modals Elements
const loginModal = document.getElementById('loginModal');
const loginModalCloseBtn = document.getElementById('loginModalCloseBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');

const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const forgotModalCloseBtn = document.getElementById('forgotModalCloseBtn');
const cancelForgotBtn = document.getElementById('cancelForgotBtn');

const resetPasswordModal = document.getElementById('resetPasswordModal');
const resetModalCloseBtn = document.getElementById('resetModalCloseBtn');
const cancelResetBtn = document.getElementById('cancelResetBtn');

// Admin Elements
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const proposalsTableHead = document.getElementById('proposalsTableHead');
const proposalsTableBody = document.getElementById('proposalsTableBody');
const resetBtn = document.getElementById('resetBtn');

// Status Update Action Elements
const detailsAdminActions = document.getElementById('detailsAdminActions');
const updateStatusForm = document.getElementById('updateStatusForm');
const updateStatusSelect = document.getElementById('updateStatusSelect');
const updateFeedbackGroup = document.getElementById('updateFeedbackGroup');
const updateFeedbackText = document.getElementById('updateFeedbackText');
const updateSanctionedGroup = document.getElementById('updateSanctionedGroup');
const updateSanctionOrder = document.getElementById('updateSanctionOrder');
const updateSanctionedAmount = document.getElementById('updateSanctionedAmount');

// Status Proof Document Elements
const statusProofDropzone = document.getElementById('statusProofDropzone');
const statusProofFileInput = document.getElementById('statusProofFileInput');
const statusProofFileInfo = document.getElementById('statusProofFileInfo');
const statusProofName = document.getElementById('statusProofName');
const statusProofSize = document.getElementById('statusProofSize');
const statusProofIcon = document.getElementById('statusProofIcon');
const statusProofRemoveBtn = document.getElementById('statusProofRemoveBtn');
const statusProofPreviewBtn = document.getElementById('statusProofPreviewBtn');
const updateExistingProofCard = document.getElementById('updateExistingProofCard');
const updateExistingProofName = document.getElementById('updateExistingProofName');
const updateExistingProofOpenBtn = document.getElementById('updateExistingProofOpenBtn');
const updateExistingProofDownloadBtn = document.getElementById('updateExistingProofDownloadBtn');
const modalProofSection = document.getElementById('modalProofSection');
const modalProofContent = document.getElementById('modalProofContent');

// User Panel Status Proof Elements
const notRecommendedCommentsGroup = document.getElementById('notRecommendedCommentsGroup');
const proposalProofContainer = document.getElementById('proposalProofContainer');
const proposalProofLabelText = document.getElementById('proposalProofLabelText');
const proposalProofDropzone = document.getElementById('proposalProofDropzone');
const proposalProofFileInput = document.getElementById('proposalProofFileInput');
const proposalProofHint = document.getElementById('proposalProofHint');
const proposalProofStatusName = document.getElementById('proposalProofStatusName');
const proposalProofFileInfo = document.getElementById('proposalProofFileInfo');
const proposalProofFileName = document.getElementById('proposalProofFileName');
const proposalProofFileSize = document.getElementById('proposalProofFileSize');
const proposalProofFileType = document.getElementById('proposalProofFileType');
const proposalProofFileIcon = document.getElementById('proposalProofFileIcon');
const proposalProofPreviewBtn = document.getElementById('proposalProofPreviewBtn');
const proposalProofRemoveBtn = document.getElementById('proposalProofRemoveBtn');

// Dynamic Panel Selectors
const submittedPanel = document.getElementById('submittedPanel');
const submittedScientistName = document.getElementById('submittedScientistName');
const submittedSectionNumber = document.getElementById('submittedSectionNumber');
const submittedTrackingNumber = document.getElementById('submittedTrackingNumber');
const invitedPanel = document.getElementById('invitedPanel');
const presentationDate = document.getElementById('presentationDate');

// Gatekeeper & Personal Dashboard Selectors
const gatekeeperCard = document.getElementById('gatekeeperCard');
const gatekeeperForm = document.getElementById('gatekeeperForm');
const gatekeeperEmpCode = document.getElementById('gatekeeperEmpCode');
const gatekeeperPiName = document.getElementById('gatekeeperPiName');
const gatekeeperPiPhone = document.getElementById('gatekeeperPiPhone');
const gatekeeperPiEmail = document.getElementById('gatekeeperPiEmail');
const gatekeeperPiDepartment = document.getElementById('gatekeeperPiDepartment');

// Gatekeeper & Verified Banner Selectors
const piGatekeeperError = document.getElementById('piGatekeeperError');
const piVerifiedUserBanner = document.getElementById('piVerifiedUserBanner');
const bannerPiName = document.getElementById('bannerPiName');
const bannerPiEmpCode = document.getElementById('bannerPiEmpCode');
const bannerPiEmail = document.getElementById('bannerPiEmail');
const bannerPiDept = document.getElementById('bannerPiDept');
const piLogoutBtn = document.getElementById('piLogoutBtn');

const personalDashboardCard = document.getElementById('personalDashboardCard');
const gatekeeperResetBtn = document.getElementById('gatekeeperResetBtn');
const dashEmpCode = document.getElementById('dashEmpCode');
const dashPiName = document.getElementById('dashPiName');
const dashPiPhone = document.getElementById('dashPiPhone');
const personalProposalsTableBody = document.getElementById('personalProposalsTableBody');
const registerNewProjectBtn = document.getElementById('registerNewProjectBtn');

const proposalFormCard = document.getElementById('proposalFormCard');
const backToDashBtn = document.getElementById('backToDashBtn');
const backToGatekeeperBtn = document.getElementById('backToGatekeeperBtn');

// Local State
let uploadedFileName = '';
let uploadedFileData = null; // Simulated file object
let userProofFileName = '';
let userProofFileType = '';
let userProofFileData = '';
let userProofFilePath = '';
let userProofFileSize = 0;
let userProofLocalUrl = '';
let currentViewingProposalId = null;
let currentViewingProposal = null;
let currentPiCode = '';
let currentPiName = '';
let currentPiPhone = '';
let currentPiEmail = '';
let currentPiDepartment = '';
let currentPiProposals = [];

let cachedProposals = [];

// Format date helper
function formatDateString(val) {
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

// Normalize proposal object to guarantee all camelCase and snake_case properties
function normalizeProposal(p) {
  if (!p) return p;
  const copisList = Array.isArray(p.copis) ? p.copis : (Array.isArray(p.coPis) ? p.coPis : []);
  return {
    ...p,
    id: p.id,
    empCode: p.empCode || p.emp_code || '',
    emp_code: p.empCode || p.emp_code || '',
    piName: p.piName || p.pi_name || '',
    pi_name: p.piName || p.pi_name || '',
    piPhone: p.piPhone || p.pi_phone || '',
    pi_phone: p.piPhone || p.pi_phone || '',
    piEmail: p.piEmail || p.pi_email || '',
    pi_email: p.piEmail || p.pi_email || '',
    piDepartment: p.piDepartment || p.pi_department || '',
    pi_department: p.piDepartment || p.pi_department || '',
    title: p.title || '',
    trackingNumber: p.trackingNumber || p.tracking_number || '',
    tracking_number: p.trackingNumber || p.tracking_number || '',
    duration: p.duration || '',
    date: formatDateString(p.date),
    industrialCollab: p.industrialCollab || p.industrial_collab || 'No',
    industrial_collab: p.industrialCollab || p.industrial_collab || 'No',
    industryName: p.industryName || p.industry_name || '',
    industry_name: p.industryName || p.industry_name || '',
    reviewedByExpert: p.reviewedByExpert || p.reviewed_by_expert || 'No',
    reviewed_by_expert: p.reviewedByExpert || p.reviewed_by_expert || 'No',
    reviewerName: p.reviewerName || p.reviewer_name || '',
    reviewer_name: p.reviewerName || p.reviewer_name || '',
    reviewerAddress: p.reviewerAddress || p.reviewer_address || '',
    reviewer_address: p.reviewerAddress || p.reviewer_address || '',
    fundingType: p.fundingType || p.funding_type || '',
    funding_type: p.fundingType || p.funding_type || '',
    fundingAgency: p.fundingAgency || p.funding_agency || '',
    funding_agency: p.fundingAgency || p.funding_agency || '',
    proposedAmount: p.proposedAmount || p.proposed_amount || '',
    proposed_amount: p.proposedAmount || p.proposed_amount || '',
    projectScheme: p.projectScheme || p.project_scheme || '',
    project_scheme: p.projectScheme || p.project_scheme || '',
    submissionEndDate: formatDateString(p.submissionEndDate || p.submission_end_date),
    submission_end_date: formatDateString(p.submissionEndDate || p.submission_end_date),
    status: p.status || 'submitted',
    sanctionOrderNumber: p.sanctionOrderNumber || p.sanction_order_number || '',
    sanction_order_number: p.sanctionOrderNumber || p.sanction_order_number || '',
    sanctionedAmount: p.sanctionedAmount || p.sanctioned_amount || '',
    sanctioned_amount: p.sanctionedAmount || p.sanctioned_amount || '',
    presentationDate: formatDateString(p.presentationDate || p.presentation_date),
    presentation_date: formatDateString(p.presentationDate || p.presentation_date),
    sectionNumber: p.sectionNumber || p.section_number || '',
    section_number: p.sectionNumber || p.section_number || '',
    scientistName: p.scientistName || p.scientist_name || '',
    scientist_name: p.scientistName || p.scientist_name || '',
    feedbackFileName: p.feedbackFileName || p.feedback_file_name || '',
    feedback_file_name: p.feedbackFileName || p.feedback_file_name || '',
    feedbackText: p.feedbackText || p.feedback_text || '',
    feedback_text: p.feedbackText || p.feedback_text || '',
    copis: copisList,
    coPis: copisList
  };
}

// Initialize Storage (cached locally for synchronous rendering compatibility)
function getProposals() {
  return cachedProposals;
}

// Fetch Proposals list from MySQL backend
async function fetchProposalsFromServer() {
  try {
    const response = await fetch('/api/proposals');
    if (response.ok) {
      const data = await response.json();
      cachedProposals = Array.isArray(data) ? data.map(normalizeProposal) : [];
    } else {
      showToast('Failed to fetch proposals from server.', 'warning');
    }
  } catch (error) {
    console.error('Fetch proposals error:', error);
    showToast('Could not connect to the backend server.', 'warning');
  }
}

// Show Toast Alert
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : 'ℹ️'}</span>
    <div>${message}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Tab Switching
function switchTab(target) {
  tabs.submit.classList.remove('active');
  tabs.view.classList.remove('active');
  if (tabs.analytics) tabs.analytics.classList.remove('active');
  
  tabs.contentSubmit.classList.remove('active');
  tabs.contentView.classList.remove('active');
  if (tabs.contentAnalytics) tabs.contentAnalytics.classList.remove('active');
  
  if (target === 'submit') {
    tabs.submit.classList.add('active');
    tabs.contentSubmit.classList.add('active');
    if (!currentPiCode) {
      if (gatekeeperCard) gatekeeperCard.style.display = 'block';
      if (personalDashboardCard) personalDashboardCard.style.display = 'none';
      if (proposalFormCard) proposalFormCard.style.display = 'none';
    }
  } else if (target === 'view') {
    tabs.view.classList.add('active');
    tabs.contentView.classList.add('active');
    renderProposals();
  } else if (target === 'analytics') {
    if (tabs.analytics && tabs.contentAnalytics) {
      tabs.analytics.classList.add('active');
      tabs.contentAnalytics.classList.add('active');
      updateAnalyticsData();
    }
  }
}

tabs.submit.addEventListener('click', () => switchTab('submit'));
tabs.view.addEventListener('click', () => switchTab('view'));
if (tabs.analytics) {
  tabs.analytics.addEventListener('click', () => switchTab('analytics'));
}

// Co-PI Management
addCopiBtn.addEventListener('click', () => {
  const copiRows = copiContainer.querySelectorAll('.copi-row');
  const count = copiRows.length + 1;
  
  const row = document.createElement('div');
  row.className = 'copi-row';
  row.innerHTML = `
    <input type="text" placeholder="Co-PI ${count} Name" name="copi[]">
    <button type="button" class="btn btn-secondary btn-sm btn-danger-outline remove-copi-btn">×</button>
  `;
  copiContainer.appendChild(row);
  
  row.querySelector('.remove-copi-btn').addEventListener('click', () => {
    row.remove();
    reindexCopiPlaceholders();
  });
});

function reindexCopiPlaceholders() {
  const inputs = copiContainer.querySelectorAll('.copi-row input');
  inputs.forEach((input, index) => {
    input.placeholder = `Co-PI ${index + 1} Name`;
  });
}

// Set Date input default to today
const today = new Date().toISOString().split('T')[0];
projectDate.value = today;

// Industrial Collaboration Toggle
function toggleCollab(isCollab) {
  if (isCollab) {
    collabYes.classList.add('active');
    collabNo.classList.remove('active');
    industrialCollabInput.value = 'Yes';
    collabNameGroup.style.display = 'flex';
    industryNameInput.required = true;
  } else {
    collabNo.classList.add('active');
    collabYes.classList.remove('active');
    industrialCollabInput.value = 'No';
    collabNameGroup.style.display = 'none';
    industryNameInput.required = false;
    industryNameInput.value = '';
  }
}
collabNo.addEventListener('click', () => toggleCollab(false));
collabYes.addEventListener('click', () => toggleCollab(true));
toggleCollab(false); // Default to No

// External Expert Review Toggle
const expertNo = document.getElementById('expertNo');
const expertYes = document.getElementById('expertYes');
const reviewedByExpertInput = document.getElementById('reviewedByExpert');
const reviewerInfoGroup = document.getElementById('reviewerInfoGroup');
const reviewerNameInput = document.getElementById('reviewerName');
const reviewerAddressInput = document.getElementById('reviewerAddress');

function toggleExpert(isExpert) {
  if (isExpert) {
    expertYes.classList.add('active');
    expertNo.classList.remove('active');
    reviewedByExpertInput.value = 'Yes';
    reviewerInfoGroup.style.display = 'flex';
    reviewerNameInput.required = true;
    reviewerAddressInput.required = true;
  } else {
    expertNo.classList.add('active');
    expertYes.classList.remove('active');
    reviewedByExpertInput.value = 'No';
    reviewerInfoGroup.style.display = 'none';
    reviewerNameInput.required = false;
    reviewerAddressInput.required = false;
    reviewerNameInput.value = '';
    reviewerAddressInput.value = '';
  }
}
if (expertNo) expertNo.addEventListener('click', () => toggleExpert(false));
if (expertYes) expertYes.addEventListener('click', () => toggleExpert(true));
toggleExpert(false); // Default to No

// Funding Type conditional fields
const fundingTypeSelect = document.getElementById('fundingType');
const fundingAgencyGroup = document.getElementById('fundingAgencyGroup');
const fundingAgencySelect = document.getElementById('fundingAgency');
const fundingOtherAgencyGroup = document.getElementById('fundingOtherAgencyGroup');
const fundingOtherAgencyInput = document.getElementById('fundingOtherAgency');
const fundingIndustryGroup = document.getElementById('fundingIndustryGroup');
const fundingIndustryNameInput = document.getElementById('fundingIndustryName');

if (fundingAgencySelect) {
  fundingAgencySelect.addEventListener('change', () => {
    if (fundingAgencySelect.value === 'Other') {
      if (fundingOtherAgencyGroup) fundingOtherAgencyGroup.style.display = 'block';
      if (fundingOtherAgencyInput) {
        fundingOtherAgencyInput.required = true;
        fundingOtherAgencyInput.focus();
      }
    } else {
      if (fundingOtherAgencyGroup) fundingOtherAgencyGroup.style.display = 'none';
      if (fundingOtherAgencyInput) {
        fundingOtherAgencyInput.required = false;
        fundingOtherAgencyInput.value = '';
      }
    }
  });
}

if (fundingTypeSelect) {
  fundingTypeSelect.addEventListener('change', () => {
    if (fundingTypeSelect.value === 'Industry') {
      if (fundingAgencyGroup) fundingAgencyGroup.style.display = 'none';
      if (fundingAgencySelect) {
        fundingAgencySelect.required = false;
        fundingAgencySelect.value = '';
      }
      if (fundingOtherAgencyGroup) fundingOtherAgencyGroup.style.display = 'none';
      if (fundingOtherAgencyInput) {
        fundingOtherAgencyInput.required = false;
        fundingOtherAgencyInput.value = '';
      }
      if (fundingIndustryGroup) fundingIndustryGroup.style.display = 'block';
      if (fundingIndustryNameInput) fundingIndustryNameInput.required = true;
    } else {
      if (fundingAgencyGroup) fundingAgencyGroup.style.display = 'block';
      if (fundingAgencySelect) fundingAgencySelect.required = true;
      if (fundingIndustryGroup) fundingIndustryGroup.style.display = 'none';
      if (fundingIndustryNameInput) {
        fundingIndustryNameInput.required = false;
        fundingIndustryNameInput.value = '';
      }
      if (fundingAgencySelect && fundingAgencySelect.value === 'Other') {
        if (fundingOtherAgencyGroup) fundingOtherAgencyGroup.style.display = 'block';
        if (fundingOtherAgencyInput) fundingOtherAgencyInput.required = true;
      } else {
        if (fundingOtherAgencyGroup) fundingOtherAgencyGroup.style.display = 'none';
        if (fundingOtherAgencyInput) {
          fundingOtherAgencyInput.required = false;
          fundingOtherAgencyInput.value = '';
        }
      }
    }
  });
}

// Helper: Show Verified PI Banner
function showPiBanner(empCode, piName, piEmail, piDepartment) {
  if (bannerPiName) bannerPiName.textContent = piName;
  if (bannerPiEmpCode) bannerPiEmpCode.textContent = empCode;
  if (bannerPiEmail) bannerPiEmail.textContent = piEmail || '—';
  if (bannerPiDept) bannerPiDept.textContent = piDepartment;
  if (piVerifiedUserBanner) piVerifiedUserBanner.style.display = 'block';
}

// Helper: Clear PI authenticated session
function clearPiSession() {
  currentPiCode = '';
  currentPiName = '';
  currentPiPhone = '';
  currentPiEmail = '';
  currentPiDepartment = '';
  currentPiProposals = [];
  piPendingAuthData = null;

  sessionStorage.removeItem('projectpi_auth_user');
  sessionStorage.removeItem('pi_code');
  sessionStorage.removeItem('pi_name');
  sessionStorage.removeItem('pi_phone');
  sessionStorage.removeItem('pi_email');
  sessionStorage.removeItem('pi_department');
  sessionStorage.removeItem('pi_view_state');

  if (gatekeeperForm) gatekeeperForm.reset();
  if (piGatekeeperError) piGatekeeperError.style.display = 'none';

  if (piVerifiedUserBanner) piVerifiedUserBanner.style.display = 'none';
  if (gatekeeperCard) gatekeeperCard.style.display = 'block';
  if (personalDashboardCard) personalDashboardCard.style.display = 'none';
  if (proposalFormCard) proposalFormCard.style.display = 'none';
}

// Direct PI Gateway Access (No OTP)
if (gatekeeperForm) {
  gatekeeperForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (piGatekeeperError) piGatekeeperError.style.display = 'none';

    const empCode = gatekeeperEmpCode.value.trim();
    const piName = gatekeeperPiName.value.trim();
    const piPhone = gatekeeperPiPhone.value.trim().replace(/\D/g, '');
    const piEmail = gatekeeperPiEmail ? gatekeeperPiEmail.value.trim().toLowerCase() : '';
    const piDepartment = gatekeeperPiDepartment.value.trim();

    if (!empCode || !piName || !piPhone || !piEmail || !piDepartment) {
      if (piGatekeeperError) {
        piGatekeeperError.textContent = 'Please fill out all required fields: Employee Code, Name, Mobile Number, University Email ID, and Department.';
        piGatekeeperError.style.display = 'block';
      }
      return;
    }

    if (!piEmail.endsWith('@vignan.ac.in')) {
      if (piGatekeeperError) {
        piGatekeeperError.textContent = 'Only official Vignan University email IDs (@vignan.ac.in) are permitted. Personal domains like @gmail.com or @yahoo.com are not allowed.';
        piGatekeeperError.style.display = 'block';
      }
      if (gatekeeperPiEmail) gatekeeperPiEmail.focus();
      return;
    }

    if (piPhone.length !== 10) {
      if (piGatekeeperError) {
        piGatekeeperError.textContent = 'Please enter a valid 10-digit mobile number.';
        piGatekeeperError.style.display = 'block';
      }
      return;
    }

    const submitBtn = document.getElementById('gatekeeperSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Accessing Portal... ⏳';
    }

    try {
      currentPiCode = empCode;
      currentPiName = piName;
      currentPiPhone = piPhone;
      currentPiEmail = piEmail;
      currentPiDepartment = piDepartment;

      // Store in sessionStorage
      sessionStorage.setItem('projectpi_auth_user', JSON.stringify({
        empCode,
        piName,
        piPhone,
        piEmail,
        piDepartment
      }));
      sessionStorage.setItem('pi_code', empCode);
      sessionStorage.setItem('pi_name', piName);
      sessionStorage.setItem('pi_phone', piPhone);
      sessionStorage.setItem('pi_email', piEmail);
      sessionStorage.setItem('pi_department', piDepartment);

      // Pre-fill locked proposal fields
      const fEmp = document.getElementById('empCode');
      const fName = document.getElementById('piName');
      const fPhone = document.getElementById('piPhone');
      const fEmail = document.getElementById('piEmail');
      const fDept = document.getElementById('piDepartment');
      if (fEmp) { fEmp.value = empCode; fEmp.readOnly = true; }
      if (fName) { fName.value = piName; fName.readOnly = true; }
      if (fPhone) { fPhone.value = piPhone; fPhone.readOnly = true; }
      if (fEmail) { fEmail.value = piEmail; fEmail.readOnly = true; }
      if (fDept) { fDept.value = piDepartment; fDept.readOnly = true; }

      // Show verified banner
      showPiBanner(empCode, piName, piEmail, piDepartment);

      // Fetch user proposals
      try {
        const pResp = await fetch(`/api/proposals?empCode=${encodeURIComponent(empCode)}&piName=${encodeURIComponent(piName)}&piPhone=${encodeURIComponent(piPhone)}&piEmail=${encodeURIComponent(piEmail)}&piDepartment=${encodeURIComponent(piDepartment)}`);
        if (pResp.ok) {
          const proposals = await pResp.json();
          currentPiProposals = Array.isArray(proposals) ? proposals.map(normalizeProposal) : [];
        } else {
          currentPiProposals = [];
        }
      } catch (pErr) {
        console.error('Failed to load proposals:', pErr);
        currentPiProposals = [];
      }

      showToast(`Welcome, ${piName}! Access granted to Project Proposals Portal.`, 'success');

      if (currentPiProposals.length === 0) {
        gatekeeperCard.style.display = 'none';
        personalDashboardCard.style.display = 'none';
        proposalFormCard.style.display = 'block';
        if (backToGatekeeperBtn) backToGatekeeperBtn.style.display = 'block';
        if (backToDashBtn) backToDashBtn.style.display = 'none';
      } else {
        renderPersonalDashboard();
        gatekeeperCard.style.display = 'none';
        personalDashboardCard.style.display = 'block';
        proposalFormCard.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
      if (piGatekeeperError) {
        piGatekeeperError.textContent = err.message || 'An error occurred while accessing the portal.';
        piGatekeeperError.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Access Portal & Proposals 🚀';
      }
    }
  });
}

// Render Personal Proposals Dashboard Table
function renderPersonalDashboard() {
  if (dashEmpCode) dashEmpCode.textContent = currentPiCode;
  if (dashPiName) dashPiName.textContent = currentPiName;
  if (dashPiPhone) dashPiPhone.textContent = currentPiPhone;
  const dashPiEmail = document.getElementById('dashPiEmail');
  const dashPiDepartment = document.getElementById('dashPiDepartment');
  if (dashPiEmail) dashPiEmail.textContent = currentPiEmail;
  if (dashPiDepartment) dashPiDepartment.textContent = currentPiDepartment;
  
  if (!personalProposalsTableBody) return;
  
  personalProposalsTableBody.innerHTML = '';
  
  if (currentPiProposals.length === 0) {
    personalProposalsTableBody.innerHTML = `<tr><td colspan="6" class="empty-state">No proposals found under this profile.</td></tr>`;
    return;
  }
  
  currentPiProposals.forEach(rawP => {
    const p = normalizeProposal(rawP);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div style="font-weight: 500; color: var(--text-primary); max-width: 300px;" class="text-truncate">${p.title || '-'}</div></td>
      <td><span class="tracking-badge">${p.trackingNumber || p.tracking_number || '-'}</span></td>
      <td>${p.submissionEndDate || p.submission_end_date || p.date || '-'}</td>
      <td>${p.duration || '-'}</td>
      <td>
        <span class="status-pill status-${(p.status || 'submitted').toLowerCase().replace(/\s+/g, '-')}">${p.status || 'submitted'}</span>
      </td>
      <td>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.openDetailsModal(${p.id})">👁️ View</button>
        </div>
      </td>
    `;
    personalProposalsTableBody.appendChild(tr);
  });
}

// Switch Investigator Profile / Logout Handlers
if (piLogoutBtn) {
  piLogoutBtn.addEventListener('click', () => {
    clearPiSession();
    showToast('Logged out of PI session.', 'info');
  });
}

if (gatekeeperResetBtn) {
  gatekeeperResetBtn.addEventListener('click', () => {
    clearPiSession();
  });
}

// Register New Proposal Project
if (registerNewProjectBtn) {
  registerNewProjectBtn.addEventListener('click', () => {
    sessionStorage.setItem('pi_view_state', 'register');
    personalDashboardCard.style.display = 'none';
    proposalFormCard.style.display = 'block';
    updateProposalProofStatusContext(statusDropdown ? statusDropdown.value : 'submitted');
    
    if (backToDashBtn) backToDashBtn.style.display = 'block';
    if (backToGatekeeperBtn) backToGatekeeperBtn.style.display = 'none';
  });
}

// Navigation Back Buttons
if (backToDashBtn) {
  backToDashBtn.addEventListener('click', () => {
    sessionStorage.setItem('pi_view_state', 'dashboard');
    proposalFormCard.style.display = 'none';
    personalDashboardCard.style.display = 'block';
    renderPersonalDashboard();
  });
}

if (backToGatekeeperBtn) {
  backToGatekeeperBtn.addEventListener('click', () => {
    clearPiSession();
  });
}

// Status change listener (Used when select dropdown is present)
if (statusDropdown && statusDropdown.tagName === 'SELECT') {
  statusDropdown.addEventListener('change', (e) => {
    updateProposalProofStatusContext(e.target.value);
  });
}

function updateProposalProofStatusContext(statusVal) {
  const val = statusVal || (statusDropdown ? statusDropdown.value : 'submitted');
  const commentsGroup = document.getElementById('notRecommendedCommentsGroup');
  const labelEl = document.getElementById('proposalProofLabelText');
  const hintEl = document.getElementById('proposalProofHint');
  const statusNameEl = document.getElementById('proposalProofStatusName');
  const feedbackInput = document.getElementById('feedbackText');

  if (val === 'Not recommended') {
    if (commentsGroup) commentsGroup.style.display = 'block';
    if (feedbackInput) feedbackInput.required = true;
    if (labelEl) labelEl.innerHTML = '📎 Upload Not Recommended Evaluation / Committee Review Proof (PDF, DOC, DOCX, JPG, PNG) <span class="req">*</span>';
    if (statusNameEl) statusNameEl.textContent = 'Not Recommended';
    if (hintEl) hintEl.innerHTML = 'Attach committee evaluation report, review score sheet, or rejection letter for <strong>Not Recommended</strong> status';
  } else {
    if (commentsGroup) commentsGroup.style.display = 'none';
    if (feedbackInput) {
      feedbackInput.required = false;
      feedbackInput.value = '';
    }

    if (val === 'invite for presentation') {
      if (labelEl) labelEl.innerHTML = '📎 Upload Presentation Invitation Notice / Email Proof (PDF, DOC, DOCX, JPG, PNG) <span class="req">*</span>';
      if (statusNameEl) statusNameEl.textContent = 'Invite for Presentation';
      if (hintEl) hintEl.innerHTML = 'Attach presentation call letter, invitation email screenshot, or schedule proof for <strong>Invite for Presentation</strong> status';
    } else if (val === 'sanctioned') {
      if (labelEl) labelEl.innerHTML = '📎 Upload Sanction Letter / Sanction Order Proof (PDF, DOC, DOCX, JPG, PNG) <span class="req">*</span>';
      if (statusNameEl) statusNameEl.textContent = 'Sanctioned';
      if (hintEl) hintEl.innerHTML = 'Attach official sanction order copy, grant sanction letter, or approval certificate for <strong>Sanctioned</strong> status';
    } else {
      // submitted
      if (labelEl) labelEl.innerHTML = '📎 Upload Submission Proof / Acknowledgment (PDF, DOC, DOCX, JPG, PNG) <span class="req">*</span>';
      if (statusNameEl) statusNameEl.textContent = 'Submitted';
      if (hintEl) hintEl.innerHTML = 'Attach submission acknowledgment slip, confirmation email, or proposal draft copy for <strong>Submitted</strong> status';
    }
  }
}

function getProofMimeFromExt(ext) {
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    default: return 'application/octet-stream';
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 KB';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function processProofFile(file, onProcessed) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png'].includes(ext);

  const reader = new FileReader();
  reader.onload = function(e) {
    const rawDataUrl = e.target.result;
    
    // Optimize large image files (> 1MB) for reliable transfer & instant database storage
    if (isImage && file.size > 1024 * 1024) {
      const img = new Image();
      img.onload = function() {
        const maxDim = 2000;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const mime = (file.type === 'image/png' || ext === 'png') ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mime, 0.85);
        onProcessed(file.name, mime, compressedDataUrl, file.size);
      };
      img.onerror = function() {
        onProcessed(file.name, file.type || getProofMimeFromExt(ext), rawDataUrl, file.size);
      };
      img.src = rawDataUrl;
    } else {
      onProcessed(file.name, file.type || getProofMimeFromExt(ext), rawDataUrl, file.size);
    }
  };
  reader.onerror = function() {
    showToast('Failed to read selected proof file.', 'danger');
  };
  reader.readAsDataURL(file);
}

async function handleProposalProofFileSelect(file) {
  if (!file) return;

  const maxBytes = 50 * 1024 * 1024; // 50MB limit
  if (file.size > maxBytes) {
    showToast('File size exceeds the 50MB limit. Please select a smaller document.', 'warning');
    return;
  }

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
  if (!allowed.includes(ext)) {
    showToast('Unsupported file format. Please upload PDF, Word (.doc, .docx), or Images (.jpg, .png).', 'warning');
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    showToast('File size exceeds the 50MB limit.', 'warning');
    return;
  }

  // Create local preview URL directly in browser for instant zero-lag preview
  if (userProofLocalUrl) {
    try { URL.revokeObjectURL(userProofLocalUrl); } catch (e) {}
  }
  userProofLocalUrl = URL.createObjectURL(file);
  userProofFileName = file.name;
  userProofFileType = file.type || `application/${ext}`;
  userProofFileSize = file.size;

  const nameEl = document.getElementById('proposalProofFileName');
  const sizeEl = document.getElementById('proposalProofFileSize');
  const typeEl = document.getElementById('proposalProofFileType');
  const iconEl = document.getElementById('proposalProofFileIcon');
  const infoCard = document.getElementById('proposalProofFileInfo');
  const dropzone = document.getElementById('proposalProofDropzone');

  if (nameEl) nameEl.textContent = file.name;
  if (sizeEl) sizeEl.textContent = `${formatBytes(file.size)} • Uploading to Drive Storage...`;
  if (typeEl) typeEl.textContent = ext.toUpperCase() + ' Document';

  if (iconEl) {
    if (['jpg', 'jpeg', 'png'].includes(ext)) {
      iconEl.textContent = '🖼️';
    } else if (ext === 'pdf') {
      iconEl.textContent = '📕';
    } else {
      iconEl.textContent = '📘';
    }
  }

  if (infoCard) {
    infoCard.style.display = 'flex';
    infoCard.style.animation = 'fadeIn 0.2s ease';
  }
  if (dropzone) {
    dropzone.style.borderColor = '#3b82f6';
    dropzone.style.background = 'rgba(59, 130, 246, 0.05)';
  }

  // Upload directly to disk drive storage via streaming multipart FormData
  try {
    const formData = new FormData();
    formData.append('proofFile', file);

    const res = await fetch('/api/proposals/upload-proof', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok && data.success) {
      userProofFileName = data.fileName;
      userProofFileType = data.fileType;
      userProofFilePath = data.filePath;
      userProofFileSize = data.fileSize;
      userProofFileData = ''; // Stored on Drive, zero base64 in RAM/DB!

      if (sizeEl) sizeEl.textContent = `${formatBytes(data.fileSize)} • Stored on Drive 💾`;
      if (dropzone) {
        dropzone.style.borderColor = '#10b981';
        dropzone.style.background = 'rgba(16, 185, 129, 0.05)';
      }
      showToast(`Proof "${file.name}" saved to drive storage successfully!`);
    } else {
      throw new Error(data.message || 'Drive upload failed');
    }
  } catch (err) {
    console.warn('Direct drive upload fallback to base64 buffer:', err);
    processProofFile(file, (fileName, mimeType, dataUrl, originalSize) => {
      userProofFileName = fileName;
      userProofFileType = mimeType;
      userProofFileData = dataUrl;
      if (sizeEl) sizeEl.textContent = `${formatBytes(originalSize)} • Attached`;
      if (dropzone) {
        dropzone.style.borderColor = '#10b981';
        dropzone.style.background = 'rgba(16, 185, 129, 0.05)';
      }
      showToast(`Proof "${fileName}" attached.`);
    });
  }
}

function clearProposalProofUpload() {
  userProofFileName = '';
  userProofFileType = '';
  userProofFileData = '';
  userProofFilePath = '';
  userProofFileSize = 0;
  if (userProofLocalUrl) {
    try { URL.revokeObjectURL(userProofLocalUrl); } catch (e) {}
    userProofLocalUrl = '';
  }
  const input = document.getElementById('proposalProofFileInput');
  if (input) input.value = '';
  const infoCard = document.getElementById('proposalProofFileInfo');
  if (infoCard) infoCard.style.display = 'none';
  const dropzone = document.getElementById('proposalProofDropzone');
  if (dropzone) {
    dropzone.style.borderColor = '#94a3b8';
    dropzone.style.background = 'rgba(248, 250, 252, 0.75)';
  }
}

// Attach Proposal Proof Dropzone & File Pickers
const pDropzone = document.getElementById('proposalProofDropzone');
const pInput = document.getElementById('proposalProofFileInput');
const pRemoveBtn = document.getElementById('proposalProofRemoveBtn');
const pPreviewBtn = document.getElementById('proposalProofPreviewBtn');

if (pDropzone) {
  pDropzone.addEventListener('click', () => {
    if (pInput) pInput.click();
  });
  pDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    pDropzone.classList.add('dragover');
  });
  pDropzone.addEventListener('dragleave', () => {
    pDropzone.classList.remove('dragover');
  });
  pDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    pDropzone.classList.remove('dragover');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProposalProofFileSelect(e.dataTransfer.files[0]);
    }
  });
}

if (pInput) {
  pInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProposalProofFileSelect(e.target.files[0]);
    }
  });
}

if (pRemoveBtn) {
  pRemoveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearProposalProofUpload();
    showToast('Attached proof document removed.', 'info');
  });
}

if (pPreviewBtn) {
  pPreviewBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const previewUrl = userProofLocalUrl || userProofFileData;
    if (!previewUrl) return;
    window.open(previewUrl, '_blank');
  });
}

function clearSubmittedInputs() {
  const sName = document.getElementById('submittedScientistName');
  const sSec = document.getElementById('submittedSectionNumber');
  const sTrack = document.getElementById('submittedTrackingNumber');
  if (sName) sName.value = '';
  if (sSec) sSec.value = '';
  if (sTrack) sTrack.value = '';
}

function clearInvitedInputs() {
  if (presentationDate) presentationDate.value = '';
}

function clearSanctionedInputs() {
  if (sanctionOrderNumberInput) sanctionOrderNumberInput.value = '';
  if (sanctionedAmountInput) sanctionedAmountInput.value = '';
}

// Drag & Drop Feedback Upload Simulation (If uploadArea is present)
if (uploadArea) {
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.background = 'rgba(99, 102, 241, 0.08)';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    uploadArea.style.background = 'rgba(0, 0, 0, 0.15)';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    uploadArea.style.background = 'rgba(0, 0, 0, 0.15)';
    
    if (e.dataTransfer.files.length > 0) {
      handleFeedbackFile(e.dataTransfer.files[0]);
    }
  });
}

if (feedbackFileInput) {
  feedbackFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFeedbackFile(e.target.files[0]);
    }
  });
}

function handleFeedbackFile(file) {
  uploadedFileName = file.name;
  if (fileNameDisplay) fileNameDisplay.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  if (fileInfo) fileInfo.classList.add('visible');
  if (uploadArea) uploadArea.style.display = 'none';
  showToast(`File "${file.name}" loaded successfully.`);
}

if (removeFileBtn) {
  removeFileBtn.addEventListener('click', () => {
    clearFeedbackUpload();
  });
}

function clearFeedbackUpload() {
  uploadedFileName = '';
  if (feedbackFileInput) feedbackFileInput.value = '';
  if (fileInfo) fileInfo.classList.remove('visible');
  if (uploadArea) uploadArea.style.display = 'block';
  if (fileNameDisplay) fileNameDisplay.textContent = 'No file uploaded';
}

// Check Admin State helper
function checkAdminState() {
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const headerAdminLoginBtn = document.getElementById('headerAdminLoginBtn');
  const portalHomeBtn = document.querySelector('.portal-home-btn');
  const controlsSection = document.querySelector('.controls-section');
  const tabsContainer = document.querySelector('.tabs-container');
  const isAdminRoute = window.location.hash === '#admin' || window.location.hash === '#projectadmin' || !!sessionStorage.getItem('admin_token');
  
  if (isAdminRoute) {
    // Admin mode active directly: NO login required
    sessionStorage.setItem('admin_token', 'admin_active_session');
    document.body.classList.add('admin-active-body');
    
    // Explicitly hide Central R&D Portal and Logout buttons on Admin side
    if (portalHomeBtn) portalHomeBtn.style.display = 'none';
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'none';
    if (headerAdminLoginBtn) headerAdminLoginBtn.style.display = 'none';
    if (controlsSection) controlsSection.style.display = 'none';
    if (tabsContainer) tabsContainer.style.display = 'flex';
    
    // Show Admin-only tabs, hide Submit tab
    if (tabs.view) tabs.view.style.display = 'inline-flex';
    if (tabs.analytics) tabs.analytics.style.display = 'inline-flex';
    if (tabs.submit) tabs.submit.style.display = 'none';
    if (tabs.contentSubmit) {
      tabs.contentSubmit.style.display = 'none';
      tabs.contentSubmit.classList.remove('active');
    }
    
    // Ensure admin hash remains in URL for Admin mode
    if (window.location.hash !== '#admin' && window.location.hash !== '#projectadmin') {
      history.replaceState(null, "", window.location.pathname + '#admin');
    }
    
    // Auto-switch to view tab (Submitted Project Proposals)
    switchTab('view');
    renderProposals();
  } else {
    // Normal Public / PI User view
    sessionStorage.removeItem('admin_token');
    document.body.classList.remove('admin-active-body');
    if (portalHomeBtn) portalHomeBtn.style.display = 'none';
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'none';
    if (headerAdminLoginBtn) headerAdminLoginBtn.style.display = 'none';
    if (controlsSection) controlsSection.style.display = 'none';
    if (tabsContainer) tabsContainer.style.display = 'none';

    // Hide Admin-only tabs, show Submit tab
    if (tabs.view) tabs.view.style.display = 'none';
    if (tabs.analytics) tabs.analytics.style.display = 'none';
    if (tabs.submit) tabs.submit.style.display = 'inline-flex';
    if (tabs.contentSubmit) {
      tabs.contentSubmit.style.display = 'block';
      tabs.contentSubmit.classList.add('active');
    }
    
    // Fallback switch to submit tab
    switchTab('submit');
  }
}

// Admin Logout Action (Returns to Central R&D Portal)
if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_emp_code');
    window.location.href = '/';
  });
}

// Header Admin Login Button Listener (Switches to Admin mode)
const headerAdminLoginBtn = document.getElementById('headerAdminLoginBtn');
if (headerAdminLoginBtn) {
  headerAdminLoginBtn.addEventListener('click', () => {
    window.location.hash = 'admin';
    checkAdminState();
  });
}

// Hash Routing for Admin View (#admin and #projectadmin)
function handleHashRoute() {
  checkAdminState();
}

window.addEventListener('hashchange', handleHashRoute);
window.addEventListener('load', handleHashRoute);

// Reset Form function
function resetForm() {
  form.reset();
  
  // Re-populate locked PI fields from verification gateway
  document.getElementById('empCode').value = currentPiCode;
  document.getElementById('piName').value = currentPiName;
  document.getElementById('piPhone').value = currentPiPhone;
  document.getElementById('piEmail').value = currentPiEmail;
  document.getElementById('piDepartment').value = currentPiDepartment;

  projectDate.value = today;
  toggleCollab(false);
  toggleExpert(false); // Reset expert fields
  if (statusDropdown) {
    statusDropdown.value = 'submitted';
    updateProposalProofStatusContext('submitted');
  }
  clearProposalProofUpload();
  const feedbackInput = document.getElementById('feedbackText');
  if (feedbackInput) {
    feedbackInput.value = '';
    feedbackInput.required = false;
  }
  if (notRecommendedCommentsGroup) {
    notRecommendedCommentsGroup.style.display = 'none';
  }
  
  const projectTitle = document.getElementById('projectTitle');
  if (projectTitle) {
    projectTitle.style.height = '48px';
  }
  const submissionEndDateInput = document.getElementById('submissionEndDate');
  if (submissionEndDateInput) {
    submissionEndDateInput.value = '';
  }
  
  // Clear extra Co-PI fields
  copiContainer.innerHTML = `
    <div class="copi-row">
      <input type="text" placeholder="Co-PI 1 Name" name="copi[]">
    </div>
  `;
  
  // Reset Funding Type panels
  if (fundingIndustryGroup) fundingIndustryGroup.style.display = 'none';
  if (fundingIndustryNameInput) {
    fundingIndustryNameInput.required = false;
    fundingIndustryNameInput.value = '';
  }
  if (fundingOtherAgencyGroup) fundingOtherAgencyGroup.style.display = 'none';
  if (fundingOtherAgencyInput) {
    fundingOtherAgencyInput.required = false;
    fundingOtherAgencyInput.value = '';
  }
  if (fundingAgencyGroup) fundingAgencyGroup.style.display = 'block';
  if (fundingAgencySelect) {
    fundingAgencySelect.required = true;
    fundingAgencySelect.value = '';
  }
}

resetBtn.addEventListener('click', resetForm);

// Form Submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const empCode = document.getElementById('empCode').value.trim();
  const piName = document.getElementById('piName').value.trim();
  const piPhone = document.getElementById('piPhone').value.trim();
  const piEmail = document.getElementById('piEmail').value.trim().toLowerCase();
  const piDepartment = document.getElementById('piDepartment').value.trim();

  if (!piEmail.endsWith('@vignan.ac.in')) {
    alert('PI Email must be an official Vignan University address ending with @vignan.ac.in');
    return;
  }
  
  // Collect all Co-PI fields
  const copis = [];
  const copiInputs = copiContainer.querySelectorAll('input[name="copi[]"]');
  copiInputs.forEach(input => {
    if (input.value.trim() !== '') {
      copis.push(input.value.trim());
    }
  });

  const title = document.getElementById('projectTitle').value.trim();
  const duration = document.getElementById('duration').value.trim();
  const date = document.getElementById('projectDate').value;
  const industrialCollab = industrialCollabInput.value;
  let industryName = '';
  if (industrialCollab === 'Yes') {
    industryName = industryNameInput.value.trim();
  }
  
  const reviewedByExpert = document.getElementById('reviewedByExpert').value;
  const reviewerName = reviewedByExpert === 'Yes' ? document.getElementById('reviewerName').value.trim() : '';
  const reviewerAddress = reviewedByExpert === 'Yes' ? document.getElementById('reviewerAddress').value.trim() : '';

  const fundingType = document.getElementById('fundingType').value;
  let fundingAgency = '';
  if (fundingType === 'Industry') {
    fundingAgency = 'Industry';
    const fundingIndustryName = document.getElementById('fundingIndustryName').value.trim();
    if (fundingIndustryName) {
      industryName = fundingIndustryName;
    }
  } else {
    const selectedAgency = document.getElementById('fundingAgency').value;
    if (selectedAgency === 'Other') {
      const customAgency = document.getElementById('fundingOtherAgency') ? document.getElementById('fundingOtherAgency').value.trim() : '';
      if (!customAgency) {
        alert('Please enter the name of the Funding Agency.');
        if (document.getElementById('fundingOtherAgency')) document.getElementById('fundingOtherAgency').focus();
        return;
      }
      fundingAgency = customAgency;
    } else {
      fundingAgency = selectedAgency;
    }
  }
  const proposedAmount = document.getElementById('proposedAmount').value;
  const projectScheme = document.getElementById('projectScheme').value.trim();
  const submissionEndDate = document.getElementById('submissionEndDate').value;
  const status = (statusDropdown && statusDropdown.value) ? statusDropdown.value : 'submitted';
  
  // Validation for Not Recommended comments
  const feedbackInput = document.getElementById('feedbackText');
  const feedbackVal = feedbackInput ? feedbackInput.value.trim() : '';
  if (status === 'Not recommended' && !feedbackVal) {
    showToast('Please enter comments / reasons for Not Recommended status.', 'warning');
    if (feedbackInput) feedbackInput.focus();
    return;
  }

  // Validation for Proof submission
  const hasAttachedProof = !!(userProofFilePath || userProofFileData || userProofFileName);
  if (!hasAttachedProof) {
    showToast('Please upload a proof document (.pdf, .doc, .docx, .jpg, .png) for the selected status.', 'warning');
    const pDropzone = document.getElementById('proposalProofDropzone');
    if (pDropzone) pDropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const trackingNumber = `PROJ-2026-${randomNum}`;

  // Create project proposal payload
  const newProposal = {
    id: Date.now(),
    empCode,
    piName,
    piPhone,
    piEmail,
    piDepartment,
    copis,
    title,
    trackingNumber,
    duration,
    date,
    industrialCollab,
    industryName,
    reviewedByExpert,
    reviewerName,
    reviewerAddress,
    fundingType,
    fundingAgency,
    proposedAmount,
    projectScheme,
    submissionEndDate,
    status,
    sanctionOrderNumber: null,
    sanctionedAmount: null,
    presentationDate: null,
    sectionNumber: null,
    scientistName: null,
    feedbackFileName: userProofFileName || null,
    feedbackText: feedbackVal || null,
    proofFileName: userProofFileName || null,
    proofFileType: userProofFileType || null,
    proofFilePath: userProofFilePath || null,
    proofFileSize: userProofFileSize || null,
    proofFileData: userProofFileData || null
  };

  submitProposalToServer(newProposal);
});

// Render Proposals Table
function renderProposals() {
  let proposals = getProposals();
  const isAdmin = !!(sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'));
  
  // Render Dynamic Headers based on view state
  if (proposalsTableHead) {
    let headersHTML = `
      <th>Emp. Code</th>
      <th>Project Tracking Number</th>
      <th>Date of Joining</th>
      <th>Duration</th>
      <th>Status</th>
    `;
    if (isAdmin) {
      headersHTML += `<th>Confidential Info (Admin Only)</th>`;
    }
    headersHTML += `<th>Actions</th>`;
    proposalsTableHead.innerHTML = headersHTML;
  }

  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const statusVal = statusFilter ? statusFilter.value : 'ALL';
  
  // Filter proposals list
  proposals = proposals.filter(p => {
    // 1. Status Filter
    if (statusVal !== 'ALL' && p.status !== statusVal) {
      return false;
    }
    
    // 2. Search Query Filter
    if (searchQuery !== '') {
      const matchesPI = p.piName.toLowerCase().includes(searchQuery);
      const matchesEmpCode = p.empCode.toLowerCase().includes(searchQuery);
      const matchesTitle = p.title.toLowerCase().includes(searchQuery);
      const matchesTrack = p.trackingNumber.toLowerCase().includes(searchQuery);
      const matchesScheme = p.projectScheme.toLowerCase().includes(searchQuery);
      const matchesAgency = p.fundingAgency.toLowerCase().includes(searchQuery);
      const matchesCoPI = p.copis.some(copi => copi.toLowerCase().includes(searchQuery));
      
      // Admin-only search capabilities
      let matchesAdminFields = false;
      if (isAdmin) {
        const matchesSanction = p.sanctionOrderNumber && p.sanctionOrderNumber.toLowerCase().includes(searchQuery);
        const matchesFeedback = p.feedbackText && p.feedbackText.toLowerCase().includes(searchQuery);
        const matchesFeedbackFile = p.feedbackFileName && p.feedbackFileName.toLowerCase().includes(searchQuery);
        matchesAdminFields = matchesSanction || matchesFeedback || matchesFeedbackFile;
      }
      
      const matchesScientist = p.scientistName && p.scientistName.toLowerCase().includes(searchQuery);
      return matchesPI || matchesEmpCode || matchesTitle || matchesTrack || matchesScheme || matchesAgency || matchesCoPI || matchesScientist || matchesAdminFields;
    }
    
    return true;
  });
  
  proposalsTableBody.innerHTML = '';
  
  if (proposals.length === 0) {
    const totalCols = isAdmin ? 7 : 6;
    proposalsTableBody.innerHTML = `
      <tr>
        <td colspan="${totalCols}" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p>No proposals match your search or filter criteria.</p>
        </td>
      </tr>
    `;
    return;
  }
  
  proposals.forEach(p => {
    const row = document.createElement('tr');
    
    // Status Badge generator
    let statusClass = 'badge-submitted';
    let statusText = 'Submitted';
    
    if (p.status === 'invite for presentation') {
      statusClass = 'badge-presentation';
      statusText = 'Invite for Presentation';
    } else if (p.status === 'Not recommended') {
      statusClass = 'badge-rejected';
      statusText = 'Not Recommended';
    } else if (p.status === 'sanctioned') {
      statusClass = 'badge-sanctioned';
      statusText = 'Sanctioned';
    }
    
    const statusBadge = `<span class="badge ${statusClass}">${statusText}</span>`;
    
    // Funding Type Badge
    const fundingBadge = `<span class="badge ${p.fundingType === 'GOVERNMENT' ? 'badge-gov' : 'badge-nongov'}">${p.fundingType}</span>`;
    
    // Investigator names build
    const coPisText = p.copis && p.copis.length > 0 
      ? `<br><span style="font-size: 0.8rem; color: var(--text-secondary);">Co-PIs: ${p.copis.join(', ')}</span>`
      : '';
    
    // Industrial Collaboration info
    const collabText = p.industrialCollab === 'Yes'
      ? `<br><span style="font-size: 0.78rem; color: var(--accent-color);">🏢 Collab: ${p.industryName}</span>`
      : '';

    // Amount column formatting
    let amountCellContent = `<div style="font-weight: 600; color: #cbd5e1;">Prop: ₹ ${p.proposedAmount} L</div>`;
    if (p.status === 'sanctioned' && p.sanctionedAmount) {
      amountCellContent += `<div style="font-weight: 600; color: #34d399; font-size: 0.82rem; margin-top: 2px;">Sanc: ₹ ${p.sanctionedAmount} L</div>`;
    }

    // Feedback & Sanction cell generator based on role settings
    let feedbackCellContent = '-';
    if (p.status === 'Not recommended') {
      if (isAdmin) {
        const fileLink = p.feedbackFileName 
          ? `<span class="feedback-filename" onclick="simulateDownload('${p.feedbackFileName}')">📄 ${p.feedbackFileName}</span>`
          : '<span style="color: var(--text-secondary); font-style: italic;">No file uploaded</span>';
        
        const note = p.feedbackText 
          ? `<span class="feedback-text-view" title="${p.feedbackText}">"${p.feedbackText}"</span>`
          : '<span style="color: var(--text-secondary); font-style: italic;">No feedback text</span>';
          
        feedbackCellContent = `
          <div class="feedback-unlocked">
            ${fileLink}
            ${note}
          </div>
        `;
      } else {
        feedbackCellContent = `
          <span class="admin-only-badge">🔒 Private Feedback (Admin Only)</span>
        `;
      }
    } else if (p.status === 'sanctioned') {
      if (isAdmin) {
        feedbackCellContent = `
          <div class="feedback-unlocked">
            <span style="font-weight: 600; color: #10b981; font-size: 0.8rem;">🔑 Sanction Order:</span>
            <span style="font-family: monospace; font-size: 0.82rem; color: var(--text-primary); white-space: normal; word-break: break-all;">${p.sanctionOrderNumber || '-'}</span>
          </div>
        `;
      } else {
        feedbackCellContent = `
          <span class="admin-only-badge">🔒 Sanction Order (Admin Only)</span>
        `;
      }
    }
    
    let rowHTML = `
      <td style="font-weight: 500;">${p.empCode || p.emp_code || '-'}</td>
      <td><code>${p.trackingNumber || p.tracking_number || '-'}</code></td>
      <td>${p.date || '-'}</td>
      <td>${p.duration || '-'}</td>
      <td>${statusBadge}</td>
    `;
    if (isAdmin) {
      rowHTML += `<td class="feedback-cell">${feedbackCellContent}</td>`;
    }
    const actionsHTML = `
      <div style="display: flex; gap: 6px; align-items: center;">
        <button class="btn btn-secondary btn-sm" onclick="openDetailsModal(${p.id})">👁️ View</button>
      </div>
    `;
    rowHTML += `<td>${actionsHTML}</td>`;
    row.innerHTML = rowHTML;
    
    proposalsTableBody.appendChild(row);
  });
}

// Build Microsoft Word HTML document matching official VFSTR Project Details Application Form layout
function buildProposalDocHtml(p) {
  p = normalizeProposal(p);
  const escapeXml = (unsafe) => {
    if (unsafe === undefined || unsafe === null) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const empCode = escapeXml(p.empCode || p.emp_code || '-');
  const piName = escapeXml(p.piName || p.pi_name || '-');
  const piPhone = escapeXml(p.piPhone || p.pi_phone || '-');
  const piEmail = escapeXml(p.piEmail || p.pi_email || '-');
  const piDepartment = escapeXml(p.piDepartment || p.pi_department || '-');

  let copiDetails = '-';
  const copis = Array.isArray(p.copis) ? p.copis : (Array.isArray(p.coPis) ? p.coPis : []);
  if (copis.length > 0) {
    copiDetails = copis.map((c, i) => `${i + 1}. ${escapeXml(c)}`).join('<br/>');
  } else {
    copiDetails = 'None';
  }

  const title = escapeXml(p.title || '-');
  const duration = escapeXml(p.duration || '-');
  const date = escapeXml(p.date || '-');
  const industrialCollab = escapeXml(p.industrialCollab || p.industrial_collab || 'No');
  const industryName = (industrialCollab === 'Yes') ? escapeXml(p.industryName || p.industry_name || '-') : '-';
  const reviewedByExpert = escapeXml(p.reviewedByExpert || p.reviewed_by_expert || 'No');
  const reviewerName = (reviewedByExpert === 'Yes') ? escapeXml(p.reviewerName || p.reviewer_name || '-') : '-';
  const reviewerAddress = (reviewedByExpert === 'Yes') ? escapeXml(p.reviewerAddress || p.reviewer_address || '-') : '-';

  const fundingType = escapeXml(p.fundingType || p.funding_type || '-');
  const fundingAgency = escapeXml(p.fundingAgency || p.funding_agency || '-');
  const projectScheme = escapeXml(p.projectScheme || p.project_scheme || '-');
  const proposedAmount = escapeXml(p.proposedAmount || p.proposed_amount || '-');
  const submissionEndDate = escapeXml(p.submissionEndDate || p.submission_end_date || '-');

  const status = escapeXml(p.status || 'submitted');
  const trackingNumber = escapeXml(p.trackingNumber || p.tracking_number || '-');
  const scientistName = escapeXml(p.scientistName || p.scientist_name || '-');

  let sectionNumber = '-';
  if (p.sectionNumber || p.section_number) {
    const sec = String(p.sectionNumber || p.section_number);
    sectionNumber = escapeXml(sec.startsWith('Section') ? sec : 'Section ' + sec);
  }

  let extraStatusRows = '';
  if (p.status === 'sanctioned') {
    if (p.sanctionOrderNumber || p.sanction_order_number) {
      extraStatusRows += `
    <tr>
      <td class="label-cell">Sanctioned Order Number:</td>
      <td class="value-cell">${escapeXml(p.sanctionOrderNumber || p.sanction_order_number)}</td>
    </tr>`;
    }
    if (p.sanctionedAmount || p.sanctioned_amount) {
      extraStatusRows += `
    <tr>
      <td class="label-cell">Sanctioned Amount (Rs. In Lakhs):</td>
      <td class="value-cell">${escapeXml(p.sanctionedAmount || p.sanctioned_amount)}</td>
    </tr>`;
    }
  } else if (p.status === 'invite for presentation') {
    if (p.presentationDate || p.presentation_date) {
      extraStatusRows += `
    <tr>
      <td class="label-cell">Date of Presentation:</td>
      <td class="value-cell">${escapeXml(p.presentationDate || p.presentation_date)}</td>
    </tr>`;
    }
  } else if (p.status === 'Not recommended') {
    if (p.feedbackText || p.feedback_text) {
      extraStatusRows += `
    <tr>
      <td class="label-cell">Feedback Comments:</td>
      <td class="value-cell">${escapeXml(p.feedbackText || p.feedback_text)}</td>
    </tr>`;
    }
  }

  if (p.proofFileName || p.proof_file_name) {
    extraStatusRows += `
    <tr>
      <td class="label-cell">Status Proof Attached:</td>
      <td class="value-cell">${escapeXml(p.proofFileName || p.proof_file_name)} (Saved in Portal Database)</td>
    </tr>`;
  }

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Project Details Application Form - ${trackingNumber}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
  size: 8.27in 11.69in; /* A4 */
  margin: 0.8in 0.8in 0.8in 0.8in;
  mso-header-margin: 0.5in;
  mso-footer-margin: 0.5in;
  mso-paper-source: 0;
}
div.Section1 {
  page: Section1;
}
body {
  font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
  color: #1e293b;
  line-height: 1.35;
  font-size: 11pt;
}
.header-container {
  text-align: center;
  margin-bottom: 8px;
}
.univ-title {
  color: #1e3a8a;
  font-size: 13.5pt;
  font-weight: bold;
  letter-spacing: 0.3px;
  margin: 0;
  text-transform: uppercase;
}
.univ-subtitle {
  color: #334155;
  font-size: 9.5pt;
  margin: 2px 0;
}
.header-divider {
  border: none;
  border-top: 1.5px solid #1e3a8a;
  margin: 8px 0 12px 0;
}
.doc-title {
  color: #1e3a8a;
  font-size: 12.5pt;
  font-weight: bold;
  text-decoration: underline;
  text-align: center;
  margin: 10px 0 14px 0;
  text-transform: uppercase;
}
.section-banner {
  background-color: #f1f5f9;
  border-left: 5px solid #1d4ed8;
  padding: 6px 10px;
  font-weight: bold;
  font-size: 10.5pt;
  color: #1e3a8a;
  margin-top: 12px;
  margin-bottom: 0px;
}
table.form-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 6px;
  border: 1px solid #cbd5e1;
}
table.form-table td {
  padding: 6px 10px;
  font-size: 10pt;
  vertical-align: middle;
  border: 1px solid #cbd5e1;
}
table.form-table td.label-cell {
  width: 34%;
  font-weight: bold;
  color: #1e293b;
  background-color: #ffffff;
}
table.form-table td.value-cell {
  width: 66%;
  color: #0f172a;
  background-color: #ffffff;
}
</style>
</head>
<body>
<div class="Section1">
  <div class="header-container">
    <div class="univ-title">VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY AND RESEARCH</div>
    <div class="univ-subtitle">(Deemed to be University) &bull; Directorate of Research & Development (R&D)</div>
    <div class="univ-subtitle">Vadlamudi, Guntur - 522213, Andhra Pradesh</div>
  </div>
  <hr class="header-divider" />
  
  <div class="doc-title">PROJECT DETAILS APPLICATION FORM</div>

  <!-- 1. INVESTIGATOR DETAILS -->
  <div class="section-banner">1. INVESTIGATOR DETAILS</div>
  <table class="form-table" border="1" cellpadding="6" cellspacing="0">
    <tr>
      <td class="label-cell">Emp. Code:</td>
      <td class="value-cell">${empCode}</td>
    </tr>
    <tr>
      <td class="label-cell">Name of the PI:</td>
      <td class="value-cell">${piName}</td>
    </tr>
    <tr>
      <td class="label-cell">PI Phone Number:</td>
      <td class="value-cell">${piPhone}</td>
    </tr>
    <tr>
      <td class="label-cell">PI Email ID:</td>
      <td class="value-cell">${piEmail}</td>
    </tr>
    <tr>
      <td class="label-cell">PI Department:</td>
      <td class="value-cell">${piDepartment}</td>
    </tr>
    <tr>
      <td class="label-cell">Co-PI Details:</td>
      <td class="value-cell">${copiDetails}</td>
    </tr>
  </table>

  <!-- 2. PROJECT METADATA -->
  <div class="section-banner">2. PROJECT METADATA</div>
  <table class="form-table" border="1" cellpadding="6" cellspacing="0">
    <tr>
      <td class="label-cell">Title of the Project:</td>
      <td class="value-cell">${title}</td>
    </tr>
    <tr>
      <td class="label-cell">Duration of the Project:</td>
      <td class="value-cell">${duration}</td>
    </tr>
    <tr>
      <td class="label-cell">Date of Submission:</td>
      <td class="value-cell">${date}</td>
    </tr>
    <tr>
      <td class="label-cell">Industrial Collaboration:</td>
      <td class="value-cell">${industrialCollab}</td>
    </tr>
    <tr>
      <td class="label-cell">Name of the Industry:</td>
      <td class="value-cell">${industryName}</td>
    </tr>
    <tr>
      <td class="label-cell">Reviewed by the External Expert:</td>
      <td class="value-cell">${reviewedByExpert}</td>
    </tr>
    <tr>
      <td class="label-cell">Name of the Reviewer:</td>
      <td class="value-cell">${reviewerName}</td>
    </tr>
    <tr>
      <td class="label-cell">Address of the Reviewer:</td>
      <td class="value-cell">${reviewerAddress}</td>
    </tr>
  </table>

  <!-- 3. FUNDING & SCHEMES -->
  <div class="section-banner">3. FUNDING & SCHEMES</div>
  <table class="form-table" border="1" cellpadding="6" cellspacing="0">
    <tr>
      <td class="label-cell">Funding Type:</td>
      <td class="value-cell">${fundingType}</td>
    </tr>
    <tr>
      <td class="label-cell">Funding Agency:</td>
      <td class="value-cell">${fundingAgency}</td>
    </tr>
    <tr>
      <td class="label-cell">Scheme:</td>
      <td class="value-cell">${projectScheme}</td>
    </tr>
    <tr>
      <td class="label-cell">Proposed Amount (Rs. In Lakhs):</td>
      <td class="value-cell">${proposedAmount}</td>
    </tr>
    <tr>
      <td class="label-cell">End Date of Project Submission:</td>
      <td class="value-cell">${submissionEndDate}</td>
    </tr>
  </table>

  <!-- 4. PROJECT STATUS -->
  <div class="section-banner">4. PROJECT STATUS</div>
  <table class="form-table" border="1" cellpadding="6" cellspacing="0">
    <tr>
      <td class="label-cell">Status of the Project:</td>
      <td class="value-cell">${status}</td>
    </tr>
    <tr>
      <td class="label-cell">Project Tracking Number:</td>
      <td class="value-cell"><strong>${trackingNumber}</strong></td>
    </tr>
    <tr>
      <td class="label-cell">Name of Scientist:</td>
      <td class="value-cell">${scientistName}</td>
    </tr>
    <tr>
      <td class="label-cell">Section:</td>
      <td class="value-cell">${sectionNumber}</td>
    </tr>${extraStatusRows}
  </table>
</div>
</body>
</html>`;
}

// Download Proposal Application as Word Document (.doc)
function downloadProposalDoc(proposal) {
  if (!proposal) {
    showToast('Proposal details not found for download.', 'warning');
    return;
  }
  const p = normalizeProposal(proposal);
  const docHtml = buildProposalDocHtml(p);
  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const cleanTrack = (p.trackingNumber || p.tracking_number || p.empCode || 'Form').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Project_Application_${cleanTrack}.doc`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  showToast(`Downloading application document: ${filename}`, 'success');
}

window.downloadProposalDoc = downloadProposalDoc;

// Download helper by proposal ID
function downloadProposalDocById(proposalId) {
  const proposals = getProposals();
  let p = proposals.find(item => item.id == proposalId);
  if (!p && Array.isArray(currentPiProposals)) {
    p = currentPiProposals.find(item => item.id == proposalId);
  }
  if (!p) {
    showToast('Could not find proposal with ID: ' + proposalId, 'warning');
    return;
  }
  downloadProposalDoc(p);
}
window.downloadProposalDocById = downloadProposalDocById;

// Simulate feedback file download
window.simulateDownload = function(filename) {
  showToast(`Simulated download of confidential report: "${filename}"`);
};

// Open detailed proposal modal
window.openDetailsModal = function(proposalId) {
  const proposals = getProposals();
  let p = proposals.find(item => item.id == proposalId);
  if (!p && Array.isArray(currentPiProposals)) {
    p = currentPiProposals.find(item => item.id == proposalId);
  }
  if (!p) return;
  p = normalizeProposal(p);
  
  currentViewingProposalId = proposalId;
  currentViewingProposal = p;
  const isAdmin = !!(sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'));
  
  modalTitle.textContent = p.title || '-';
  modalTrackingNumber.textContent = `Tracking Number: ${p.trackingNumber || p.tracking_number || '-'} | Date: ${p.date || '-'}`;
  
  // PI & Co-PIs Content
  let investigatorsHTML = `<div><strong>PI Name:</strong> ${p.piName || p.pi_name || '-'} (Code: ${p.empCode || p.emp_code || '-'})</div>`;
  investigatorsHTML += `<div style="margin-top: 4px;"><strong>PI Phone:</strong> ${p.piPhone || p.pi_phone || '-'} | <strong>PI Email:</strong> ${p.piEmail || p.pi_email || '-'}</div>`;
  investigatorsHTML += `<div style="margin-top: 4px;"><strong>PI Department:</strong> ${p.piDepartment || p.pi_department || '-'}</div>`;
  if (p.copis && p.copis.length > 0) {
    investigatorsHTML += `<div style="margin-top: 8px;"><strong>Co-PI Name(s):</strong> ${p.copis.join(', ')}</div>`;
  } else {
    investigatorsHTML += `<div style="margin-top: 8px; font-style: italic; color: var(--text-secondary);">No Co-PI listed</div>`;
  }
  modalInvestigators.innerHTML = investigatorsHTML;
  
  // Funding Info Content
  let fundingHTML = `<div><strong>Agency:</strong> ${p.fundingAgency || p.funding_agency || '-'} (${p.fundingType || p.funding_type || '-'})</div>`;
  fundingHTML += `<div style="margin-top: 4px;"><strong>Scheme:</strong> ${p.projectScheme || p.project_scheme || '-'}</div>`;
  if (p.submissionEndDate) {
    fundingHTML += `<div style="margin-top: 4px;"><strong>Submission End Date:</strong> ${p.submissionEndDate}</div>`;
  }
  if (p.industrialCollab === 'Yes') {
    fundingHTML += `<div style="margin-top: 4px; color: var(--accent-color);">🏢 Industrial Collab: ${p.industryName || p.industry_name || '-'}</div>`;
  }
  modalFunding.innerHTML = fundingHTML;
  
  // Proposed Amount Content
  modalProposedAmount.textContent = `₹ ${p.proposedAmount || p.proposed_amount || '-'} Lakhs`;
  
  // Expert Review Details
  const modalExpertSection = document.getElementById('modalExpertSection');
  const modalExpertContent = document.getElementById('modalExpertContent');
  if (modalExpertSection && modalExpertContent) {
    if (p.reviewedByExpert === 'Yes') {
      modalExpertSection.style.display = 'block';
      modalExpertContent.innerHTML = `
        <div><strong>Name of the Reviewer:</strong> ${p.reviewerName}</div>
        <div style="margin-top: 4px;"><strong>Address of the Reviewer:</strong> ${p.reviewerAddress}</div>
      `;
    } else {
      modalExpertSection.style.display = 'none';
    }
  }
  
  // Sanctioned Details Block
  if (p.status === 'sanctioned') {
    modalSanctionedSection.style.display = 'block';
    modalSanctionedAmount.textContent = `₹ ${p.sanctionedAmount || '-'} Lakhs`;
    
    if (isAdmin) {
      modalSanctionOrder.innerHTML = `<strong>Order No:</strong> ${p.sanctionOrderNumber || '-'}`;
    } else {
      modalSanctionOrder.innerHTML = `<span class="admin-only-badge" style="margin-top: 4px;">🔒 Sanction Order (Admin Only)</span>`;
    }
  } else {
    modalSanctionedSection.style.display = 'none';
  }

  // Presentation Details Block
  const modalInvitedSection = document.getElementById('modalInvitedSection');
  const modalPresentationDate = document.getElementById('modalPresentationDate');
  if (modalInvitedSection && modalPresentationDate) {
    if (p.status === 'invite for presentation' && p.presentationDate) {
      modalInvitedSection.style.display = 'block';
      modalPresentationDate.textContent = p.presentationDate;
    } else {
      modalInvitedSection.style.display = 'none';
    }
  }

  // Section Details Block (Submitted Status Only)
  const modalSubmittedSection = document.getElementById('modalSubmittedSection');
  const modalScientistName = document.getElementById('modalScientistName');
  const modalSectionNumber = document.getElementById('modalSectionNumber');
  const modalSubmittedTrackingNumber = document.getElementById('modalSubmittedTrackingNumber');
  if (modalSubmittedSection) {
    if (p.status === 'submitted') {
      modalSubmittedSection.style.display = 'block';
      if (modalScientistName) modalScientistName.textContent = p.scientistName || '-';
      if (modalSectionNumber) modalSectionNumber.textContent = p.sectionNumber ? `Section ${p.sectionNumber}` : '-';
      if (modalSubmittedTrackingNumber) modalSubmittedTrackingNumber.textContent = p.trackingNumber || '-';
    } else {
      modalSubmittedSection.style.display = 'none';
    }
  }
  
  // Confidential Feedback Block
  if (p.status === 'Not recommended') {
    modalAdminFeedbackSection.style.display = 'block';
    
    if (isAdmin) {
      const fileHTML = p.feedbackFileName 
        ? `<div style="margin-bottom: 8px;"><span class="feedback-filename" onclick="simulateDownload('${p.feedbackFileName}')">📄 ${p.feedbackFileName}</span></div>`
        : '<div style="font-style: italic; color: var(--text-secondary); margin-bottom: 8px;">No file uploaded</div>';
      
      const textHTML = p.feedbackText 
        ? `<div style="font-style: italic; color: var(--text-secondary); background: rgba(255,255,255,0.03); padding: 8px; border-radius: 4px; border: 1px solid var(--border-color);">"${p.feedbackText}"</div>`
        : '<div style="font-style: italic; color: var(--text-secondary);">No review notes added</div>';
        
      modalFeedbackContent.innerHTML = fileHTML + textHTML;
    } else {
      modalFeedbackContent.innerHTML = `<span class="admin-only-badge">🔒 Private Feedback (Admin Only)</span>`;
    }
  } else {
    modalAdminFeedbackSection.style.display = 'none';
  }

  // Status Proof Document Block (Detailed View)
  const modalProofSection = document.getElementById('modalProofSection');
  const modalProofContent = document.getElementById('modalProofContent');
  if (modalProofSection && modalProofContent) {
    const proofName = p.proofFileName || p.proof_file_name;
    if (proofName) {
      modalProofSection.style.display = 'block';
      const fileType = p.proofFileType || p.proof_file_type || '';
      const isImage = (fileType && fileType.startsWith('image/')) || /\.(jpg|jpeg|png|gif|webp)$/i.test(proofName);
      const isPdf = (fileType && fileType.includes('pdf')) || /\.pdf$/i.test(proofName);
      const icon = isImage ? '🖼️' : (isPdf ? '📕' : '📝');
      
      modalProofContent.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
              <span style="font-size: 1.6rem;">${icon}</span>
              <div style="min-width: 0;">
                <div style="font-weight: 600; font-size: 0.9rem; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(proofName)}</div>
                <div style="font-size: 0.75rem; color: #16a34a; font-weight: 500;">💾 Stored on Drive Storage &bull; ${fileType || 'Document'}</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.viewProofInNewTab(${p.id})" style="padding: 5px 12px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                <span>👁️</span> Open Proof
              </button>
              <button type="button" class="btn btn-primary btn-sm" onclick="window.downloadProofById(${p.id})" style="padding: 5px 12px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                <span>⬇️</span> Download
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      modalProofSection.style.display = 'none';
      modalProofContent.innerHTML = '';
    }
  }
  
  // Action Updates Populate (Dean / Admin View only)
  if (detailsAdminActions) {
    if (isAdmin) {
      detailsAdminActions.style.display = 'block';
      updateStatusSelect.value = p.status || 'submitted';
      
      if (updateFeedbackText) updateFeedbackText.value = p.feedbackText || p.feedback_text || '';
      if (updateSanctionOrder) updateSanctionOrder.value = p.sanctionOrderNumber || p.sanction_order_number || '';
      if (updateSanctionedAmount) updateSanctionedAmount.value = p.sanctionedAmount || p.sanctioned_amount || '';
      
      const updatePresentationDate = document.getElementById('updatePresentationDate');
      const updateScientistName = document.getElementById('updateScientistName');
      const updateSectionNumber = document.getElementById('updateSectionNumber');
      const updateTrackingNumber = document.getElementById('updateTrackingNumber');
      
      if (updatePresentationDate) updatePresentationDate.value = p.presentationDate || p.presentation_date || '';
      if (updateScientistName) updateScientistName.value = p.scientistName || p.scientist_name || '';
      if (updateSectionNumber) updateSectionNumber.value = p.sectionNumber || p.section_number || '';
      if (updateTrackingNumber) updateTrackingNumber.value = p.trackingNumber || p.tracking_number || '';
      
      toggleUpdateStatusFields(p.status || 'submitted');
    } else {
      detailsAdminActions.style.display = 'none';
    }
  }
  
  detailsModal.classList.add('visible');
};

// Close details modal listeners
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    detailsModal.classList.remove('visible');
  });
}

detailsModal.addEventListener('click', (e) => {
  if (e.target === detailsModal) {
    detailsModal.classList.remove('visible');
  }
});

// Download doc button in details modal
const modalDownloadDocBtn = document.getElementById('modalDownloadDocBtn');
if (modalDownloadDocBtn) {
  modalDownloadDocBtn.addEventListener('click', () => {
    if (currentViewingProposal) {
      downloadProposalDoc(currentViewingProposal);
    } else if (currentViewingProposalId) {
      window.downloadProposalDocById(currentViewingProposalId);
    }
  });
}

// Toggle conditional update status fields
function toggleUpdateStatusFields(status) {
  const updateFeedbackGroup = document.getElementById('updateFeedbackGroup');
  const updateSanctionedGroup = document.getElementById('updateSanctionedGroup');
  const updateInvitedGroup = document.getElementById('updateInvitedGroup');
  const updateSubmittedGroup = document.getElementById('updateSubmittedGroup');

  if (updateFeedbackGroup && updateSanctionedGroup && updateInvitedGroup && updateSubmittedGroup) {
    if (status === 'Not recommended') {
      updateFeedbackGroup.style.display = 'flex';
      updateSanctionedGroup.style.display = 'none';
      updateInvitedGroup.style.display = 'none';
      updateSubmittedGroup.style.display = 'none';
    } else if (status === 'sanctioned') {
      updateFeedbackGroup.style.display = 'none';
      updateSanctionedGroup.style.display = 'grid';
      updateInvitedGroup.style.display = 'none';
      updateSubmittedGroup.style.display = 'none';
    } else if (status === 'invite for presentation') {
      updateFeedbackGroup.style.display = 'none';
      updateSanctionedGroup.style.display = 'none';
      updateInvitedGroup.style.display = 'flex';
      updateSubmittedGroup.style.display = 'none';
    } else if (status === 'submitted') {
      updateFeedbackGroup.style.display = 'none';
      updateSanctionedGroup.style.display = 'none';
      updateInvitedGroup.style.display = 'none';
      updateSubmittedGroup.style.display = 'grid';
    } else {
      updateFeedbackGroup.style.display = 'none';
      updateSanctionedGroup.style.display = 'none';
      updateInvitedGroup.style.display = 'none';
      updateSubmittedGroup.style.display = 'none';
    }
  }
}

if (updateStatusSelect) {
  updateStatusSelect.addEventListener('change', (e) => {
    toggleUpdateStatusFields(e.target.value);
  });
}

// Helper for safe HTML escaping
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Proof File State for Status Updates
let currentProofFileName = '';
let currentProofFileType = '';
let currentProofFileData = '';
let proofRemovedExplicitly = false;

function clearStatusProofUpload() {
  currentProofFileName = '';
  currentProofFileType = '';
  currentProofFileData = '';
  proofRemovedExplicitly = false;
  const input = document.getElementById('statusProofFileInput');
  if (input) input.value = '';
  const info = document.getElementById('statusProofFileInfo');
  if (info) info.style.display = 'none';
  const dropzone = document.getElementById('statusProofDropzone');
  if (dropzone) dropzone.style.display = 'block';
}

function handleStatusProofFileSelect(file) {
  if (!file) return;
  if (file.size > 50 * 1024 * 1024) {
    showToast('File size exceeds 50MB limit. Please upload a smaller file.', 'warning');
    return;
  }
  
  processProofFile(file, (fileName, mimeType, dataUrl, originalSize) => {
    currentProofFileName = fileName;
    currentProofFileType = mimeType;
    currentProofFileData = dataUrl;
    proofRemovedExplicitly = false;
    
    const info = document.getElementById('statusProofFileInfo');
    const dropzone = document.getElementById('statusProofDropzone');
    const nameEl = document.getElementById('statusProofName');
    const sizeEl = document.getElementById('statusProofSize');
    const iconEl = document.getElementById('statusProofIcon');
    
    if (nameEl) nameEl.textContent = fileName;
    if (sizeEl) sizeEl.textContent = formatBytes(originalSize);
    
    const isImage = mimeType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
    const isPdf = mimeType.includes('pdf') || /\.pdf$/i.test(fileName);
    if (iconEl) iconEl.textContent = isImage ? '🖼️' : (isPdf ? '📕' : '📝');
    
    if (info) info.style.display = 'flex';
    if (dropzone) dropzone.style.display = 'none';
    showToast(`Proof file "${fileName}" ready to be saved in database.`);
  });
}

// Proof File Dropzone and Picker Event Listeners
if (statusProofDropzone) {
  statusProofDropzone.addEventListener('click', () => {
    if (statusProofFileInput) statusProofFileInput.click();
  });
  statusProofDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    statusProofDropzone.style.borderColor = 'var(--primary-color)';
    statusProofDropzone.style.background = '#f0f9ff';
  });
  statusProofDropzone.addEventListener('dragleave', () => {
    statusProofDropzone.style.borderColor = '#94a3b8';
    statusProofDropzone.style.background = '#ffffff';
  });
  statusProofDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    statusProofDropzone.style.borderColor = '#94a3b8';
    statusProofDropzone.style.background = '#ffffff';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleStatusProofFileSelect(e.dataTransfer.files[0]);
    }
  });
}

if (statusProofFileInput) {
  statusProofFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleStatusProofFileSelect(e.target.files[0]);
    }
  });
}

if (statusProofRemoveBtn) {
  statusProofRemoveBtn.addEventListener('click', () => {
    clearStatusProofUpload();
  });
}

if (statusProofPreviewBtn) {
  statusProofPreviewBtn.addEventListener('click', () => {
    if (currentProofFileData) {
      const win = window.open();
      if (win) {
        if (currentProofFileType.startsWith('image/')) {
          win.document.write(`<title>${escapeHtml(currentProofFileName)}</title><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${currentProofFileData}" style="max-width:95%;max-height:95%;object-fit:contain;"></body>`);
        } else {
          win.location.href = currentProofFileData;
        }
      }
    }
  });
}

// Download helper for proof files
window.downloadProofById = function(id) {
  const proposals = getProposals();
  let p = proposals.find(item => item.id == id);
  if (!p && Array.isArray(currentPiProposals)) {
    p = currentPiProposals.find(item => item.id == id);
  }
  if (!p) {
    window.location.href = `/api/proposals/${id}/proof`;
    return;
  }
  const fileName = p.proofFileName || p.proof_file_name || `proposal-${id}-proof`;
  const fileData = p.proofFileData || p.proof_file_data;
  if (fileData) {
    const a = document.createElement('a');
    a.href = fileData;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(`/api/proposals/${id}/proof`, '_blank');
  }
};

window.viewProofInNewTab = function(id) {
  const proposals = getProposals();
  let p = proposals.find(item => item.id == id);
  if (!p && Array.isArray(currentPiProposals)) {
    p = currentPiProposals.find(item => item.id == id);
  }
  if (p && (p.proofFileData || p.proof_file_data)) {
    const dataUrl = p.proofFileData || p.proof_file_data;
    const isImage = (p.proofFileType && p.proofFileType.startsWith('image/')) || /\.(jpg|jpeg|png|gif|webp)$/i.test(p.proofFileName || p.proof_file_name || '');
    if (isImage) {
      const win = window.open();
      if (win) {
        win.document.write(`<title>${escapeHtml(p.proofFileName || p.proof_file_name || 'Proof Image')}</title><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${dataUrl}" style="max-width:95%;max-height:95%;object-fit:contain;box-shadow:0 10px 30px rgba(0,0,0,0.5);border-radius:4px;"></body>`);
        return;
      }
    }
  }
  window.open(`/api/proposals/${id}/proof`, '_blank');
};

// Dedicated quick modal opener for Dean R&D Status Update
window.openUpdateStatusModal = function(id) {
  openDetailsModal(id);
  setTimeout(() => {
    const adminActions = document.getElementById('detailsAdminActions');
    if (adminActions) {
      adminActions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const select = document.getElementById('updateStatusSelect');
      if (select) select.focus();
    }
  }, 150);
};

if (updateStatusForm) {
  updateStatusForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentViewingProposalId || !currentViewingProposal) return;

    const status = updateStatusSelect.value;
    const feedbackEl = document.getElementById('updateFeedbackText');
    const sanctionOrderEl = document.getElementById('updateSanctionOrder');
    const sanctionedAmountEl = document.getElementById('updateSanctionedAmount');
    const presentationDateEl = document.getElementById('updatePresentationDate');
    const scientistEl = document.getElementById('updateScientistName');
    const sectionEl = document.getElementById('updateSectionNumber');
    const trackingEl = document.getElementById('updateTrackingNumber');

    const feedbackText = status === 'Not recommended' 
      ? (feedbackEl ? feedbackEl.value.trim() : '') 
      : (currentViewingProposal.feedbackText || currentViewingProposal.feedback_text || '');
    
    const sanctionOrderNumber = status === 'sanctioned' 
      ? (sanctionOrderEl ? sanctionOrderEl.value.trim() : '') 
      : (currentViewingProposal.sanctionOrderNumber || currentViewingProposal.sanction_order_number || '');
    
    const sanctionedAmount = status === 'sanctioned' 
      ? (sanctionedAmountEl ? sanctionedAmountEl.value.trim() : '') 
      : (currentViewingProposal.sanctionedAmount || currentViewingProposal.sanctioned_amount || '');
    
    const presentationDateVal = status === 'invite for presentation' 
      ? (presentationDateEl ? presentationDateEl.value : '') 
      : (currentViewingProposal.presentationDate || currentViewingProposal.presentation_date || '');
    
    const scientistName = (scientistEl && scientistEl.value.trim()) 
      || currentViewingProposal.scientistName || currentViewingProposal.scientist_name || '';
    
    const sectionNumber = (sectionEl && sectionEl.value.trim()) 
      || currentViewingProposal.sectionNumber || currentViewingProposal.section_number || '';
    
    const trackingNumber = (trackingEl && trackingEl.value.trim()) 
      || currentViewingProposal.trackingNumber || currentViewingProposal.tracking_number || '';

    // Validation per status
    if (status === 'invite for presentation' && !presentationDateVal) {
      showToast('Please specify the Date of Presentation.', 'warning');
      return;
    }
    if (status === 'sanctioned') {
      if (!sanctionOrderNumber) {
        showToast('Please specify the Sanction Order Number.', 'warning');
        return;
      }
      if (!sanctionedAmount) {
        showToast('Please specify the Sanctioned Amount.', 'warning');
        return;
      }
    }
    if (status === 'Not recommended' && !feedbackText) {
      showToast('Please enter the Feedback Description / Review Comments.', 'warning');
      return;
    }

    // Determine proof file data for database persistence
    let proofFileName = currentProofFileName || (proofRemovedExplicitly ? null : (currentViewingProposal.proofFileName || currentViewingProposal.proof_file_name || null));
    let proofFileType = currentProofFileType || (proofRemovedExplicitly ? null : (currentViewingProposal.proofFileType || currentViewingProposal.proof_file_type || null));
    let proofFileData = currentProofFileData || (proofRemovedExplicitly ? null : (currentViewingProposal.proofFileData || currentViewingProposal.proof_file_data || null));

    const payload = {
      status,
      feedbackText,
      sanctionOrderNumber,
      sanctionedAmount,
      presentationDate: presentationDateVal || null,
      sectionNumber: sectionNumber || null,
      scientistName: scientistName || null,
      trackingNumber: trackingNumber || null,
      feedbackFileName: currentViewingProposal.feedbackFileName || currentViewingProposal.feedback_file_name || null,
      proofFileName,
      proofFileType,
      proofFileData
    };

    try {
      const response = await fetch(`/api/proposals/${currentViewingProposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Project status updated successfully by Dean R&D!', 'success');
        detailsModal.classList.remove('visible');
        
        await fetchProposalsFromServer();
        renderProposals();
        
        if (tabs.analytics && tabs.analytics.classList.contains('active')) {
          updateAnalyticsData();
        }
      } else {
        showToast(data.message || 'Failed to update proposal status.', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to backend server to update status.', 'warning');
    }
  });
}



// Define exportable fields array
const exportableFields = [
  { id: 'empCode', label: 'Emp Code' },
  { id: 'piName', label: 'PI Name' },
  { id: 'piPhone', label: 'PI Phone' },
  { id: 'copis', label: 'Co-PIs' },
  { id: 'title', label: 'Project Title' },
  { id: 'trackingNumber', label: 'Project Tracking Number' },
  { id: 'duration', label: 'Duration' },
  { id: 'date', label: 'Date of Joining' },
  { id: 'industrialCollab', label: 'Industrial Collab' },
  { id: 'industryName', label: 'Industry Name' },
  { id: 'reviewedByExpert', label: 'Reviewed by Expert' },
  { id: 'reviewerName', label: 'Reviewer Name' },
  { id: 'reviewerAddress', label: 'Reviewer Address' },
  { id: 'fundingType', label: 'Funding Type' },
  { id: 'fundingAgency', label: 'Funding Agency' },
  { id: 'projectScheme', label: 'Scheme' },
  { id: 'proposedAmount', label: 'Proposed Amount' },
  { id: 'status', label: 'Status' },
  { id: 'sanctionOrderNumber', label: 'Sanctioned Number' },
  { id: 'sanctionedAmount', label: 'Sanctioned Amount' },
  { id: 'presentationDate', label: 'Presentation Date' },
  { id: 'scientistName', label: 'Name of Scientist' },
  { id: 'sectionNumber', label: 'Section' },
  { id: 'feedbackFileName', label: 'Feedback Document' },
  { id: 'feedbackText', label: 'Feedback Comments' }
];

// Open Column Select Modal on Export Button Click
function openExportModal() {
  let proposals = getProposals();
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const statusVal = statusFilter ? statusFilter.value : 'ALL';
  const isAdmin = !!(sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'));
  
  // Filter list to make sure there are elements to export
  proposals = proposals.filter(p => {
    if (statusVal !== 'ALL' && p.status !== statusVal) return false;
    if (searchQuery !== '') {
      const matchesPI = p.piName.toLowerCase().includes(searchQuery);
      const matchesEmpCode = p.empCode.toLowerCase().includes(searchQuery);
      const matchesTitle = p.title.toLowerCase().includes(searchQuery);
      const matchesTrack = p.trackingNumber.toLowerCase().includes(searchQuery);
      const matchesScheme = p.projectScheme.toLowerCase().includes(searchQuery);
      const matchesAgency = p.fundingAgency.toLowerCase().includes(searchQuery);
      const matchesCoPI = p.copis.some(copi => copi.toLowerCase().includes(searchQuery));
      
      let matchesAdminFields = false;
      if (isAdmin) {
        const matchesSanction = p.sanctionOrderNumber && p.sanctionOrderNumber.toLowerCase().includes(searchQuery);
        const matchesFeedback = p.feedbackText && p.feedbackText.toLowerCase().includes(searchQuery);
        const matchesFeedbackFile = p.feedbackFileName && p.feedbackFileName.toLowerCase().includes(searchQuery);
        matchesAdminFields = matchesSanction || matchesFeedback || matchesFeedbackFile;
      }
      const matchesScientist = p.scientistName && p.scientistName.toLowerCase().includes(searchQuery);
      return matchesPI || matchesEmpCode || matchesTitle || matchesTrack || matchesScheme || matchesAgency || matchesCoPI || matchesScientist || matchesAdminFields;
    }
    return true;
  });
  
  if (proposals.length === 0) {
    showToast('No proposals to export.', 'info');
    return;
  }

  // Generate selector list
  if (exportColumnsList) {
    exportColumnsList.innerHTML = '';
    exportableFields.forEach(field => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.gap = '8px';
      
      div.innerHTML = `
        <input type="checkbox" id="col_${field.id}" value="${field.id}" checked class="col-export-checkbox" style="width: 16px; height: 16px; cursor: pointer;">
        <label for="col_${field.id}" style="cursor: pointer; font-size: 0.9rem; color: #334155;">${field.label}</label>
      `;
      exportColumnsList.appendChild(div);
    });
  }

  // Reset Select All state
  if (selectAllCols) {
    selectAllCols.checked = true;
  }

  // Open Modal
  if (exportModal) {
    exportModal.classList.add('visible');
  }
}

// Select All functionality
if (selectAllCols) {
  selectAllCols.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const checkboxes = exportColumnsList.querySelectorAll('.col-export-checkbox');
    checkboxes.forEach(cb => cb.checked = isChecked);
  });
}

// Track select all checked state when individual checkboxes clicked
if (exportColumnsList) {
  exportColumnsList.addEventListener('change', (e) => {
    if (e.target.classList.contains('col-export-checkbox')) {
      const checkboxes = Array.from(exportColumnsList.querySelectorAll('.col-export-checkbox'));
      const allChecked = checkboxes.every(cb => cb.checked);
      if (selectAllCols) {
        selectAllCols.checked = allChecked;
      }
    }
  });
}

// Close export modal helpers
function closeExportModal() {
  if (exportModal) {
    exportModal.classList.remove('visible');
  }
}

if (exportModalCloseBtn) exportModalCloseBtn.addEventListener('click', closeExportModal);
if (cancelExportBtn) cancelExportBtn.addEventListener('click', closeExportModal);

if (exportModal) {
  exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) {
      closeExportModal();
    }
  });
}

// Confirm and Download CSV
if (confirmExportBtn) {
  confirmExportBtn.addEventListener('click', () => {
    const checkboxes = Array.from(exportColumnsList.querySelectorAll('.col-export-checkbox:checked'));
    if (checkboxes.length === 0) {
      showToast('Please select at least one field to export.', 'warning');
      return;
    }

    const selectedFieldIds = checkboxes.map(cb => cb.value);
    
    // Get fields mapping details
    const selectedFields = exportableFields.filter(f => selectedFieldIds.includes(f.id));
    
    // Filter proposals list
    let proposals = getProposals();
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const statusVal = statusFilter ? statusFilter.value : 'ALL';
    const isAdmin = !!(sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'));
    
    proposals = proposals.filter(p => {
      if (statusVal !== 'ALL' && p.status !== statusVal) return false;
      if (searchQuery !== '') {
        const matchesPI = p.piName.toLowerCase().includes(searchQuery);
        const matchesEmpCode = p.empCode.toLowerCase().includes(searchQuery);
        const matchesTitle = p.title.toLowerCase().includes(searchQuery);
        const matchesTrack = p.trackingNumber.toLowerCase().includes(searchQuery);
        const matchesScheme = p.projectScheme.toLowerCase().includes(searchQuery);
        const matchesAgency = p.fundingAgency.toLowerCase().includes(searchQuery);
        const matchesCoPI = p.copis.some(copi => copi.toLowerCase().includes(searchQuery));
        
        let matchesAdminFields = false;
        if (isAdmin) {
          const matchesSanction = p.sanctionOrderNumber && p.sanctionOrderNumber.toLowerCase().includes(searchQuery);
          const matchesFeedback = p.feedbackText && p.feedbackText.toLowerCase().includes(searchQuery);
          const matchesFeedbackFile = p.feedbackFileName && p.feedbackFileName.toLowerCase().includes(searchQuery);
          matchesAdminFields = matchesSanction || matchesFeedback || matchesFeedbackFile;
        }
        return matchesPI || matchesEmpCode || matchesTitle || matchesTrack || matchesScheme || matchesAgency || matchesCoPI || matchesAdminFields;
      }
      return true;
    });

    // Compile dynamic CSV contents
    const headers = selectedFields.map(f => f.label);
    const rows = proposals.map(p => {
      return selectedFields.map(f => {
        const val = p[f.id];
        if (f.id === 'copis') {
          return val ? val.join("; ") : "";
        }
        return val !== undefined && val !== null ? val : "";
      }).map(val => `"${String(val).replace(/"/g, '""')}"`); // Escape quotes
    });

    const csvContent = headers.join(",") + "\r\n" + rows.map(r => r.join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ProjectPi_Custom_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeExportModal();
    showToast(`Exported ${proposals.length} proposals with ${selectedFields.length} selected columns.`);
  });
}

// Submit proposal payload to MySQL server
async function submitProposalToServer(proposal) {
  try {
    const response = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal)
    });

    const data = await response.json();
    if (response.ok) {
      const fullProposal = {
        ...proposal,
        id: data.id || proposal.id,
        trackingNumber: data.trackingNumber || proposal.trackingNumber
      };

      // Automatically download application form as .doc file
      downloadProposalDoc(fullProposal);

      showToast('Proposal submitted successfully! Downloading Application Form (.doc)...', 'success');
      resetForm();
      await fetchProposalsFromServer();
      renderProposals();
      
      // Fetch latest proposals for current PI and show dashboard
      try {
        const piResponse = await fetch(`/api/proposals?empCode=${encodeURIComponent(currentPiCode)}&piName=${encodeURIComponent(currentPiName)}&piPhone=${encodeURIComponent(currentPiPhone)}&piEmail=${encodeURIComponent(currentPiEmail)}&piDepartment=${encodeURIComponent(currentPiDepartment)}`);
        if (piResponse.ok) {
          const piData = await piResponse.json();
          currentPiProposals = Array.isArray(piData) ? piData.map(normalizeProposal) : [];
        }
      } catch (e) {
        console.error(e);
      }
      
      sessionStorage.setItem('pi_view_state', 'dashboard');
      setTimeout(() => {
        proposalFormCard.style.display = 'none';
        personalDashboardCard.style.display = 'block';
        renderPersonalDashboard();
      }, 500);
    } else {
      showToast(data.message || 'Error saving proposal to database.', 'warning');
    }
  } catch (err) {
    console.error(err);
    showToast('Error connecting to backend server to save proposal.', 'warning');
  }
}

// Login Modal Controllers
function openLoginModal() {
  const form = document.getElementById('loginForm');
  if (form) form.reset();
  if (loginModal) {
    loginModal.classList.add('visible');
    setTimeout(() => {
      const input = document.getElementById('loginEmpCode');
      if (input) input.focus();
    }, 100);
  }
}

function closeLoginModal() {
  if (loginModal) {
    loginModal.classList.remove('visible');
  }
}

if (loginModalCloseBtn) loginModalCloseBtn.addEventListener('click', closeLoginModal);
if (cancelLoginBtn) {
  cancelLoginBtn.addEventListener('click', () => {
    closeLoginModal();
    const isAdminRoute = window.location.hash === '#admin' || window.location.hash === '#projectadmin';
    if (isAdminRoute && !sessionStorage.getItem('admin_token')) {
      const adminGatewayCard = document.getElementById('adminGatewayCard');
      if (adminGatewayCard) adminGatewayCard.style.display = 'block';
    }
  });
}
if (loginModal) {
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLoginModal();
  });
}

// Reset Password Modal Controllers
function openResetModal(empCode, tempPassword) {
  document.getElementById('resetPasswordForm').reset();
  document.getElementById('resetEmpCode').value = empCode;
  document.getElementById('resetTempPassword').value = tempPassword;
  if (resetPasswordModal) {
    resetPasswordModal.classList.add('visible');
  }
}

function closeResetModal() {
  if (resetPasswordModal) {
    resetPasswordModal.classList.remove('visible');
  }
}

if (resetModalCloseBtn) resetModalCloseBtn.addEventListener('click', closeResetModal);
if (cancelResetBtn) cancelResetBtn.addEventListener('click', closeResetModal);
if (resetPasswordModal) {
  resetPasswordModal.addEventListener('click', (e) => {
    if (e.target === resetPasswordModal) closeResetModal();
  });
}

// Admin Login Form Submit
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const empCode = document.getElementById('loginEmpCode').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empCode, password })
      });

      const data = await response.json();
      if (response.ok) {
        if (data.requiresReset) {
          closeLoginModal();
          openResetModal(empCode, password);
          showToast(data.message || 'Password reset required.', 'info');
        } else {
          sessionStorage.setItem('admin_token', data.token);
          sessionStorage.setItem('admin_emp_code', empCode);
          closeLoginModal();
          checkAdminState();
          renderProposals();
          showToast('Authenticated successfully as Admin.', 'success');
        }
      } else {
        showToast(data.message || 'Invalid Employee Code or Password.', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to authentication server.', 'warning');
    }
  });
}

// Admin Reset Password Form Submit
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const empCode = document.getElementById('resetEmpCode').value.trim();
    const tempPassword = document.getElementById('resetTempPassword').value;
    const newPassword = document.getElementById('resetNewPassword').value;
    const confirmPassword = document.getElementById('resetConfirmPassword').value;

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empCode, tempPassword, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_emp_code', empCode);
        closeResetModal();
        checkAdminState();
        renderProposals();
        showToast('Password reset successfully. Admin View unlocked!', 'success');
      } else {
        showToast(data.message || 'Password reset failed.', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to reset password server.', 'warning');
    }
  });
}

// Forgot Password Modal Controllers
function openForgotModal() {
  const forgotForm = document.getElementById('forgotPasswordForm');
  const successAlert = document.getElementById('forgotSuccessAlert');
  if (forgotForm) forgotForm.reset();
  if (successAlert) successAlert.style.display = 'none';
  if (forgotPasswordModal) forgotPasswordModal.classList.add('visible');
}

function closeForgotModal() {
  if (forgotPasswordModal) forgotPasswordModal.classList.remove('visible');
}

if (forgotModalCloseBtn) forgotModalCloseBtn.addEventListener('click', closeForgotModal);
if (cancelForgotBtn) cancelForgotBtn.addEventListener('click', closeForgotModal);
if (forgotPasswordModal) {
  forgotPasswordModal.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) closeForgotModal();
  });
}

// Forgot Password Link Click in Login Modal
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeLoginModal();
    openForgotModal();
  });
}

// Forgot Password Form Submit
const forgotForm = document.getElementById('forgotPasswordForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const empCodeInput = document.getElementById('forgotEmpCode');
    const successAlert = document.getElementById('forgotSuccessAlert');
    const sendBtn = document.getElementById('sendTempPassBtn');
    
    const empCode = empCodeInput.value.trim();
    if (!empCode) return;

    showToast('Generating temporary password...', 'info');
    if (sendBtn) sendBtn.disabled = true;

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empCode })
      });

      const data = await response.json();
      if (response.ok) {
        if (successAlert) successAlert.style.display = 'block';
        showToast('Temporary password sent successfully.', 'success');
        
        setTimeout(() => {
          closeForgotModal();
          openLoginModal();
          // Pre-populate login input with the employee code
          const loginEmpInput = document.getElementById('loginEmpCode');
          if (loginEmpInput) {
            loginEmpInput.value = empCode;
          }
        }, 3000);
      } else {
        showToast(data.message || 'Forgot password request failed.', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error contacting forgot password server.', 'warning');
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  });
}

// Export R&D Project Analytics to PDF function
function exportAnalyticsToPDF() {
  const analyticsElement = document.querySelector('#contentAnalytics .glass-card');
  if (!analyticsElement) return;
  
  // Clone element to modify for print (removing export button)
  const clone = analyticsElement.cloneNode(true);
  const btn = clone.querySelector('#exportAnalyticsPdfBtn');
  if (btn) btn.remove();
  
  const printContent = `
    <html>
      <head>
        <title>R&D Project Analytics Report</title>
        <style>
          @font-face {
            font-family: 'Amazon Ember';
            font-style: normal;
            font-weight: 400;
            src: local('Amazon Ember Regular'), local('Amazon Ember'), url('fonts/AmazonEmber_Rg.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Amazon Ember';
            font-style: normal;
            font-weight: 700;
            src: local('Amazon Ember Bold'), url('fonts/AmazonEmber_Bd.woff2') format('woff2');
          }
          body {
            font-family: 'Amazon Ember', 'Amazon Amber', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            padding: 40px;
            background: #ffffff !important;
          }
          .card-title-bar {
            margin-bottom: 30px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .card-title-bar h2 {
            font-size: 26px;
            margin: 0 0 5px 0;
            color: #1e1b4b;
            font-weight: 700;
          }
          .card-title-bar p {
            font-size: 14px;
            color: #64748b;
            margin: 0;
          }
          .analytics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          .analytics-card {
            border: 1px solid #e2e8f0;
            background: #f8fafc !important;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .analytics-card div:first-child {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 600;
            color: #4f46e5;
            margin-bottom: 8px;
          }
          .analytics-card div:last-child {
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
          }
          .analytics-charts-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .analytics-charts-grid > div {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            background: #ffffff;
          }
          h4 {
            font-size: 16px;
            margin-top: 0;
            margin-bottom: 15px;
            color: #1e1b4b;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .progress-item {
            margin-bottom: 15px;
          }
          .progress-header {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-bottom: 6px;
          }
          .progress-bar-bg {
            background: #e2e8f0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
          }
          .progress-bar-fill {
            height: 100%;
            border-radius: 4px;
            background-color: #4f46e5 !important;
          }
          .bg-primary-grad { background-color: #4f46e5 !important; }
          .bg-secondary-grad { background-color: #0d9488 !important; }
          .bg-success-grad { background-color: #16a34a !important; }
          .bg-warning-grad { background-color: #f59e0b !important; }
          .bg-danger-grad { background-color: #ef4444 !important; }
          
          #deptDistributionList {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${clone.innerHTML}
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=950,height=750');
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 600);
}

// Attach search, filter, and export event listeners
if (searchInput) searchInput.addEventListener('input', renderProposals);
if (statusFilter) statusFilter.addEventListener('change', renderProposals);
if (exportBtn) exportBtn.addEventListener('click', openExportModal);
const exportAnalyticsPdfBtn = document.getElementById('exportAnalyticsPdfBtn');
if (exportAnalyticsPdfBtn) exportAnalyticsPdfBtn.addEventListener('click', exportAnalyticsToPDF);

// Departments list
const departmentsList = [
  "Actuarial Science",
  "Agricultural Economics",
  "Agriculture Engineering",
  "Agronomy",
  "Artificial Intelligence (AI) and Machine Learning",
  "Artificial Intelligence and Data Science",
  "Automobile Engineering",
  "Autonomous Electric Vehicles",
  "B.A. (Hons.) Political Science",
  "B.A. B.Ed. Economics",
  "B.A. B.Ed. English Literature",
  "B.Sc. (Hons.) Agriculture",
  "B.Sc. (Hons.) Data Science",
  "B.Sc. B.Ed. Botany",
  "B.Sc. B.Ed. Chemistry",
  "B.Sc. B.Ed. Mathematics",
  "B.Sc. B.Ed. Zoology",
  "BA.LLB (Hons.)",
  "Bachelor of Business Administration",
  "Bachelor of Computer Applications",
  "Bachelor of Pharmacy",
  "BBA. LLB (Hons.)",
  "Bioinformatics",
  "Biomedical Engineering",
  "Biotechnology",
  "Biotechnology & Bioprocess Engineering",
  "CAD/CAM/CAE",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Communication & Signal Processing",
  "Computer Networks and Information Security",
  "Computer Science & Engineering",
  "Computer Science and Business System",
  "Computer Science and Engineering",
  "Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
  "Computer Science and Engineering (Cyber Security)",
  "Computer Science and Engineering (Data Science)",
  "Computer Science and Engineering (IOT)",
  "Data Communication & Networking",
  "Data Science",
  "Digital Electronics & Communication Systems",
  "Doctor of Pharmacy",
  "Electrical Vehicle Technology",
  "Electrical and Electronics Engineering",
  "Electronics & Computer Engineering",
  "Electronics and Communication Engineering",
  "Electronics Engineering (VLSI Design and Technology)",
  "Embedded Systems",
  "Energy Engineering",
  "English",
  "Entomology",
  "Farm Machinery",
  "Finance",
  "Floriculture and Landscaping",
  "Food Processing Technology",
  "Food Technology",
  "General",
  "Genetics & Plant Breeding",
  "Human Resource",
  "Image Processing & Machine Vision",
  "Information Technology",
  "Internet of Things",
  "M. Pharmacy (Pharmaceutics)",
  "Machine Design",
  "Machine Learning",
  "Master of Computer Applications",
  "Mathematics, Statistics and Computer Science",
  "Mechanical Engineering",
  "Mechatronics",
  "Organic Chemistry",
  "Petroleum Engineering",
  "Pharmaceutical Chemistry",
  "Plant Pathology",
  "Power Electronics and Drives",
  "Power Systems",
  "Psychology",
  "Robotics and Automation",
  "Smart Manufacturing",
  "Soil Science",
  "Structural Engineering",
  "Sustainable Smart Construction",
  "Technical Textiles",
  "Textile & Fashion Technology",
  "Textile Technology",
  "Thermal Engineering",
  "Vegetable Science",
  "VLSI"
];

// Initialize custom searchable dropdown
function initDepartmentDropdown() {
  const input = document.getElementById('gatekeeperPiDepartment');
  const optionsList = document.getElementById('departmentOptionsList');
  const arrow = document.querySelector('.custom-select-arrow');
  
  if (!input || !optionsList) return;
  
  // Render options list
  function renderOptions(filterText = '') {
    optionsList.innerHTML = '';
    const filtered = departmentsList.filter(dept => 
      dept.toLowerCase().includes(filterText.toLowerCase())
    );
    
    if (filtered.length === 0) {
      const div = document.createElement('div');
      div.className = 'custom-select-option empty';
      div.textContent = 'No matching departments';
      optionsList.appendChild(div);
      return;
    }
    
    filtered.forEach(dept => {
      const div = document.createElement('div');
      div.className = 'custom-select-option';
      div.textContent = dept;
      div.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent input blur before click
        input.value = dept;
        optionsList.classList.remove('visible');
      });
      optionsList.appendChild(div);
    });
  }
  
  // Initial render
  renderOptions();
  
  // Input event listeners
  input.addEventListener('focus', () => {
    optionsList.classList.add('visible');
    renderOptions(input.value);
  });
  
  input.addEventListener('input', () => {
    optionsList.classList.add('visible');
    renderOptions(input.value);
  });
  
  input.addEventListener('blur', () => {
    // Check if the current value is a valid department
    setTimeout(() => {
      optionsList.classList.remove('visible');
    }, 150);
  });
  
  if (arrow) {
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      input.focus();
    });
  }
}

// Detect server restart to clear any lingering admin tokens
async function syncServerBootLifecycle() {
  try {
    const res = await fetch('/api/auth/server-instance');
    if (res.ok) {
      const data = await res.json();
      const lastBootId = sessionStorage.getItem('projectpi_server_boot_id');
      if (lastBootId && lastBootId !== data.serverBootId) {
        console.log('Server restart detected. Clearing prior admin session.');
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_emp_code');
        localStorage.removeItem('admin_token');
      }
      sessionStorage.setItem('projectpi_server_boot_id', data.serverBootId);
    }
  } catch (e) {
    sessionStorage.removeItem('admin_token');
  }
}

// Render table on initial page load
document.addEventListener('DOMContentLoaded', async () => {
  await syncServerBootLifecycle();
  initDepartmentDropdown(); // Initialize searchable dropdown
  checkAdminState(); // Restore session
  await fetchProposalsFromServer();
  renderProposals();
  updateProposalProofStatusContext('submitted');

  // Restore Investigator/PI session if present (only on normal user view, not when accessing admin route)
  const savedPiCode = sessionStorage.getItem('pi_code');
  const isAdminRoute = window.location.hash === '#admin' || window.location.hash === '#projectadmin';
  if (savedPiCode && !isAdminRoute) {
    currentPiCode = savedPiCode;
    currentPiName = sessionStorage.getItem('pi_name') || '';
    currentPiPhone = sessionStorage.getItem('pi_phone') || '';
    currentPiEmail = sessionStorage.getItem('pi_email') || '';
    currentPiDepartment = sessionStorage.getItem('pi_department') || '';
    
    // Show verified investigator banner
    showPiBanner(currentPiCode, currentPiName, currentPiEmail, currentPiDepartment);

    // Fill the locked fields of the proposal form
    const fEmp = document.getElementById('empCode');
    const fName = document.getElementById('piName');
    const fPhone = document.getElementById('piPhone');
    const fEmail = document.getElementById('piEmail');
    const fDept = document.getElementById('piDepartment');
    if (fEmp) { fEmp.value = currentPiCode; fEmp.readOnly = true; }
    if (fName) { fName.value = currentPiName; fName.readOnly = true; }
    if (fPhone) { fPhone.value = currentPiPhone; fPhone.readOnly = true; }
    if (fEmail) { fEmail.value = currentPiEmail; fEmail.readOnly = true; }
    if (fDept) { fDept.value = currentPiDepartment; fDept.readOnly = true; }
    
    try {
      const piResponse = await fetch(`/api/proposals?empCode=${encodeURIComponent(currentPiCode)}&piName=${encodeURIComponent(currentPiName)}&piPhone=${encodeURIComponent(currentPiPhone)}&piEmail=${encodeURIComponent(currentPiEmail)}&piDepartment=${encodeURIComponent(currentPiDepartment)}`);
      if (piResponse.ok) {
        const piData = await piResponse.json();
        currentPiProposals = Array.isArray(piData) ? piData.map(normalizeProposal) : [];
      }
    } catch (e) {
      console.error('Error restoring PI session:', e);
    }
    
    const savedPiViewState = sessionStorage.getItem('pi_view_state');
    if (savedPiViewState === 'register' || !currentPiProposals || currentPiProposals.length === 0) {
      gatekeeperCard.style.display = 'none';
      personalDashboardCard.style.display = 'none';
      proposalFormCard.style.display = 'block';
      
      if (currentPiProposals && currentPiProposals.length > 0) {
        if (backToGatekeeperBtn) backToGatekeeperBtn.style.display = 'none';
        if (backToDashBtn) backToDashBtn.style.display = 'block';
      } else {
        if (backToGatekeeperBtn) backToGatekeeperBtn.style.display = 'block';
        if (backToDashBtn) backToDashBtn.style.display = 'none';
      }
    } else {
      renderPersonalDashboard();
      gatekeeperCard.style.display = 'none';
      personalDashboardCard.style.display = 'block';
      proposalFormCard.style.display = 'none';
    }
  }
  
  // Auto-resize Project Title textarea
  const projectTitle = document.getElementById('projectTitle');
  if (projectTitle) {
    projectTitle.addEventListener('input', function() {
      this.style.height = '48px'; // Reset to base height
      const newHeight = this.scrollHeight;
      this.style.height = (newHeight > 48 ? newHeight : 48) + 'px';
    });
  }
});

// Calculate and render Admin Analytics dashboards
function updateAnalyticsData() {
  const proposals = getProposals();
  
  const totalCount = proposals.length;
  document.getElementById('statTotalProposals').textContent = totalCount;
  
  let totalProposed = 0;
  let totalSanctioned = 0;
  let sanctionedCount = 0;
  
  const statusCounts = {
    'submitted': 0,
    'invite for presentation': 0,
    'Not recommended': 0,
    'sanctioned': 0
  };

  const agencyCounts = {};
  
  proposals.forEach(p => {
    const propAmt = parseFloat(p.proposedAmount) || 0;
    totalProposed += propAmt;
    
    if (statusCounts[p.status] !== undefined) {
      statusCounts[p.status]++;
    }
    
    if (p.status === 'sanctioned') {
      sanctionedCount++;
      const sancAmt = parseFloat(p.sanctionedAmount) || 0;
      totalSanctioned += sancAmt;
    }

    const agency = p.fundingAgency || 'Other';
    agencyCounts[agency] = (agencyCounts[agency] || 0) + 1;
  });

  const sanctionRate = totalCount > 0 ? ((sanctionedCount / totalCount) * 100).toFixed(1) : '0.0';

  document.getElementById('statProposedBudget').textContent = `₹ ${totalProposed.toFixed(2)} L`;
  document.getElementById('statSanctionedBudget').textContent = `₹ ${totalSanctioned.toFixed(2)} L`;
  document.getElementById('statSanctionRate').textContent = `${sanctionRate}%`;

  const statusLabels = {
    'submitted': { label: 'Submitted', class: 'bg-primary-grad' },
    'invite for presentation': { label: 'Invite for Presentation', class: 'bg-warning-grad' },
    'Not recommended': { label: 'Not Recommended', class: 'bg-danger-grad' },
    'sanctioned': { label: 'Sanctioned', class: 'bg-success-grad' }
  };

  const statusList = document.getElementById('statusDistributionList');
  if (statusList) {
    statusList.innerHTML = '';
    Object.keys(statusLabels).forEach(key => {
      const count = statusCounts[key];
      const percent = totalCount > 0 ? ((count / totalCount) * 100).toFixed(0) : 0;
      const meta = statusLabels[key];
      
      const item = document.createElement('div');
      item.className = 'progress-item';
      item.innerHTML = `
        <div class="progress-header">
          <span style="color: var(--text-secondary);">${meta.label}</span>
          <span style="font-weight: 600; color: var(--text-primary);">${count} (${percent}%)</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill ${meta.class}" style="width: ${percent}%;"></div>
        </div>
      `;
      statusList.appendChild(item);
    });
  }

  const agencyList = document.getElementById('agencyDistributionList');
  if (agencyList) {
    agencyList.innerHTML = '';
    const sortedAgencies = Object.entries(agencyCounts).sort((a, b) => b[1] - a[1]);
    
    if (sortedAgencies.length === 0) {
      agencyList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); font-style: italic; padding: 20px;">No agency data available</div>';
    } else {
      sortedAgencies.forEach(([agencyName, count], idx) => {
        const percent = totalCount > 0 ? ((count / totalCount) * 100).toFixed(0) : 0;
        const colors = ['bg-primary-grad', 'bg-secondary-grad', 'bg-success-grad', 'bg-warning-grad'];
        const colorClass = colors[idx % colors.length];

        const item = document.createElement('div');
        item.className = 'progress-item';
        item.innerHTML = `
          <div class="progress-header">
            <span style="color: var(--text-secondary); font-weight: 500;">${agencyName}</span>
            <span style="font-weight: 600; color: var(--text-primary);">${count} (${percent}%)</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${colorClass}" style="width: ${percent}%;"></div>
          </div>
        `;
        agencyList.appendChild(item);
      });
    }
  }

  // Calculate department metrics
  const deptCounts = {};
  const deptBudgets = {};
  proposals.forEach(p => {
    const dept = p.piDepartment || 'General';
    const propAmt = parseFloat(p.proposedAmount) || 0;
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    deptBudgets[dept] = (deptBudgets[dept] || 0) + propAmt;
  });

  const deptList = document.getElementById('deptDistributionList');
  if (deptList) {
    deptList.innerHTML = '';
    const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
    
    if (sortedDepts.length === 0) {
      deptList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); font-style: italic; padding: 20px; grid-column: span 2;">No department data available</div>';
    } else {
      sortedDepts.forEach(([deptName, count], idx) => {
        const percent = totalCount > 0 ? ((count / totalCount) * 100).toFixed(0) : 0;
        const budget = deptBudgets[deptName] || 0;
        const colors = ['bg-primary-grad', 'bg-secondary-grad', 'bg-success-grad', 'bg-warning-grad'];
        const colorClass = colors[idx % colors.length];

        const item = document.createElement('div');
        item.className = 'progress-item';
        item.innerHTML = `
          <div class="progress-header">
            <span style="color: var(--text-secondary); font-weight: 500;">${deptName}</span>
            <span style="font-weight: 600; color: var(--text-primary);">${count} proposal${count > 1 ? 's' : ''} (₹ ${budget.toFixed(2)} L)</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${colorClass}" style="width: ${percent}%;"></div>
          </div>
        `;
        deptList.appendChild(item);
      });
    }
  }
}
