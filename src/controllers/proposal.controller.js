const fs = require('fs');
const path = require('path');
const config = require('../config/environment');
const ProposalService = require('../services/proposal.service');

const ProposalController = {
  getProposals: async (req, res, next) => {
    try {
      const proposals = await ProposalService.getProposals(req.query);
      res.json(proposals);
    } catch (err) {
      next(err);
    }
  },

  uploadProof: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No proof file uploaded.' });
      }
      res.json({
        success: true,
        fileName: req.file.originalname,
        storedFileName: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        message: 'Proof file successfully uploaded and saved to drive storage.'
      });
    } catch (err) {
      next(err);
    }
  },

  createProposal: async (req, res, next) => {
    try {
      const result = await ProposalService.createProposal(req.body);
      res.status(201).json({ success: true, id: result.id, trackingNumber: result.trackingNumber });
    } catch (err) {
      next(err);
    }
  },

  updateProposal: async (req, res, next) => {
    try {
      const result = await ProposalService.updateProposal(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getProposalProof: async (req, res, next) => {
    try {
      const proposal = await ProposalService.getProposalProof(req.params.id);
      if (!proposal) {
        return res.status(404).send('Proof document not found for this proposal.');
      }
      
      const fileName = proposal.proof_file_name || `proposal-${req.params.id}-proof`;

      // 1. Check if file exists on disk drive
      if (proposal.proof_file_path && fs.existsSync(proposal.proof_file_path)) {
        if (proposal.proof_file_type) {
          res.setHeader('Content-Type', proposal.proof_file_type);
        }
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
        return res.sendFile(path.resolve(proposal.proof_file_path));
      }

      // Check if file is stored in current UPLOAD_DIR (e.g. C:\rd_uploads) by basename
      if (proposal.proof_file_path) {
        const storedBaseName = path.basename(proposal.proof_file_path);
        const uploadDirPath = path.join(config.UPLOAD_DIR, storedBaseName);
        if (fs.existsSync(uploadDirPath)) {
          if (proposal.proof_file_type) {
            res.setHeader('Content-Type', proposal.proof_file_type);
          }
          res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
          return res.sendFile(path.resolve(uploadDirPath));
        }
      }

      // Check if file is stored in UPLOAD_DIR by filename
      if (proposal.proof_file_name) {
        const potentialPath = path.join(config.UPLOAD_DIR, proposal.proof_file_name);
        if (fs.existsSync(potentialPath)) {
          if (proposal.proof_file_type) {
            res.setHeader('Content-Type', proposal.proof_file_type);
          }
          res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
          return res.sendFile(path.resolve(potentialPath));
        }
      }

      // 2. Fallback to legacy database base64 data if present
      if (proposal.proof_file_data) {
        const rawData = String(proposal.proof_file_data).trim();
        const mimeMatch = rawData.match(/^data:([^;]+);base64,(.+)$/);
        let buffer, mimeType;
        
        if (mimeMatch) {
          mimeType = mimeMatch[1] || proposal.proof_file_type || 'application/octet-stream';
          buffer = Buffer.from(mimeMatch[2], 'base64');
        } else {
          mimeType = proposal.proof_file_type || 'application/octet-stream';
          buffer = Buffer.from(rawData, 'base64');
        }
        
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
        return res.send(buffer);
      }

      return res.status(404).send('Proof document not found on drive storage.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ProposalController;
