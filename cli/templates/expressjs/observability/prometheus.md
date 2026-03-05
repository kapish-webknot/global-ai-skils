# Prometheus - Metrics & Monitoring

## Why Prometheus?
- **Industry standard** - Most popular metrics solution
- **Pull-based** - Server scrapes metrics from your app
- **Time-series DB** - Efficient metric storage
- **PromQL** - Powerful query language
- **Alerting** - Built-in alert manager

## Installation
```bash
npm install prom-client
```

## Setup
```typescript
import client from 'prom-client';

// Enable default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({
  register: client.register,
  prefix: 'api_'
});

// Custom metrics
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});
```

## Middleware
```typescript
import { httpRequestDuration, httpRequestTotal } from '@core/metrics';

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  
  res.on('finish', () => {
    const route = req.route?.path || req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode
    };
    
    end(labels);
    httpRequestTotal.inc(labels);
  });
  
  next();
});
```

## Metrics Endpoint
```typescript
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});
```

## Custom Business Metrics
```typescript
// Track user signups
export const userSignups = new client.Counter({
  name: 'user_signups_total',
  help: 'Total number of user signups'
});

// Track database query duration
export const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['query_type', 'table']
});

// Usage
userSignups.inc();
const timer = dbQueryDuration.startTimer();
await db.query(...);
timer({ query_type: 'select', table: 'users' });
```

## Prometheus Configuration (prometheus.yml)
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

## Best Practices
- Use histograms for latency metrics
- Use counters for event counts
- Use gauges for current state
- Include relevant labels
- Don't create too many unique label combinations
- Expose metrics on separate endpoint