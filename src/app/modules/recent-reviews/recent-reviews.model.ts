import { Schema, model } from 'mongoose';
import { IRecentReviews, RecentReviewsModel } from './recent-reviews.interface';

const recentReviewsSchema = new Schema<IRecentReviews, RecentReviewsModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
    },
  },
  { timestamps: true }
);

export const RecentReviews = model<IRecentReviews, RecentReviewsModel>(
  'RecentReviews',
  recentReviewsSchema
);
