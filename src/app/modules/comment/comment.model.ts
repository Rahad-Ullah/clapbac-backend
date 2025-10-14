import { Schema, model } from 'mongoose';
import { IComment, CommentModel } from './comment.interface';

const commentSchema = new Schema<IComment, CommentModel>({
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
  message: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Comment = model<IComment, CommentModel>('Comment', commentSchema);
