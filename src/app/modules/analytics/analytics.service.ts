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

  const weeklyReviews = await getWeeklyReviews();

  return {
    totalUsers,
    totalReviewers: reviewerRes?.pagination?.total,
    totalReviews,
    newUsers,
    weeklyReviews,
  };
};

// ----------- get weekly reviews statistics -----------
const getWeeklyReviews = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Step 1: Get review counts for the last 7 days
  const result = await Review.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dayOfWeek: '$createdAt', // 1 = Sunday, 7 = Saturday
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Step 2: Prepare default structure for all 7 days
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const reviewCounts = Array(7).fill(0);

  // Step 3: Fill in counts for days that have data
  result.forEach(day => {
    const index = (day._id - 1) % 7; // adjust 1–7 to 0–6
    reviewCounts[index] = day.count;
  });

  // Step 4: Return formatted result (for graph)
  const formatted = daysOfWeek.map((day, i) => ({
    day,
    count: reviewCounts[i],
  }));

  return formatted;
};


export const AnalyticsServices = { getDashboardOverview };
