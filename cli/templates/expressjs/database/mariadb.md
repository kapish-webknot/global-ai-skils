# MariaDB Integration

## Connection Setup

\`\`\`javascript
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});
\`\`\`

## Best Practices
- Use connection pooling
- Implement prepared statements
- Use transactions for data consistency
- Index frequently queried columns
- Use appropriate storage engines (InnoDB for transactions)

## Example Query

\`\`\`javascript
let conn;
try {
  conn = await pool.getConnection();
  const rows = await conn.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows;
} finally {
  if (conn) conn.release();
}
\`\`\`

## Transaction Example

\`\`\`javascript
let conn;
try {
  conn = await pool.getConnection();
  await conn.beginTransaction();
  await conn.query('INSERT INTO users VALUES (?, ?)', [id, name]);
  await conn.query('INSERT INTO profiles VALUES (?, ?)', [userId, bio]);
  await conn.commit();
} catch (err) {
  if (conn) await conn.rollback();
  throw err;
} finally {
  if (conn) conn.release();
}
\`\`\`
