# Pino - Ultra-Fast Logger

## Setup (1 min)
```bash
npm install pino pino-pretty
```

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' 
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined
});

export default logger;
```

## Usage
```typescript
logger.info('Server started on port 3000');
logger.error({ err, userId }, 'Database query failed');
logger.warn({ attempts: 3 }, 'Rate limit approaching');

// Child loggers
const reqLogger = logger.child({ reqId: req.id });
reqLogger.info('Processing request');
```

## Production Tips
- 5x faster than Winston
- Use pino-pretty only in dev
- Child loggers for request context
- Stream to external services

**Full docs:** `/reference/logging/pino.md` | **Tokens:** ~150