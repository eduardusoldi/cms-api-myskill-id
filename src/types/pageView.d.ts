import { Document } from "mongoose";

export interface IPageView extends Document {
  article: Schema.Types.ObjectId;
  createdAt: Date;
}
