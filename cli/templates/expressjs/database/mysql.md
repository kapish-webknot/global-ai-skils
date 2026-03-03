# MySQL Integration

## Connection Setup

\`\`\`javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
\`\`\`

## Best Practices
- Use connection pooling
- Implement prepared statements to prevent SQL injection
- Use transactions for multi-step operations
- Index frequently queried columns
- Use appropriate data types

## Example Query

\`\`\`javascript
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
\`\`\`

## Transaction Example

\`\`\`javascript
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();
  await connection.execute('INSERT INTO users SET ?', [userData]);
  await connection.execute('INSERT INTO profiles SET ?', [profileData]);
  await connection.commit();
} catch (err) {
  await connection.rollback();
  throw err;
} finally {
  connection.release();
}
\`\`\`
