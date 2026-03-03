#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ORM → Database compatibility matrix
const ORM_DATABASE_MAP = {
  'mongoose': ['mongodb'],
  'prisma': ['postgresql', 'mongodb', 'mysql', 'sqlite', 'cockroachdb'],
  'typeorm': ['postgresql', 'mongodb', 'mysql', 'sqlite', 'mariadb'],
  'sequelize': ['postgresql', 'mysql', 'mariadb', 'sqlite', 'sqlserver'],
  'none': ['postgresql', 'mongodb', 'mysql', 'sqlite', 'mariadb', 'sqlserver', 'cockroachdb', 'timeseries']
};

// Available skill sources
const SOURCES = {
  callstack: {
    name: 'Callstack Agent Skills',
    repo: 'callstackincubator/agent-skills',
    branch: 'main',
    url: 'https://github.com/callstackincubator/agent-skills',
    description: 'React Native performance & optimization',
    skillsPath: 'skills',
    type: 'github'
  },
  vercel: {
    name: 'Vercel Agent Skills',
    repo: 'vercel-labs/agent-skills',
    branch: 'main',
    url: 'https://github.com/vercel-labs/agent-skills',
    description: 'React, Next.js & composition best practices (40+ rules)',
    skillsPath: 'skills',
    type: 'github'
  },
  'next-skills': {
    name: 'Vercel Next.js Skills',
    repo: 'vercel-labs/next-skills',
    branch: 'main',
    url: 'https://github.com/vercel-labs/next-skills',
    description: 'Next.js app development patterns',
    skillsPath: 'skills',
    type: 'github'
  },
  expressjs: {
    name: 'Express.js Production Architecture',
    description: 'Backend best practices: ORM, auth, caching, deployment',
    type: 'template',
    categories: {
      orm: ['mongoose', 'prisma', 'typeorm', 'sequelize', 'none'],
      database: ['postgresql', 'mongodb', 'mysql', 'sqlite', 'mariadb', 'sqlserver', 'cockroachdb', 'timeseries'],
      auth: ['jwt', 'session-based', 'oauth2', 'passport'],
      caching: ['redis', 'memcached', 'in-memory', 'none'],
      realtime: ['websockets', 'sse', 'none'],
      deployment: ['docker-kubernetes', 'aws', 'gcp', 'azure', 'vps-pm2', 'serverless']
    }
  }
};

// Fetch from GitHub API
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'global-ai-skills-cli' }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Fetch raw file from GitHub
function fetchRaw(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 404) {
        reject(new Error(`File not found: ${url}`));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Discover available skills from a GitHub repo
async function discoverSkills(source) {
  const apiUrl = `https://api.github.com/repos/${source.repo}/git/trees/${source.branch}?recursive=1`;
  
  try {
    const tree = await fetchJSON(apiUrl);
    
    // Find all SKILL.md files
    const skillPaths = tree.tree
      .filter(item => item.path.includes('/SKILL.md') && item.path.startsWith(source.skillsPath))
      .map(item => {
        const parts = item.path.split('/');
        const skillName = parts[parts.length - 2];
        return {
          name: skillName,
          path: item.path,
          fullPath: parts.slice(0, -1).join('/')
        };
      });

    // For each skill, try to find sub-skills (references or rules)
    const skills = [];
    for (const skill of skillPaths) {
      const subSkills = tree.tree
        .filter(item => 
          item.type === 'blob' &&
          item.path.startsWith(skill.fullPath) &&
          (item.path.includes('/references/') || item.path.includes('/rules/')) &&
          item.path.endsWith('.md') &&
          !item.path.endsWith('_sections.md') &&
          !item.path.endsWith('_template.md')
        )
        .map(item => {
          const filename = item.path.split('/').pop();
          return filename.replace('.md', '');
        });

      skills.push({
        name: skill.name,
        displayName: skill.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        subSkills: subSkills.length > 0 ? subSkills : null,
        hasSubSkills: subSkills.length > 0,
        subSkillsPath: subSkills.length > 0 ? (tree.tree.find(i => i.path.includes(`${skill.fullPath}/references/`)) ? 'references' : 'rules') : null
      });
    }

    return skills;
  } catch (error) {
    console.error(chalk.red(`Failed to discover skills: ${error.message}`));
    return [];
  }
}

// Generate Express.js template content
function generateExpressTemplate(category, option) {
  const templates = {
    'orm-mongoose': `# Mongoose (MongoDB ODM)

## Overview
Mongoose provides schema-based MongoDB modeling for Node.js applications.

## Installation
\`\`\`bash
npm install mongoose
\`\`\`

## Connection Setup
\`\`\`javascript
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
});
\`\`\`

## Schema Definition
\`\`\`javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
\`\`\`

## Best Practices
- Use lean() for read-only queries
- Index frequently queried fields
- Use virtuals for computed properties
- Enable timestamps for audit trails
`,
    'orm-prisma': `# Prisma ORM

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
`,
    'auth-jwt': `# JWT Authentication

## Installation
\`\`\`bash
npm install jsonwebtoken bcrypt
\`\`\`

## Token Generation
\`\`\`javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid credentials');
  }
  
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { token, user };
}
\`\`\`

## Middleware
\`\`\`javascript
export function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
\`\`\`

## Best Practices
- Use strong JWT_SECRET (min 256 bits)
- Set appropriate expiration times
- Implement refresh tokens for long sessions
- Store tokens in httpOnly cookies (not localStorage)
`,
    'caching-redis': `# Redis Caching

## Installation
\`\`\`bash
npm install redis
\`\`\`

## Setup
\`\`\`javascript
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 500) }
});

await redis.connect();
\`\`\`

## Cache Middleware
\`\`\`javascript
export function cacheMiddleware(ttl = 300) {
  return async (req, res, next) => {
    const key = \`cache:\${req.method}:\${req.originalUrl}\`;
    
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redis.setEx(key, ttl, JSON.stringify(data));
      return originalJson(data);
    };
    
    next();
  };
}
\`\`\`

## Best Practices
- Set appropriate TTLs per endpoint
- Use key namespaces (e.g., \`user:123\`, \`post:456\`)
- Implement cache invalidation strategies
- Monitor cache hit rates
`,
    'deployment-docker-kubernetes': `# Docker & Kubernetes Deployment

## Dockerfile
\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
\`\`\`

## Kubernetes Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: express-api
  template:
    metadata:
      labels:
        app: express-api
    spec:
      containers:
      - name: api
        image: your-registry/express-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
\`\`\`

## Best Practices
- Use multi-stage builds
- Run as non-root user
- Set resource limits
- Implement health checks
- Use secrets for sensitive data
`
  };

  const key = `${category}-${option}`;
  return templates[key] || `# ${option}\n\nSkill content for ${category}/${option} coming soon.\n`;
}

// Generate main README for template-based skills
function generateExpressReadme(selections) {
  const { orm, database, auth, caching, realtime, deployment } = selections;
  
  return `# Express.js Production Architecture - Skill Pack

## Your Selected Stack

### ORM/ODM
${orm.map(o => `- ${o.charAt(0).toUpperCase() + o.slice(1)}`).join('\n')}

### Databases
${database.map(d => `- ${d.charAt(0).toUpperCase() + d.slice(1)}`).join('\n')}

### Authentication
${auth.map(a => `- ${a.toUpperCase()}`).join('\n')}

### Caching
${caching.map(c => `- ${c.charAt(0).toUpperCase() + c.slice(1)}`).join('\n')}

### Real-time
${realtime.map(r => `- ${r.toUpperCase()}`).join('\n')}

### Deployment
${deployment.map(d => `- ${d.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`).join('\n')}

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

## Usage

1. Copy relevant skill files as context for Claude
2. Ask specific questions about implementation
3. Use code examples as starting templates
4. Adapt to your specific requirements

## Source

Generated by global-ai-skills CLI  
https://github.com/kapish-webknot/global-ai-skils

---
*Fetch the latest templates anytime by re-running the CLI*
`;
}

// Handle Express.js template generation
async function handleExpressJS(outputDir) {
  console.log(chalk.cyan('\n📋 Configure your Express.js stack:\n'));

  // 1. Select ORM
  const { orm } = await inquirer.prompt([{
    type: 'list',
    name: 'orm',
    message: 'Select ORM/ODM:',
    choices: [
      { name: 'Mongoose (MongoDB only)', value: 'mongoose' },
      { name: 'Prisma (PostgreSQL, MySQL, MongoDB, SQLite, CockroachDB)', value: 'prisma' },
      { name: 'TypeORM (PostgreSQL, MySQL, MariaDB, SQLite, MongoDB)', value: 'typeorm' },
      { name: 'Sequelize (PostgreSQL, MySQL, MariaDB, SQLite, SQL Server)', value: 'sequelize' },
      { name: 'None (Raw Database Drivers)', value: 'none' }
    ]
  }]);

  // 2. Select Database(s) - filtered by ORM
  const availableDatabases = ORM_DATABASE_MAP[orm];
  const { database } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'database',
    message: 'Select Database(s):',
    choices: availableDatabases.map(db => ({
      name: db.charAt(0).toUpperCase() + db.slice(1),
      value: db,
      checked: availableDatabases.length === 1
    }))
  }]);

  if (database.length === 0) {
    console.log(chalk.yellow('\n⚠️  No databases selected. Exiting.\n'));
    return;
  }

  // 3. Select Authentication
  const { auth } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'auth',
    message: 'Select Authentication method(s):',
    choices: [
      { name: 'JWT (JSON Web Tokens)', value: 'jwt', checked: true },
      { name: 'Session-based (Express Session)', value: 'session-based' },
      { name: 'OAuth 2.0', value: 'oauth2' },
      { name: 'Passport.js', value: 'passport' }
    ]
  }]);

  // 4. Select Caching
  const { caching } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'caching',
    message: 'Select Caching layer(s):',
    choices: [
      { name: 'Redis', value: 'redis', checked: true },
      { name: 'Memcached', value: 'memcached' },
      { name: 'In-memory (Node.js Map)', value: 'in-memory' },
      { name: 'None', value: 'none' }
    ]
  }]);

  // 5. Select Real-time
  const { realtime } = await inquirer.prompt([{
    type: 'list',
    name: 'realtime',
    message: 'Select Real-time communication:',
    choices: [
      { name: 'WebSockets (Socket.io)', value: 'websockets' },
      { name: 'Server-Sent Events (SSE)', value: 'sse' },
      { name: 'None (REST only)', value: 'none' }
    ]
  }]);

  // 6. Select Deployment
  const { deployment } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'deployment',
    message: 'Select Deployment target(s):',
    choices: [
      { name: 'Docker & Kubernetes', value: 'docker-kubernetes', checked: true },
      { name: 'AWS (Lambda, ECS, Fargate)', value: 'aws' },
      { name: 'GCP (Cloud Run, GKE)', value: 'gcp' },
      { name: 'Azure (AKS, Container Apps)', value: 'azure' },
      { name: 'Traditional VPS (PM2, Nginx)', value: 'vps-pm2' },
      { name: 'Serverless (AWS Lambda, Vercel)', value: 'serverless' }
    ]
  }]);

  const selections = { orm: [orm], database, auth, caching, realtime: [realtime], deployment };

  // Confirm
  console.log(chalk.cyan('\n📋 Summary:'));
  console.log(chalk.white(`   ORM: ${orm}`));
  console.log(chalk.white(`   Databases: ${database.join(', ')}`));
  console.log(chalk.white(`   Auth: ${auth.join(', ')}`));
  console.log(chalk.white(`   Caching: ${caching.join(', ')}`));
  console.log(chalk.white(`   Real-time: ${realtime}`));
  console.log(chalk.white(`   Deployment: ${deployment.join(', ')}`));
  console.log(chalk.white(`   Output: ${outputDir}\n`));

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: 'Generate skill pack?',
    default: true
  }]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Cancelled.\n'));
    return;
  }

  // Generate files
  const outputPath = path.resolve(outputDir);
  await fs.ensureDir(outputPath);
  await fs.ensureDir(path.join(outputPath, 'references'));

  console.log(chalk.cyan('\n📦 Generating skill pack...\n'));

  // Generate README
  await fs.writeFile(
    path.join(outputPath, 'README.md'),
    generateExpressReadme(selections)
  );
  console.log(chalk.green('   ✓ README.md'));

  // Generate base skills (always included)
  const baseSkills = [
    'project-structure',
    'api-design-versioning',
    'error-handling-logging',
    'security-validation',
    'testing-coverage',
    'monitoring-observability'
  ];

  for (const skill of baseSkills) {
    await fs.writeFile(
      path.join(outputPath, 'references', `${skill}.md`),
      `# ${skill.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}\n\nBase skill content coming soon.\n`
    );
  }

  // Generate ORM skills
  for (const o of [orm]) {
    const content = generateExpressTemplate('orm', o);
    await fs.writeFile(
      path.join(outputPath, 'references', `orm-${o}.md`),
      content
    );
    console.log(chalk.green(`   ✓ orm-${o}.md`));
  }

  // Generate auth skills
  for (const a of auth) {
    const content = generateExpressTemplate('auth', a);
    await fs.writeFile(
      path.join(outputPath, 'references', `auth-${a}.md`),
      content
    );
    console.log(chalk.green(`   ✓ auth-${a}.md`));
  }

  // Generate caching skills
  for (const c of caching) {
    const content = generateExpressTemplate('caching', c);
    await fs.writeFile(
      path.join(outputPath, 'references', `caching-${c}.md`),
      content
    );
    console.log(chalk.green(`   ✓ caching-${c}.md`));
  }

  // Generate deployment skills
  for (const d of deployment) {
    const content = generateExpressTemplate('deployment', d);
    await fs.writeFile(
      path.join(outputPath, 'references', `deployment-${d}.md`),
      content
    );
    console.log(chalk.green(`   ✓ deployment-${d}.md`));
  }

  console.log(chalk.green.bold(`\n✅ Express.js skill pack generated!\n`));
  console.log(chalk.white('Summary:'));
  console.log(chalk.gray(`  📁 Output: ${outputDir}`));
  console.log(chalk.gray(`  📄 Base skills: ${baseSkills.length} files`));
  console.log(chalk.gray(`  📄 Stack-specific: ${1 + auth.length + caching.length + deployment.length} files\n`));
}

// Handle GitHub-based sources
async function handleGitHubSource(source, outputDir) {
  console.log(chalk.cyan(`\n🔍 Discovering skills from ${source.name}...\n`));

  const availableSkills = await discoverSkills(source);

  if (availableSkills.length === 0) {
    console.log(chalk.yellow('⚠️  No skills found. Exiting.\n'));
    return;
  }

  const { skillName } = await inquirer.prompt([{
    type: 'list',
    name: 'skillName',
    message: 'Select a skill pack:',
    choices: availableSkills.map(skill => ({
      name: `${skill.displayName}${skill.hasSubSkills ? ` (${skill.subSkills.length} sub-skills)` : ''}`,
      value: skill.name,
      short: skill.displayName
    }))
  }]);

  const selectedSkill = availableSkills.find(s => s.name === skillName);

  let subSkillsToFetch = [];
  if (selectedSkill.hasSubSkills) {
    const { subSkills } = await inquirer.prompt([{
      type: 'checkbox',
      name: 'subSkills',
      message: 'Select sub-skills to fetch:',
      choices: [
        { name: 'Select All', value: '__all__', checked: true },
        new inquirer.Separator(),
        ...selectedSkill.subSkills.map(skill => ({
          name: skill.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          value: skill,
          checked: false
        }))
      ]
    }]);

    subSkillsToFetch = subSkills.includes('__all__') ? selectedSkill.subSkills : subSkills;

    if (subSkillsToFetch.length === 0) {
      console.log(chalk.yellow('\n⚠️  No sub-skills selected. Exiting.\n'));
      return;
    }
  }

  console.log(chalk.cyan('\n📋 Summary:'));
  console.log(chalk.white(`   Source: ${source.name}`));
  console.log(chalk.white(`   Skill: ${selectedSkill.displayName}`));
  if (selectedSkill.hasSubSkills) {
    console.log(chalk.white(`   Sub-skills: ${subSkillsToFetch.length} selected`));
  }
  console.log(chalk.white(`   Output: ${outputDir}\n`));

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: 'Fetch and save?',
    default: true
  }]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Cancelled.\n'));
    return;
  }

  const outputPath = path.resolve(outputDir);
  await fs.ensureDir(outputPath);
  if (selectedSkill.hasSubSkills) {
    await fs.ensureDir(path.join(outputPath, selectedSkill.subSkillsPath));
  }

  console.log(chalk.cyan(`\n📥 Fetching from ${source.name}...\n`));

  const rawBase = `https://raw.githubusercontent.com/${source.repo}/${source.branch}`;

  // Fetch main SKILL.md
  try {
    const skillUrl = `${rawBase}/${source.skillsPath}/${skillName}/SKILL.md`;
    const content = await fetchRaw(skillUrl);
    await fs.writeFile(path.join(outputPath, 'SKILL.md'), content);
    console.log(chalk.green(`   ✓ SKILL.md`));
  } catch (error) {
    console.log(chalk.yellow(`   ⚠ SKILL.md not found`));
  }

  // Fetch sub-skills
  let successCount = 0;
  if (selectedSkill.hasSubSkills && subSkillsToFetch.length > 0) {
    for (const subSkill of subSkillsToFetch) {
      try {
        const url = `${rawBase}/${source.skillsPath}/${skillName}/${selectedSkill.subSkillsPath}/${subSkill}.md`;
        const content = await fetchRaw(url);
        await fs.writeFile(
          path.join(outputPath, selectedSkill.subSkillsPath, `${subSkill}.md`),
          content
        );
        console.log(chalk.green(`   ✓ ${subSkill}.md`));
        successCount++;
      } catch (error) {
        console.log(chalk.red(`   ✗ ${subSkill}.md: ${error.message}`));
      }
    }
  }

  // Generate README
  await fs.writeFile(
    path.join(outputPath, 'README.md'),
    `# ${selectedSkill.displayName}\n\nFetched from ${source.name}\n${source.url}\n`
  );

  console.log(chalk.green.bold(`\n✅ Skill pack fetched!\n`));
  console.log(chalk.gray(`  📁 ${outputDir}`));
  console.log(chalk.gray(`  ✓ ${successCount} skills\n`));
}

async function main() {
  console.log(chalk.blue.bold('\n🚀 AI Skills Fetcher CLI\n'));
  console.log(chalk.gray('Fetch live skill packs from Callstack, Vercel & custom templates\n'));

  try {
    const { sourceKey } = await inquirer.prompt([{
      type: 'list',
      name: 'sourceKey',
      message: 'Select a skill source:',
      choices: Object.entries(SOURCES).map(([key, src]) => ({
        name: `${src.name} — ${src.description}`,
        value: key,
        short: src.name
      }))
    }]);

    const source = SOURCES[sourceKey];

    const { outputDir } = await inquirer.prompt([{
      type: 'input',
      name: 'outputDir',
      message: 'Output directory:',
      default: `./${sourceKey}-skill-pack`
    }]);

    if (source.type === 'template') {
      await handleExpressJS(outputDir);
    } else {
      await handleGitHubSource(source, outputDir);
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}

main();
