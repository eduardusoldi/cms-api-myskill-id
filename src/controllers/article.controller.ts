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
            if (!article) return next(new AppError('Article not found', 404));

            const isAuthor = article.author.toString() === req.user?.id;


            if (article.status === 'published' || isAuthor) {
                res.json(article);
            } else {
                throw new AppError('Forbidden', 403);
            }
        } catch (err) {
            next(err);
        }
    }

    static async updateArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return next(new AppError('Article not found', 404));

            if (article.author.toString() !== req.user?.id) {
                throw new AppError('Unauthorized', 403);
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
            if (!article) return next(new AppError('Article not found', 404));

            if (article.author.toString() !== req.user?.id) {
                throw new AppError('Unauthorized', 403);
            }

            await article.deleteOne();
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}
