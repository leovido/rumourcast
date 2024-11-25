import { QueueName, getWorker, getQueue } from "./utils";
import { handler } from "./handler";

const run = async () => {
  const usePromotePost = !!process.argv[2];
  const queueName = usePromotePost ? QueueName.PromotePost : QueueName.Default;
  console.log(`Starting worker for ${queueName}`);
  const worker = getWorker(queueName, async (job) => {
    console.log(`[${job.id}] started ${job.data.type}`);
    await handler(job.data);
    console.log(`[${job.id}] completed ${job.data.type}`);
  });

  worker.on("failed", (job, err) => {
    if (job) {
      console.log(`[${job.id}] failed with ${err.message}`);
    }
  });
};

run().catch((e) => {
  console.error(e);
});
