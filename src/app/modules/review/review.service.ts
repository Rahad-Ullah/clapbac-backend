import { Company } from '../company/company.model';
import { IReview, ReviewModel } from './review.interface';
import { Review } from './review.model';

// create review service
const createReviewToDB = async (payload: IReview): Promise<IReview> => {
  // check if the user owns at least one company
  const isCompanyExist = await Company.findOne({
    owner: payload.user,
  });
  if (!isCompanyExist) {
    throw new Error('You must own a business to create a review');
  }

  // attach company to the review
  payload.company = isCompanyExist._id;

  const result = await Review.create(payload);
  return result;
};

export const ReviewServices = { createReviewToDB };
