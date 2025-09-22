import { Model, Types } from 'mongoose';

export type ICompany = {
  _id?: Types.ObjectId;
  name: string;
  category: string;
  logo: string;
  about: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  author: Types.ObjectId;
  reviewCount?: number;
  avgRating?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CompanyModel = Model<ICompany>;
