# Changelog - Global AI Skills CLI

## v2.0.0 (2026-03-03) - Major Update

### 🚀 New Features

#### 1. Express.js Template Source (Hierarchical Dependencies)
- **ORM-aware database filtering** — Database options dynamically filtered based on ORM selection
- **Multiple selections** — Auth, caching, and deployment support multiple choices
- **Generated skill packs** — Custom combinations based on your exact stack
- **5 ORM options:** Mongoose, Prisma, TypeORM, Sequelize, None (raw drivers)
- **8 databases:** PostgreSQL, MongoDB, MySQL, SQLite, MariaDB, SQL Server, CockroachDB, TimeSeriesDB
- **4 auth methods:** JWT, Session-based, OAuth2, Passport.js
- **3 caching layers:** Redis, Memcached, In-memory
- **3 real-time options:** WebSockets (Socket.io), SSE, None
- **6 deployment targets:** Docker/K8s, AWS, GCP, Azure, VPS/PM2, Serverless

#### 2. Vercel Next.js Skills Source
- Added `next-skills` repository from Vercel
- Direct fetch from `vercel-labs/next-skills`

#### 3. Enhanced CLI Flow
- Source type detection (GitHub vs Template)
- Hierarchical question routing
- Dependency-aware filtering
- Multi-select support for applicable categories

### 🔧 Technical Changes

#### ORM → Database Compatibility Matrix

```javascript
const ORM_DATABASE_MAP = {
  'mongoose': ['mongodb'],
  'prisma': ['postgresql', 'mongodb', 'mysql', 'sqlite', 'cockroachdb'],
  'typeorm': ['postgresql', 'mongodb', 'mysql', 'sqlite', 'mariadb'],
  'sequelize': ['postgresql', 'mysql', 'mariadb', 'sqlite', 'sqlserver'],
  'none': ['postgresql', 'mongodb', 'mysql', 'sqlite', 'mariadb', 'sqlserver', 'cockroachdb', 'timeseries']
};
```

#### Template Generation System

```javascript
function generateExpressTemplate(category, option) {
  // Returns pre-written markdown templates with:
  // - Installation instructions
  // - Setup code
  // - Usage examples
  // - Best practices
}
```

### 📦 Output Structure

#### GitHub Sources (Callstack, Vercel, Next-Skills)
```
skill-pack/
├── SKILL.md               # Main skill reference
├── README.md              # Generated overview
└── references/            # or rules/
    ├── skill-1.md
    ├── skill-2.md
    └── ...
```

#### Template Source (Express.js)
```
expressjs-skill-pack/
├── README.md              # Your selected stack
└── references/
    ├── project-structure.md          # Base (always)
    ├── api-design-versioning.md      # Base
    ├── error-handling-logging.md     # Base
    ├── security-validation.md        # Base
    ├── testing-coverage.md           # Base
    ├── monitoring-observability.md   # Base
    ├── orm-{choice}.md               # Your ORM
    ├── auth-{choice}.md              # Your auth(s)
    ├── caching-{choice}.md           # Your cache
    └── deployment-{choice}.md        # Your deploy(s)
```

### 📚 Documentation

#### New Files
- `EXPRESS_DEMO.md` — Complete hierarchical flow example
- `CHANGELOG.md` — This file

#### Updated Files
- `README.md` — Added Express.js & next-skills sources, compatibility matrix
- `DEMO.md` — Existing demo for GitHub sources

### 🔍 Example Usage

```bash
cd cli
npm start

# Choose "Express.js Production Architecture"
# Select: Prisma → PostgreSQL + MongoDB → JWT + OAuth2 → Redis → WebSockets → Docker/K8s
# Generates 13 skill files tailored to your stack
```

### ✅ Validation

#### ORM Filtering Examples

**Mongoose → Only MongoDB available**
```
? Select Database(s):
❯ ◉ MongoDB
```

**Prisma → 5 databases available**
```
? Select Database(s):
❯ ◉ PostgreSQL
  ◉ MongoDB
  ◉ MySQL
  ◉ SQLite
  ◯ CockroachDB
```

**None (Raw) → All 8 databases available**
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

### 🎯 Breaking Changes

None — fully backward compatible with v1.0.0

### 🔮 Future Plans

- [ ] Add Drizzle ORM
- [ ] Add Knex.js
- [ ] GraphQL (Apollo Server) templates
- [ ] gRPC templates
- [ ] Message queue templates (Bull, Agenda, BullMQ)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Testing frameworks (Jest, Mocha, Supertest)
- [ ] Docker Compose local dev setups
- [ ] CI/CD pipeline templates
- [ ] Monitoring setups (Datadog, New Relic, Sentry)
- [ ] Add more GitHub sources (Angular, Vue, Svelte, etc.)

---

## v1.0.0 (2026-03-03) - Initial Release

### Features
- Dynamic skill discovery from GitHub repos
- Callstack Agent Skills integration
- Vercel Agent Skills integration
- Fetch live content from main branch
- Interactive CLI with Inquirer.js
- Checkbox selection for sub-skills
- Auto-generated README files

### Sources
- Callstack: React Native Best Practices (29 skills)
- Callstack: React Native Upgrade Workflows (7 skills)
- Callstack: GitHub Workflows
- Vercel: React Best Practices (40+ rules)
- Vercel: Composition Patterns (8 skills)
- Vercel: React Native Skills (30+ skills)
