const fetch = global.fetch || require('node-fetch');

async function testAllFourPortalsMobileOtp() {
  console.log('=================================================================');
  console.log('   TESTING MOBILE OTP AUTHENTICATION ACROSS ALL 4 APPLICATIONS   ');
  console.log('=================================================================\n');

  // 1. Guideship Allotment System
  console.log('--- 1. Testing Guideship Allotment System ---');
  const res1 = await fetch('http://localhost:3000/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: '3067',
      mobile: '9848012345',
      portal: 'guideship'
    })
  });
  const data1 = await res1.json();
  console.log('Result 1 (Guideship Send OTP):', data1);
  if (!data1.success || !data1.devOtp) throw new Error('Failed to generate OTP for Guideship');

  const res1v = await fetch('http://localhost:3000/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: '3067',
      mobile: '9848012345',
      portal: 'guideship',
      otp: data1.devOtp
    })
  });
  const data1v = await res1v.json();
  console.log('Result 1 (Guideship Verify OTP):', data1v);
  if (!data1v.success || !data1v.token) throw new Error('Failed to verify OTP for Guideship');

  // 2. Project Proposals Management (ProjectPi)
  console.log('\n--- 2. Testing Project Proposals Management (ProjectPi) ---');
  const res2 = await fetch('http://localhost:3000/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: 'PI1001',
      mobile: '9876543210',
      portal: 'project-pi'
    })
  });
  const data2 = await res2.json();
  console.log('Result 2 (ProjectPi Send OTP):', data2);
  if (!data2.success || !data2.devOtp) throw new Error('Failed to generate OTP for ProjectPi');

  const res2v = await fetch('http://localhost:3000/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: 'PI1001',
      mobile: '9876543210',
      portal: 'project-pi',
      otp: data2.devOtp
    })
  });
  const data2v = await res2v.json();
  console.log('Result 2 (ProjectPi Verify OTP):', data2v);
  if (!data2v.success || !data2v.token) throw new Error('Failed to verify OTP for ProjectPi');

  // 3. Ph.D Full-Time Scholars Tracking
  console.log('\n--- 3. Testing Ph.D Full-Time Scholars Tracking ---');
  const res3 = await fetch('http://localhost:3000/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: '251BG37001',
      mobile: '9848012345',
      portal: 'phd-tracking'
    })
  });
  const data3 = await res3.json();
  console.log('Result 3 (Ph.D Full-Time Send OTP):', data3);
  if (!data3.success || !data3.devOtp) throw new Error('Failed to generate OTP for Ph.D Full-Time');

  const res3v = await fetch('http://localhost:3000/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: '251BG37001',
      mobile: '9848012345',
      portal: 'phd-tracking',
      otp: data3.devOtp
    })
  });
  const data3v = await res3v.json();
  console.log('Result 3 (Ph.D Full-Time Verify OTP):', data3v);
  if (!data3v.success || !data3v.token || !data3v.profile) throw new Error('Failed to verify OTP for Ph.D Full-Time');

  // 4. Ph.D Part-Time Scholars Tracking
  console.log('\n--- 4. Testing Ph.D Part-Time Scholars Tracking ---');
  const res4 = await fetch('http://localhost:3000/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: '251PT01001',
      mobile: '9848012345',
      portal: 'part-time-phd-tracking'
    })
  });
  const data4 = await res4.json();
  console.log('Result 4 (Ph.D Part-Time Send OTP):', data4);
  if (!data4.success || !data4.devOtp) throw new Error('Failed to generate OTP for Ph.D Part-Time');

  const res4v = await fetch('http://localhost:3000/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: '251PT01001',
      mobile: '9848012345',
      portal: 'part-time-phd-tracking',
      otp: data4.devOtp
    })
  });
  const data4v = await res4v.json();
  console.log('Result 4 (Ph.D Part-Time Verify OTP):', data4v);
  if (!data4v.success || !data4v.token || !data4v.profile) throw new Error('Failed to verify OTP for Ph.D Part-Time');

  // 5. Database scholar profile validation check
  console.log('\n--- 5. Testing Scholar Registration Validation (Invalid ID Rejection) ---');
  const res5 = await fetch('http://localhost:3000/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      empId: 'INVALID999',
      mobile: '9848012345',
      portal: 'phd-tracking'
    })
  });
  const data5 = await res5.json();
  console.log('Result 5 (Invalid Reg Rejection): Status', res5.status, data5);
  if (res5.status !== 404 || data5.success) throw new Error('Should have rejected non-existent scholar');

  console.log('\n=================================================================');
  console.log('  ALL 4 APPLICATIONS MOBILE OTP GENERATION & VERIFICATION PASSED ');
  console.log('=================================================================');
}

testAllFourPortalsMobileOtp().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
