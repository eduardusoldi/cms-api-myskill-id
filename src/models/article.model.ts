import { Schema, model } from 'mongoose';
import { IArticle } from '../types/article';

const articleSchema = new Schema<IArticle>(
  {
    status: {
      type: String,
      enum: ['draft', 'published'],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
    },
  },
  { timestamps: true }
);


export default model<IArticle>('Article', articleSchema);
