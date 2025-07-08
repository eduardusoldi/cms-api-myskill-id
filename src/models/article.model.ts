import { Schema, model, Document } from 'mongoose';

export interface IArticle extends Document {
  status: 'draft' | 'published';
  title: string;
  content: string;
  author: {
    id: Schema.Types.ObjectId;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

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
