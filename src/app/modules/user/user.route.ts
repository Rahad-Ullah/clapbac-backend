import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { USER_ROLES } from './user.constant';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();

router.route('/profile').get(auth(), UserController.getUserProfile);

router.patch(
  '/profile',
  auth(),
  fileUploadHandler(),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateProfile
);

router
  .route('/create-owner')
  .post(
    validateRequest(UserValidation.createOwnerZodSchema),
    UserController.createOwner
  );

export const UserRoutes = router;
