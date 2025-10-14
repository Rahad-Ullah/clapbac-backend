import { Model, Types } from 'mongoose';

export type IComment = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  review: Types.ObjectId;
  message: string;
  parent?: Types.ObjectId;
  replies?: Types.ObjectId[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CommentModel = Model<IComment>;
