import express from 'express';
import { PageViewController } from '../controllers/pageView.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', PageViewController.trackView);
router.get('/count', authenticate, PageViewController.getCount);
router.get('/aggregate-date', authenticate, PageViewController.getAggregatedPageViews);

export default router;
