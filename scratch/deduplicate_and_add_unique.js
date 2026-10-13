const db = require('../src/config/db');

async function run() {
  try {
    console.log('--- Cleaning up duplicate submissions in monthly_submissions ---');
    // 1. Find all duplicates
    const [dupes] = await db.query(`
      SELECT id, reg_no, current_month, created_at 
      FROM monthly_submissions 
      ORDER BY reg_no, current_month, created_at DESC
    `);
    
    const seen = new Set();
    const toDelete = [];
    
    for (const row of dupes) {
      const key = `${row.reg_no.trim().toLowerCase()}_${row.current_month}`;
      if (seen.has(key)) {
        toDelete.push(row.id);
      } else {
        seen.add(key);
      }
    }
    
    console.log(`Found ${toDelete.length} duplicate rows to delete:`, toDelete);
    for (const id of toDelete) {
      await db.query(`DELETE FROM monthly_submissions WHERE id = ?`, [id]);
    }
    console.log('Duplicates deleted successfully.');

    // 2. Check if unique index exists on monthly_submissions
    const [indexes] = await db.query(`SHOW INDEX FROM monthly_submissions WHERE Key_name = 'uq_scholar_month'`);
    if (indexes.length === 0) {
      console.log('Adding UNIQUE KEY uq_scholar_month (reg_no, current_month)...');
      await db.query(`ALTER TABLE monthly_submissions ADD UNIQUE KEY uq_scholar_month (reg_no, current_month)`);
      console.log('Unique key added on monthly_submissions.');
    } else {
      console.log('Unique key uq_scholar_month already exists.');
    }

    // 3. Check part_time_monthly_submissions
    const [ptIndexes] = await db.query(`SHOW INDEX FROM part_time_monthly_submissions WHERE Key_name = 'uq_pt_scholar_month'`);
    if (ptIndexes.length === 0) {
      console.log('Adding UNIQUE KEY uq_pt_scholar_month (reg_no, current_month)...');
      await db.query(`ALTER TABLE part_time_monthly_submissions ADD UNIQUE KEY uq_pt_scholar_month (reg_no, current_month)`);
      console.log('Unique key added on part_time_monthly_submissions.');
    } else {
      console.log('Unique key uq_pt_scholar_month already exists.');
    }

    console.log('--- Checking remaining rows in monthly_submissions ---');
    const [remaining] = await db.query(`SELECT id, reg_no, scholar_name, current_month, created_at FROM monthly_submissions`);
    console.log(remaining);

    process.exit(0);
  } catch (err) {
    console.error('Error running deduplication:', err);
    process.exit(1);
  }
}

run();
