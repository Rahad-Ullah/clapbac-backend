import unlinkFile from '../../../shared/unlinkFile';
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

// update category service
const updateCategoryToDB = async (id: string, payload: Partial<ICategory>) => {
  // check if category exists
  const existingCategory = await Category.findById(id);
  if (!existingCategory) {
    throw new Error('Category not found');
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });

  // unlink files if image is updated
  if (payload.icon && existingCategory.icon) {
    unlinkFile(existingCategory.icon);
  }

  return result;
};

export const CategoryServices = { createCategoryToDB, updateCategoryToDB };
