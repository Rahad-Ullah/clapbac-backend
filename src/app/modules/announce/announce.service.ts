import QueryBuilder from '../../builder/QueryBuilder';
import { AnnounceStatus } from './announce.constants';
import { redis } from './announce.controller';
import { IAnnounce } from './announce.interface';
import { Announce } from './announce.model';

// ----------- create announce service -----------
const createAnnounceToDB = async (payload: IAnnounce): Promise<IAnnounce> => {
  // check if announce already exists
  const existingAnnounce = await Announce.findOne({
    title: payload.title,
    audience: payload.audience,
    status: { $ne: AnnounceStatus.ARCHIVED },
  });
  if (existingAnnounce) {
    throw new Error('Announce already exists');
  }
  // set status as scheduled
  if (payload.scheduleDate) {
    payload.status = AnnounceStatus.SCHEDULED;
  }

  const result = await Announce.create(payload);

  // when publishing, update other active announces status to draft
  if (payload.status === AnnounceStatus.ACTIVE) {
    await Announce.updateMany(
      {
        audience: payload.audience,
        status: { $eq: AnnounceStatus.ACTIVE },
        _id: { $ne: result._id },
      },
      { status: AnnounceStatus.DRAFT }
    );

    // update redis cache as well
    await redis.del(`announce:active:${payload.audience}`);
  }

  return result;
};

// ----------- update announce -----------
const updateAnnounce = async (id: string, payload: Partial<IAnnounce>) => {
  // check if announce exists
  const existingAnnounce = await Announce.findById(id);
  if (!existingAnnounce) {
    throw new Error('Announce not found');
  }
  if (existingAnnounce.status === AnnounceStatus.ARCHIVED) {
    throw new Error('Announce is archived. Cannot update.');
  }

  if (payload.scheduleDate) {
    payload.status = AnnounceStatus.SCHEDULED;
  }

  const result = await Announce.findByIdAndUpdate(id, payload, { new: true });

  // when publishing, update other active announces status to draft
  if (payload.status === AnnounceStatus.ACTIVE) {
    await Announce.updateMany(
      {
        audience: payload.audience,
        status: { $eq: AnnounceStatus.ACTIVE },
        _id: { $ne: id },
      },
      { status: AnnounceStatus.DRAFT }
    );

    // update redis cache as well
    await redis.del(`announce:active:${payload.audience}`);
  }

  return result;
};

// ----------- archive announce -----------
const archiveAnnounce = async (id: string) => {
  // check if announce exists
  const existingAnnounce = await Announce.findById(id);
  if (!existingAnnounce) {
    throw new Error('Announce not found');
  }

  const result = await Announce.findByIdAndUpdate(
    id,
    { status: AnnounceStatus.ARCHIVED },
    { new: true }
  );
  return result;
};

// get active announce
const getActiveAnnounce = async (audience: string) => {
  return Announce.findOne({
    audience,
    status: AnnounceStatus.ACTIVE,
  }).lean();
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
  archiveAnnounce,
  getActiveAnnounce,
  getAllAnnounces,
};
