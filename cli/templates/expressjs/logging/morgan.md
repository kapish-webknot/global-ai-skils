# Morgan - HTTP Request Logger

## Why Morgan?
- **Simple setup** - Minimal configuration needed
- **Predefined formats** - combined, common, dev, short, tiny
- **Custom tokens** - Create custom log formats
- **Stream support** - Integrate with other loggers
- **Lightweight** - Focused on HTTP logging only

## Installation
```bash
npm install morgan
```

## Setup
```typescript
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Development - colored output
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Production - Apache combined format
if (process.env.NODE_ENV === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs/access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}
```

## Custom Format
```typescript
morgan.token('user-id', (req) => req.user?.id || 'anonymous');
morgan.token('response-time-ms', (req, res) => {
  return `${(res.responseTime || 0).toFixed(2)}ms`;
});

app.use(morgan(':method :url :status :response-time-ms - :user-id'));
```

## Integration with Winston
```typescript
import logger from '@core/logger';
import morgan from 'morgan';

const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

app.use(morgan('combined', { stream: morganStream }));
```

## Available Formats
| Format | Use Case |
|--------|----------|
| `dev` | Development (colored) |
| `combined` | Production (Apache style) |
| `common` | Standard Apache log |
| `short` | Shorter than combined |
| `tiny` | Minimal output |

## Best Practices
- Use 'dev' format in development
- Use 'combined' format in production
- Stream to proper logger (Winston/Pino)
- Rotate log files
- Filter sensitive URLs (auth endpoints)