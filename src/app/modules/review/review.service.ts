import { IComment } from '../comment/comment.interface';
import { CommentServices } from '../comment/comment.service';
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

    const averageRating = stats[0]?.avgRating
      ? Number(stats[0].avgRating.toFixed(1))
      : 0;
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

    const averageRating = stats[0]?.avgRating
      ? Number(stats[0].avgRating.toFixed(1))
      : 0;
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
  const reviews = await Review.find({ company: id })
    .populate('user', 'name title image')
    .populate('company', 'name')
    .lean();

  let reviewsWithComments;

  // get comments of the review
  if (reviews.length > 0) {
    reviewsWithComments = await Promise.all(
      reviews.map(async (review: IReview & { comments?: IComment[] }) => {
        const comments = await CommentServices.getCommentsByReviewId(
          review._id?.toString() as string
        );
        return { ...review, comments };
      })
    );
  }

  return reviews?.length > 0 ? reviewsWithComments : reviews;
};

// group review by reviewer name and get reviewer with their last review
const getAllReviewers = async (query: Record<string, unknown>) => {
  const { searchTerm, reviewerType } = query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const pipeline: any[] = [];

  // Search by reviewerName
  if (
    searchTerm &&
    typeof searchTerm === 'string' &&
    searchTerm.trim() !== ''
  ) {
    pipeline.push({
      $match: { reviewerName: { $regex: searchTerm, $options: 'i' } },
    });
  }

  // Filter by reviewerType
  if (reviewerType) {
    pipeline.push({ $match: { reviewerType } });
  }

  // Sort by createdAt (latest first)
  pipeline.push({ $sort: { createdAt: -1 } });

  // Group by reviewerName
  pipeline.push({
    $group: {
      _id: '$reviewerName',
      latestReview: { $first: '$$ROOT' },
    },
  });

  // Unwrap latestReview
  pipeline.push({ $replaceRoot: { newRoot: '$latestReview' } });

  // Use $facet to split into data + count in a single query
  pipeline.push({
    $facet: {
      data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      totalCount: [{ $count: 'count' }],
    },
  });

  // Run aggregation
  const result = await Review.aggregate(pipeline);

  const reviewers = result[0].data || [];
  const total = result[0].totalCount[0]?.count || 0;
  const totalPage = Math.ceil(total / limit);

  // Populate refs
  const populatedReviewers = await Review.populate(reviewers, [
    {
      path: 'user',
      select: 'firstName lastName title',
    },
    {
      path: 'company',
      select: 'name logo',
    },
  ]);

  return {
    data: populatedReviewers,
    pagination: {
      total,
      limit,
      page,
      totalPage,
    },
  };
};

export const ReviewServices = {
  createReviewToDB,
  updateReviewToDB,
  getReviewByCompanyId,
  getAllReviewers,
};
