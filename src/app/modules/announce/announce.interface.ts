import { Model, Types } from 'mongoose';
import { AnnounceAudience, AnnounceStatus } from './announce.constants';

export type IAnnounce = {
  _id?: Types.ObjectId;
  title: string;
  message: string;
  url: string;
  audience: AnnounceAudience;
  status: AnnounceStatus;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AnnounceModel = Model<IAnnounce>;
