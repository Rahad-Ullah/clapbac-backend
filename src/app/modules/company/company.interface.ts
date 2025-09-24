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
  owner: Types.ObjectId;
  reviewCount?: number;
  avgRating?: number;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CompanyModel = Model<ICompany>;
