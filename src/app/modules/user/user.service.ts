import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { USER_ROLES } from './user.constant';
import { CompanyServices } from '../company/company.service';
import mongoose from 'mongoose';
import { Company } from '../company/company.model';

const createOwnerToDB = async (
  payload: Partial<IUser> & {
    companyName: string;
    businessCategory: string;
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

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

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

export const UserService = {
  createOwnerToDB,
  getUserProfileFromDB,
  updateProfileToDB,
};
