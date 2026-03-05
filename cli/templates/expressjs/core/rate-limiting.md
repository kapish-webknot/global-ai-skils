# Rate Limiting - DDoS Protection

## Setup (1 min)
```bash
npm install express-rate-limit rate-limit-redis ioredis
```

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const limiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: 'rl:' }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { error: 'Too many requests' }
});

app.use('/api/', limiter);
```

## Per-User Limits
```typescript
const userLimiter = rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 60000,
  max: 50,
  keyGenerator: (req) => req.user?.id || req.ip
});
```

## Auth Endpoint (Strict)
```typescript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 attempts
  skipSuccessfulRequests: true
});

app.post('/login', authLimiter, loginHandler);
```

**Key:** Use Redis for distributed systems, strict limits on auth | **Tokens:** ~120