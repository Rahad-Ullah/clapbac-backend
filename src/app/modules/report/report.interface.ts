import { Model, Types } from 'mongoose';
import { ReportReason, ReportStatus } from './report.constants';

export type IReport = {
  _id?: string;
  user: Types.ObjectId;
  review: Types.ObjectId;
  reason: ReportReason;
  status: ReportStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ReportModel = Model<IReport>;
