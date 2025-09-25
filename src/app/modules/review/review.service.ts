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

// update review service
const updateReviewToDB = async (id: string, payload: Partial<IReview>) => {
  // check if review exists
  const existingReview = await Review.findById(id);
  if (!existingReview) {
    throw new Error('Review not found');
  }
  
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const ReviewServices = { createReviewToDB, updateReviewToDB };
