import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICompany } from './company.interface';
import { Company } from './company.model';

// update company service
const updateCompany = async (
  id: string,
  payload: Partial<ICompany>,
  userId: string
) => {
  // check if the company exists
  const existingCompany = await Company.findById(id);
  if (!existingCompany) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Company not found!');
  }
  // check if the user owns the company
  if (existingCompany.owner.toString() !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not allowed to update this company!'
    );
  }

  // update the company
  const updatedCompany = await Company.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedCompany;
};

export const CompanyServices = { updateCompany };
