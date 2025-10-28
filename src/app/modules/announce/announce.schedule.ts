import cron from 'node-cron';
import { Announce } from './announce.model';
import { AnnounceStatus } from './announce.constants';

// Runs every minute
cron.schedule('*/5 * * * *', async () => {
  console.log('[Announce Cron] Running at', new Date().toISOString());

  const now = new Date();

  // Find all audiences that have scheduled announcements ready
  const audiences = await Announce.distinct('audience', {
    status: AnnounceStatus.SCHEDULED,
    scheduleDate: { $lte: now },
  });

  for (const audience of audiences) {
    const latest = await Announce.findOne({
      audience,
      status: AnnounceStatus.SCHEDULED,
      scheduleDate: { $lte: now },
    })
      .sort({ scheduleDate: -1 })
      .lean();

    if (!latest) continue;

    await Announce.bulkWrite([
      {
        updateOne: {
          filter: { _id: latest._id },
          update: { $set: { status: AnnounceStatus.ACTIVE } },
        },
      },
      {
        updateMany: {
          filter: {
            audience,
            status: AnnounceStatus.SCHEDULED,
            _id: { $ne: latest._id },
          },
          update: { $set: { status: AnnounceStatus.DRAFT } },
        },
      },
    ]);
  }

  console.log('[Announce Cron] Finished processing audiences:', audiences);
});
