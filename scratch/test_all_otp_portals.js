const http = require('http');

function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(resData) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: resData });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 RUNNING UNIVERSITY OUTLOOK OTP VERIFICATION TEST SUITE\n');

  const portals = [
    { portal: 'guideship', empId: '3067', email: 'guideship.test@vignan.ac.in', name: 'Guideship Allotment System' },
    { portal: 'project-pi', empId: '01251', email: 'faculty.pi@vignan.ac.in', name: 'Project Proposals Management (ProjectPi)' },
    { portal: 'phd-tracking', empId: '251BG37001', email: '251bg37001@vignan.ac.in', name: 'Ph.D Full-Time Scholars Tracking' }
  ];

  for (const p of portals) {
    console.log(`--- Testing Portal: ${p.name} (${p.portal}) ---`);

    // 1. Test Send OTP
    const sendRes = await postJson('/api/auth/otp/send', {
      empId: p.empId,
      email: p.email,
      portal: p.portal
    });

    console.log(`[Send OTP] Status: ${sendRes.status}, Success: ${sendRes.body?.success}`);
    if (!sendRes.body?.success || !sendRes.body?.devOtp) {
      console.error('❌ Send OTP failed:', sendRes);
      continue;
    }
    console.log(`✅ Generated OTP Code: ${sendRes.body.devOtp}`);

    // 2. Test Invalid OTP
    const failRes = await postJson('/api/auth/otp/verify', {
      empId: p.empId,
      email: p.email,
      portal: p.portal,
      otp: '000000'
    });
    console.log(`[Verify Invalid OTP] Status: ${failRes.status} (Expected 400), Message: "${failRes.body?.message}"`);

    // 3. Test Valid OTP
    const passRes = await postJson('/api/auth/otp/verify', {
      empId: p.empId,
      email: p.email,
      portal: p.portal,
      otp: sendRes.body.devOtp
    });
    console.log(`[Verify Valid OTP] Status: ${passRes.status} (Expected 200), Success: ${passRes.body?.success}`);
    if (passRes.body?.token) {
      console.log(`✅ JWT Issued for ${passRes.body?.user?.empId} (${passRes.body?.user?.email})`);
    } else {
      console.error('❌ Valid OTP verification failed:', passRes);
    }
    console.log('');
  }

  // 4. Test unauthorized domain rejection
  console.log('--- Testing Unauthorized Email Domain Rejection ---');
  const rejectRes = await postJson('/api/auth/otp/send', {
    empId: '9999',
    email: 'hacker@gmail.com',
    portal: 'project-pi'
  });
  console.log(`[Reject Non-University Email] Status: ${rejectRes.status} (Expected 400), Message: "${rejectRes.body?.message}"`);

  console.log('\n🎉 ALL PORTAL OTP VERIFICATION TESTS COMPLETED!');
}

runTests().catch(console.error);
