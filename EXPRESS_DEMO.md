# Express.js Hierarchical Skill Generator - Demo

## What's New

🔥 **ORM-aware database filtering** — Pick an ORM, CLI shows only compatible databases  
🎯 **Multiple selections** — Choose multiple auth methods, caching layers, deployment targets  
📦 **Template-based generation** — No GitHub needed, generates from local templates  
🔧 **Fully customizable** — Add your own templates easily

## Complete Flow Example

### Step 1: Choose Source

```
🚀 AI Skills Fetcher CLI

? Select a skill source:
  Callstack Agent Skills — React Native performance & optimization
  Vercel Agent Skills — React, Next.js & composition best practices
  Vercel Next.js Skills — Next.js app development patterns
❯ Express.js Production Architecture — Backend best practices: ORM, auth, caching, deployment
```

### Step 2: Select ORM

```
📋 Configure your Express.js stack:

? Select ORM/ODM:
  Mongoose (MongoDB only)
❯ Prisma (PostgreSQL, MySQL, MongoDB, SQLite, CockroachDB)
  TypeORM (PostgreSQL, MySQL, MariaDB, SQLite, MongoDB)
  Sequelize (PostgreSQL, MySQL, MariaDB, SQLite, SQL Server)
  None (Raw Database Drivers)
```

**User selects:** Prisma

### Step 3: Select Database(s) — Filtered!

```
? Select Database(s):
❯ ◉ PostgreSQL       ← Available (Prisma supports it)
  ◉ MongoDB          ← Available (Prisma supports it)
  ◉ Mysql            ← Available (Prisma supports it)
  ◉ Sqlite           ← Available (Prisma supports it)
  ◯ CockroachDB      ← Available (Prisma supports it)
```

**Note:** If you had picked **Mongoose**, only **MongoDB** would show!

**User selects:** PostgreSQL + MongoDB

### Step 4: Select Authentication (Multiple)

```
? Select Authentication method(s):
❯ ◉ JWT (JSON Web Tokens)
  ◉ Session-based (Express Session)
  ◯ OAuth 2.0
  ◯ Passport.js
```

**User selects:** JWT + Session-based

### Step 5: Select Caching (Multiple)

```
? Select Caching layer(s):
❯ ◉ Redis
  ◯ Memcached
  ◯ In-memory (Node.js Map)
  ◯ None
```

**User selects:** Redis

### Step 6: Select Real-time (Single)

```
? Select Real-time communication:
❯ WebSockets (Socket.io)
  Server-Sent Events (SSE)
  None (REST only)
```

**User selects:** WebSockets

### Step 7: Select Deployment (Multiple)

```
? Select Deployment target(s):
❯ ◉ Docker & Kubernetes
  ◉ AWS (Lambda, ECS, Fargate)
  ◯ GCP (Cloud Run, GKE)
  ◯ Azure (AKS, Container Apps)
  ◯ Traditional VPS (PM2, Nginx)
  ◯ Serverless (AWS Lambda, Vercel)
```

**User selects:** Docker/K8s + AWS

### Step 8: Confirm

```
📋 Summary:
   ORM: prisma
   Databases: postgresql, mongodb
   Auth: jwt, session-based
   Caching: redis
   Real-time: websockets
   Deployment: docker-kubernetes, aws
   Output: ./expressjs-skill-pack

? Generate skill pack? (Y/n)
```

### Step 9: Generation

```
📦 Generating skill pack...

   ✓ README.md
   ✓ orm-prisma.md
   ✓ auth-jwt.md
   ✓ auth-session-based.md
   ✓ caching-redis.md
   ✓ deployment-docker-kubernetes.md
   ✓ deployment-aws.md

✅ Express.js skill pack generated!

Summary:
  📁 Output: ./expressjs-skill-pack
  📄 Base skills: 6 files
  📄 Stack-specific: 7 files
```

## Generated Structure

```
expressjs-skill-pack/
├── README.md                             # Overview with your selected stack
└── references/
    ├── project-structure.md              # Base (always included)
    ├── api-design-versioning.md          # Base
    ├── error-handling-logging.md         # Base
    ├── security-validation.md            # Base
    ├── testing-coverage.md               # Base
    ├── monitoring-observability.md       # Base
    ├── orm-prisma.md                     # Your ORM choice
    ├── auth-jwt.md                       # Your auth choices
    ├── auth-session-based.md
    ├── caching-redis.md                  # Your caching choice
    ├── deployment-docker-kubernetes.md   # Your deployment choices
    └── deployment-aws.md
```

## Example: README.md Content

```markdown
# Express.js Production Architecture - Skill Pack

## Your Selected Stack

### ORM/ODM
- Prisma

### Databases
- Postgresql
- Mongodb

### Authentication
- JWT
- Session-based

### Caching
- Redis

### Real-time
- WEBSOCKETS

### Deployment
- Docker & Kubernetes
- Aws

## Skills Included

This pack contains production-ready patterns for your Express.js stack.

### Base Skills (Always Included)
- Project structure & organization
- API design & versioning
- Error handling & logging
- Security & validation
- Testing & coverage
- Monitoring & observability

### Generated Skills
All skills based on your selections above.
```

## Example: orm-prisma.md Content

```markdown
# Prisma ORM

## Overview
Next-generation TypeScript-first ORM with auto-generated types.

## Installation
\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Schema (schema.prisma)
\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
\`\`\`

## Usage
\`\`\`javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const user = await prisma.user.create({
  data: { email: 'test@example.com', name: 'Test' }
});
\`\`\`

## Best Practices
- Run migrations in CI/CD
- Use connection pooling (PgBouncer for PostgreSQL)
- Enable query logging in development
- Use select to fetch only needed fields
```

## ORM → Database Filtering

### Example: Mongoose Selected

```
? Select Database(s):
❯ ◉ MongoDB  ← ONLY MongoDB available!
```

### Example: Sequelize Selected

```
? Select Database(s):
❯ ◉ PostgreSQL
  ◯ MySQL
  ◯ MariaDB
  ◯ SQLite
  ◯ SQL Server
```
(MongoDB NOT available because Sequelize doesn't support it)

### Example: None (Raw Drivers) Selected

```
? Select Database(s):
❯ ◯ PostgreSQL
  ◯ MongoDB
  ◯ MySQL
  ◯ SQLite
  ◯ MariaDB
  ◯ SQL Server
  ◯ CockroachDB
  ◯ TimeSeriesDB
```
(ALL databases available!)

## Comparison: GitHub vs Template Sources

### GitHub Sources (Callstack, Vercel, Next-Skills)

✅ Fetch live content from repos  
✅ Always up-to-date  
✅ Just select & download  
❌ Can't customize before fetching  

### Template Source (Express.js)

✅ Hierarchical questions with dependencies  
✅ Multiple selections  
✅ Generated based on YOUR stack  
✅ Easy to add your own templates  
❌ Templates need maintenance  

## Adding Your Own Templates

Edit `cli/index.js`:

```javascript
function generateExpressTemplate(category, option) {
  const templates = {
    'orm-drizzle': `# Drizzle ORM
    
## Your custom template here
\`\`\`,
    // Add more...
  };
  
  return templates[\`\${category}-\${option}\`] || '...';
}
```

Then update the ORM list:

```javascript
expressjs: {
  categories: {
    orm: ['mongoose', 'prisma', 'typeorm', 'sequelize', 'drizzle', 'none'], // ← Added drizzle
    // ...
  }
}
```

And add to compatibility matrix:

```javascript
const ORM_DATABASE_MAP = {
  'drizzle': ['postgresql', 'mysql', 'sqlite'],
  // ...
};
```

Done! Now "Drizzle" appears in the ORM list and filters databases correctly.

## Use Cases

### Scenario 1: Full-Stack Startup

```
ORM: Prisma
DB: PostgreSQL
Auth: JWT + OAuth2
Caching: Redis
Real-time: WebSockets
Deploy: Docker/K8s + AWS

→ Gets production-ready Express.js stack with AWS deployment guides
```

### Scenario 2: Quick REST API

```
ORM: None (raw)
DB: MongoDB
Auth: JWT
Caching: None
Real-time: None
Deploy: Serverless

→ Gets minimal Express.js setup for serverless deployment
```

### Scenario 3: Enterprise Monolith

```
ORM: Sequelize
DB: PostgreSQL + SQL Server
Auth: Session-based + Passport
Caching: Redis + Memcached
Real-time: WebSockets
Deploy: VPS/PM2

→ Gets traditional server setup with multiple auth & caching strategies
```

## Next Steps

1. Run the CLI:
   ```bash
   cd /Users/prabhanjansharma/webknot/global-ai-skils/cli
   npm start
   ```

2. Select "Express.js Production Architecture"

3. Pick your stack

4. Use generated skills with Claude!

## Roadmap

- [ ] Add more ORM templates (Drizzle, Knex, etc.)
- [ ] Add API documentation templates (Swagger, OpenAPI)
- [ ] Add testing templates (Jest, Mocha, Supertest)
- [ ] Add queue/worker templates (Bull, Agenda)
- [ ] Add database migration guides
- [ ] Add monitoring setups (Datadog, New Relic)
- [ ] Support for GraphQL (Apollo Server)
- [ ] Support for gRPC
- [ ] Docker Compose examples for local dev
- [ ] CI/CD pipeline templates (GitHub Actions, GitLab CI)

**Want to contribute a template?** Just add it to the `generateExpressTemplate()` function!
