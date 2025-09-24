import { Model, Types } from 'mongoose';
import { USER_ROLES, USER_STATUS } from './user.constant';

export type IUser = {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: USER_ROLES;
  phone: string;
  username?: string;
  image?: string;
  company?: Types.ObjectId;
  title?: string;
  adminNotes?: string;
  status: USER_STATUS;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
