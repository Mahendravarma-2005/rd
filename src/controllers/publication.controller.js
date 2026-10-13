const PublicationService = require('../services/publication.service');

const PublicationController = {
  // Publications
  getAllPublications: async (req, res, next) => {
    try {
      const rows = await PublicationService.getAllPublications();
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  createPublication: async (req, res, next) => {
    try {
      const result = await PublicationService.createPublication(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  updatePublication: async (req, res, next) => {
    try {
      const result = await PublicationService.updatePublication(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  deletePublication: async (req, res, next) => {
    try {
      const result = await PublicationService.deletePublication(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // Reimbursements
  getAllReimbursements: async (req, res, next) => {
    try {
      const rows = await PublicationService.getAllReimbursements();
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  createReimbursement: async (req, res, next) => {
    try {
      const result = await PublicationService.createReimbursement(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  updateReimbursement: async (req, res, next) => {
    try {
      const result = await PublicationService.updateReimbursement(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  deleteReimbursement: async (req, res, next) => {
    try {
      const result = await PublicationService.deleteReimbursement(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PublicationController;
