import QueryBuilder from '../../builder/QueryBuilder';
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

// ----------- update announce -----------
const updateAnnounce = async (id: string, payload: Partial<IAnnounce>) => {
  // check if announce exists
  const existingAnnounce = await Announce.findById(id);
  if (!existingAnnounce) {
    throw new Error('Announce not found');
  }

  const result = await Announce.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// ----------- delete announce -----------
const deleteAnnounce = async (id: string) => {
  // check if announce exists
  const existingAnnounce = await Announce.findById(id);
  if (!existingAnnounce) {
    throw new Error('Announce not found');
  }

  const result = await Announce.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// get all announces
const getAllAnnounces = async (query: Record<string, unknown>) => {
  const announceQuery = new QueryBuilder(
    Announce.find({ isDeleted: false }),
    query
  )
    .search(['title'])
    .filter()
    .paginate()
    .sort();

  const [data, pagination] = await Promise.all([
    announceQuery.modelQuery.lean(),
    announceQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const AnnounceServices = {
  createAnnounceToDB,
  updateAnnounce,
  deleteAnnounce,
  getAllAnnounces,
};
