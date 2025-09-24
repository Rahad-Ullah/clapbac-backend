import { Schema, model } from 'mongoose';
import { ISupport, SupportModel } from './support.interface';
import { SupportStatus } from './support.constant';

const supportSchema = new Schema<ISupport, SupportModel>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SupportStatus),
      default: SupportStatus.OPEN,
    },
  },
  {
    timestamps: true,
  }
);

export const Support = model<ISupport, SupportModel>('Support', supportSchema);
