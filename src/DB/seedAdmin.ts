import { USER_ROLES } from '../app/modules/user/user.constant';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { logger } from '../shared/logger';

const payload = {
  firstName: 'Super',
  lastName: 'Admin',
  email: config.super_admin.email,
  role: USER_ROLES.SUPER_ADMIN,
  password: config.super_admin.password,
  phone: '+8801712345678',
  isVerified: true,
};

export const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await User.findOne({
    email: config.super_admin.email,
    role: USER_ROLES.SUPER_ADMIN,
  });
  if (!isExistSuperAdmin) {
    await User.create(payload);
    logger.info('✨ Super Admin account has been successfully created!');
  }
};
