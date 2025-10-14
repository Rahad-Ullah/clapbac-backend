import { Review } from '../review/review.model';
import { CommentModel, IComment } from './comment.interface';
import { Comment } from './comment.model';

// ----------- create comment -----------
const createCommentIntoDB = async (payload: IComment): Promise<IComment> => {
  // check if the review is exist
  const isExistReview = await Review.findById(payload.review);
  if (!isExistReview) {
    throw new Error('Review not found');
  }

  // check if the parent is exist
  if (payload.parent) {
    const isExistParent = await Comment.findById(payload.parent);
    if (!isExistParent) {
      throw new Error('Parent comment not found');
    }
  }

  // create comment and update parent replies by transaction
  const session = await Comment.startSession();
  session.startTransaction();

  try {
    const comment = await Comment.create([payload], { session });

    if (payload.parent) {
      await Comment.findByIdAndUpdate(
        payload.parent,
        { $addToSet: { replies: comment[0]._id } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return comment[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ----------- update comment -----------
const updateCommentIntoDB = async (id: string, payload: Partial<IComment>) => {
  // check if comment exists
  const existingComment = await Comment.findById(id);
  if (!existingComment) {
    throw new Error('Comment not found');
  }

  const result = await Comment.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// ----------- get comments by review id -----------
const getCommentsByReviewId = async (id: string) => {
  // check if review exists
  const isExistReview = await Review.findById(id);
  if (!isExistReview) {
    throw new Error('Review not found');
  }

  const result = await Comment.find({ review: id, isDeleted: false })
    .populate('user', 'firstName lastName username email title image')
    .populate('replies', 'message');
  return result;
};

export const CommentServices = { createCommentIntoDB, updateCommentIntoDB, getCommentsByReviewId };
