# CORS - Cross-Origin Resource Sharing

## Setup (30 sec)
```bash
npm install cors
```

```typescript
import cors from 'cors';

// Allow all (development only)
app.use(cors());

// Production config
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
  maxAge: 600
}));
```

## Dynamic Origin
```typescript
app.use(cors({
  origin: (origin, callback) => {
    const allowed = ['https://app.com', 'https://admin.app.com'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed'));
    }
  }
}));
```

**Key:** Whitelist origins in production, never `*` with credentials | **Tokens:** ~90