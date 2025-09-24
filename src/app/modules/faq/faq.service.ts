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

// update faq service
const updateFaqToDB = async (id: string, payload: Partial<IFaq>) => {
  // check if faq exists
  const existingFaq = await Faq.findById(id);
  if (!existingFaq) {
    throw new Error('Faq not found');
  }

  const result = await Faq.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// delete faq service
const deleteFaqFromDB = async (id: string) => {
  // check if faq exists
  const existingFaq = await Faq.findById(id);
  if (!existingFaq) {
    throw new Error('Faq not found');
  }

  const result = await Faq.findByIdAndDelete(id);
  return result;
};

// get all faqs service
const getAllFaqsFromDB = async () => {
  const result = await Faq.find();
  return result;
};

export const FaqServices = { createFaqToDB, updateFaqToDB, deleteFaqFromDB, getAllFaqsFromDB };
