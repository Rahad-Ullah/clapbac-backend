import express from 'express';
import { CategoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// create category route
router.post(
  '/create',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  validateRequest(CategoryValidations.createCategoryZodSchema),
  CategoryController.createCategory
);

// update category route
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  validateRequest(CategoryValidations.updateCategoryZodSchema),
  CategoryController.updateCategory
);

// get single category route
router.get(
  '/:id',
  CategoryController.getSingleCategory
);

// get all categories route
router.get(
  '/',
  CategoryController.getAllCategories
);

export const CategoryRoutes = router;
