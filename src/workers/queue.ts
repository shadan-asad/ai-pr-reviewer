import Queue from 'bull';
import { config } from '../config/config';

const reviewQueue = new Queue('reviewQueue', config.redisUrl);

reviewQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

reviewQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
});

export default reviewQueue;
