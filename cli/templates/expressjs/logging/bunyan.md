# Bunyan - JSON Logging

## Why Bunyan?
- **JSON-first** - Native structured logging
- **CLI viewer** - Pretty print with bunyan CLI
- **Child loggers** - Contextual logging
- **Serializers** - Automatic object serialization
- **Battle-tested** - Used by Netflix, Joyent

## Installation
```bash
npm install bunyan
```

## Setup
```typescript
import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'api',
  level: process.env.LOG_LEVEL || 'info',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      path: 'logs/error.log'
    }
  ],
  serializers: bunyan.stdSerializers
});

export default logger;
```

## Usage
```typescript
import logger from '@core/logger';

// Basic logging
logger.info('Server started');
logger.error({ err }, 'Database connection failed');

// Child logger with context
const reqLogger = logger.child({ req_id: req.id });
reqLogger.info('Processing request');
```

## Request Logging
```typescript
app.use((req, res, next) => {
  req.log = logger.child({
    req_id: req.id,
    method: req.method,
    url: req.url
  });
  
  req.log.info('Incoming request');
  next();
});
```

## CLI Viewer
```bash
# Pretty print logs
node app.js | bunyan

# Filter by level
node app.js | bunyan -l error
```

## Best Practices
- Use serializers for consistent object logging
- Create child loggers per request
- Include correlation IDs
- Use JSON in production
- Pretty print only in development