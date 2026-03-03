# Redis Caching

## Setup

\`\`\`javascript
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

await redis.connect();
\`\`\`

## Caching Pattern

\`\`\`javascript
const getUser = async (userId) => {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.users.findById(userId);
  await redis.setEx(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
};
\`\`\`

## Best Practices
- Set appropriate TTL values
- Use key prefixes for organization
- Implement cache invalidation
- Handle connection failures gracefully
- Use pipelining for multiple operations
