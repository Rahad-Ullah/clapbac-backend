import { Review } from '../review/review.model';
import { IRecentReviews } from './recent-reviews.interface';
import { RecentReviews } from './recent-reviews.model';

// ---------- create recent reviews services here ----------
const createRecentReviews = async (payload: IRecentReviews) => {
  // check if the review is exist
  const isExistReview = await Review.findById(payload.review);
  if (!isExistReview) {
    throw new Error('review not found');
  }

  // check if recent Reviews already exists
  const isExist = await RecentReviews.findOne(payload);
  if (isExist) {
    const result = await RecentReviews.findByIdAndUpdate(
      isExist._id,
      {},
      { new: true }
    );
    return result;
  }

  // create recent Reviews
  const result = await RecentReviews.create(payload);

  // delete older recent Reviews if more than 10
  const recentReviews = await RecentReviews.find({
    user: payload.user,
  }).sort({ updatedAt: -1 });
  if (recentReviews.length > 10) {
    const recentReviewsToDelete = recentReviews.slice(10);
    const recentReviewsToDeleteIds = recentReviewsToDelete.map(
      item => item._id
    );
    await RecentReviews.deleteMany({
      _id: { $in: recentReviewsToDeleteIds },
    });
  }
  return result;
};

export const RecentReviewsServices = { createRecentReviews };
