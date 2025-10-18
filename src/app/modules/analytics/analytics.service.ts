import { ReportReason, ReportStatus } from '../report/report.constants';
import { Report } from '../report/report.model';
import { Review } from '../review/review.model';
import { ReviewServices } from '../review/review.service';
import { USER_ROLES } from '../user/user.constant';
import { User } from '../user/user.model';

// ----------- get dashboard overview -----------
const getDashboardOverview = async () => {
  // get total users, total reviewers, total reviews, new users of the last 30 days, weekly reviews
  const [
    totalUsers,
    reviewerRes,
    totalReviews,
    newUsers,
    weeklyReviews,
    ratingDistribution,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: USER_ROLES.SUPER_ADMIN } }).lean(),
    ReviewServices.getAllReviewers({}),
    Review.countDocuments({}).lean(),
    User.countDocuments({
      role: { $ne: USER_ROLES.SUPER_ADMIN },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).lean(),
    getWeeklyReviews(),
    getRatingDistribution(),
  ]);

  return {
    totalUsers,
    totalReviewers: reviewerRes?.pagination?.total,
    totalReviews,
    newUsers,
    weeklyReviews,
    ratingDistribution,
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

// get rating distribution
const getRatingDistribution = async () => {
  const result = await Review.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lte: ['$reviewRating', 2] }, then: 'bad' },
              {
                case: {
                  $and: [
                    { $gt: ['$reviewRating', 2] },
                    { $lte: ['$reviewRating', 4] },
                  ],
                },
                then: 'average',
              },
              { case: { $gt: ['$reviewRating', 4] }, then: 'good' },
            ],
            default: 'unknown',
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Ensure all categories exist even if count = 0
  const categories = ['bad', 'average', 'good'].map(category => {
    const found = result.find(r => r._id === category);
    return { category, count: found ? found.count : 0 };
  });

  return categories;
};

// ----------- get weekly report activity -----------
const getWeeklyReportActivity = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const result = await Report.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' }, // 1=Sunday, 7=Saturday
        count: { $sum: 1 },
      },
    },
  ]);

  // Define day names (Sun–Sat)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const counts = Array(7).fill(0);

  // Fill in counts for available days
  result.forEach(day => {
    const index = (day._id - 1) % 7;
    counts[index] = day.count;
  });

  // Return chart-friendly data
  const weeklyReportActivity = daysOfWeek.map((day, i) => ({
    day,
    count: counts[i],
  }));

  return weeklyReportActivity;
};

// ----------- get report overview -----------
const getReportOverview = async () => {
  const [overview, weekly, ratings] = await Promise.all([
    Report.aggregate([
      {
        $facet: {
          reasons: [
            {
              $group: {
                _id: '$reason',
                count: { $sum: 1 },
              },
            },
          ],
          openReports: [
            {
              $match: { status: ReportStatus.OPEN },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]),
    getWeeklyReportActivity(),
    getRatingDistribution(),
  ]);

  const { reasons, openReports } = overview[0];

  const totalSpam =
    reasons.find((r: { _id: ReportReason }) => r._id === ReportReason.SPAM)
      ?.count || 0;
  const totalHarassment =
    reasons.find(
      (r: { _id: ReportReason }) => r._id === ReportReason.HARASSMENT
    )?.count || 0;
  const totalFakeReview =
    reasons.find((r: { _id: ReportReason }) => r._id === ReportReason.FAKE)
      ?.count || 0;
  const newReports = openReports[0]?.count || 0;

  return {
    totalSpam,
    totalHarassment,
    totalFakeReview,
    newReports,
    weeklyReportActivity: weekly,
    ratingDistribution: ratings,
  };
};

export const AnalyticsServices = { getDashboardOverview, getReportOverview };
