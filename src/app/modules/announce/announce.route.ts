import express from 'express';
import { AnnounceController } from './announce.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AnnounceValidations } from './announce.validation';

const router = express.Router();

// create announce
router.post(
  '/create',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(AnnounceValidations.createAnnounceZodSchema),
  AnnounceController.createAnnounce
); 

// update announce
router.patch(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(AnnounceValidations.updateAnnounceZodSchema),
  AnnounceController.updateAnnounce
);

export const AnnounceRoutes = router;
