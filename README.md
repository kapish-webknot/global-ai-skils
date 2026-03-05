# global-ai-skills

🔥 **Fetch always-updated skill packs from top-tier AI agent skill repositories**

A CLI tool that **dynamically discovers and fetches** Claude-optimized skill packs from:
- 🚀 [Callstack Agent Skills](https://github.com/callstackincubator/agent-skills) — React Native performance & optimization
- ⚡ [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) — React & Next.js best practices (40+ rules)
- 🔧 **Express.js Production Architecture** — Backend best practices with ORM, auth, caching & deployment

## Installation

### Global Installation (Recommended)

```bash
cd cli
npm install
npm link
```

Now use `ai-skills` or `global-ai-skills` command from anywhere:

```bash
ai-skills
# or
global-ai-skills
```

### Local Usage

```bash
cd cli
npm install
npm start
```

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup, troubleshooting, and usage examples.

## Quick Start

```bash
# After global installation
cd your-project
ai-skills

# Select source, skill pack, and sub-skills
# Files will be generated in your current directory
```

## Why This CLI?

Instead of outdated templates, this tool **fetches live content** directly from source repos:
- ✅ **Dynamic discovery** — automatically finds all available skills
- ✅ **Always up-to-date** — fetches the latest from GitHub
- ✅ **Real content** — actual best practices, not placeholders
- ✅ **Multi-source** — Callstack + Vercel (more coming)
- ✅ **Interactive** — pick exactly what you need

## Available Sources

### 🚀 Callstack Agent Skills
From the creators of React Native Performance Guide

**Skills:**
- **React Native Best Practices** (29 sub-skills)  
  JS/React profiling, FPS, state, animations, React Compiler, native profiling, TTI, memory, Turbo Modules, bundling, tree shaking, R8
  
- **React Native Upgrade Workflows** (7 sub-skills)  
  Upgrade helper, dependencies, Expo SDK, verification
  
- **GitHub Workflows**  
  PR workflows, stacked PRs, code review patterns

### ⚡ Vercel Agent Skills
From the creators of Next.js & Vercel

**Skills:**
- **React Best Practices** (40+ rules)  
  Rendering, re-renders, async patterns, server components, caching, bundling, hydration
  
- **Composition Patterns**  
  Component composition, compound components, state patterns, context interfaces
  
- **React Native Skills**  
  List performance, animations, navigation, fonts, state management

**Blog:** [Introducing React Best Practices](https://vercel.com/blog/introducing-react-best-practices)

### 🎯 Vercel Next.js Skills
**NEW!** Next.js specific development patterns

**Repo:** [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills)

### 🔧 Express.js Production Architecture ✨ NEW!
Custom template-based skill generator with **AI context optimization** and **hierarchical dependencies**

**🎯 AI-Optimized Features:**
- **Core Templates** (~150 tokens each) — Ultra-concise, code-first for AI consumption
- **Standard Templates** (~500 tokens each) — Comprehensive reference with examples
- **Context Guide** — Token estimates and smart loading strategies
- **70% Token Reduction** — 1,200 tokens vs 6,000+ for standard templates

**📦 11 Configuration Categories:**
- **ORM/ODM** — Mongoose, Prisma, TypeORM, Sequelize, None
- **Databases** — PostgreSQL, MongoDB, MySQL, SQLite, MariaDB, CockroachDB, TimescaleDB
- **Authentication** — JWT, Session-based, OAuth 2.0, Passport.js
- **Logging** — Winston, Pino (5x faster), Morgan, Bunyan
- **Security** — Helmet, CORS, Zod Validation, Rate Limiting
- **Testing** — Jest, Mocha, Vitest
- **Messaging** — BullMQ, RabbitMQ, Kafka
- **Observability** — Prometheus, Datadog, Sentry
- **Resilience** — Health Checks, Circuit Breaker, Graceful Shutdown
- **Caching** — Redis, Memcached, In-memory
- **Real-time** — WebSockets, Server-Sent Events
- **Deployment** — Docker/K8s, AWS, GCP, Azure, VPS, Serverless

**🚀 Smart Selection Flow:**
```
1. Select ORM: Prisma
2. Databases: ✓ PostgreSQL (filtered by Prisma support)
3. Auth: ✓ JWT
4. Logging: Pino (fastest)
5. Security: ✓ Helmet ✓ CORS ✓ Zod ✓ Rate Limiting
6. Testing: Jest
7. Messaging: BullMQ
8. Observability: Prometheus
9. Resilience: ✓ Health Checks ✓ Graceful Shutdown
10. Caching: ✓ Redis
11. Real-time: WebSockets
12. Deployment: ✓ Docker/K8s
13. Template Depth: Core (AI-optimized) [RECOMMENDED]

→ Generates 24+ skill files + CONTEXT_GUIDE.md
```

**📊 Template Depth Options:**
- **Core** — AI-optimized, ~150 tokens each (Feed to Claude/GPT)
- **Standard** — Full detail, ~500 tokens each (Human reference)
- **Both** — Core for AI + Standard for developers

**ORM → Database Compatibility Matrix:**

| ORM | PostgreSQL | MongoDB | MySQL | SQLite | MariaDB | SQL Server | CockroachDB | TimeSeriesDB |
|-----|:----------:|:-------:|:-----:|:------:|:-------:|:----------:|:-----------:|:------------:|
| Mongoose | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Prisma | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| TypeORM | ✅ | ✅* | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Sequelize | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| None (Raw) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🔧 Express.js Production Architecture
Production-ready backend architecture templates

**Features:**
- **ORM-aware database selection** — Choose ORM first, get compatible databases
- **Multiple ORMs** — Mongoose, Prisma, TypeORM, Sequelize, or raw drivers
- **Databases** — PostgreSQL, MongoDB, MySQL, SQLite, MariaDB, TimescaleDB
- **Authentication** — JWT, Session-based
- **Caching** — Redis, Memcached, In-memory
- **Real-time** — WebSockets (Socket.io), Server-Sent Events
- **Deployment** — Docker/Kubernetes, AWS, VPS, Serverless

**Smart Selection Flow:**
1. Select ORM (e.g., Prisma)
2. Only compatible databases shown (PostgreSQL, MySQL, MongoDB, SQLite)
3. Choose multiple databases, auth methods, caching strategies
4. Pick deployment targets
5. Get customized skill pack with only what you need

## How It Works

1. **Select source** — Callstack or Vercel
2. **CLI discovers** all available skill packs automatically via GitHub API
3. **Pick a skill pack** — React Native, React Best Practices, etc.
4. **Select sub-skills** — or choose "Select All"
5. **Fetches live** from GitHub main branch
6. **Saves locally** with proper structure

## Example Usage

### Frontend Skills (Vercel)
```bash
cd your-project
ai-skills

# 1. Select "Vercel Agent Skills"
# 2. Choose "React Best Practices"
# 3. Select all 40+ rules (or pick specific ones)
# 4. Output to ./react-best-practices

# Now use:
# - react-best-practices/SKILL.md (quick reference)
# - react-best-practices/rules/*.md (40+ detailed rules)
```

### Backend Skills (Express.js) - AI-Optimized
```bash
cd your-backend-project
ai-skills

# 1. Select "Express.js Production Architecture"
# 2. Choose ORM: Prisma
# 3. Select databases: PostgreSQL
# 4. Select auth: JWT
# 5. Select logging: Pino (5x faster than Winston)
# 6. Select security: All (Helmet, CORS, Zod, Rate Limiting)
# 7. Select testing: Jest
# 8. Select messaging: BullMQ
# 9. Select observability: Prometheus
# 10. Select resilience: Health Checks, Graceful Shutdown
# 11. Select caching: Redis
# 12. Select real-time: None (or WebSockets)
# 13. Select deployment: Docker/Kubernetes
# 14. Select template depth: Core (AI-optimized) [RECOMMENDED]
# 15. Output to ./expressjs-skill-pack

# Generated files:
# - CONTEXT_GUIDE.md (How to use with AI - token estimates)
# - README.md (Your stack overview)
# - core/*.md (9 AI-optimized templates, ~1,200 tokens total)
# - references/*.md (24+ detailed guides)

# Feed to Claude/GPT:
# → Attach all files from core/ directory
# → Or select specific files based on CONTEXT_GUIDE.md
```

## Use with Claude/GPT

### Option 1: Complete Context (~1,200 tokens)
1. Run `ai-skills` and select "Core" template depth
2. Navigate to output directory
3. Attach **all files from core/ directory** to Claude
4. Ask questions — full context available

### Option 2: Selective Context (300-600 tokens)
1. Read `CONTEXT_GUIDE.md` for recommendations
2. Attach **only relevant core files** for your task
3. Example: Security setup → Attach helmet.md, cors.md, rate-limiting.md

### Option 3: Reference Lookup
1. Keep standard templates for deep dives
2. Use core templates for AI, standard for humans
3. Best of both worlds

## Updates

Re-run `ai-skills` anytime to fetch the latest:
```bash
ai-skills
```

The CLI always pulls from the `main` branch, so you get the freshest content.

## Adding New Sources

Want to add your own skill source? Edit `cli/index.js`:

```javascript
const SOURCES = {
  callstack: { ... },
  vercel: { ... },
  yourSource: {
    name: 'Your Skill Source',
    repo: 'username/repo',
    branch: 'main',
    url: 'https://github.com/username/repo',
    description: 'Your description',
    skillsPath: 'skills'
  }
};
```

The CLI will auto-discover all skills with a `SKILL.md` file.

---
*Powered by [Callstack](https://github.com/callstackincubator/agent-skills) & [Vercel](https://github.com/vercel-labs/agent-skills)*
