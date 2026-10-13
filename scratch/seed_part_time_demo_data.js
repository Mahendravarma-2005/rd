const db = require('../src/config/db');

async function seedPartTimeDemoData() {
  console.log('--- Seeding Part-Time PhD Scholars Tracking Demo Data ---');

  // 1. Seed Master Profiles
  const profiles = [
    {
      reg_no: '251PT01001',
      scholar_name: 'Dr. / Mr. V. Ramesh Kumar',
      guide_name: 'Dr. K. Phani Kumar',
      department: 'CSE',
      ra_type: 'Industry',
      bank_account_no: '50100438921102',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2024-07-31',
      end_of_ra: '2027-07-30',
      scholar_contact: '9848012345',
      supervisor_contact: '9440154321',
      courses_completed: 4
    },
    {
      reg_no: '241PT04005',
      scholar_name: 'Ms. K. Srilatha',
      guide_name: 'Dr. Jyosthna Devi Bodapati',
      department: 'ACSE',
      ra_type: 'Academic',
      bank_account_no: '620458912345',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2024-09-04',
      end_of_ra: '2027-09-03',
      scholar_contact: '9876543210',
      supervisor_contact: '9849123456',
      courses_completed: 3
    },
    {
      reg_no: '231PT06012',
      scholar_name: 'Mr. P. Srinivasa Rao',
      guide_name: 'Dr. N. Usha Rani',
      department: 'ECE',
      ra_type: 'Industry',
      bank_account_no: '301204589210',
      bank_name: 'Union Bank of India',
      ifsc_code: 'UBIN0530123',
      date_of_joining: '2023-08-15',
      end_of_ra: '2026-08-14',
      scholar_contact: '9988776655',
      supervisor_contact: '9440234567',
      courses_completed: 4
    },
    {
      reg_no: '251PT08003',
      scholar_name: 'Mr. M. Venkat Reddy',
      guide_name: 'Dr. Sanjay Kumar Gupta',
      department: 'Mechanical',
      ra_type: 'Industry',
      bank_account_no: '401204981234',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2025-07-10',
      end_of_ra: '2028-07-09',
      scholar_contact: '9177994914',
      supervisor_contact: '9876543210',
      courses_completed: 2
    },
    {
      reg_no: '241PT12002',
      scholar_name: 'Ms. Ch. Hymavathi Devi',
      guide_name: 'Dr. K. Kalpana',
      department: 'MBA',
      ra_type: 'Academic',
      bank_account_no: '501234567890',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2024-08-01',
      end_of_ra: '2027-07-31',
      scholar_contact: '9652794187',
      supervisor_contact: '9988112233',
      courses_completed: 4
    },
    {
      reg_no: '251PT36001',
      scholar_name: 'Mr. B. Koteswara Rao',
      guide_name: 'Dr. M. Sabareesh',
      department: 'Pharmacy',
      ra_type: 'Industry',
      bank_account_no: '50100438921105',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2025-04-07',
      end_of_ra: '2028-04-06',
      scholar_contact: '9948399412',
      supervisor_contact: '9876501234',
      courses_completed: 3
    },
    {
      reg_no: '231PT01004',
      scholar_name: 'Mrs. T. Lakshmi Prasanna',
      guide_name: 'Dr. S. Anil Kumar',
      department: 'Bio-Tech',
      ra_type: 'Academic',
      bank_account_no: '30100438921109',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2023-07-08',
      end_of_ra: '2026-07-07',
      scholar_contact: '9846342281',
      supervisor_contact: '9440556677',
      courses_completed: 4
    },
    {
      reg_no: '241PT03001',
      scholar_name: 'Mr. G. Ravindra Babu',
      guide_name: 'Dr. P. Sundara Kumar',
      department: 'Civil',
      ra_type: 'Industry',
      bank_account_no: '50100438921111',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2024-08-01',
      end_of_ra: '2027-07-31',
      scholar_contact: '9346299591',
      supervisor_contact: '9848554433',
      courses_completed: 4
    }
  ];

  for (const p of profiles) {
    await db.query(`
      INSERT INTO part_time_scholar_profiles
      (reg_no, scholar_name, guide_name, department, ra_type, bank_account_no, bank_name, ifsc_code, date_of_joining, end_of_ra, scholar_contact, supervisor_contact, courses_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        scholar_name = VALUES(scholar_name),
        guide_name = VALUES(guide_name),
        department = VALUES(department),
        ra_type = VALUES(ra_type),
        bank_account_no = VALUES(bank_account_no),
        bank_name = VALUES(bank_name),
        ifsc_code = VALUES(ifsc_code),
        date_of_joining = VALUES(date_of_joining),
        end_of_ra = VALUES(end_of_ra),
        scholar_contact = VALUES(scholar_contact),
        supervisor_contact = VALUES(supervisor_contact),
        courses_completed = VALUES(courses_completed)
    `, [
      p.reg_no, p.scholar_name, p.guide_name, p.department, p.ra_type,
      p.bank_account_no, p.bank_name, p.ifsc_code, p.date_of_joining,
      p.end_of_ra, p.scholar_contact, p.supervisor_contact, p.courses_completed
    ]);
  }
  console.log(`✅ Seeded ${profiles.length} master scholar profiles.`);

  // 2. Seed Monthly Submissions & Child Tables
  const submissions = [
    {
      id: 'pt_sub_251PT01001_2026_08',
      reg_no: '251PT01001',
      scholar_name: 'Dr. / Mr. V. Ramesh Kumar',
      guide_name: 'Dr. K. Phani Kumar',
      department: 'CSE',
      ra_type: 'Industry',
      bank_account_no: '50100438921102',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2024-07-31',
      end_of_ra: '2027-07-30',
      scholar_contact: '9848012345',
      supervisor_contact: '9440154321',
      current_month: '2026-08',
      forget_thumbs: 0,
      courses_completed: 2,
      leaves_taken: 0,
      avg_spent_stayed: '84 hrs (Part-time scheduled lab hours)',
      academic_load: 'Research formulation, dataset collection & Literature Review on Graph Neural Networks',
      created_at: '2026-08-31 16:30:00',
      courses: [
        { course_code: '22CS501', course_name: 'Research Methodology & IPR', course_type: 'Internal', credits: '4', formative_marks: '38', summative_marks: '44', grade: '82 (Pass)', cgpa: '82', result: 'Pass', completion_date: '2025-06-15' },
        { course_code: 'NOC25CS12', course_name: 'Deep Learning for Computer Vision', course_type: 'NPTEL', credits: '3', formative_marks: '28', summative_marks: '42', grade: '70 (Pass)', cgpa: '70', result: 'Pass', completion_date: '2026-05-20' }
      ],
      journals: [
        { title: 'A Comprehensive Survey on Edge AI in Smart Healthcare', journal_name: 'IEEE Access', status: 'Accepted', status_date: '2026-08-15' }
      ],
      conferences: [
        { title: 'Distributed Graph Representation Learning in Constrained Environments', conference_name: 'IEEE INDICON 2026', status: 'Accepted', status_date: '2026-08-10' }
      ],
      fdps: [
        { name: 'Hands-on Workshop on Generative AI and Large Language Models', organizer: 'IIT Madras', category: 'Workshop', event_date: '2026-08-12' }
      ],
      dcs: [
        { dc_name: '1', last_dc_date: '2026-08-20', regulation: 'R22', rating: '10', recommendations: 'In Progress', comments: 'Coursework completed successfully. Research framework approved to proceed with experimental benchmarking.' }
      ]
    },
    {
      id: 'pt_sub_241PT04005_2026_08',
      reg_no: '241PT04005',
      scholar_name: 'Ms. K. Srilatha',
      guide_name: 'Dr. Jyosthna Devi Bodapati',
      department: 'ACSE',
      ra_type: 'Academic',
      bank_account_no: '620458912345',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2024-09-04',
      end_of_ra: '2027-09-03',
      scholar_contact: '9876543210',
      supervisor_contact: '9849123456',
      current_month: '2026-08',
      forget_thumbs: 0,
      courses_completed: 2,
      leaves_taken: 1,
      avg_spent_stayed: '90 hrs',
      academic_load: 'Algorithmic optimization and comparative model evaluation for multimodal transformer models',
      created_at: '2026-08-30 14:15:00',
      courses: [
        { course_code: '22CS502', course_name: 'Advanced Machine Learning', course_type: 'Internal', credits: '4', formative_marks: '36', summative_marks: '46', grade: '82 (Pass)', cgpa: '82', result: 'Pass', completion_date: '2025-05-18' },
        { course_code: 'NOC25CS44', course_name: 'Python for Data Science', course_type: 'NPTEL', credits: '3', formative_marks: '26', summative_marks: '40', grade: '66 (Pass)', cgpa: '66', result: 'Pass', completion_date: '2026-04-10' }
      ],
      journals: [
        { title: 'Hybrid Transformer Architectures for Multimodal Fusion', journal_name: 'Elsevier Knowledge-Based Systems', status: 'Under Review', status_date: '2026-08-05' }
      ],
      conferences: [],
      fdps: [
        { name: 'Advanced Deep Learning Seminar', organizer: 'NIT Warangal', category: 'Seminar', event_date: '2026-08-14' }
      ],
      dcs: [
        { dc_name: '2', last_dc_date: '2026-08-18', regulation: 'R22', rating: '11', recommendations: 'Pre-synopsis', comments: 'Significant experimental progress noted. Recommended to begin drafting pre-synopsis documentation.' }
      ]
    },
    {
      id: 'pt_sub_231PT06012_2026_08',
      reg_no: '231PT06012',
      scholar_name: 'Mr. P. Srinivasa Rao',
      guide_name: 'Dr. N. Usha Rani',
      department: 'ECE',
      ra_type: 'Industry',
      bank_account_no: '301204589210',
      bank_name: 'Union Bank of India',
      ifsc_code: 'UBIN0530123',
      date_of_joining: '2023-08-15',
      end_of_ra: '2026-08-14',
      scholar_contact: '9988776655',
      supervisor_contact: '9440234567',
      current_month: '2026-08',
      forget_thumbs: 0,
      courses_completed: 1,
      leaves_taken: 0,
      avg_spent_stayed: '95 hrs',
      academic_load: 'Drafting final synopsis, journal proofs submission and pre-thesis presentation preparation',
      created_at: '2026-08-28 11:00:00',
      courses: [
        { course_code: '22EC601', course_name: 'VLSI Signal Processing', course_type: 'Internal', credits: '4', formative_marks: '37', summative_marks: '48', grade: '85 (Pass)', cgpa: '85', result: 'Pass', completion_date: '2024-06-20' }
      ],
      journals: [
        { title: 'Low Power High-Speed VLSI Architectures for DSP Applications', journal_name: 'Springer Circuits, Systems, and Signal Processing', status: 'Accepted', status_date: '2026-07-25' }
      ],
      conferences: [
        { title: 'FPGA Prototyping of Reconfigurable Signal Processors', conference_name: 'IEEE VLSI-DCS 2026', status: 'Accepted', status_date: '2026-06-15' }
      ],
      fdps: [],
      dcs: [
        { dc_name: '3', last_dc_date: '2026-08-14', regulation: 'R22', rating: '12', recommendations: 'Synopsis', comments: 'Doctoral Committee completed final review. Granted clearance for formal submission of synopsis.' }
      ]
    },
    {
      id: 'pt_sub_251PT08003_2026_07',
      reg_no: '251PT08003',
      scholar_name: 'Mr. M. Venkat Reddy',
      guide_name: 'Dr. Sanjay Kumar Gupta',
      department: 'Mechanical',
      ra_type: 'Industry',
      bank_account_no: '401204981234',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2025-07-10',
      end_of_ra: '2028-07-09',
      scholar_contact: '9177994914',
      supervisor_contact: '9876543210',
      current_month: '2026-07',
      forget_thumbs: 1,
      courses_completed: 1,
      leaves_taken: 0,
      avg_spent_stayed: '78 hrs',
      academic_load: 'Finite Element Analysis on composite materials and specimen preparation in CAD/CAM laboratory',
      created_at: '2026-07-31 17:45:00',
      courses: [
        { course_code: '25ME501', course_name: 'Advanced Finite Element Methods', course_type: 'Internal', credits: '4', formative_marks: '34', summative_marks: '41', grade: '75 (Pass)', cgpa: '75', result: 'Pass', completion_date: '2026-06-10' }
      ],
      journals: [
        { title: 'Structural Analysis and Characterization of Hybrid Bio-composites', journal_name: 'Springer Mechanics of Advanced Materials', status: 'Communicated', status_date: '2026-07-15' }
      ],
      conferences: [],
      fdps: [
        { name: 'Composite Fabrication and Testing Symposium', organizer: 'VFSTR Mech Dept', category: 'Workshop', event_date: '2026-07-08' }
      ],
      dcs: [
        { dc_name: '1', last_dc_date: '2026-07-22', regulation: 'R25', rating: '9', recommendations: 'In Progress', comments: 'Recommended adding tensile and impact test analysis before next review meeting.' }
      ]
    },
    {
      id: 'pt_sub_241PT12002_2026_08',
      reg_no: '241PT12002',
      scholar_name: 'Ms. Ch. Hymavathi Devi',
      guide_name: 'Dr. K. Kalpana',
      department: 'MBA',
      ra_type: 'Academic',
      bank_account_no: '501234567890',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0001234',
      date_of_joining: '2024-08-01',
      end_of_ra: '2027-07-31',
      scholar_contact: '9652794187',
      supervisor_contact: '9988112233',
      current_month: '2026-08',
      forget_thumbs: 0,
      courses_completed: 1,
      leaves_taken: 0,
      avg_spent_stayed: '88 hrs',
      academic_load: 'Empirical survey analysis of strategic organizational leadership in manufacturing MSMEs',
      created_at: '2026-08-29 15:20:00',
      courses: [
        { course_code: '24MB501', course_name: 'Quantitative Research Techniques in Management', course_type: 'Internal', credits: '4', formative_marks: '35', summative_marks: '45', grade: '80 (Pass)', cgpa: '80', result: 'Pass', completion_date: '2025-07-15' }
      ],
      journals: [],
      conferences: [
        { title: 'Impact of Digital Transformation on Supply Chain Leadership', conference_name: 'AIM International Conference 2026', status: 'Accepted', status_date: '2026-08-12' }
      ],
      fdps: [
        { name: 'National Workshop on Qualitative Research & Structural Equation Modeling', organizer: 'IIM Bangalore', category: 'Workshop', event_date: '2026-08-05' }
      ],
      dcs: [
        { dc_name: '2', last_dc_date: '2026-08-25', regulation: 'R22', rating: '10', recommendations: 'Pre-thesis colloquium', comments: 'Statistical validation and hypothesis testing framework approved.' }
      ]
    }
  ];

  for (const sub of submissions) {
    await db.query(`
      INSERT INTO part_time_monthly_submissions
      (id, reg_no, scholar_name, guide_name, department, ra_type, bank_account_no, bank_name, ifsc_code, date_of_joining, end_of_ra, scholar_contact, supervisor_contact, current_month, forget_thumbs, courses_completed, leaves_taken, avg_spent_stayed, academic_load, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        scholar_name = VALUES(scholar_name),
        guide_name = VALUES(guide_name),
        department = VALUES(department),
        avg_spent_stayed = VALUES(avg_spent_stayed),
        academic_load = VALUES(academic_load)
    `, [
      sub.id, sub.reg_no, sub.scholar_name, sub.guide_name, sub.department,
      sub.ra_type, sub.bank_account_no, sub.bank_name, sub.ifsc_code,
      sub.date_of_joining, sub.end_of_ra, sub.scholar_contact, sub.supervisor_contact,
      sub.current_month, sub.forget_thumbs, sub.courses_completed, sub.leaves_taken,
      sub.avg_spent_stayed, sub.academic_load, sub.created_at
    ]);

    // Clean existing child records for this submission
    await db.query('DELETE FROM part_time_courses_completed_details WHERE submission_id = ?', [sub.id]);
    await db.query('DELETE FROM part_time_journal_papers WHERE submission_id = ?', [sub.id]);
    await db.query('DELETE FROM part_time_conference_papers WHERE submission_id = ?', [sub.id]);
    await db.query('DELETE FROM part_time_fdps_attended WHERE submission_id = ?', [sub.id]);
    await db.query('DELETE FROM part_time_dc_meetings_attended WHERE submission_id = ?', [sub.id]);

    // Insert courses
    for (const c of sub.courses) {
      await db.query(`
        INSERT INTO part_time_courses_completed_details
        (submission_id, course_code, course_name, course_type, credits, formative_marks, summative_marks, grade, cgpa, result, completion_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [sub.id, c.course_code, c.course_name, c.course_type, c.credits, c.formative_marks, c.summative_marks, c.grade, c.cgpa, c.result, c.completion_date]);
    }

    // Insert journals
    for (const j of sub.journals) {
      await db.query(`
        INSERT INTO part_time_journal_papers
        (submission_id, title, journal_name, status, status_date)
        VALUES (?, ?, ?, ?, ?)
      `, [sub.id, j.title, j.journal_name, j.status, j.status_date]);
    }

    // Insert conferences
    for (const conf of sub.conferences) {
      await db.query(`
        INSERT INTO part_time_conference_papers
        (submission_id, title, conference_name, status, status_date)
        VALUES (?, ?, ?, ?, ?)
      `, [sub.id, conf.title, conf.conference_name, conf.status, conf.status_date]);
    }

    // Insert FDPs
    for (const f of sub.fdps) {
      await db.query(`
        INSERT INTO part_time_fdps_attended
        (submission_id, name, organizer, category, event_date)
        VALUES (?, ?, ?, ?, ?)
      `, [sub.id, f.name, f.organizer, f.category, f.event_date]);
    }

    // Insert DC meetings
    for (const dc of sub.dcs) {
      await db.query(`
        INSERT INTO part_time_dc_meetings_attended
        (submission_id, scholar_id, dc_name, last_dc_date, comments, regulation, rating, recommendations)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [sub.id, sub.reg_no, dc.dc_name, dc.last_dc_date, dc.comments, dc.regulation, dc.rating, dc.recommendations]);
    }
  }

  console.log(`✅ Seeded ${submissions.length} monthly submissions with related courses, journals, conferences, FDPs, and DC meetings.`);
  console.log('--- Done Seeding Part-Time Demo Data ---');
  process.exit(0);
}

seedPartTimeDemoData().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
