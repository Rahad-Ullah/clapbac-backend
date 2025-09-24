import { ISupport } from './support.interface';
import { Support } from './support.model';

// create support
const createSupport = async (payload: ISupport): Promise<ISupport> => {
  const result = await Support.create(payload);
  return result;
};

export const SupportServices = { createSupport };
