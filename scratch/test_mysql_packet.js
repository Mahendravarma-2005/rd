require('dotenv').config();
const db = require('../src/config/db');

async function testLargePayload() {
  const [rows] = await db.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
  console.log('max_allowed_packet:', rows);

  // 1.77 MB PNG converted to base64 is ~ 2.4MB
  const fakeBase64 = 'data:image/png;base64,' + 'A'.repeat(2.4 * 1024 * 1024);
  console.log('Payload size:', fakeBase64.length, 'bytes');

  try {
    const [result] = await db.query(
      'INSERT INTO proposals (emp_code, pi_name, pi_phone, title, tracking_number, duration, funding_type, funding_agency, project_scheme, proposed_amount, status, proof_file_name, proof_file_type, proof_file_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['01251', 'DR. DONDETI. VENKATESULU', '9845321045', 'Test Large', 'TEST-' + Date.now(), '1 Year', 'Government', 'DST', 'Scheme', '10.00', 'submitted', 'test.png', 'image/png', fakeBase64]
    );
    console.log('Insert succeeded! Insert ID:', result.insertId);
  } catch (err) {
    console.error('Insert error code:', err.code);
    console.error('Insert error errno:', err.errno);
    console.error('Insert error message:', err.message);
  }

  process.exit(0);
}

testLargePayload().catch(console.error);
