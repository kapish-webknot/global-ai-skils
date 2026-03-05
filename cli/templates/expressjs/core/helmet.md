# Helmet - HTTP Security Headers

## Setup (30 sec)
```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

## Custom Config
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: { maxAge: 31536000 }
}));
```

## Protects Against
XSS, clickjacking, MIME sniffing, DNS prefetch attacks

**Production:** Enable HSTS, strict CSP | **Tokens:** ~120