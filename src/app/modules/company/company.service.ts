import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICompany } from './company.interface';
import { Company } from './company.model';
import QueryBuilder from '../../builder/QueryBuilder';

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

// get single by id
const getSingleById = async (id: string) => {
  const result = await Company.findById(id).populate('category', 'name icon').lean()
  if(!result){
    throw new ApiError(StatusCodes.NOT_FOUND, "Company not found")
  }

  return result;
}

// get all companies with pagination and search
const getAllCompanies = async (query: Record<string, unknown>) => {
  const companyQuery = new QueryBuilder(
    Company.find().populate('category', 'name icon'),
    query
  )
    .search(['name'])
    .filter()
    .paginate()
    .sort();

  const [data, pagination] = await Promise.all([
    companyQuery.modelQuery,
    companyQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const CompanyServices = { updateCompany, getSingleById, getAllCompanies };
