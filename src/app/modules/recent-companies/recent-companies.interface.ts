import { Model, Types } from 'mongoose';

export type IRecentCompanies = {
  _id?: string;
  user: Types.ObjectId;
  company: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RecentCompaniesModel = Model<IRecentCompanies>;
