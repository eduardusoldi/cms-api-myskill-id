import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { User } from '../models/user.model';
import Article from '../models/article.model';
import { AppError } from '../utils/appError';

export class ArticleController {
    static async createArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new AppError('Request body cannot be empty.', 400, 'EMPTY_BODY');
            }

            const { title, content, status } = req.body;
            const errors: string[] = [];

            if (!title || !String(title).trim()) errors.push('Title is required');
            if (!content || !String(content).trim()) errors.push('Content is required');
            if (!status || !['draft', 'published'].includes(status)) errors.push("Status must be either 'draft' or 'published'");

            if (errors.length > 0) {
                throw new AppError(errors.join('; '), 400, 'VALIDATION_ERROR');
            }

            const user = await User.findById(req.user?.id);
            if (!user) {
                throw new AppError('User not found', 404, 'USER_NOT_FOUND');
            }

            const article = await Article.create({
                title: String(title).trim(),
                content: String(content).trim(),
                status,
                author: {
                    id: user._id,
                    username: user.username,
                },
            });

            const { __v, ...articleData } = article.toObject();
            res.status(201).json(articleData);
        } catch (err) {
            next(err);
        }
    }

    static async getArticles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.user?.id
                ? {
                    $or: [
                        { status: 'published' },
                        { status: 'draft', 'author.id': req.user.id }
                    ]
                }
                : { status: 'published' };

            const articles = await Article.find(query).select('-__v');

            if (!articles.length) {
                throw new AppError('No articles found', 404, 'ARTICLES_EMPTY');
            }

            const cleanedArticles = articles.map(article => {
                const { id, ...authorWithoutId } = article.toObject().author || {};
                const { author, ...articleData } = article.toObject();
                return {
                    ...articleData,
                    author: authorWithoutId
                };
            });

            res.json(cleanedArticles);
        } catch (err) {
            next(err);
        }
    }



    static async getArticleById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const article = await Article.findById(req.params.id).select('-__v');

            if (!article) {
                throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
            }

            const isPublished = article.status === 'published';
            const isAuthor = req.user?.id === article.author?.id?.toString();

            if (isPublished || isAuthor) {
                const rawArticle = article.toObject();

                const { id, ...authorWithoutId } = rawArticle.author || {};
                const cleanedArticle = {
                    ...rawArticle,
                    author: authorWithoutId,
                };

                res.json(cleanedArticle);
            }

            throw new AppError('Forbidden: You are not allowed to access this article.', 403, 'FORBIDDEN_VIEW');
        } catch (err) {
            next(err);
        }
    }



    static async updateArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new AppError('Request body cannot be empty.', 400, 'EMPTY_BODY');
            }

            const article = await Article.findById(req.params.id);
            if (!article) {
                throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
            }

            if (article.author.toString() !== req.user?.id) {
                throw new AppError('You are not allowed to update this article.', 403, 'FORBIDDEN_UPDATE');
            }

            const { title, content, status } = req.body;
            const updateFields: Partial<typeof article> = {};

            if (typeof title === 'string' && title.trim()) updateFields.title = title.trim();
            if (typeof content === 'string' && content.trim()) updateFields.content = content.trim();

            if (status === 'published' || status === 'draft') {
                updateFields.status = status;
            } else if (status !== undefined) {
                throw new AppError('Status must be either "published" or "draft".', 400, 'VALIDATION_ERROR');
            }

            if (!Object.keys(updateFields).length) {
                throw new AppError('At least one of title, content, or status must be provided.', 400, 'VALIDATION_ERROR');
            }

            article.set(updateFields);
            await article.save();

            const updated = await Article.findById(article._id)
                .populate({ path: 'author', select: 'username -_id' })
                .select('-__v');

            res.json(updated);
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

            const isAuthor = article.author?.id?.toString() === req.user?.id;

            if (!isAuthor) {
                throw new AppError('You are not allowed to delete this article.', 403, 'FORBIDDEN_DELETE');
            }

            await article.deleteOne();
            res.status(200).json({ message: 'Article deleted successfully' });
        } catch (err) {
            next(err);
        }
    }

}
