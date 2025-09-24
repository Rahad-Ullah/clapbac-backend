import { Model, Types } from 'mongoose';
import { SupportStatus } from './support.constant';

export type ISupport = {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: SupportStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SupportModel = Model<ISupport>;
