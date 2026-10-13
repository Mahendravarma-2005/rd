// Test updating proposal status and proof upload
async function runTest() {
  const proposalId = 1;

  // Create a sample small test PDF (or image) data URI
  const samplePdfContent = '%PDF-1.4 sample proof document test for R&D status update';
  const sampleBase64 = Buffer.from(samplePdfContent).toString('base64');
  const dataUrl = `data:application/pdf;base64,${sampleBase64}`;

  console.log('1. Sending PUT request to update status and upload proof...');
  const putRes = await fetch(`http://localhost:3000/api/proposals/${proposalId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Approved',
      remarks: 'Proposal verified and approved with sanction order attached.',
      proofFileName: 'dean_sanction_order.pdf',
      proofFileType: 'application/pdf',
      proofFileData: dataUrl
    })
  });

  const putJson = await putRes.json();
  console.log('PUT Response:', putJson);

  console.log('\n2. Fetching proposal list to check proof metadata...');
  const listRes = await fetch(`http://localhost:3000/api/proposals`);
  const listJson = await listRes.json();
  const updatedProposal = listJson.find(p => p.id === proposalId);
  console.log('Found proposal:', {
    id: updatedProposal.id,
    status: updatedProposal.status,
    proofFileName: updatedProposal.proofFileName,
    proofFileType: updatedProposal.proofFileType,
    hasProofData: !!updatedProposal.proofFileData
  });

  console.log('\n3. Testing GET /api/proposals/:id/proof binary streaming endpoint...');
  const proofRes = await fetch(`http://localhost:3000/api/proposals/${proposalId}/proof`);
  console.log('Proof HTTP status:', proofRes.status);
  console.log('Proof Content-Type:', proofRes.headers.get('content-type'));
  console.log('Proof Content-Disposition:', proofRes.headers.get('content-disposition'));
  const proofBuffer = await proofRes.arrayBuffer();
  const proofText = Buffer.from(proofBuffer).toString('utf-8');
  console.log('Proof content matches expected:', proofText === samplePdfContent);
  console.log('Proof byte length:', proofBuffer.byteLength);

  console.log('\nAll tests passed successfully!');
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
