# PostgreSQL Integration

## Connection Setup

\`\`\`javascript
import pg from 'pg';
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000
});
\`\`\`

## Best Practices
- Use connection pooling
- Implement prepared statements
- Use transactions for multi-step operations
- Index frequently queried columns
- Use JSONB for flexible data

## Example Query

\`\`\`javascript
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
\`\`\`
