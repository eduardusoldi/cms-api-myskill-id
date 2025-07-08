import { Schema, model } from 'mongoose';
import { IPageView } from '../types/pageView';

const pageViewSchema = new Schema<IPageView>(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IPageView>('PageView', pageViewSchema);
