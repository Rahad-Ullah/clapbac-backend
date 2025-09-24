import express from 'express';
import { SupportController } from './support.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SupportValidations } from './support.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(SupportValidations.createSupportZodSchema),
  SupportController.createSupport
);

export const SupportRoutes = router;
