import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { CompanyModel, ICompany } from './company.interface';
import { Company } from './company.model';

// create company service
const createCompany = async (payload: Partial<ICompany>) => {
  // check if the company already exists
  const existingCompany = await Company.findOne({ name: payload.name });
  if (existingCompany) {
    throw new ApiError(StatusCodes.CONFLICT, 'Company already exists');
  }
  const result = await Company.create(payload);
  return result;
};

export const CompanyServices = { createCompany };
