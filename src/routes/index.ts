import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CompanyRoutes } from '../app/modules/company/company.route';
import { RecentCompaniesRoutes } from '../app/modules/recent-companies/recent-companies.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/companies',
    route: CompanyRoutes,
  },
  {
    path: '/recent-companies',
    route: RecentCompaniesRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
