import { DisclaimerModel, IDisclaimer } from './disclaimer.interface';
import { Disclaimer } from './disclaimer.model';

// create or update disclaimer
const createUpdateDisclaimer = async (payload: IDisclaimer) => {
  const result = await Disclaimer.findOneAndUpdate(
    { type: payload.type },
    { $set: payload },
    { new: true, upsert: true }
  );
  return result;
};

export const DisclaimerServices = { createUpdateDisclaimer };
