# BullMQ - Job Queue

## Setup (2 min)
```bash
npm install bullmq ioredis
```

```typescript
import { Queue, Worker } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

// Create queue
export const emailQueue = new Queue('emails', { connection });

// Create worker
new Worker('emails', async (job) => {
  const { to, subject } = job.data;
  await sendEmail(to, subject);
}, { connection, concurrency: 5 });
```

## Add Jobs
```typescript
await emailQueue.add('send-welcome', {
  to: 'user@example.com',
  subject: 'Welcome!'
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 }
});
```

## Scheduled Jobs
```typescript
await emailQueue.add('daily-report', data, {
  repeat: { pattern: '0 9 * * *' } // 9 AM daily
});
```

**Key:** Reliable, scalable async jobs with retry logic | **Tokens:** ~150