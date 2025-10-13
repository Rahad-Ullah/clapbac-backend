import QueryBuilder from '../../builder/QueryBuilder';
import { Review } from '../review/review.model';
import { IReport } from './report.interface';
import { Report } from './report.model';

// ----------- create report -----------
const createReport = async (payload: IReport): Promise<IReport> => {
  // check if the review is exist
  const isExistReview = await Review.findById(payload.review);
  if (!isExistReview) {
    throw new Error('Review not found');
  }

  // check if the user is the owner of the review
  if (isExistReview.user.toString() === payload.user.toString()) {
    throw new Error('You cannot report your own review');
  }

  // check if the user already reported this review within last 24 hours
  const isExistReport = await Report.findOne({
    review: payload.review,
    user: payload.user,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (isExistReport) {
    throw new Error('You have already reported this review');
  }

  const result = await Report.create(payload);
  return result;
};

// ----------- update report  -----------
const updateReport = async (id: string, payload: Partial<IReport>) => {
  // check if report exists
  const existingReport = await Report.findById(id);
  if (!existingReport) {
    throw new Error('Report not found');
  }

  const result = await Report.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// ----------- get all reports with pagination  -----------
const getAllReports = async (query: Record<string, unknown>) => {
  const reportQuery = new QueryBuilder(
    Report.find().populate({
      path: 'user',
      select: 'firstName lastName username email image',
      match: query?.searchTerm
        ? {
            $or: [
              { firstName: { $regex: new RegExp(query?.searchTerm as string, 'i') } },
              { lastName: { $regex: new RegExp(query?.searchTerm as string, 'i') } },
              { username: { $regex: new RegExp(query?.searchTerm as string, 'i') } },
              { email: { $regex: new RegExp(query?.searchTerm as string, 'i') } },
            ],
          }
        : undefined,
    }),
    query
  )
    .filter()
    .paginate()
    .sort();

  const [data, pagination] = await Promise.all([
    reportQuery.modelQuery.exec(),
    reportQuery.getPaginationInfo(),
  ]);

    // Remove reports where user didn't match (user = null)
  const filteredData = data.filter(report => report.user);

  return { data: filteredData, pagination };
};

export const ReportServices = { createReport, updateReport, getAllReports };
