import { Schema, model } from 'mongoose';
import { IAnnounce, AnnounceModel } from './announce.interface';
import { AnnounceAudience, AnnounceStatus } from './announce.constants';

const announceSchema = new Schema<IAnnounce, AnnounceModel>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    url: { type: String, required: true },
    audience: {
      type: String,
      enum: Object.values(AnnounceAudience),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AnnounceStatus),
      default: AnnounceStatus.DRAFT,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Announce = model<IAnnounce, AnnounceModel>(
  'Announce',
  announceSchema
);
