const PhdService = require('../src/services/phd.service');

async function test() {
  console.log('Testing DC Meetings integration...');
  const testId = 'test_dc_' + Date.now();
  const testPayload = {
    id: testId,
    regNo: 'TEST_REG_9999',
    scholarName: 'Test Scholar for DC',
    guideName: 'Dr. Test Guide',
    department: 'CSE',
    raType: 'ERA',
    currentMonth: 'September 2026',
    dcMeetings: [
      {
        dcName: 'DC Meeting #1',
        lastDcDate: '2026-08-15',
        regulation: 'R22',
        rating: '10',
        recommendations: 'Pre-synopsis',
        comments: 'Excellent progress on literature survey.'
      },
      {
        dcName: 'DC Meeting #2',
        lastDcDate: '2026-09-10',
        regulation: 'R18',
        rating: 'Good',
        recommendations: 'Pre-thesis colloquium',
        comments: 'Ready for pre-thesis draft submission.'
      }
    ]
  };

  try {
    console.log('1. Saving submission with DC meetings...');
    await PhdService.saveMonthlySubmission(testPayload);
    console.log('Saved successfully.');

    console.log('2. Fetching all submissions...');
    const all = await PhdService.getAllSubmissions();
    const found = all.find(s => s.id === testId);

    if (!found) {
      throw new Error('Test submission was not found in getAllSubmissions!');
    }

    console.log('Found submission:', found.id);
    console.log('DC meetings:', JSON.stringify(found.dcMeetings, null, 2));

    if (!found.dcMeetings || found.dcMeetings.length !== 2) {
      throw new Error(`Expected 2 DC meetings, got ${found.dcMeetings ? found.dcMeetings.length : 0}`);
    }

    const dc1 = found.dcMeetings[0];
    if (dc1.regulation !== 'R22' || dc1.rating !== '10' || dc1.recommendations !== 'Pre-synopsis') {
      throw new Error('DC 1 fields mismatch: ' + JSON.stringify(dc1));
    }

    const dc2 = found.dcMeetings[1];
    if (dc2.regulation !== 'R18' || dc2.rating !== 'Good' || dc2.recommendations !== 'Pre-thesis colloquium') {
      throw new Error('DC 2 fields mismatch: ' + JSON.stringify(dc2));
    }

    console.log('All DC assertions passed!');

    console.log('3. Cleaning up test submission...');
    await PhdService.deleteSubmission(testId);
    console.log('Test record cleaned up successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    try {
      await PhdService.deleteSubmission(testId);
    } catch (_) {}
    process.exit(1);
  }
}

test();
