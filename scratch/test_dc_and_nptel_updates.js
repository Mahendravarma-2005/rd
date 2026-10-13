const fs = require('fs');
const path = require('path');

function runChecks() {
  console.log('=================================================================');
  console.log('   TESTING DC RECOMMENDATIONS, CRP (0-12), AND NPTEL SCORING     ');
  console.log('=================================================================\n');

  const filesToCheck = [
    {
      dir: 'PHD Scholar Tracking',
      dcFile: 'PHD Scholar Tracking/js/dynamicCards.js',
      portalFile: 'PHD Scholar Tracking/js/portal.js',
      adminFile: 'PHD Scholar Tracking/js/admin.js',
      reportFile: 'PHD Scholar Tracking/js/report.js'
    },
    {
      dir: 'PHD Part Time Scholar Tracking',
      dcFile: 'PHD Part Time Scholar Tracking/js/dynamicCards.js',
      portalFile: 'PHD Part Time Scholar Tracking/js/portal.js',
      adminFile: 'PHD Part Time Scholar Tracking/js/admin.js',
      reportFile: 'PHD Part Time Scholar Tracking/js/report.js'
    }
  ];

  let allPassed = true;

  for (const item of filesToCheck) {
    console.log(`\n--- Checking ${item.dir} ---`);
    const dcContent = fs.readFileSync(path.resolve(item.dcFile), 'utf8');
    const portalContent = fs.readFileSync(path.resolve(item.portalFile), 'utf8');
    const adminContent = fs.readFileSync(path.resolve(item.adminFile), 'utf8');
    const reportContent = fs.readFileSync(path.resolve(item.reportFile), 'utf8');

    // 1. Check Recommendations dropdown options: Synopsis, In Progress, Thesis Submission
    const hasPreThesis = dcContent.includes('<option value="Pre-thesis colloquium"');
    const hasPreSynopsis = dcContent.includes('<option value="Pre-synopsis"');
    const hasSynopsis = dcContent.includes('<option value="Synopsis"');
    const hasInProgress = dcContent.includes('<option value="In Progress"');
    const hasThesisSubmission = dcContent.includes('<option value="Thesis Submission"');

    if (hasPreThesis && hasPreSynopsis && hasSynopsis && hasInProgress && hasThesisSubmission) {
      console.log('✅ Recommendations Dropdown: Contains Pre-thesis colloquium, Pre-synopsis, Synopsis, In Progress, Thesis Submission');
    } else {
      console.error('❌ Recommendations Dropdown missing expected options!');
      allPassed = false;
    }

    // 2. Check CRP (0 - 12) label and dropdown options
    const hasCrp012Label = dcContent.includes('CRP (0 - 12)');
    const hasCrpLoop012 = dcContent.includes('for (let n = 0; n <= 12; n++)');
    const hasCrpOptionFormat = dcContent.includes('el.textContent = `${n} / 12`;') || dcContent.includes('el.textContent = `${n} / 12`');
    const hasOldCrpOptionFormat = dcContent.includes('el.textContent = `CRP ${n} / 12`');

    if (hasCrp012Label && hasCrpLoop012 && hasCrpOptionFormat && !hasOldCrpOptionFormat) {
      console.log('✅ CRP Dropdown: Label is "CRP (0 - 12)", starts at 0, formatted as "0 / 12", "1 / 12", ..., "12 / 12"');
    } else {
      console.error('❌ CRP Dropdown check failed:', { hasCrp012Label, hasCrpLoop012, hasCrpOptionFormat, hasOldCrpOptionFormat });
      allPassed = false;
    }

    // 3. Check NPTEL formative and summative fields
    const hasNptelHiddenFormative = dcContent.includes("courseType === 'NPTEL' ? 'display: none;' : ''");
    const hasPortalNptelExclude = portalContent.includes("courseType === 'NPTEL' ? '' : (card.querySelector('.course-formative-input')");
    const hasAdminNptelExclude = adminContent.includes("courseType === 'NPTEL' ? '' : (card.querySelector('.course-formative-input')");

    if (!hasNptelHiddenFormative && !hasPortalNptelExclude && !hasAdminNptelExclude) {
      console.log('✅ NPTEL Coursework: Formative and Summative Marks fields active, collected on submission in portal & admin');
    } else {
      console.error('❌ NPTEL Coursework still has exclusions:', { hasNptelHiddenFormative, hasPortalNptelExclude, hasAdminNptelExclude });
      allPassed = false;
    }

    // 4. Check Report display
    const hasReportNptelNA = reportContent.includes("c.courseType === 'NPTEL' ? 'N/A' : `${escapeHtml(c.formativeMarks");
    if (!hasReportNptelNA) {
      console.log('✅ Report: Formative/Summative marks displayed for NPTEL courses');
    } else {
      console.error('❌ Report still hardcoding N/A for NPTEL formative/summative marks');
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n=================================================================');
    console.log('     ALL REQUIREMENTS VERIFIED AND PASSED SUCCESSFULLY!          ');
    console.log('=================================================================');
  } else {
    process.exit(1);
  }
}

runChecks();
