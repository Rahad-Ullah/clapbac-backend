import { Company } from '../company/company.model';
import { IRecentCompanies } from './recent-companies.interface';
import { RecentCompanies } from './recent-companies.model';

// create recent companies services
const createRecentCompanies = async (
  payload: IRecentCompanies
) => {
    // check if the company is exist
    const isExistCompany = await Company.findById(payload.company);
    if (!isExistCompany) {
      throw new Error('Company not found');
    }
    
    // check if recent companies already exists
    const isExist = await RecentCompanies.findOne(payload);
    if (isExist) {
        const result = await RecentCompanies.findByIdAndUpdate(isExist._id, {}, { new: true });
        return result;
    }

    // create recent companies
    const result = await RecentCompanies.create(payload);
    // delete older recent companies if more than 10
    const recentCompanies = await RecentCompanies.find({ user: payload.user }).sort({ updatedAt: -1 });
    if (recentCompanies.length > 10) {
      const recentCompaniesToDelete = recentCompanies.slice(10);
      const recentCompaniesToDeleteIds = recentCompaniesToDelete.map((item) => item._id);
      await RecentCompanies.deleteMany({ _id: { $in: recentCompaniesToDeleteIds } });
    }
    return result;
};

// get recent companies by user id
const getUserRecentCompanies = async (id: string) => {
    const result = await RecentCompanies.find({ user: id }).sort({ updatedAt: -1 }).populate('company').limit(10);
    // send company details only
    const formatedResult = result.map((item) => item.company);
    return formatedResult;
};

export const RecentCompaniesServices = { createRecentCompanies, getUserRecentCompanies };
