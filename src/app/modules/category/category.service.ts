import unlinkFile from '../../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';
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

// get single category by id
const getSingleCategoryById = async (id: string) => {
  const result = await Category.findById(id).populate('relatedTo', 'name icon');
  if (!result) {
    throw new Error('Category not found');
  }
  return result;
};

// get all categories
const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Category.find().populate('relatedTo', 'name icon').lean(),
    query
  )
    .search(['name'])
    .sort();

  const result = await categoryQuery.modelQuery;
  return result;
};

export const CategoryServices = {
  createCategoryToDB,
  updateCategoryToDB,
  getSingleCategoryById,
  getAllCategories,
};
