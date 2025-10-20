import { Model, Types } from 'mongoose';

export type IRecentReviews = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  review: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RecentReviewsModel = Model<IRecentReviews>;
