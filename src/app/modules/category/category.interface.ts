import { Model, Types } from 'mongoose';

export type ICategory = {
  _id: Types.ObjectId;
  name: string;
  icon: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CategoryModel = Model<ICategory>;
