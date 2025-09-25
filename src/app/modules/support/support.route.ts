import express from 'express';
import { SupportController } from './support.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SupportValidations } from './support.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create',
  validateRequest(SupportValidations.createSupportZodSchema),
  SupportController.createSupport
);

// update support
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(SupportValidations.updateSupportZodSchema),
  SupportController.updateSupport
);

// get all supports
router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), SupportController.getAllSupports);

export const SupportRoutes = router;
