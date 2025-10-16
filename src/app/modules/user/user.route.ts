import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { USER_ROLES } from './user.constant';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
const router = express.Router();

// create business owner
router.post(
  '/create-owner',
  validateRequest(UserValidation.createOwnerZodSchema),
  UserController.createOwner
);

// update user profile
router.patch(
  '/profile',
  auth(),
  fileUploadHandler(),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateProfile
);

// update user by id
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUserById
);

// delete user by id
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  UserController.deleteUserById
);

// get user profile
router.route('/profile').get(auth(), UserController.getUserProfile);

// get single user by id
router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  UserController.getUserById
);

// get all users
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  UserController.getAllUsers
);

export const UserRoutes = router;
