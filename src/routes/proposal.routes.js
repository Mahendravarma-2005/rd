const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config/environment');
const ProposalController = require('../controllers/proposal.controller');

// Multer Storage Configuration for Proof Documents (Disk Drive)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(config.UPLOAD_DIR)) {
        fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
      }
      cb(null, config.UPLOAD_DIR);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `proof-${cleanBase}-${unique}${ext}`);
  }
});

const uploadProof = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|doc|docx|jpg|jpeg|png)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error('Only PDF, Word (.doc, .docx), and Image (.jpg, .png) files are allowed.'));
    }
    cb(null, true);
  }
});

// Proposals API
router.get(
  ['/api/proposals', '/project-pi/api/proposals'],
  ProposalController.getProposals
);

router.post(
  ['/api/proposals/upload-proof', '/project-pi/api/proposals/upload-proof'],
  uploadProof.single('proofFile'),
  ProposalController.uploadProof
);

router.post(
  ['/api/proposals', '/project-pi/api/proposals'],
  ProposalController.createProposal
);

router.put(
  ['/api/proposals/:id', '/project-pi/api/proposals/:id'],
  ProposalController.updateProposal
);

router.get(
  ['/api/proposals/:id/proof', '/project-pi/api/proposals/:id/proof'],
  ProposalController.getProposalProof
);

module.exports = router;
