const express = require('express');
const router = express.Router();
const PhdController = require('../controllers/phd.controller');

// 1. Monthly Submissions (GET all & POST new)
router.get(
  ['/api/scholars', '/phd-tracking/api/scholars', '/phd-scholar-tracking/api/scholars'],
  PhdController.getAllSubmissions
);

router.post(
  ['/api/scholars', '/phd-tracking/api/scholars', '/phd-scholar-tracking/api/scholars'],
  PhdController.saveSubmission
);

// 1b. Scholar Submissions History (GET for specific scholar)
router.get(
  [
    '/api/scholar-submissions/:regNo',
    '/api/scholars/history/:regNo',
    '/phd-tracking/api/scholar-submissions/:regNo',
    '/phd-tracking/api/scholars/history/:regNo',
    '/phd-scholar-tracking/api/scholar-submissions/:regNo',
    '/phd-scholar-tracking/api/scholars/history/:regNo'
  ],
  PhdController.getScholarSubmissions
);

// 2. Delete Submission (DELETE)
router.delete(
  ['/api/scholars/:id', '/phd-tracking/api/scholars/:id', '/phd-scholar-tracking/api/scholars/:id'],
  PhdController.deleteSubmission
);

// 3. Scholar Profile Lookup by Reg No (GET)
router.get(
  ['/api/profile/:regNo', '/phd-tracking/api/profile/:regNo', '/phd-scholar-tracking/api/profile/:regNo'],
  PhdController.getProfile
);

// 4. Master Scholar Profiles List (GET)
router.get(
  ['/api/profiles', '/phd-tracking/api/profiles', '/phd-scholar-tracking/api/profiles'],
  PhdController.getAllProfiles
);

// 5. Admin Login Authentication (POST)
router.post(
  ['/api/admin/login', '/phd-tracking/api/admin/login', '/phd-scholar-tracking/api/admin/login'],
  PhdController.adminLogin
);

module.exports = router;
