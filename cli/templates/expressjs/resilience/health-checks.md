# Health Checks & Readiness Probes

## Why Health Checks?
- **Load balancer** - Route traffic only to healthy instances
- **Kubernetes** - Liveness and readiness probes
- **Monitoring** - Alert on unhealthy services
- **Zero-downtime** - Graceful deployment handling

## Basic Health Check
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

## Comprehensive Health Check
```typescript
import { prisma } from '@core/database';
import { redis } from '@core/cache';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    queue: 'up' | 'down';
  };
  uptime: number;
  memory: NodeJS.MemoryUsage;
}

app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    cache: await checkCache(),
    queue: await checkQueue()
  };

  const allHealthy = Object.values(checks).every(status => status === 'up');
  const someUnhealthy = Object.values(checks).some(status => status === 'down');

  const health: HealthStatus = {
    status: allHealthy ? 'healthy' : someUnhealthy ? 'unhealthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: checks,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

async function checkDatabase(): Promise<'up' | 'down'> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'up';
  } catch {
    return 'down';
  }
}

async function checkCache(): Promise<'up' | 'down'> {
  try {
    await redis.ping();
    return 'up';
  } catch {
    return 'down';
  }
}

async function checkQueue(): Promise<'up' | 'down'> {
  try {
    // Check queue connection
    return 'up';
  } catch {
    return 'down';
  }
}
```

## Kubernetes Probes
```typescript
// Liveness probe - Is the app running?
app.get('/health/live', (req, res) => {
  res.json({ status: 'alive' });
});

// Readiness probe - Can the app serve traffic?
app.get('/health/ready', async (req, res) => {
  const dbHealthy = await checkDatabase();
  
  if (dbHealthy === 'up') {
    res.json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Startup probe - Has the app finished starting?
let appReady = false;

app.get('/health/startup', (req, res) => {
  if (appReady) {
    res.json({ status: 'started' });
  } else {
    res.status(503).json({ status: 'starting' });
  }
});

// Set ready after initialization
async function initialize() {
  await connectDatabase();
  await warmupCache();
  appReady = true;
}
```

## Kubernetes Deployment YAML
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      containers:
      - name: api
        image: api:latest
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        startupProbe:
          httpGet:
            path: /health/startup
            port: 3000
          failureThreshold: 30
          periodSeconds: 10
```

## Best Practices
- Don't perform heavy operations in health checks
- Use separate endpoints for liveness/readiness
- Include dependency checks in readiness probe
- Return appropriate HTTP status codes (200 or 503)
- Monitor health check endpoint performance
- Include version info in health response