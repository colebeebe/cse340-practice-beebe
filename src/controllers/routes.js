import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';

const router = Router();

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

export default router;
