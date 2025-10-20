import { Schema, model } from 'mongoose';
import { ICategory, CategoryModel } from './category.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    relatedTo: { type: [Schema.Types.ObjectId], ref: 'Category', default: [] },
    searchCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema
);
