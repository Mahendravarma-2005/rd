require('dotenv').config();
const db = require('../src/config/db');
const GuideshipService = require('../src/services/guideship.service');
const mailer = require('../src/utils/mailer');

async function runTest() {
  console.log('=== Step 1: Testing Outlook SMTP Diagnostics ===');
  const connStatus = await mailer.verifyOutlookConnection();
  console.log('Outlook SMTP Status:', JSON.stringify(connStatus, null, 2));

  console.log('\n=== Step 2: Testing Approval Flow with Email Notification ===');
  // Create a pending test application
  const testEmpId = 99981;
  const [insertRes] = await db.query(`
    INSERT INTO supervisor_applications 
    (faculty_name, employee_id, email, designation, level, department, phd_award_date, phd_institute, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `, [
    'Dr. Test Candidate', testEmpId, 'test.candidate@vignan.ac.in',
    'Associate Professor', '13A', 'CSE', '2022-05-15', 'IIT Madras'
  ]);
  const appId = insertRes.insertId;
  console.log(`Created Pending test application ID: ${appId}`);

  // Evaluate as 'approve'
  const evalResult = await GuideshipService.evaluateProposal(
    appId,
    'approve',
    'Excellent research record in top-tier SCI journals. Approved.',
    92,
    '2026-09-16'
  );
  console.log('Approval Result Status:', evalResult.newStatus);

  // Check database state
  const [[appRow]] = await db.query('SELECT status, score_points, dean_remarks FROM supervisor_applications WHERE id = ?', [appId]);
  console.log('DB Application Status after approval:', appRow);

  const [[guideRow]] = await db.query('SELECT employee_id, guide_name, department, in_service FROM guides WHERE employee_id = ?', [testEmpId]);
  console.log('DB Guide Record created:', guideRow);

  console.log('\n=== Step 3: Testing Rejection Flow with Email Notification ===');
  const testEmpId2 = 99982;
  const [insertRes2] = await db.query(`
    INSERT INTO supervisor_applications 
    (faculty_name, employee_id, email, designation, level, department, phd_award_date, phd_institute, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `, [
    'Dr. Another Candidate', testEmpId2, 'candidate2@vignan.ac.in',
    'Assistant Professor', '10', 'ECE', '2024-01-10', 'NIT Warangal'
  ]);
  const appId2 = insertRes2.insertId;
  console.log(`Created Pending test application ID: ${appId2}`);

  // Evaluate as 'reject'
  const rejectResult = await GuideshipService.evaluateProposal(
    appId2,
    'reject',
    'Minimum statutory requirement of 5 SCI/Scopus journal papers as first author not met.',
    45,
    null
  );
  console.log('Rejection Result Status:', rejectResult.newStatus);

  const [[appRow2]] = await db.query('SELECT status, score_points, dean_remarks FROM supervisor_applications WHERE id = ?', [appId2]);
  console.log('DB Application Status after rejection:', appRow2);

  // Cleanup test data
  console.log('\n=== Step 4: Cleaning up test records ===');
  await db.query('DELETE FROM supervisor_applications WHERE id IN (?, ?)', [appId, appId2]);
  await db.query('DELETE FROM guides WHERE employee_id IN (?, ?)', [testEmpId, testEmpId2]);
  console.log('Cleanup completed.');

  console.log('\nAll tests executed successfully!');
  process.exit(0);
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
