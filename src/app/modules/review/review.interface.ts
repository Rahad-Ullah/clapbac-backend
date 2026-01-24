import { Model, Types } from 'mongoose';

export type IReview = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  company: Types.ObjectId;
  reviewerName: string;
  reviewerAddress: string;
  reviewRating: number;
  reviewMessage: string;
  reviewSource: string;
  sourceLink: string;
  experienceDate: Date;
  clapbacTitle: string;
  clapbacMessage: string;
  clapbacRating: number;
  reviewerType: string;
  reviewerConsequence: string;
  helpfulCount: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ReviewModel = Model<IReview>;