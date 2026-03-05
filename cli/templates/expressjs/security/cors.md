# CORS - Cross-Origin Resource Sharing

## Why CORS?
- **API security** - Control which domains can access your API
- **Credential handling** - Manage cookies and authentication
- **Preflight requests** - Handle OPTIONS requests
- **Production ready** - Prevent unauthorized access

## Installation
```bash
npm install cors
```

## Basic Setup (Express)
```typescript
import cors from 'cors';

// Allow all origins (Development only!)
app.use(cors());

// Production configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600 // Cache preflight for 10 minutes
}));
```

## Dynamic Origin
```typescript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

## Fastify Setup
```typescript
import cors from '@fastify/cors';

await fastify.register(cors, {
  origin: ['https://yourdomain.com'],
  credentials: true
});
```

## Best Practices
- Never use `origin: '*'` with `credentials: true`
- Whitelist specific origins in production
- Use environment variables for origin list
- Cache preflight requests
- Monitor CORS errors in production