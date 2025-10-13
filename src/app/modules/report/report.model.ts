import { Schema, model } from 'mongoose';
import { IReport, ReportModel } from './report.interface';
import { ReportStatus } from './report.constants';

const reportSchema = new Schema<IReport, ReportModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.OPEN,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = model<IReport, ReportModel>('Report', reportSchema);
