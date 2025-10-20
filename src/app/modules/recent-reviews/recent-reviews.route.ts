import express from 'express';
import { RecentreviewsController } from './recent-reviews.controller';

const router = express.Router();

router.get('/', RecentreviewsController); 

export const RecentreviewsRoutes = router;
