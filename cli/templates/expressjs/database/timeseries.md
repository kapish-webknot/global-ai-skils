# TimeSeriesDB (TimescaleDB) Integration

## Connection Setup

\`\`\`javascript
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.TIMESCALE_URL,
  max: 20
});

// Create hypertable
await pool.query(\`
  CREATE TABLE IF NOT EXISTS metrics (
    time TIMESTAMPTZ NOT NULL,
    device_id TEXT,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION
  );
  
  SELECT create_hypertable('metrics', 'time', if_not_exists => TRUE);
\`);
\`\`\`

## Best Practices
- Use hypertables for time-series data
- Implement data retention policies
- Use continuous aggregates for analytics
- Compress old data automatically
- Index on time and frequently queried dimensions

## Example Query

\`\`\`javascript
// Insert time-series data
await pool.query(
  'INSERT INTO metrics (time, device_id, temperature) VALUES ($1, $2, $3)',
  [new Date(), 'device-1', 23.5]
);

// Query with time bucket
const result = await pool.query(\`
  SELECT time_bucket('1 hour', time) AS hour,
         AVG(temperature) as avg_temp
  FROM metrics
  WHERE time > NOW() - INTERVAL '24 hours'
  GROUP BY hour
  ORDER BY hour DESC
\`);
\`\`\`

## Retention Policy

\`\`\`javascript
// Drop data older than 30 days
await pool.query(\`
  SELECT add_retention_policy('metrics', INTERVAL '30 days');
\`);
\`\`\`
