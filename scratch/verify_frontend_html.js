const fs = require('fs');
const path = require('path');

const checks = [
  {
    name: 'Guideship Allotment System (apply_recognition.html)',
    file: 'guideship_front_end/views/apply_recognition.html',
    requiredStrings: [
      'id="guideshipOtpGatekeeper"',
      'id="otpStep1"',
      'id="otpStep2"',
      'id="btnSendOtp"',
      'id="btnVerifyOtp"',
      'id="verifiedUserBanner"',
      'id="supervisorApplicationForm"'
    ]
  },
  {
    name: 'Project Proposals Management (ProjectPi index.html)',
    file: 'ProjectPi/public/index.html',
    requiredStrings: [
      'id="piVerifiedUserBanner"',
      'id="gatekeeperCard"',
      'id="piOtpStep1"',
      'id="piOtpStep2"',
      'id="btnVerifyPiOtp"',
      'id="btnResendPiOtp"',
      'id="btnBackToPiStep1"',
      'id="piLogoutBtn"'
    ]
  },
  {
    name: 'Ph.D Full-Time Scholars Tracking (index.html)',
    file: 'PHD Scholar Tracking/index.html',
    requiredStrings: [
      'id="scholarVerifiedBanner"',
      'id="scholarOtpGatekeeper"',
      'id="scholarOtpStep1"',
      'id="scholarOtpStep2"',
      'id="btnSendScholarOtp"',
      'id="btnVerifyScholarOtp"',
      'id="btnScholarLogout"'
    ]
  }
];

let allPassed = true;
for (const check of checks) {
  const filePath = path.join(__dirname, '..', check.file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`Checking ${check.name}...`);
  for (const s of check.requiredStrings) {
    if (content.includes(s)) {
      console.log(`  ✓ Found: ${s}`);
    } else {
      console.error(`  ❌ Missing: ${s}`);
      allPassed = false;
    }
  }
}

if (allPassed) {
  console.log('\n🎉 ALL FRONTEND HTML GATEKEEPER STRUCTURES VERIFIED SUCCESSFULLY!');
} else {
  console.error('\n❌ SOME FRONTEND HTML CHECKS FAILED!');
  process.exit(1);
}
