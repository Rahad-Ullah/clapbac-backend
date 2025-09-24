import { Model, Types } from 'mongoose';

export type IContact = {
  id?: Types.ObjectId;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactModel = Model<IContact>;
