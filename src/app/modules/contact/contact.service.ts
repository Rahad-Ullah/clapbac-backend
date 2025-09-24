import { IContact } from './contact.interface';
import { Contact } from './contact.model';

// create or update contact info
const createUpdateContact = async (payload: IContact) => {
  const result = await Contact.findOneAndUpdate(
    {},
    { $set: payload },
    { new: true, upsert: true }
  );
  return result;
};

export const ContactServices = { createUpdateContact };
