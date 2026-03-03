# Prisma ORM

## Setup

\`\`\`javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
\`\`\`

## Schema Example

\`\`\`prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  posts     Post[]
}
\`\`\`

## Best Practices

\`\`\`javascript
// Use transactions
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.profile.create({ data: profileData })
]);

// Connection pooling
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});
\`\`\`

## Tips
- Use migrations for schema changes
- Leverage type safety
- Use connection pooling in production
- Enable query logging in development
