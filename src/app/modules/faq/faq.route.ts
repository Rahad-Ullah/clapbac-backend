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

// update faq
router.patch(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(FaqValidations.updateFaqZodSchema),
  FaqController.updateFaq
);

// delete faq
router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  FaqController.deleteFaq
);

// get all faqs
router.get('/', FaqController.getAllFaqs);

export const FaqRoutes = router;
