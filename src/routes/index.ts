import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CompanyRoutes } from '../app/modules/company/company.route';
import { RecentCompaniesRoutes } from '../app/modules/recent-companies/recent-companies.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { DisclaimerRoutes } from '../app/modules/disclaimer/disclaimer.route';
import { ContactRoutes } from '../app/modules/contact/contact.route';
import { SupportRoutes } from '../app/modules/support/support.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { ReportRoutes } from '../app/modules/report/report.route';
import { CommentRoutes } from '../app/modules/comment/comment.route';
import { AnnounceRoutes } from '../app/modules/announce/announce.route';
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
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/faqs',
    route: FaqRoutes,
  },
  {
    path: '/disclaimers',
    route: DisclaimerRoutes,
  },
  {
    path: '/announcements',
    route: AnnounceRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  {
    path: '/supports',
    route: SupportRoutes,
  },
  {
    path: '/reports',
    route: ReportRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
