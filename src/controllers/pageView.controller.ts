import { Request, Response, NextFunction } from 'express';
import PageView from '../models/pageView.model';
import Article from '../models/article.model'
import { AppError } from '../utils/appError';
import mongoose from 'mongoose';

export class PageViewController {
    static async trackView(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new AppError('Request body cannot be empty.', 400, 'EMPTY_BODY');
            }

            if (Object.keys(req.body).length !== 1) {
                throw new AppError('Request body contains unexpected fields.', 400, 'INVALID_BODY');
            }

            const { article } = req.body;

            if (!article) {
                throw new AppError('Article ID is required.', 400, 'VALIDATION_ERROR');
            }

            if (!mongoose.Types.ObjectId.isValid(article)) {
                throw new AppError('Invalid article ID', 400, 'INVALID_ARTICLE_ID');
            }

            // ✅ Check if the article exists
            const existingArticle = await Article.findById(article);
            if (!existingArticle) {
                throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
            }

            await PageView.create({ article });

            res.status(201).json({ message: 'Page view recorded' });
        } catch (err) {
            next(err);
        }
    }

    static async getCount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { article, startAt, endAt } = req.query;

            const filter: any = {};

            if (article && mongoose.Types.ObjectId.isValid(String(article))) {
                filter.article = article;
            }

            if (startAt || endAt) {
                filter.createdAt = {};
                if (startAt) filter.createdAt.$gte = new Date(String(startAt));
                if (endAt) filter.createdAt.$lte = new Date(String(endAt));
            }

            const totalPageViews = await PageView.countDocuments(filter);
            res.json({ totalPageViews });
        } catch (err) {
            next(err);
        }
    }

    static async getAggregatedPageViews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { interval, article, startAt, endAt } = req.query;

            const validIntervals = ['hourly', 'daily', 'monthly'] as const;
            const formatMap: Record<typeof validIntervals[number], string> = {
                hourly: '%Y-%m-%dT%H:00:00',
                daily: '%Y-%m-%d',
                monthly: '%Y-%m',
            };

            const timezone = 'Asia/Jakarta'; // You can change this if needed
            const rawInterval = Array.isArray(interval) ? interval[0] : interval;

            if (!rawInterval || !validIntervals.includes(rawInterval as any)) {
                throw new AppError(
                    'Invalid or missing interval. Must be one of: hourly, daily, or monthly.',
                    400,
                    'INVALID_INTERVAL'
                );
            }

            const groupFormat = formatMap[rawInterval as typeof validIntervals[number]];

            const match: any = {};

            if (article) {
                if (!mongoose.Types.ObjectId.isValid(article.toString())) {
                    throw new AppError('Invalid article ID format.', 400, 'INVALID_ARTICLE_ID');
                }
                match.article = new mongoose.Types.ObjectId(article.toString());
            }

            if (startAt || endAt) {
                match.createdAt = {};
                if (startAt) match.createdAt.$gte = new Date(startAt.toString());
                if (endAt) match.createdAt.$lte = new Date(endAt.toString());
            }

            const aggregation = await PageView.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: groupFormat,
                                date: '$createdAt',
                                timezone,
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            res.json(
                aggregation.map((item) => ({
                    date: item._id,
                    totalPageViews: item.count,
                }))
            );
        } catch (err) {
            next(err);
        }
    }

}
