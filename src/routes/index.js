const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const publicationRoutes = require('./publication.routes');
const proposalRoutes = require('./proposal.routes');
const guideshipRoutes = require('./guideship.routes');
const phdRoutes = require('./phd.routes');

router.use(authRoutes);
router.use(publicationRoutes);
router.use(proposalRoutes);
router.use(guideshipRoutes);
router.use(phdRoutes);

module.exports = router;
