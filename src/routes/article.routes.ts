import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { optionalAuth } from '../middlewares/optionalAuth.middleware';
import { ArticleController } from '../controllers/article.controller';

const router = express.Router();

router.get('/', optionalAuth, ArticleController.getArticles);
router.get('/:id', optionalAuth, ArticleController.getArticleById);

router.use(authenticate);

router.post('/', ArticleController.createArticle);
router.put('/:id', ArticleController.updateArticle);
router.delete('/:id', ArticleController.deleteArticle);

export default router;
