# Prometheus - Metrics & Monitoring

## Setup (1 min)
```bash
npm install prom-client
```

```typescript
import client from 'prom-client';

// Enable default metrics (CPU, memory)
client.collectDefaultMetrics({ prefix: 'api_' });

// Custom metrics
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status']
});

// Middleware
app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});
```

**Key:** Industry standard, time-series metrics | **Tokens:** ~140