import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import articleRoutes from './article.routes';
import pageViewRoutes from './pageView.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/page-view', pageViewRoutes)

export default router;
