const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Checks if the configured SMTP password is still a placeholder
 */
const isPlaceholder = (pass) => {
  if (!pass) return true;
  const p = String(pass).trim().toLowerCase();
  return (
    p === 'your_office365_outlook_password' ||
    p.includes('placeholder') ||
    p === 'password' ||
    p === 'secret' ||
    p === 'your_password'
  );
};

/**
 * Creates a Nodemailer transporter pre-configured for Microsoft 365 / Outlook
 */
function createOutlookTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.office365.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'deanrd@vignan.ac.in';
  const pass = process.env.SMTP_PASS || '';
  const secure = process.env.SMTP_SECURE === 'true'; // false for port 587 (STARTTLS)

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    }
  });
}

/**
 * Generates official VFSTR University branded HTML email layout
 */
function getEmailLayout({ title, badgeText, badgeColor, contentHtml }) {
  const senderEmail = process.env.SMTP_USER || 'deanrd@vignan.ac.in';

  let badgeBg = '#eff6ff';
  let badgeBorder = '#bfdbfe';
  let badgeTextColor = '#1e40af';

  if (badgeColor === 'green') {
    badgeBg = '#ecfdf5';
    badgeBorder = '#a7f3d0';
    badgeTextColor = '#065f46';
  } else if (badgeColor === 'red') {
    badgeBg = '#fef2f2';
    badgeBorder = '#fecaca';
    badgeTextColor = '#991b1b';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width: 620px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid #e2e8f0;">
          
          <!-- Top Header Brand -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 35px 25px 35px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 4px;">
                      VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH
                    </div>
                    <div style="font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      (Deemed to be University • Estd. u/s 3 of UGC Act 1956)
                    </div>
                    <div style="display: inline-block; background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: 20px; padding: 5px 16px;">
                      <span style="font-size: 12px; font-weight: 700; color: #f59e0b; letter-spacing: 0.5px; text-transform: uppercase;">
                        Directorate of Research & Development • Office of the Dean
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Indicator Pill -->
          <tr>
            <td style="padding: 24px 35px 0 35px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background-color: ${badgeBg}; color: ${badgeTextColor}; border: 1px solid ${badgeBorder};">
                      ${badgeText}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td style="padding: 20px 35px 30px 35px; color: #334155; font-size: 14.5px; line-height: 1.65;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Official Sign-off -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 25px 35px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a;">Office of the Dean (Research & Development)</div>
                    <div style="font-size: 12.5px; color: #64748b; margin-top: 3px;">VFSTR Deemed-to-be University, Vadlamudi, Guntur, AP - 522213</div>
                    <div style="font-size: 12.5px; color: #64748b; margin-top: 2px;">
                      Official Email: <a href="mailto:${senderEmail}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${senderEmail}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Disclaimer -->
          <tr>
            <td style="background-color: #0f172a; padding: 18px 35px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                This is an official institutional notification generated by the VFSTR R&D Governance Portal.<br>
                For official correspondence, please contact the Dean's Office at ${senderEmail}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Prints the dispatched email formatted prominently to the console terminal
 */
function printEmailToTerminal({ to, from, subject, text, mode, messageId }) {
  const divider = '='.repeat(78);
  const subDivider = '-'.repeat(78);
  
  console.log('\n' + divider);
  console.log('📧  OFFICIAL DEAN (R&D) OFFICE EMAIL DISPATCH');
  console.log(divider);
  console.log(`STATUS:    ${mode === 'LIVE' ? '✅ SENT LIVE VIA MICROSOFT 365 OUTLOOK' : '🟡 PREVIEW / DISPATCHED (SIMULATION MODE)'}`);
  if (messageId) {
    console.log(`MSG ID:    ${messageId}`);
  }
  console.log(`FROM:      ${from}`);
  console.log(`TO:        ${to}`);
  console.log(`SUBJECT:   ${subject}`);
  console.log(`TIMESTAMP: ${new Date().toLocaleString()}`);
  console.log(subDivider);
  console.log('EMAIL CONTENT (SENT TO USER):');
  console.log(subDivider);
  console.log(text.trim());
  console.log(divider + '\n');
}

/**
 * Dispatches email through Microsoft 365 Outlook SMTP or logs mock simulation
 */
async function dispatchMail({ to, subject, text, html, logContext }) {
  if (!to) {
    logger.warn(`[Dean Mailer] Skipping mail dispatch: Recipient email is empty (${logContext})`);
    return false;
  }

  const sender = `"${process.env.EMAIL_SENDER_NAME || 'Office of Dean (R&D) - VFSTR'}" <${process.env.SMTP_USER || 'deanrd@vignan.ac.in'}>`;
  const pass = process.env.SMTP_PASS || '';
  const isDummy = isPlaceholder(pass);

  if (isDummy) {
    printEmailToTerminal({
      to,
      from: sender,
      subject,
      text,
      mode: 'SIMULATION'
    });
    logger.info(`[OFFICE 365 SMTP SIMULATION] ${logContext} -> To: ${to} | Subject: "${subject}"`);
    return true;
  }

  try {
    const transporter = createOutlookTransporter();

    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text,
      html
    });

    printEmailToTerminal({
      to,
      from: sender,
      subject,
      text,
      mode: 'LIVE',
      messageId: info.messageId
    });
    logger.success(`[OFFICE 365 SMTP] Dispatched to ${to}: Message ID ${info.messageId}`);
    return true;
  } catch (err) {
    console.log('\n' + '='.repeat(78));
    console.log('❌  MICROSOFT 365 OUTLOOK SMTP DISPATCH FAILED');
    console.log(`TO:       ${to}`);
    console.log(`SUBJECT:  ${subject}`);
    console.log(`ERROR:    ${err.message}`);
    console.log('='.repeat(78) + '\n');
    logger.warn(`[OFFICE 365 SMTP WARN] Failed to dispatch email to ${to}: ${err.message}. (${logContext})`);
    return false;
  }
}

/**
 * Super Admin / Dean Password Reset Dispatch
 */
async function sendResetEmail(toEmail, facultyName, tempPassword) {
  const subject = 'Administrative Access: Temporary Access Code - Dean R&D, VFSTR';
  const contentHtml = `
    <p style="margin-top: 0;">Dear <strong>${facultyName}</strong>,</p>
    <p>A request for administrative password reset was authorized by the R&D Central Administration.</p>
    
    <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <span style="font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Your Temporary Passcode</span>
      <span style="font-family: monospace; font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: 2px;">${tempPassword}</span>
    </div>

    <p style="font-size: 13px; color: #64748b;">
      Please login using this temporary access passcode and immediately set your permanent password under account settings.
    </p>
  `;

  const text = `Dear ${facultyName},\n\nYour request for temporary password access has been approved.\nTemporary Access Code: ${tempPassword}\n\nPlease login immediately and update your permanent password.\n\nRegards,\nDean (Research & Development)\nVFSTR Deemed-to-be University`;

  const html = getEmailLayout({
    title: 'Administrative Password Reset',
    badgeText: 'Security Notice • Password Reset',
    badgeColor: 'blue',
    contentHtml
  });

  return await dispatchMail({
    to: toEmail,
    subject,
    text,
    html,
    logContext: `Password reset dispatched to ${toEmail}`
  });
}

/**
 * Notification dispatched when the Dean Approves a supervisor recognition application
 */
async function sendApprovalEmail(optionsOrEmail, facultyName, employeeId, scorePoints, deanRemarks, department) {
  let opts = {};
  if (typeof optionsOrEmail === 'object' && optionsOrEmail !== null) {
    opts = optionsOrEmail;
  } else {
    opts = {
      toEmail: optionsOrEmail,
      facultyName,
      employeeId,
      scorePoints,
      deanRemarks,
      department
    };
  }

  const {
    toEmail,
    facultyName: name = 'Faculty Member',
    employeeId: empId = 'N/A',
    department: dept = 'N/A',
    designation: desig = 'Faculty',
    scorePoints: score = 'N/A',
    deanRemarks: remarks = 'Recommended and Approved for Ph.D. Guideship',
    allocatedDate: allocDate = new Date().toISOString().split('T')[0],
    applicationId = ''
  } = opts;

  const subject = `Official Notification: Recognition as Ph.D. Research Supervisor Approved (Emp ID: ${empId}) - Dean R&D, VFSTR`;

  const contentHtml = `
    <p style="margin-top: 0;">Dear <strong>Dr./Prof. ${name}</strong>,</p>
    <p>
      We take immense pleasure in informing you that the <strong>Academic Council & Directorate of Research and Development</strong> has evaluated your application 
      ${applicationId ? `(Proposal Reference: <strong>#${applicationId}</strong>)` : ''} and verified your peer-reviewed research credentials.
    </p>
    <p style="color: #065f46; font-weight: 700; font-size: 15px; margin: 15px 0;">
      ✓ Your application for formal recognition as a Ph.D. Research Supervisor at VFSTR has been APPROVED by the Dean (R&D).
    </p>

    <!-- Details Table -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0; font-size: 13.5px;">
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; width: 35%;">Faculty Name</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Employee ID</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${empId}</td>
      </tr>
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Department / Designation</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${dept} / ${desig}</td>
      </tr>
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Recognition / Allocation Date</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${allocDate}</td>
      </tr>
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">Evaluation Score Points</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #d97706;">${score} / 100</td>
      </tr>
      <tr>
        <td style="padding: 10px 15px; font-weight: 600; color: #64748b;">Dean's Assessment Remarks</td>
        <td style="padding: 10px 15px; font-weight: 600; color: #0f172a;">${remarks}</td>
      </tr>
    </table>

    <p style="margin-bottom: 8px;">
      <strong>Next Steps & Guidelines:</strong>
    </p>
    <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 20px; color: #475569;">
      <li>Your supervisor record has been officially enrolled in the <strong>VFSTR Guideship Registry</strong>.</li>
      <li>You are now eligible to be allocated Full-Time and Part-Time Ph.D. scholars under statutory UGC/VFSTR doctoral quota regulations.</li>
      <li>Scholars, milestones, and coursework progress can be tracked through the centralized R&D portal.</li>
    </ul>

    <p>Congratulations and we wish you productive research mentorship at VFSTR.</p>
  `;

  const text = `Dear Dr./Prof. ${name},\n\nWe are pleased to inform you that your application for recognition as a Ph.D. Research Supervisor at VFSTR has been APPROVED by the Dean (R&D).\n\nEmployee ID: ${empId}\nDepartment: ${dept}\nScore Points: ${score}/100\nAllocation Date: ${allocDate}\nRemarks: ${remarks}\n\nYour profile has been enrolled in the Guideship system. You may now guide doctoral scholars as per VFSTR regulations.\n\nRegards,\nDean (Research & Development)\nVFSTR Deemed-to-be University`;

  const html = getEmailLayout({
    title: 'Ph.D. Supervisor Recognition Approved',
    badgeText: '✓ Application Approved & Recognized',
    badgeColor: 'green',
    contentHtml
  });

  return await dispatchMail({
    to: toEmail,
    subject,
    text,
    html,
    logContext: `Supervisor recognition approval dispatched to ${toEmail} (Emp ID: ${empId})`
  });
}

/**
 * Notification dispatched when the Dean Rejects or Defers a supervisor recognition application
 */
async function sendRejectionEmail(optionsOrEmail, facultyName, remarks, department) {
  let opts = {};
  if (typeof optionsOrEmail === 'object' && optionsOrEmail !== null) {
    opts = optionsOrEmail;
  } else {
    opts = {
      toEmail: optionsOrEmail,
      facultyName,
      remarks,
      department
    };
  }

  const {
    toEmail,
    facultyName: name = 'Faculty Member',
    employeeId: empId = 'N/A',
    department: dept = 'N/A',
    remarks: deanRemarks = 'Does not satisfy the minimum statutory publications or guidelines at this stage.',
    scorePoints: score = 'N/A',
    applicationId = ''
  } = opts;

  const subject = `Institutional Update: Ph.D. Supervisor Application Status (Proposal #${applicationId || empId}) - Dean R&D, VFSTR`;

  const contentHtml = `
    <p style="margin-top: 0;">Dear <strong>Dr./Prof. ${name}</strong>,</p>
    <p>
      Thank you for submitting your application for recognition as a Ph.D. Research Supervisor at VFSTR 
      ${applicationId ? `(Proposal Reference: <strong>#${applicationId}</strong>)` : ''}.
    </p>
    <p>
      The Academic Committee and Directorate of Research & Development has reviewed your submitted dossier and publication credentials. 
      We regret to inform you that your application has <strong>NOT been approved</strong> for supervisory recognition at this time.
    </p>

    <!-- Details Table -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; margin: 20px 0; font-size: 13.5px;">
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 600; color: #991b1b; width: 35%;">Faculty Name</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 700; color: #7f1d1d;">${name}</td>
      </tr>
      ${empId !== 'N/A' ? `
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 600; color: #991b1b;">Employee ID</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 600; color: #7f1d1d;">${empId}</td>
      </tr>` : ''}
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 600; color: #991b1b;">Department</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 600; color: #7f1d1d;">${dept}</td>
      </tr>
      <tr>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 600; color: #991b1b;">Review Status</td>
        <td style="padding: 10px 15px; border-bottom: 1px solid #fecaca; font-weight: 700; color: #dc2626;">Not Approved / Deferred</td>
      </tr>
      <tr>
        <td style="padding: 10px 15px; font-weight: 600; color: #991b1b;">Dean's Evaluation Feedback</td>
        <td style="padding: 10px 15px; font-weight: 600; color: #7f1d1d;">${deanRemarks}</td>
      </tr>
    </table>

    <p style="margin-bottom: 8px;">
      <strong>Recommendations & Next Steps:</strong>
    </p>
    <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 20px; color: #475569;">
      <li>Please review the Dean's assessment feedback notes above regarding journal indexing, first/corresponding authorship, or publication count.</li>
      <li>Faculty members are encouraged to strengthen their research profile in SCI/Scopus indexed journals.</li>
      <li>You are eligible to re-apply in the subsequent academic semester once the regulatory criteria are fulfilled.</li>
    </ul>

    <p>We appreciate your continued dedication to research and academic excellence at VFSTR.</p>
  `;

  const text = `Dear Dr./Prof. ${name},\n\nThank you for submitting your application for recognition as a Ph.D. Research Supervisor (Ref: #${applicationId || empId}).\n\nFollowing review by the Dean (R&D), your application has NOT been approved at this time.\n\nEvaluation Feedback: ${deanRemarks}\n\nYou are encouraged to address this feedback and re-apply in the subsequent academic cycle.\n\nRegards,\nDean (Research & Development)\nVFSTR Deemed-to-be University`;

  const html = getEmailLayout({
    title: 'Ph.D. Supervisor Application Status',
    badgeText: 'Application Review Completed - Not Approved',
    badgeColor: 'red',
    contentHtml
  });

  return await dispatchMail({
    to: toEmail,
    subject,
    text,
    html,
    logContext: `Supervisor recognition rejection dispatched to ${toEmail}`
  });
}

/**
 * Verifies live connection to Microsoft 365 Outlook SMTP
 */
async function verifyOutlookConnection() {
  const host = process.env.SMTP_HOST || 'smtp.office365.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'deanrd@vignan.ac.in';
  const pass = process.env.SMTP_PASS || '';

  if (isPlaceholder(pass)) {
    return {
      connected: false,
      isPlaceholder: true,
      reason: 'Placeholder password in .env (SMTP_PASS=your_office365_outlook_password). Replace with live Outlook password or App Password.',
      host,
      port,
      user
    };
  }

  try {
    const transporter = createOutlookTransporter();
    await transporter.verify();
    return {
      connected: true,
      isPlaceholder: false,
      message: 'Successfully connected and authenticated with Microsoft 365 Outlook SMTP server.',
      host,
      port,
      user
    };
  } catch (err) {
    return {
      connected: false,
      isPlaceholder: false,
      reason: err.message,
      host,
      port,
      user
    };
  }
}

/**
 * Portal User Email OTP Dispatch
 */
async function sendOtpEmail({ toEmail, empId, otpCode, portalName, expiresInMinutes = 10 }) {
  const subject = `VFSTR R&D Portal Access OTP: ${otpCode} (${portalName})`;
  const contentHtml = `
    <p style="margin-top: 0;">Dear Researcher / Faculty Member (ID: <strong>${empId}</strong>),</p>
    <p>A request was initiated to authenticate access to the <strong>${portalName}</strong> on the VFSTR Directorate of Research & Development Central Platform.</p>
    
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #f59e0b; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <span style="font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; display: block; margin-bottom: 8px;">Your One-Time Password (OTP)</span>
      <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: 8px; display: inline-block; background: #ffffff; padding: 8px 24px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">${otpCode}</span>
      <p style="margin: 12px 0 0 0; font-size: 13px; color: #dc2626; font-weight: 600;">⏱️ Valid for ${expiresInMinutes} minutes only</p>
    </div>

    <p style="font-size: 13.5px; color: #475569; line-height: 1.6;">
      Please enter this verification code in the portal gateway to proceed with your application. Do not share this OTP with anyone. The Directorate of R&D will never ask for your authentication codes.
    </p>
    <div style="margin-top: 20px; padding: 12px 16px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; border-radius: 4px; font-size: 12.5px; color: #78350f;">
      If you did not request this OTP, please contact the Office of Dean R&D (deanrd@vignan.ac.in) immediately.
    </div>
  `;

  const text = `Dear Researcher / Faculty Member (ID: ${empId}),\n\nYour One-Time Password (OTP) to access ${portalName} is:\n\n${otpCode}\n\nThis OTP is valid for ${expiresInMinutes} minutes. Please do not share it with anyone.\n\nRegards,\nDirectorate of Research & Development\nVFSTR (Deemed to be University)`;

  const html = getEmailLayout({
    title: 'VFSTR Portal Authentication',
    badgeText: 'Portal Access Verification',
    badgeColor: 'amber',
    contentHtml
  });

  return await dispatchMail({
    to: toEmail,
    subject,
    text,
    html,
    logContext: `Portal OTP for [${empId} | ${portalName}] to ${toEmail}`
  });
}

module.exports = {
  sendResetEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendOtpEmail,
  verifyOutlookConnection
};
