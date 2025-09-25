import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    reviewerName: { type: String, required: true },
    reviewRating: { type: Number, required: true, min: 1, max: 5 },
    reviewMessage: { type: String, required: true },
    reviewSource: { type: String, required: true },
    sourceLink: { type: String, required: true },
    experienceDate: { type: Date, required: true },
    clapbacTitle: { type: String },
    clapbacMessage: { type: String },
    clapbacRating: { type: Number, default: 0, max: 5 },
    reviewerType: { type: String },
    reviewerConsequence: { type: String },
    helpfulCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview, ReviewModel>('Review', reviewSchema);
