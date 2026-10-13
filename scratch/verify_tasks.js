const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function testAll() {
  console.log('=== STARTING AUTOMATED VALIDATION FOR TASK 1 & TASK 2 ===\n');

  // Test 1: Full-Time Scholar History API
  console.log('Test 1: Testing Full-Time Scholar History API...');
  const resFt = await fetch('http://localhost:3000/api/scholar-submissions/251BG37001');
  const jsonFt = await resFt.json();
  if (jsonFt.success && Array.isArray(jsonFt.data) && jsonFt.data.length > 0) {
    console.log('✅ Full-Time Scholar History API SUCCESS. Submissions count:', jsonFt.count);
    console.log('   Month:', jsonFt.data[0].currentMonth, '| Log Timestamp (created_at):', jsonFt.data[0].createdAt);
  } else {
    throw new Error('❌ Full-Time Scholar History API FAILED: ' + JSON.stringify(jsonFt));
  }

  // Test 2: Part-Time Scholar History API
  console.log('\nTest 2: Testing Part-Time Scholar History API...');
  let resPt = await fetch('http://localhost:3000/api/part-time-scholar-submissions/251PT01001');
  let jsonPt = await resPt.json();
  if (!jsonPt.data || jsonPt.data.length === 0) {
    await fetch('http://localhost:3000/api/part-time-scholars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'pt_seed_' + Date.now(),
        regNo: '251PT01001',
        scholarName: 'Dr. / Mr. V. Ramesh Kumar',
        guideName: 'Dr. K. Phani Kumar',
        department: 'CSE',
        raType: 'Part Time',
        currentMonth: '2026-09',
        avgSpentStayed: '80',
        academicLoad: 'Research & Project Progress'
      })
    });
    resPt = await fetch('http://localhost:3000/api/part-time-scholar-submissions/251PT01001');
    jsonPt = await resPt.json();
  }
  if (jsonPt.success && Array.isArray(jsonPt.data) && jsonPt.data.length > 0) {
    console.log('✅ Part-Time Scholar History API SUCCESS. Submissions count:', jsonPt.count);
    console.log('   Month:', jsonPt.data[0].currentMonth, '| Log Timestamp (created_at):', jsonPt.data[0].createdAt);
  } else {
    throw new Error('❌ Part-Time Scholar History API FAILED: ' + JSON.stringify(jsonPt));
  }

  // Test 3: Backend Rejection of Duplicate Submission (Full-Time)
  console.log('\nTest 3: Testing Duplicate Submission Rejection (Full-Time)...');
  const resDupFt = await fetch('http://localhost:3000/api/scholars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'test_dup_' + Date.now(),
      regNo: '251BG37001',
      scholarName: 'Koteswara Rao Ch',
      currentMonth: '2026-09',
      avgSpentStayed: '160',
      academicLoad: 'Lab duty'
    })
  });
  const jsonDupFt = await resDupFt.json();
  if (resDupFt.status === 409 && jsonDupFt.error === 'DUPLICATE_SUBMISSION') {
    console.log('✅ Full-Time Duplicate Rejection SUCCESS. Status:', resDupFt.status, '| Message:', jsonDupFt.message);
  } else {
    throw new Error('❌ Full-Time Duplicate Rejection FAILED: ' + JSON.stringify(jsonDupFt));
  }

  // Test 4: Backend Rejection of Duplicate Submission (Part-Time)
  console.log('\nTest 4: Testing Duplicate Submission Rejection (Part-Time)...');
  const resDupPt = await fetch('http://localhost:3000/api/part-time-scholars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'test_dup_pt_' + Date.now(),
      regNo: '251PT01001',
      scholarName: 'Dr. / Mr. V. Ramesh Kumar',
      guideName: 'Dr. K. Phani Kumar',
      department: 'CSE',
      currentMonth: '2026-08',
      avgSpentStayed: '60',
      academicLoad: 'Part time'
    })
  });
  const jsonDupPt = await resDupPt.json();
  if (resDupPt.status === 409 && jsonDupPt.error === 'DUPLICATE_SUBMISSION') {
    console.log('✅ Part-Time Duplicate Rejection SUCCESS. Status:', resDupPt.status, '| Message:', jsonDupPt.message);
  } else {
    throw new Error('❌ Part-Time Duplicate Rejection FAILED: ' + JSON.stringify(jsonDupPt));
  }

  // Test 5: Verify MySQL Unique Index
  console.log('\nTest 5: Verifying MySQL Unique Constraints...');
  const [ftIndexes] = await db.query("SHOW INDEX FROM monthly_submissions WHERE Key_name = 'uq_scholar_month'");
  const [ptIndexes] = await db.query("SHOW INDEX FROM part_time_monthly_submissions WHERE Key_name = 'uq_pt_scholar_month'");
  if (ftIndexes.length > 0 && ptIndexes.length > 0) {
    console.log('✅ MySQL Unique Constraints verified on both tables (uq_scholar_month & uq_pt_scholar_month)');
  } else {
    throw new Error('❌ Unique key missing in database');
  }

  // Test 6: Verify Frontend DOM elements in HTML files
  console.log('\nTest 6: Verifying Frontend HTML Files...');
  const files = [
    'PHD Scholar Tracking/index.html',
    'PHD Part Time Scholar Tracking/index.html'
  ];
  const expectedElements = [
    'id="btnScholarHistory"',
    'id="scholarHistoryBadge"',
    'id="btnScholarLogout"',
    'id="scholarHistoryModal"',
    'id="scholarHistoryList"',
    'id="btnCloseScholarHistory"'
  ];

  const removedElements = [
    'id="alreadySubmittedAlert"',
    'id="submittedMonthText"',
    'id="btnViewCurrentSubmittedReport"'
  ];

  for (const f of files) {
    const content = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
    for (const elem of expectedElements) {
      if (!content.includes(elem)) {
        throw new Error(`❌ Missing ${elem} in ${f}`);
      }
    }
    for (const elem of removedElements) {
      if (content.includes(elem)) {
        throw new Error(`❌ Element should have been removed: ${elem} in ${f}`);
      }
    }
    console.log(`✅ All required HTML elements verified and alert banner confirmed removed in ${f}`);
  }

  console.log('\n🎉 ALL VALIDATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  process.exit(0);
}

testAll().catch(err => {
  console.error('\n❌ VALIDATION TEST ENCOUNTERED AN ERROR:\n', err);
  process.exit(1);
});
