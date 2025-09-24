import { Schema, model } from 'mongoose';
import {
  IRecentCompanies,
  RecentCompaniesModel,
} from './recent-companies.interface';

const RecentCompaniesSchema = new Schema<
  IRecentCompanies,
  RecentCompaniesModel
>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
);

export const RecentCompanies = model<IRecentCompanies, RecentCompaniesModel>(
  'RecentCompanies',
  RecentCompaniesSchema
);
