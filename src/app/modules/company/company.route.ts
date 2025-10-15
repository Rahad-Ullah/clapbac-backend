import express from 'express';
import { CompanyController } from './company.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CompanyValidations } from './company.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// update company
router.patch(
  '/:id',
  auth(USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  validateRequest(CompanyValidations.updateCompanyZodSchema),
  CompanyController.updateCompany
); 

// get single company
router.get(
  '/:id',
  CompanyController.getSingleById
);

// get all companies
router.get(
  '/',
  CompanyController.getAllCompanies
);

export const CompanyRoutes = router;
