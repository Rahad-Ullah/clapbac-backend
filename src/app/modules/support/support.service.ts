import { ISupport } from './support.interface';
import { Support } from './support.model';

// create support
const createSupport = async (payload: ISupport): Promise<ISupport> => {
  const result = await Support.create(payload);
  return result;
};

// update support
const updateSupport = async (id: string, payload: ISupport): Promise<ISupport | null> => {
  const result = await Support.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
}

export const SupportServices = { createSupport, updateSupport };
