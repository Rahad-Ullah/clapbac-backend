import express from 'express';
import { FaqController } from './faq.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { FaqValidations } from './faq.validation';

const router = express.Router();

// create faq
router.post(
  '/create',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(FaqValidations.createFaqZodSchema),
  FaqController.createFaq
);

export const FaqRoutes = router;
