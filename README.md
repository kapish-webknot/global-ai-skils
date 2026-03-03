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
npm install -g .
```

Now use `gs` command from anywhere:

```bash
gs
```

### Local Usage

```bash
cd cli
npm install
npm start
```

## Quick Start

```bash
# After global installation
cd your-project
gs

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

### 🔧 Express.js Production Architecture
**NEW!** Custom template-based skill generator with **hierarchical dependencies**

**Features:**
- **ORM-aware database selection** — Pick Mongoose, Prisma, TypeORM, Sequelize, or raw drivers
- **Filtered database options** — Only shows compatible DBs based on ORM choice
- **Multiple selections** — Auth, caching, deployment targets
- **Generated skill packs** — Custom combinations based on your stack

**Example Flow:**
```
1. Select ORM: Prisma
2. Databases: ✓ PostgreSQL ✓ MongoDB (filtered by Prisma support)
3. Auth: ✓ JWT ✓ OAuth2
4. Caching: ✓ Redis
5. Real-time: WebSockets
6. Deployment: ✓ Docker/K8s ✓ AWS
→ Generates 15+ skill files tailored to YOUR stack
```

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
gs

# 1. Select "Vercel Agent Skills"
# 2. Choose "React Best Practices"
# 3. Select all 40+ rules (or pick specific ones)
# 4. Output to ./react-best-practices

# Now use:
# - react-best-practices/SKILL.md (quick reference)
# - react-best-practices/rules/*.md (40+ detailed rules)
```

### Backend Skills (Express.js)
```bash
cd your-backend-project
gs

# 1. Select "Express.js Production Architecture"
# 2. Choose ORM: Prisma
# 3. Select databases: PostgreSQL, MongoDB
# 4. Select auth: JWT
# 5. Select caching: Redis
# 6. Select real-time: WebSockets
# 7. Select deployment: Docker/Kubernetes
# 8. Output to ./expressjs-skill-pack

# Now use:
# - expressjs-skill-pack/SKILL.md (overview)
# - expressjs-skill-pack/references/*.md (detailed guides)
```

## Use with Claude

1. Run `gs` to fetch a skill pack
2. Navigate to output directory
3. Copy relevant `.md` files
4. Provide as context to Claude (or any AI coding assistant)
5. Ask specific questions — Claude will follow the structured guidance

## Updates

Re-run `gs` anytime to fetch the latest:
```bash
gs
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
