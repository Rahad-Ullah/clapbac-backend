import { Company } from '../company/company.model';
import { IReview } from './review.interface';
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

  // start mongoose session
  const session = await Review.startSession();
  session.startTransaction();

  try {
    // attach company to the review
    payload.company = isCompanyExist._id;

    const [review] = await Review.create([payload], { session });

    // calculate avg review rating for the company
    const stats = await Review.aggregate([
      { $match: { company: isCompanyExist._id } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$reviewRating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]).session(session);

    const averageRating = stats[0]?.avgRating || 0;
    const reviewCount = stats[0]?.reviewCount || 0;

    // update company rating
    await Company.findOneAndUpdate(
      { _id: isCompanyExist._id },
      {
        $set: {
          avgRating: averageRating,
          reviewCount: reviewCount,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return review;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// update review service
const updateReviewToDB = async (
  id: string,
  payload: Partial<IReview>
): Promise<IReview | null> => {
  // check if review exists
  const existingReview = await Review.findById(id);
  if (!existingReview) {
    throw new Error('Review not found');
  }

  const session = await Review.startSession();
  session.startTransaction();

  try {
    // update review
    const updatedReview = await Review.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });

    if (!updatedReview) {
      throw new Error('Failed to update review');
    }

    // recalculate avgRating + reviewCount for this company
    const stats = await Review.aggregate([
      { $match: { company: updatedReview.company } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$reviewRating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]).session(session);

    const averageRating = stats[0]?.avgRating || 0;
    const reviewCount = stats[0]?.reviewCount || 0;

    await Company.findByIdAndUpdate(
      updatedReview.company,
      {
        $set: {
          avgRating: averageRating,
          reviewCount: reviewCount,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedReview;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// get review by company id
const getReviewByCompanyId = async (id: string) => {
  const result = await Review.find({ company: id })
    .populate('user', 'name title image')
    .populate('company', 'name');
  return result;
};

export const ReviewServices = {
  createReviewToDB,
  updateReviewToDB,
  getReviewByCompanyId,
};
