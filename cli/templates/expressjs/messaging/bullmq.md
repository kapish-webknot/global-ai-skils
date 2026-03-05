# BullMQ - Redis-Based Job Queue

## Why BullMQ?
- **Reliable** - At-least-once delivery guarantee
- **Scalable** - Distribute jobs across workers
- **Priority queues** - Process important jobs first
- **Retry logic** - Automatic retry with backoff
- **Job scheduling** - Delayed and recurring jobs

## Installation
```bash
npm install bullmq ioredis
```

## Setup
```typescript
import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

// Create queue
export const emailQueue = new Queue('emails', { connection });

// Create worker
const worker = new Worker('emails', async (job) => {
  const { to, subject, body } = job.data;
  
  console.log(`Processing email job ${job.id}`);
  // Send email logic here
  await sendEmail(to, subject, body);
  
  return { sent: true, timestamp: new Date() };
}, {
  connection,
  concurrency: 5 // Process 5 jobs concurrently
});

// Event handlers
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
```

## Adding Jobs
```typescript
import { emailQueue } from '@core/queue';

// Simple job
await emailQueue.add('send-welcome', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Welcome to our platform'
});

// Job with options
await emailQueue.add('send-notification', data, {
  attempts: 3, // Retry 3 times
  backoff: {
    type: 'exponential',
    delay: 1000 // 1s, 2s, 4s
  },
  delay: 5000, // Delay 5 seconds
  priority: 1 // Higher priority
});

// Recurring job
await emailQueue.add('daily-report', data, {
  repeat: {
    pattern: '0 9 * * *', // Every day at 9 AM
    tz: 'America/New_York'
  }
});
```

## Job Processing Patterns
```typescript
// Batch processing
const worker = new Worker('batch-processor', async (job) => {
  const items = job.data.items;
  const results = [];
  
  for (const item of items) {
    await job.updateProgress(results.length / items.length * 100);
    results.push(await processItem(item));
  }
  
  return results;
}, { connection });

// Job chaining (Flow)
import { FlowProducer } from 'bullmq';

const flow = new FlowProducer({ connection });
await flow.add({
  name: 'parent-job',
  queueName: 'parent-queue',
  data: {},
  children: [
    { name: 'child-1', data: {}, queueName: 'child-queue' },
    { name: 'child-2', data: {}, queueName: 'child-queue' }
  ]
});
```

## Best Practices
- Use separate queues for different job types
- Set appropriate concurrency based on resources
- Implement retry logic with exponential backoff
- Monitor queue metrics (pending, active, failed)
- Clean up completed jobs regularly
- Use job priorities for critical tasks