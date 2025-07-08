import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { ArticleController } from '../controllers/article.controller';

const router = express.Router();

// Public: Get all published articles
router.get('/published', ArticleController.getPublishedArticles);

// Protected routes
router.use(authenticate);

// Create article
router.post('/', ArticleController.createArticle);

// Get drafts
router.get('/drafts', ArticleController.getUserDrafts);

// Get one article
router.get('/:id', ArticleController.getArticleById);

// Update article
router.put('/:id', ArticleController.updateArticle);

// Delete article
router.delete('/:id', ArticleController.deleteArticle);

export default router;
