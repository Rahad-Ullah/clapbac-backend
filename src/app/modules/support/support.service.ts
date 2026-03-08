import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import QueryBuilder from '../../builder/QueryBuilder';
import { SupportStatus } from './support.constant';
import { ISupport } from './support.interface';
import { Support } from './support.model';

// create support
const createSupport = async (payload: ISupport): Promise<ISupport> => {
  // check if the user has already 3 pending request within last 6 hours
  const requestCount = await Support.countDocuments({
    email: payload.email,
    status: SupportStatus.OPEN,
    createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  });
  if (requestCount >= 3) {
    throw new Error(
      'We have received too many requests from you. Please try again later.',
    );
  }

  const result = await Support.create(payload);

  // send email to admin about new support request
  await emailHelper.sendEmail(emailTemplate.supportResponseToAdmin(payload));

  // send confirmation email to user
  await emailHelper.sendEmail(emailTemplate.supportConfirmationToUser(payload));

  return result;
};

// update support
const updateSupport = async (
  id: string,
  payload: ISupport
): Promise<ISupport | null> => {
  const result = await Support.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// get all supports
const getAllSupports = async (query: Record<string, unknown>) => {
  const supportQuery = new QueryBuilder(Support.find(), query)
    .filter()
    .paginate()
    .sort();

  const [data, pagination] = await Promise.all([
    supportQuery.modelQuery.exec(),
    supportQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const SupportServices = { createSupport, updateSupport, getAllSupports };
