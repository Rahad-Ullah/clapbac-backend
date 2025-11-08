import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICompany } from './company.interface';
import { Company } from './company.model';
import QueryBuilder from '../../builder/QueryBuilder';

// update company service
const updateCompany = async (
  id: string,
  payload: Partial<ICompany>,
) => {
  // check if the company exists
  const existingCompany = await Company.findById(id);
  if (!existingCompany) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Company not found!');
  }

  // update the company
  const updatedCompany = await Company.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedCompany;
};

// toggle featured company service
const toggleFeaturedCompany = async (
  id: string
) => {
  // check if the company exists
  const existingCompany = await Company.findById(id);
  if (!existingCompany) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Company not found!');
  }

  // update the company
  const result = await Company.findByIdAndUpdate(id, { isFeatured: !existingCompany.isFeatured }, {
    new: true,
  });
  return result;
};

// get single by id
const getSingleById = async (id: string) => {
  const result = await Company.findById(id).populate('category', 'name icon').lean()
  if(!result){
    throw new ApiError(StatusCodes.NOT_FOUND, "Company not found")
  }

  return result;
}

// get my company
const getMyCompany = async (userId: string) => {
  const result = await Company.findOne({ owner: userId}).populate('category').lean()
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

export const CompanyServices = { updateCompany, toggleFeaturedCompany, getSingleById, getMyCompany, getAllCompanies };
