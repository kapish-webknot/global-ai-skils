# global-ai-skills

🔥 **Fetch always-updated skill packs from top-tier AI agent skill repositories**

A CLI tool that **dynamically discovers and fetches** Claude-optimized skill packs from:
- 🚀 [Callstack Agent Skills](https://github.com/callstackincubator/agent-skills) — React Native performance & optimization
- ⚡ [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) — React & Next.js best practices (40+ rules)

## Why This CLI?

Instead of outdated templates, this tool **fetches live content** directly from source repos:
- ✅ **Dynamic discovery** — automatically finds all available skills
- ✅ **Always up-to-date** — fetches the latest from GitHub
- ✅ **Real content** — actual best practices, not placeholders
- ✅ **Multi-source** — Callstack + Vercel (more coming)
- ✅ **Interactive** — pick exactly what you need

## Quick Start

```bash
cd cli
npm install
npm start
```

Or run directly:

```bash
node cli/index.js
```

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

## How It Works

1. **Select source** — Callstack or Vercel
2. **CLI discovers** all available skill packs automatically via GitHub API
3. **Pick a skill pack** — React Native, React Best Practices, etc.
4. **Select sub-skills** — or choose "Select All"
5. **Fetches live** from GitHub main branch
6. **Saves locally** with proper structure

## Example Usage

```bash
cd cli
npm start

# 1. Select "Vercel Agent Skills"
# 2. Choose "React Best Practices"
# 3. Select all 40+ rules (or pick specific ones)
# 4. Output to ./react-best-practices

# Now use:
# - react-best-practices/SKILL.md (quick reference)
# - react-best-practices/rules/*.md (40+ detailed rules)
```

## Use with Claude

1. Run the CLI to fetch a skill pack
2. Navigate to output directory
3. Copy relevant `.md` files
4. Provide as context to Claude (or any AI coding assistant)
5. Ask specific questions — Claude will follow the structured guidance

## Updates

Re-run the CLI anytime to fetch the latest:
```bash
cd cli
npm start
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