# Health Checks - K8s Probes

## Basic Health Check
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});
```

## Production Health Check
```typescript
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDB(),
    redis: await checkRedis()
  };
  
  const healthy = Object.values(checks).every(c => c === 'up');
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    checks,
    uptime: process.uptime()
  });
});

async function checkDB() {
  try {
    await db.query('SELECT 1');
    return 'up';
  } catch {
    return 'down';
  }
}
```

## Kubernetes Probes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
```

**Key:** Return 200 if healthy, 503 if not | **Tokens:** ~110