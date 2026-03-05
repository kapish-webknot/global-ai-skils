# Pino - Ultra-Fast Logging

## Why Pino?
- **Fastest logger** - 5x faster than Winston
- **Low overhead** - Minimal performance impact
- **JSON output** - Structured logs by default
- **Pretty printing** - Development-friendly output
- **Child loggers** - Contextual logging

## Installation
```bash
npm install pino pino-pretty
```

## Setup
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' 
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  base: { service: 'api' },
  timestamp: pino.stdTimeFunctions.isoTime
});

export default logger;
```

## Usage
```typescript
import logger from '@core/logger';

// Basic logging
logger.info('Server started');
logger.error({ err }, 'Database connection failed');
logger.warn({ userId, attempts: 3 }, 'Login attempts exceeded');

// Child loggers for context
const userLogger = logger.child({ userId: '123' });
userLogger.info('User action performed'); // Includes userId automatically
```

## Request Logging Middleware
```typescript
import pino from 'pino-http';

app.use(pino({
  logger: logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customProps: (req, res) => ({
    requestId: req.id,
    userId: req.user?.id
  })
}));
```

## Performance Comparison
| Logger | Ops/sec | Relative |
|--------|---------|----------|
| Pino | 1,000,000+ | Fastest |
| Bunyan | 500,000 | 2x slower |
| Winston | 100,000 | 10x slower |

## Best Practices
- Use child loggers for request context
- Enable pretty printing only in development
- Use redaction for sensitive data
- Stream to external services in production
- Include correlation IDs for tracing