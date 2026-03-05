# Redis Rate Limiting

## Why Redis Rate Limiting?
- **Distributed** - Works across multiple servers
- **Persistent** - Survives server restarts
- **Scalable** - Handle millions of requests
- **Precise** - Atomic operations for accuracy
- **Battle-tested** - Production-proven solution

## Installation
```bash
npm install express-rate-limit rate-limit-redis ioredis
```

## Basic Setup
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:' // Rate limit key prefix
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Apply to all routes
app.use('/api/', limiter);
```

## Tiered Rate Limiting
```typescript
const createTierLimiter = (tier: 'free' | 'pro' | 'enterprise') => {
  const limits = {
    free: { windowMs: 60000, max: 10 },
    pro: { windowMs: 60000, max: 100 },
    enterprise: { windowMs: 60000, max: 1000 }
  };

  return rateLimit({
    store: new RedisStore({ client: redis, prefix: `rl:${tier}:` }),
    ...limits[tier]
  });
};

// Middleware to apply tier-based limit
app.use('/api', (req, res, next) => {
  const tier = req.user?.subscription || 'free';
  const limiter = createTierLimiter(tier);
  limiter(req, res, next);
});
```

## Per-User Rate Limiting
```typescript
const userLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: 'rl:user:' }),
  windowMs: 60000,
  max: 50,
  keyGenerator: (req) => req.user?.id || req.ip,
  skip: (req) => !req.user // Skip for unauthenticated
});
```

## Different Limits Per Endpoint
```typescript
// Strict limit for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: 'rl:auth:' }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true
});

app.post('/auth/login', authLimiter, loginHandler);
app.post('/auth/register', authLimiter, registerHandler);

// Relaxed limit for public APIs
const publicLimiter = rateLimit({
  store: new RedisStore({ client: redis, prefix: 'rl:public:' }),
  windowMs: 60000,
  max: 1000
});

app.get('/api/public/*', publicLimiter);
```

## Best Practices
- Use Redis in production for distributed systems
- Set different limits for different endpoints
- Implement tiered limits based on user plans
- Return clear error messages with retry info
- Monitor rate limit hits in production
- Use `skipSuccessfulRequests` for login endpoints