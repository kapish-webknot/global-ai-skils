# Demo: How It Works

## What We Built

A dynamic CLI that:
1. **Auto-discovers** all skills from Callstack & Vercel repos via GitHub API
2. **Fetches live content** (not templates!)
3. **Supports multiple sources** — easy to add more

## Flow

```bash
npm start
```

### Step 1: Choose Source
```
? Select a skill source:
  ❯ Callstack Agent Skills — React Native performance & optimization
    Vercel Agent Skills — React, Next.js & composition best practices (40+ rules)
```

### Step 2: CLI Discovers Skills Automatically
```
🔍 Discovering skills from Vercel Agent Skills...
```

The CLI calls GitHub API:
```
GET https://api.github.com/repos/vercel-labs/agent-skills/git/trees/main?recursive=1
```

Finds all `SKILL.md` files → discovers available skill packs

### Step 3: Pick a Skill Pack
```
? Select a skill pack:
  ❯ React Best Practices (40+ sub-skills)
    Composition Patterns (8 sub-skills)
    React Native Skills (30+ sub-skills)
```

### Step 4: Select Sub-Skills
```
? Select sub-skills to fetch:
  ❯ ◉ Select All
   ─────────────
    ◯ Advanced Event Handler Refs
    ◯ Advanced Init Once
    ◯ Advanced Use Latest
    ◯ Async Api Routes
    ◯ Async Defer Await
    ... (40+ more)
```

### Step 5: Choose Output
```
? Output directory: (./react-best-practices)
```

### Step 6: Confirm & Fetch
```
📋 Summary:
   Source: Vercel Agent Skills
   Skill Pack: React Best Practices
   Sub-skills: 40+ selected
   Output: ./react-best-practices

? Fetch and save skill pack? (Y/n)
```

### Step 7: Downloads Live Content
```
📥 Fetching from Vercel Agent Skills...

   Fetching SKILL.md...
   ✓ SKILL.md
   Fetching README.md...
   ✓ README_ORIGINAL.md
   ✓ advanced-event-handler-refs.md
   ✓ advanced-init-once.md
   ✓ async-defer-await.md
   ... (40+ files)

✅ Skill pack fetched successfully!

Summary:
  📁 Output: ./react-best-practices
  📄 Main files: SKILL.md, README.md
  ✓ Sub-skills: 43 fetched

  💡 Live skills from Vercel Agent Skills
     Re-run anytime to get the latest updates!
```

## What You Get

```
react-best-practices/
├── SKILL.md              # Quick reference
├── README.md             # Generated overview
├── README_ORIGINAL.md    # Original from repo
└── rules/
    ├── advanced-event-handler-refs.md
    ├── async-defer-await.md
    ├── rendering-memo.md
    ├── server-cache-react.md
    ... (40+ rules)
```

## Use with Claude

```
Copy react-best-practices/SKILL.md
→ Paste as context to Claude
→ Ask: "How should I handle async data fetching in React Server Components?"
→ Claude uses the skill pack to give best-practice answers
```

## Callstack Example

```bash
npm start
# Choose "Callstack Agent Skills"
# Pick "React Native Best Practices"
# Select all 29 sub-skills
# Output: ./react-native-best-practices

Result:
react-native-best-practices/
├── SKILL.md
├── README.md
└── references/
    ├── js-profile-react.md
    ├── js-animations-reanimated.md
    ├── native-profiling.md
    ├── bundle-analyze-js.md
    ... (29 files)
```

## Key Features

### 🔥 Dynamic Discovery
- No hardcoded skill lists
- Automatically finds all skills via GitHub API
- Future-proof — new skills appear automatically

### ⚡ Multi-Source
- Callstack (React Native focus)
- Vercel (React/Next.js focus)
- Easy to add more sources

### 🎯 Selective Fetching
- Pick exactly what you need
- Or grab everything with "Select All"

### 🔄 Always Fresh
- Pulls from `main` branch
- Re-run anytime for updates
- No stale content

## Blog Reference

Vercel's announcement:
https://vercel.com/blog/introducing-react-best-practices

## Adding Your Own Source

Edit `cli/index.js`:

```javascript
const SOURCES = {
  callstack: { ... },
  vercel: { ... },
  awesome: {
    name: 'Awesome Skills',
    repo: 'username/awesome-skills',
    branch: 'main',
    url: 'https://github.com/username/awesome-skills',
    description: 'Awesome best practices',
    skillsPath: 'skills'  // Where SKILL.md files are
  }
};
```

Requirements:
- Repo structure: `skills/my-skill/SKILL.md`
- Sub-skills in: `skills/my-skill/references/*.md` or `skills/my-skill/rules/*.md`

The CLI does the rest!
