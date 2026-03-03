# SQLite Integration

## Connection Setup

\`\`\`javascript
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});
\`\`\`

## Best Practices
- Use WAL mode for better concurrency
- Create indexes for frequently queried columns
- Use prepared statements
- Enable foreign keys
- Regular VACUUM for optimization

## Example Query

\`\`\`javascript
const user = await db.get(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
\`\`\`

## Transaction Example

\`\`\`javascript
await db.run('BEGIN TRANSACTION');
try {
  await db.run('INSERT INTO users VALUES (?, ?)', [id, name]);
  await db.run('INSERT INTO profiles VALUES (?, ?)', [userId, bio]);
  await db.run('COMMIT');
} catch (err) {
  await db.run('ROLLBACK');
  throw err;
}
\`\`\`

## Configuration

\`\`\`javascript
// Enable foreign keys
await db.run('PRAGMA foreign_keys = ON');
// Enable WAL mode
await db.run('PRAGMA journal_mode = WAL');
\`\`\`
