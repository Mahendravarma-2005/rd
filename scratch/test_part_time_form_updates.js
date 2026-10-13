const fs = require('fs');
const path = require('path');
const http = require('http');

async function testPartTimeFormUpdates() {
  console.log('=================================================================');
  console.log('      TESTING PART-TIME SCHOLAR USER FORM FIELD UPDATES          ');
  console.log('=================================================================\n');

  const htmlPath = path.join(__dirname, '..', 'PHD Part Time Scholar Tracking', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. Scholar Permanent Profile checks
  console.log('--- 1. Checking Scholar Permanent Profile Fields ---');
  const hasScholarName = html.includes('id="portalScholarName"');
  const hasGuideName = html.includes('id="portalGuideName"');
  const hasDept = html.includes('id="portalDepartment"');
  const hasEmployementLabel = html.includes('Employement');
  const hasIndustryOpt = html.includes('<option value="Industry">Industry</option>');
  const hasAcademicOpt = html.includes('<option value="Academic">Academic</option>');
  const hasDateOfJoining = html.includes('id="portalDateOfJoining"');
  const hasScholarContact = html.includes('id="portalScholarContact"');
  const hasSupervisorContact = html.includes('id="portalSupervisorContact"');

  console.log('✅ Scholar Name present:', hasScholarName);
  console.log('✅ Guide Name present:', hasGuideName);
  console.log('✅ Department present:', hasDept);
  console.log('✅ Employement label present:', hasEmployementLabel);
  console.log('✅ Industry option present:', hasIndustryOpt);
  console.log('✅ Academic option present:', hasAcademicOpt);
  console.log('✅ Date of Joining present:', hasDateOfJoining);
  console.log('✅ Contact No of Scholar present:', hasScholarContact);
  console.log('✅ Contact No of Supervisor present:', hasSupervisorContact);

  if (!hasScholarName || !hasGuideName || !hasDept || !hasEmployementLabel || !hasIndustryOpt || !hasAcademicOpt || !hasDateOfJoining || !hasScholarContact || !hasSupervisorContact) {
    throw new Error('Failed: One or more required fields are missing in Scholar Permanent Profile');
  }

  // Check removed fields under Scholar Permanent Profile
  const hasBankName = html.includes('id="portalBankName"');
  const hasBankAccountNo = html.includes('id="portalBankAccountNo"');
  const hasIfscCode = html.includes('id="portalIfscCode"');
  const hasEndOfRA = html.includes('id="portalEndOfRA"');
  const hasRemainingTenure = html.includes('id="portalRemainingTenure"');

  console.log('✅ Bank Name removed:', !hasBankName);
  console.log('✅ Bank Account No removed:', !hasBankAccountNo);
  console.log('✅ IFSC Code removed:', !hasIfscCode);
  console.log('✅ End of RA removed:', !hasEndOfRA);
  console.log('✅ Remaining Tenure banner removed:', !hasRemainingTenure);

  if (hasBankName || hasBankAccountNo || hasIfscCode || hasEndOfRA || hasRemainingTenure) {
    throw new Error('Failed: Removed fields are still present in Scholar Permanent Profile');
  }

  // 2. Monthly Progress checks
  console.log('\n--- 2. Checking Monthly Progress Fields ---');
  const hasCurrentMonth = html.includes('id="portalCurrentMonth"');
  const hasCoursesCompleted = html.includes('id="portalCoursesCompleted"');
  const hasCoursesContainer = html.includes('id="portalCoursesContainer"');

  console.log('✅ Current Month (Auto-Generated) present:', hasCurrentMonth);
  console.log('✅ No of Courses Completed (1, 2, 3...) present:', hasCoursesCompleted);
  console.log('✅ Courses container present:', hasCoursesContainer);

  if (!hasCurrentMonth || !hasCoursesCompleted || !hasCoursesContainer) {
    throw new Error('Failed: Required fields missing in Monthly Progress section');
  }

  // Check removed fields in Monthly Progress
  const hasForgetThumbs = html.includes('id="portalForgetThumbs"');
  const hasLeavesTaken = html.includes('id="portalLeavesTaken"');
  const hasAvgSpentStayed = html.includes('id="portalAvgSpentStayed"');
  const hasAcademicLoad = html.includes('id="portalAcademicLoad"');

  console.log('✅ Forget Thumbs removed:', !hasForgetThumbs);
  console.log('✅ No of Leaves Taken removed:', !hasLeavesTaken);
  console.log('✅ Average Hours Spent removed:', !hasAvgSpentStayed);
  console.log('✅ Academic Load removed:', !hasAcademicLoad);

  if (hasForgetThumbs || hasLeavesTaken || hasAvgSpentStayed || hasAcademicLoad) {
    throw new Error('Failed: Attendance and load fields should be removed from Monthly Progress');
  }

  // Check remaining sections are intact
  const hasJournals = html.includes('3. Journal Papers Progress') && html.includes('id="portalJournalContainer"');
  const hasConfs = html.includes('4. Conference Papers Progress') && html.includes('id="portalConferenceContainer"');
  const hasEvents = html.includes('5. Conferences / Workshops / Guest Lectures / Synopsis / Pre-Synopsis / ODEC Attended') && html.includes('id="portalFdpContainer"');
  const hasDcs = html.includes('6. Doctoral Committee (DC) Meetings Attended') && html.includes('id="portalDcContainer"');

  console.log('✅ Journal Papers Progress intact:', hasJournals);
  console.log('✅ Conference Papers Progress intact:', hasConfs);
  console.log('✅ Conferences / Workshops / Guest Lectures / Synopsis / Pre-Synopsis / ODEC Attended intact:', hasEvents);
  console.log('✅ Doctoral Committee (DC) Meetings Attended intact:', hasDcs);

  if (!hasJournals || !hasConfs || !hasEvents || !hasDcs) {
    throw new Error('Failed: One of the remaining sections was modified unintentionally');
  }

  // 3. API Test - Verify profile lookup and raType
  console.log('\n--- 3. Testing Backend API Integration ---');
  function get(urlPath) {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:3000' + urlPath, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }).on('error', reject);
    });
  }

  const p1 = await get('/api/part-time-profile/251PT01001');
  console.log('Profile 251PT01001:', p1.status, '| Scholar:', p1.body.profile.scholarName, '| Employement:', p1.body.profile.raType);
  if (p1.body.profile.raType !== 'Industry') {
    throw new Error('Expected 251PT01001 raType to be Industry');
  }

  const p2 = await get('/api/part-time-profile/241PT04005');
  console.log('Profile 241PT04005:', p2.status, '| Scholar:', p2.body.profile.scholarName, '| Employement:', p2.body.profile.raType);
  if (p2.body.profile.raType !== 'Academic') {
    throw new Error('Expected 241PT04005 raType to be Academic');
  }

  // 4. Test Submission without removed fields
  console.log('\n--- 4. Testing Submission with Only Requested Fields ---');
  function post(urlPath, body) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const req = http.request('http://localhost:3000' + urlPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, res => {
        let respData = '';
        res.on('data', chunk => respData += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(respData) }));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  const testSubPayload = {
    id: 'test_sub_251PT01001_2026_09',
    regNo: '251PT01001',
    scholarName: 'Dr. / Mr. V. Ramesh Kumar',
    guideName: 'Dr. K. Phani Kumar',
    department: 'CSE',
    raType: 'Industry',
    dateOfJoining: '2024-07-31',
    scholarContact: '9848012345',
    supervisorContact: '9440154321',
    currentMonth: '2026-09',
    coursesCompleted: 1,
    courseDetails: [
      {
        courseCode: 'NOC26CS01',
        courseName: 'Deep Reinforcement Learning',
        courseType: 'NPTEL',
        credits: '3',
        formativeMarks: '30',
        summativeMarks: '45',
        cgpa: '75',
        result: 'Pass',
        completionDate: '2026-09-15'
      }
    ],
    journalPapers: [],
    conferencePapers: [],
    events: [],
    dcMeetings: [
      {
        dcName: '2',
        lastDcDate: '2026-09-20',
        regulation: 'R22',
        rating: '11',
        recommendations: 'In Progress',
        comments: 'Experimental results validated.'
      }
    ]
  };

  const subRes = await post('/api/part-time-scholars', testSubPayload);
  console.log('Submission Result:', subRes.status, subRes.body.success, subRes.body.message || subRes.body.id);
  if (!subRes.body.success) {
    throw new Error('Failed to submit test monthly progress report: ' + JSON.stringify(subRes.body));
  }

  // Cleanup test submission
  const db = require('../src/config/db');
  await db.query('DELETE FROM part_time_monthly_submissions WHERE id = ?', ['test_sub_251PT01001_2026_09']);
  console.log('✅ Cleaned up test submission');

  console.log('\n=================================================================');
  console.log('       ALL PART-TIME USER FORM TESTS PASSED SUCCESSFULLY!        ');
  console.log('=================================================================');
}

testPartTimeFormUpdates().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
