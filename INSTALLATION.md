# Installation Guide

## Local Development Installation

### 1. Install Dependencies
```bash
cd cli
npm install
```

### 2. Link Globally (Recommended)
```bash
npm link
```

This creates global commands:
- `ai-skills` - Main command
- `global-ai-skills` - Alternative command

### 3. Verify Installation
```bash
which ai-skills
# Should output: /path/to/node/bin/ai-skills

ai-skills --help
# Launches the interactive CLI
```

## Usage

### Quick Start
```bash
ai-skills
```

The CLI will guide you through:
1. Select skill source (Callstack, Vercel, or Express.js)
2. Configure your stack
3. Choose template depth (Core/Standard/Both)
4. Generate skill pack

### Example: Generate Express.js Skills
```bash
ai-skills

? Select a skill source: Express.js Production Architecture
? Output directory: ./my-backend-skills
? Select ORM/ODM: Prisma
? Select Database(s): PostgreSQL
? Select Authentication: JWT
? Select Logging: Pino
? Select Security features: All
? Select Testing: Jest
? Select Message Queue: BullMQ
? Select Observability: Prometheus
? Select Resilience: Health Checks, Graceful Shutdown
? Select Caching: Redis
? Select Real-time: None
? Select Deployment: Docker & Kubernetes
? Select template detail level: Core (AI-optimized) [RECOMMENDED]

✅ Generated skill pack in ./my-backend-skills
```

## Template Depth Options

### Core (Recommended for AI)
- Ultra-concise templates (~150 tokens each)
- Code-first format
- Perfect for feeding to Claude/GPT
- Total: ~1,200 tokens for all files
- Output: `/core/` directory

### Standard (Reference)
- Full detail with examples (~500 tokens each)
- Comprehensive explanations
- Best practices and patterns
- Total: ~6,000 tokens
- Output: `/references/` directory

### Both
- Core templates for AI
- Standard templates for human reference
- Best of both worlds
- Output: Both directories

## Using Generated Skills with AI

### Step 1: Generate Skills
```bash
ai-skills
# Select "Core" template depth
```

### Step 2: Read Context Guide
```bash
cd my-backend-skills
cat CONTEXT_GUIDE.md
```

### Step 3: Feed to AI
Open Claude/ChatGPT and attach:
```
✅ All files from core/ directory (~1,200 tokens)
   OR
✅ Selected files based on your task (300-600 tokens)
```

### Example Prompts

#### Implementing Logging
```
Attach: core/pino.md

"Using this Pino setup, help me add structured logging to my Express app
with request IDs and error tracking."
```

#### Setting Up Security
```
Attach: core/helmet.md, core/cors.md, core/rate-limiting.md

"Help me implement these security measures for my production API."
```

#### Complete Stack
```
Attach: All core/ files

"I'm building a backend with this stack. Help me structure the project
and implement authentication with JWT."
```

## Uninstall

```bash
cd cli
npm unlink
```

## Publishing to npm (Optional)

### 1. Update package.json
```json
{
  "name": "@your-org/global-ai-skills",
  "version": "1.0.0"
}
```

### 2. Publish
```bash
npm publish --access public
```

### 3. Install Globally
```bash
npm install -g @your-org/global-ai-skills
```

## Troubleshooting

### Command not found
```bash
# Re-link the package
cd cli
npm link
```

### Permission errors
```bash
# Use sudo (Linux/Mac)
sudo npm link

# Or configure npm prefix
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Module not found
```bash
# Reinstall dependencies
cd cli
rm -rf node_modules package-lock.json
npm install
npm link
```

## Development

### Run Locally (without linking)
```bash
cd cli
npm start
```

### Test Changes
```bash
# After making changes
npm link  # Updates the linked version
ai-skills # Test your changes
```

## Features

✅ **Multiple Sources**
- Callstack React Native skills
- Vercel Next.js best practices
- Express.js production templates

✅ **Smart Configuration**
- ORM-database compatibility checking
- Auth-cache recommendations
- Deployment-database suggestions

✅ **AI-Optimized**
- Core templates (~150 tokens)
- Token estimates for every file
- Context window management guide

✅ **Production-Ready**
- Security best practices
- Monitoring & observability
- Testing patterns
- Deployment configurations

## Support

For issues or questions:
- Open an issue on GitHub
- Check CONTEXT_GUIDE.md in generated packs
- Review template documentation

---

**Made with ❤️ for AI-assisted development**