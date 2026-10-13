const jwt = require('jsonwebtoken');
const config = require('../config/environment');

/**
 * JWT Authentication Middleware for Student Publication Tracker & ProjectPi
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err || !decoded || decoded.bootId !== config.SERVER_INSTANCE_ID) {
        return res.status(401).json({ 
          message: 'Unauthorized: Session terminated because the server restarted. Please log in again.',
          serverRestarted: true 
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized: Missing token.' });
  }
};

/**
 * Optional JWT Authentication Middleware
 */
const optionalAuthenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (!err && decoded && decoded.bootId === config.SERVER_INSTANCE_ID) {
        req.user = decoded;
      }
      next();
    });
  } else {
    next();
  }
};

/**
 * Admin Session Guard for Guideship (Direct Access - No Login Required)
 */
function requireGuideshipAdmin(req, res, next) {
  if (!req.session) {
    req.session = {};
  }
  if (!req.session.admin) {
    req.session.admin = {
      id: 1001,
      employee_id: 1001,
      name: 'Dr. Rajesh K. Sharma',
      role: 'Dean R&D',
      email: 'dean.rd@vignan.ac.in'
    };
    req.session.bootId = config.SERVER_INSTANCE_ID;
  }
  next();
}

module.exports = {
  authenticateJWT,
  optionalAuthenticateJWT,
  requireGuideshipAdmin
};
