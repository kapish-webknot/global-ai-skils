# Helmet - HTTP Security Headers

## Why Helmet?
- **Sets security headers** - Protects against common attacks
- **Prevents XSS** - Cross-site scripting protection
- **Clickjacking protection** - X-Frame-Options header
- **MIME sniffing prevention** - X-Content-Type-Options
- **HSTS enforcement** - Forces HTTPS connections

## Installation
```bash
npm install helmet
```

## Express Setup
```typescript
import helmet from 'helmet';

app.use(helmet());
```

## Advanced Configuration
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
}));
```

## Headers Added
| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| X-Frame-Options | SAMEORIGIN | Prevents clickjacking |
| X-XSS-Protection | 1; mode=block | XSS filter |
| Strict-Transport-Security | max-age=... | Forces HTTPS |
| Content-Security-Policy | ... | Controls resources |
| X-Permitted-Cross-Domain-Policies | none | Flash/PDF protection |

## Fastify Setup
```typescript
import helmet from '@fastify/helmet';

await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"]
    }
  }
});
```

## Best Practices
- Enable all protections in production
- Test CSP thoroughly (can break apps)
- Use report-only mode first for CSP
