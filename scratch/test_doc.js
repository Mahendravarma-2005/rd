const fs = require('fs');

function escapeXml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildProposalDocHtml(p) {
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
      <td class="label-cell">Duration of Project:</td>
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
      <td class="label-cell">Project Scheme:</td>
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

const sample = {
  empCode: '31335',
  piName: 'Mahendra',
  piPhone: '9391824255',
  piEmail: 'mahendra@vignan.ac.in',
  piDepartment: 'Artificial intelligence (AI) and Machine Learning',
  copis: ['P Manoj'],
  title: 'Image Enhancement using CNN',
  duration: '4',
  date: '2026-09-30',
  industrialCollab: 'Yes',
  industryName: 'Tata Services',
  reviewedByExpert: 'Yes',
  reviewerName: 'Dr Ravi Kumar',
  reviewerAddress: 'Andhra Pradesh',
  fundingType: 'GOVERNMENT',
  fundingAgency: 'DST',
  projectScheme: 'Extra Mulunar',
  proposedAmount: '54.56',
  submissionEndDate: '2026-10-03',
  status: 'submitted',
  trackingNumber: 'PROJ-2026-008',
  scientistName: 'Dr Kumar Babu',
  sectionNumber: 'A'
};

const html = buildProposalDocHtml(sample);
fs.writeFileSync('scratch/test_doc_sample.doc', html);
console.log('Sample doc written successfully! Size:', html.length);
