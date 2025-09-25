import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import QueryBuilder from '../../builder/QueryBuilder';
import { ISupport } from './support.interface';
import { Support } from './support.model';

// create support
const createSupport = async (payload: ISupport): Promise<ISupport> => {
  const result = await Support.create(payload);

  // send email to admin about new support request
  await emailHelper.sendEmail(emailTemplate.supportResponse(payload));

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
