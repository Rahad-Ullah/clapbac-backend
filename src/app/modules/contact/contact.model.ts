import { Schema, model } from 'mongoose';
import { IContact, ContactModel } from './contact.interface';

const contactSchema = new Schema<IContact, ContactModel>(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Contact = model<IContact, ContactModel>('Contact', contactSchema);
