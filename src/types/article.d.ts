import { Document } from "mongoose";

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
