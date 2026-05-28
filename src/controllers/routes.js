import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { Router } from 'express';

const router = Router();

router.use('/about', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/about.css">');
  next();
});

router.use('/catalog', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

router.use('/faculty', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

router.use('/contact', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
  next();
});

router.use('/register', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
  next();
});

router.use('/login', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/login.css">');
  next();
});

router.use('/dashboard', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/login.css">');
  next();
});

router.get('/', homePage);
router.get('/about', aboutPage);

router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

router.get('/demo', addDemoHeaders, demoPage);

// Displays a 500 error page. In development mode, stack trace is displayed
// on this page
router.get('/test-error', testErrorPage);

router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

router.use('/contact', contactRoutes);

router.use('/register', registrationRoutes);

router.use('/login', loginRoutes);

export default router;
