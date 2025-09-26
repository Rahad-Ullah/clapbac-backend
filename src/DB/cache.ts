type CachedReviewers = {
  reviewerType?: string | null;
  data: any;
  lastFetched: number;
};

export const cachedReviewers: CachedReviewers[] = [];