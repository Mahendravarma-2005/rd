const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const ejs = require('ejs');
const config = require('./config/environment');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const GuideshipModel = require('./models/guideship.model');

const app = express();

// 1. Core Parsers & Security
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Session Middleware (Guideship Dean / Admin Authentication)
app.use(session({
  name: 'vignan_rd_sid',
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

// 3. Configure EJS View Engine for Guideship HTML Templates
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '..', 'guideship_front_end', 'views'));

// 4. Global Template Context (res.locals)
app.use(async (req, res, next) => {
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
  res.locals.admin = req.session.admin;
  if (!req.path.includes('.')) {
    try {
      res.locals.pendingProposalsCount = await GuideshipModel.getPendingCount();
    } catch (e) {
      res.locals.pendingProposalsCount = 0;
    }
  } else {
    res.locals.pendingProposalsCount = 0;
  }
  next();
});

// 5. Static Asset Mounts
// Guideship Assets (CSS, Logos, Images)
app.use('/guideship-assets', express.static(path.join(__dirname, '..', 'guideship_front_end', 'public')));

// Student Publication Tracker (SPA + CSS + JS + Assets)
app.use('/student-publication/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));
app.use('/student-publication', express.static(path.join(__dirname, '..', 'student publication')));
app.get('/student-publication', (req, res) => res.redirect('/student-publication/'));
app.get('/student-publication/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'student publication', 'index.html'));
});

// ProjectPi Proposals App (SPA + CSS + JS + Images)
app.use('/project-pi', express.static(path.join(__dirname, '..', 'ProjectPi', 'public')));
app.get('/project-pi', (req, res) => res.redirect('/project-pi/'));
app.get('/project-pi/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'ProjectPi', 'public', 'index.html'));
});

// PhD Full-Time Scholar Tracking App (SPA + CSS + JS + Datasets)
app.use('/phd-tracking', express.static(path.join(__dirname, '..', 'PHD Scholar Tracking')));
app.get('/phd-tracking', (req, res) => res.redirect('/phd-tracking/'));
app.get('/phd-tracking/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'PHD Scholar Tracking', 'index.html'));
});
app.use('/phd-scholar-tracking', express.static(path.join(__dirname, '..', 'PHD Scholar Tracking')));
app.get('/phd-scholar-tracking', (req, res) => res.redirect('/phd-tracking/'));

// Central Front Landing Page (Root /)
app.use(express.static(path.join(__dirname, '..', 'fornt_landing_page')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'fornt_landing_page', 'index.html'));
});

// 6. Application Routes
app.use(routes);

// 7. Error Interceptors
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
