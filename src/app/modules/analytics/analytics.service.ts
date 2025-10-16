import { Review } from '../review/review.model';
import { ReviewServices } from '../review/review.service';
import { USER_ROLES } from '../user/user.constant';
import { User } from '../user/user.model';

// ----------- get dashboard overview -----------
const getDashboardOverview = async () => {
  // get total users, total reviewers, total reviews and new users of the last 30 days
  const [totalUsers, reviewerRes, totalReviews, newUsers] = await Promise.all([
    User.countDocuments({ role: { $ne: USER_ROLES.SUPER_ADMIN } }).lean(),
    ReviewServices.getAllReviewers({}),
    Review.countDocuments({}).lean(),
    User.countDocuments({
      role: { $ne: USER_ROLES.SUPER_ADMIN },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).lean(),
  ]);

  return {
    totalUsers,
    totalReviewers: reviewerRes?.pagination?.total,
    totalReviews,
    newUsers,
  };
};

export const AnalyticsServices = { getDashboardOverview };
