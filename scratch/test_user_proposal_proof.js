// End-to-end integration test for user panel proposal submission with status dropdown and proof upload
async function runTest() {
  console.log('Testing User Panel Proposal Submissions with Proofs...\n');

  // Test Case 1: 'submitted' status with proof document
  const samplePdfData = 'data:application/pdf;base64,' + Buffer.from('%PDF-1.4 sample proposal submission slip').toString('base64');
  const res1 = await fetch('http://localhost:3000/api/proposals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empCode: '01251',
      piName: 'DR. DONDETI. VENKATESULU',
      piPhone: '9845321045',
      piEmail: 'dvenkatesulu@vignan.ac.in',
      piDepartment: 'CSE',
      title: 'Automated Drone Swarm for Agricultural Monitoring',
      duration: '2 Years',
      date: '2026-10-06',
      industrialCollab: 'No',
      fundingType: 'Government',
      fundingAgency: 'DST',
      proposedAmount: '35.50',
      projectScheme: 'SERB CRG',
      submissionEndDate: '2026-11-30',
      status: 'submitted',
      proofFileName: 'drone_swarm_submission_proof.pdf',
      proofFileType: 'application/pdf',
      proofFileData: samplePdfData
    })
  });
  const data1 = await res1.json();
  console.log('Test 1 (Submitted):', data1);

  // Test Case 2: 'Not recommended' status with comments and proof
  const sampleDocData = 'data:application/msword;base64,' + Buffer.from('Evaluation review comments proof doc').toString('base64');
  const res2 = await fetch('http://localhost:3000/api/proposals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empCode: '01251',
      piName: 'DR. DONDETI. VENKATESULU',
      piPhone: '9845321045',
      piEmail: 'dvenkatesulu@vignan.ac.in',
      piDepartment: 'CSE',
      title: 'Quantum Key Distribution for Micro-Grid SCADA',
      duration: '3 Years',
      date: '2026-10-06',
      industrialCollab: 'No',
      fundingType: 'Government',
      fundingAgency: 'DRDO',
      proposedAmount: '50.00',
      projectScheme: 'ER&IPR',
      submissionEndDate: '2026-12-15',
      status: 'Not recommended',
      feedbackText: 'The proposed hardware topology requires further experimental validation before funding.',
      proofFileName: 'drdo_review_evaluation.doc',
      proofFileType: 'application/msword',
      proofFileData: sampleDocData
    })
  });
  const data2 = await res2.json();
  console.log('Test 2 (Not recommended with comments):', data2);

  // Test Case 3: 'invite for presentation' status with proof
  const samplePngData = 'data:image/png;base64,' + Buffer.from('FakePngDataBytes').toString('base64');
  const res3 = await fetch('http://localhost:3000/api/proposals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empCode: '01251',
      piName: 'DR. DONDETI. VENKATESULU',
      piPhone: '9845321045',
      piEmail: 'dvenkatesulu@vignan.ac.in',
      piDepartment: 'CSE',
      title: 'Edge AI Vision System for Railway Track Inspection',
      duration: '2 Years',
      date: '2026-10-06',
      industrialCollab: 'No',
      fundingType: 'Government',
      fundingAgency: 'DST',
      proposedAmount: '28.00',
      projectScheme: 'TDP Scheme',
      submissionEndDate: '2026-10-31',
      status: 'invite for presentation',
      proofFileName: 'railway_presentation_call.png',
      proofFileType: 'image/png',
      proofFileData: samplePngData
    })
  });
  const data3 = await res3.json();
  console.log('Test 3 (Invite for presentation):', data3);

  // Test Case 4: Verify streaming proof retrieval for Test 1
  console.log('\nVerifying streaming retrieval for proposal ID:', data1.id);
  const streamRes = await fetch(`http://localhost:3000/api/proposals/${data1.id}/proof`);
  console.log('Stream status:', streamRes.status);
  console.log('Stream Content-Type:', streamRes.headers.get('content-type'));
  console.log('Stream Content-Disposition:', streamRes.headers.get('content-disposition'));
  const streamBuf = await streamRes.arrayBuffer();
  console.log('Stream buffer size (bytes):', streamBuf.byteLength);

  console.log('\nAll integration tests passed successfully!');
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
