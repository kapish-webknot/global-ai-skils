# Winston - Production Logging

## Why Winston?
- **Industry standard** - Most popular Node.js logger
- **Multiple transports** - Log to files, console, external services
- **Structured logging** - JSON format for easy parsing
- **Log levels** - error, warn, info, debug, verbose
- **Custom formats** - Flexible output formatting

## Installation
```bash
npm install winston winston-daily-rotate-file
```

## Setup
```typescript
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    // Error logs
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    // Combined logs
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

## Usage
```typescript
import logger from '@core/logger';

// Different log levels
logger.error('Database connection failed', { error: err.message });
logger.warn('Rate limit approaching', { userId, requests: 95 });
logger.info('User logged in', { userId, ip: req.ip });
logger.debug('Query executed', { query, duration: 45 });
```

## Request Logging Middleware
```typescript
import logger from '@core/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
};
```

## Best Practices
- Use structured JSON logging in production
- Include request IDs for tracing
- Rotate logs daily
- Set appropriate log levels
- Never log sensitive data (passwords, tokens)
- Use correlation IDs for distributed tracing