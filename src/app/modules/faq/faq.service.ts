import { IFaq } from './faq.interface';
import { Faq } from './faq.model';

// create faq service
const createFaqToDB = async (payload: IFaq) => {
  // check if faq already exists
  const existingFaq = await Faq.findOne({ question: payload.question });
  if (existingFaq) {
    throw new Error('The question already exists');
  }

  const result = await Faq.create(payload);
  return result;
};

export const FaqServices = { createFaqToDB };
