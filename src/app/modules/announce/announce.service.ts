import { IAnnounce } from './announce.interface';
import { Announce } from './announce.model';

// ----------- create announce service -----------
const createAnnounceToDB = async (payload: IAnnounce): Promise<IAnnounce> => {
  // check if announce already exists
  const existingAnnounce = await Announce.findOne({ title: payload.title });
  if (existingAnnounce) {
    throw new Error('Announce already exists');
  }

  const result = await Announce.create(payload);
  return result;
};

export const AnnounceServices = { createAnnounceToDB };
