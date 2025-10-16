import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { USER_ROLES, USER_STATUS } from './user.constant';
import mongoose, { Types } from 'mongoose';
import { Company } from '../company/company.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createOwnerToDB = async (
  payload: Partial<IUser> & {
    companyName: string;
    businessCategory: Types.ObjectId;
    website: string;
  }
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { companyName, businessCategory, website, ...userPayload } = payload;

    // 1. Create company
    // check if the company already exists
    const existingCompany = await Company.findOne({
      name: payload.companyName,
    });
    if (existingCompany) {
      throw new ApiError(StatusCodes.CONFLICT, 'Company already exists');
    }

    const [newCompany] = await Company.create(
      [
        {
          name: companyName,
          category: businessCategory,
          website,
        },
      ],
      { session }
    );

    // 2. Create user with role=OWNER
    const [createUser] = await User.create(
      [
        {
          ...userPayload,
          role: USER_ROLES.OWNER,
          company: newCompany._id,
        },
      ],
      { session }
    );

    // 3. Update company with owner
    newCompany.owner = createUser._id;
    await newCompany.save({ session });

    // 4. Generate OTP and prepare email
    const otp = generateOTP(6);
    const values = {
      name: createUser.firstName,
      otp: otp,
      email: createUser.email!,
    };
    const createAccountTemplate = emailTemplate.createAccount(values);

    // send the email AFTER commit.

    // 5. Save authentication info
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000), // expires in 3 min
    };
    await User.findByIdAndUpdate(
      createUser._id,
      { $set: { authentication } },
      { session }
    );

    // 6. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send email after commit (so DB is consistent even if email fails)
    emailHelper.sendEmail(createAccountTemplate);

    return null;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// update user by id
const updateUserByIdToDB = async (id: string, payload: Partial<IUser>) => {
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// -------- update user profile --------
const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

// -------- delete user by id --------
const deleteUserByIdFromDB = async (id: string) => {
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  
  const result = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

// -------- get user profile --------
const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  // check user exist
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // check if user is deleted
  if (isExistUser.isDeleted) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Your account is deleted!');
  }

  // check user is banned
  if (isExistUser.status === USER_STATUS.BANNED) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Your account has been suspended. Please contact support.'
    );
  }

  return isExistUser;
};

// get user by id
const getUserByIdFromDB = async (id: string) => {
  const result = await User.findById(id).populate('company');
  return result;
};

// -------- get all users with pagination --------
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ isDeleted: false, role: { $ne: USER_ROLES.SUPER_ADMIN } }).populate('company'),
    query
  )
    .search(['firstName', 'lastName', 'email', 'phone', 'username'])
    .filter()
    .paginate()
    .sort();

  const [users, pagination] = await Promise.all([
    userQuery.modelQuery,
    userQuery.getPaginationInfo(),
  ]);

  return { users, pagination };
};

export const UserService = {
  createOwnerToDB,
  updateUserByIdToDB,
  updateProfileToDB,
  deleteUserByIdFromDB,
  getUserProfileFromDB,
  getUserByIdFromDB,
  getAllUsersFromDB,
};
