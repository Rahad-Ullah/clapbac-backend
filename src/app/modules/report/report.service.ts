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

export const ReportServices = { createReport, updateReport };
