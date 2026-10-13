const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/publication.controller');
const { authenticateJWT, optionalAuthenticateJWT } = require('../middlewares/auth.middleware');

// Publications CRUD
router.get(
  ['/api/publications', '/student-publication/api/publications'],
  optionalAuthenticateJWT,
  PublicationController.getAllPublications
);

router.post(
  ['/api/publications', '/student-publication/api/publications'],
  authenticateJWT,
  PublicationController.createPublication
);

router.put(
  ['/api/publications/:id', '/student-publication/api/publications/:id'],
  authenticateJWT,
  PublicationController.updatePublication
);

router.delete(
  ['/api/publications/:id', '/student-publication/api/publications/:id'],
  authenticateJWT,
  PublicationController.deletePublication
);

// Reimbursements CRUD
router.get(
  ['/api/reimbursements', '/student-publication/api/reimbursements'],
  PublicationController.getAllReimbursements
);

router.post(
  ['/api/reimbursements', '/student-publication/api/reimbursements'],
  PublicationController.createReimbursement
);

router.put(
  ['/api/reimbursements/:id', '/student-publication/api/reimbursements/:id'],
  PublicationController.updateReimbursement
);

router.delete(
  ['/api/reimbursements/:id', '/student-publication/api/reimbursements/:id'],
  authenticateJWT,
  PublicationController.deleteReimbursement
);

module.exports = router;
