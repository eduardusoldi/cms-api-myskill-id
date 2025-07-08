import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import Article from '../models/article.model';
import { AppError } from '../utils/appError';

export class ArticleController {
  static async getPublishedArticles(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const articles = await Article.find({ status: 'published' }).populate('author', 'username');
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  static async createArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, content, status } = req.body;

      if (!title || !content || !status) {
        throw new AppError('Title, content, and status are required.', 400, 'VALIDATION_ERROR');
      }

      const article = await Article.create({
        title,
        content,
        status,
        author: req.user?.id,
      });

      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  static async getUserDrafts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const drafts = await Article.find({ author: req.user?.id, status: 'draft' });
      res.json(drafts);
    } catch (err) {
      next(err);
    }
  }

  static async getArticleById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await Article.findById(req.params.id).populate('author', 'username');

      if (!article) {
        throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
      }

      const isAuthor = article.author.toString() === req.user?.id;

      if (article.status === 'published' || isAuthor) {
        res.json(article);
      } else {
        throw new AppError('Forbidden: You are not allowed to access this article.', 403, 'FORBIDDEN_VIEW');
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
      }

      if (article.author.toString() !== req.user?.id) {
        throw new AppError('You are not allowed to update this article.', 403, 'FORBIDDEN_UPDATE');
      }

      article.set(req.body);
      await article.save();
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  static async deleteArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
      }

      if (article.author.toString() !== req.user?.id) {
        throw new AppError('You are not allowed to delete this article.', 403, 'FORBIDDEN_DELETE');
      }

      await article.deleteOne();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
