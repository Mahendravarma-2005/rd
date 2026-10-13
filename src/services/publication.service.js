const crypto = require('crypto');
const PublicationModel = require('../models/publication.model');

const PublicationService = {
  getAllPublications: async () => {
    return await PublicationModel.getAllPublications();
  },

  createPublication: async (pubData) => {
    const data = { ...pubData };
    data.id = data.id || crypto.randomUUID();
    data.funding_amount = parseFloat(data.funding_amount) || 0;
    await PublicationModel.createPublication(data);
    return [data];
  },

  updatePublication: async (id, pubData) => {
    const data = { ...pubData };
    delete data.id;
    delete data.created_at;
    if (data.funding_amount !== undefined) {
      data.funding_amount = parseFloat(data.funding_amount) || 0;
    }
    return await PublicationModel.updatePublication(id, data);
  },

  deletePublication: async (id) => {
    return await PublicationModel.deletePublication(id);
  },

  getAllReimbursements: async () => {
    return await PublicationModel.getAllReimbursements();
  },

  createReimbursement: async (claimData) => {
    const data = { ...claimData };
    data.fee_paid = parseFloat(data.fee_paid) || 0;
    data.status = data.status || 'Submitted';

    const year = new Date().getFullYear();
    const yearPrefix = `${year}-`;
    const lastId = await PublicationModel.getLastReimbursementSeq(yearPrefix);

    let nextNum = 1;
    if (lastId) {
      const parts = lastId.split('-');
      const lastNum = parseInt(parts[1], 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }

    data.id = `${year}-${String(nextNum).padStart(5, '0')}`;
    await PublicationModel.createReimbursement(data);
    return data;
  },

  updateReimbursement: async (id, claimData) => {
    const data = { ...claimData };
    delete data.id;
    delete data.created_at;
    if (data.fee_paid !== undefined) {
      data.fee_paid = parseFloat(data.fee_paid) || 0;
    }
    if (data.updated_at) {
      data.updated_at = new Date(data.updated_at).toISOString().slice(0, 19).replace('T', ' ');
    }
    return await PublicationModel.updateReimbursement(id, data);
  },

  deleteReimbursement: async (id) => {
    return await PublicationModel.deleteReimbursement(id);
  }
};

module.exports = PublicationService;
