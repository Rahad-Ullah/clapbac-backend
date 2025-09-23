import express from 'express';
import { CompanyController } from './company.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CompanyValidations } from './company.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.patch(
  '/:id',
  auth(USER_ROLES.OWNER),
  fileUploadHandler(),
  validateRequest(CompanyValidations.updateCompanyZodSchema),
  CompanyController.updateCompany
); 

export const CompanyRoutes = router;
