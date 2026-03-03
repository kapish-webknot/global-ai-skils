# MongoDB Integration

## Native Driver Setup

\`\`\`javascript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10
});

await client.connect();
const db = client.db('myapp');
\`\`\`

## Best Practices
- Use indexes for performance
- Implement proper error handling
- Use bulk operations for multiple writes
- Enable retryable writes
- Use aggregation pipeline for complex queries

## Example

\`\`\`javascript
const users = db.collection('users');
await users.createIndex({ email: 1 }, { unique: true });
const user = await users.findOne({ email });
\`\`\`
