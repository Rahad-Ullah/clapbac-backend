import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CompanyRoutes } from '../app/modules/company/company.route';
import { RecentCompaniesRoutes } from '../app/modules/recent-companies/recent-companies.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
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
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/companies',
    route: CompanyRoutes,
  },
  {
    path: '/recent-companies',
    route: RecentCompaniesRoutes,
  },
  {
    path: '/faqs',
    route: FaqRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
