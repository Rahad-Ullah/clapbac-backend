import { ICategory } from './category.interface';
import { Category } from './category.model';

// create category service
const createCategoryToDB = async (payload: ICategory) => {
  // check if category already exists
  const existingCategory = await Category.findOne({ name: payload.name });
  if (existingCategory) {
    throw new Error('Category already exists');
  }

  const result = await Category.create(payload);
  return result;
};

export const CategoryServices = { createCategoryToDB };
