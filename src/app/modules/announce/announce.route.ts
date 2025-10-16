import express from 'express';
import { AnnounceController } from './announce.controller';

const router = express.Router();

router.get('/', AnnounceController); 

export const AnnounceRoutes = router;
