#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Available skill sources
const SOURCES = {
  callstack: {
    name: 'Callstack Agent Skills',
    repo: 'callstackincubator/agent-skills',
    branch: 'main',
    url: 'https://github.com/callstackincubator/agent-skills',
    description: 'React Native performance & optimization (from The Ultimate Guide)',
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
  expressjs: {
    name: 'Express.js Production Architecture',
    description: 'Backend best practices with ORM, auth, caching & deployment',
    type: 'local'
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

// Generate main README
function generateMainReadme(sourceName, skillName, selectedSubSkills, source) {
  const hasSubSkills = selectedSubSkills && selectedSubSkills.length > 0;
  
  let skillsList = '';
  if (hasSubSkills) {
    const subSkillsPath = selectedSubSkills[0].includes('references/') ? 'references' : 'rules';
    skillsList = selectedSubSkills.map(skill => {
      const displayName = skill.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return `| ${displayName} | [View Skill](./${subSkillsPath}/${skill}.md) |`;
    }).join('\n');
  }

  return `# ${skillName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - AI Skill Pack

## Source

Fetched from **${source.name}**  
${source.url}

**Always up-to-date** — re-run the CLI anytime to fetch the latest.

## Description

${source.description}

${hasSubSkills ? `## Available Skills

| Skill | Reference |
|-------|-----------|
${skillsList}

## Main Skill File

See [SKILL.md](./SKILL.md) for the main quick reference.
` : ''}

## Usage

Provide these files as context to Claude or any AI coding assistant:
1. Copy the relevant skill content
2. Provide it as context
3. Ask specific questions related to the skill area

## Credits

From [${source.name}](${source.url})

---
*Fetched via global-ai-skills CLI*
`;
}

// ORM to Database compatibility
const ORM_DB_COMPAT = {
  mongoose: ['mongodb'],
  prisma: ['postgresql', 'mongodb', 'mysql', 'sqlite'],
  typeorm: ['postgresql', 'mongodb', 'mysql', 'mariadb', 'sqlite'],
  sequelize: ['postgresql', 'mysql', 'mariadb', 'sqlite'],
  none: ['postgresql', 'mongodb', 'mysql', 'mariadb', 'sqlite', 'timeseries']
};

// Handle Express.js local templates
async function handleExpressJS() {
  const templatesPath = path.join(__dirname, 'templates', 'expressjs');

  // Step 1: Select ORM
  const { orm } = await inquirer.prompt([
    {
      type: 'list',
      name: 'orm',
      message: 'Select ORM/ODM:',
      choices: [
        { name: 'Mongoose (MongoDB only)', value: 'mongoose' },
        { name: 'Prisma (PostgreSQL, MySQL, MongoDB, SQLite)', value: 'prisma' },
        { name: 'TypeORM (PostgreSQL, MySQL, MariaDB, SQLite, MongoDB)', value: 'typeorm' },
        { name: 'Sequelize (PostgreSQL, MySQL, MariaDB, SQLite)', value: 'sequelize' },
        { name: 'None (Raw drivers)', value: 'none' }
      ]
    }
  ]);

  // Step 2: Select databases (filtered by ORM)
  const availableDbs = ORM_DB_COMPAT[orm];
  const { databases } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'databases',
      message: 'Select database(s):',
      choices: [
        { name: 'PostgreSQL', value: 'postgresql', disabled: !availableDbs.includes('postgresql') },
        { name: 'MongoDB', value: 'mongodb', disabled: !availableDbs.includes('mongodb') },
        { name: 'MySQL', value: 'mysql', disabled: !availableDbs.includes('mysql') },
        { name: 'SQLite', value: 'sqlite', disabled: !availableDbs.includes('sqlite') },
        { name: 'MariaDB', value: 'mariadb', disabled: !availableDbs.includes('mariadb') },
        { name: 'TimeSeriesDB', value: 'timeseries', disabled: !availableDbs.includes('timeseries') }
      ].filter(choice => !choice.disabled)
    }
  ]);

  if (databases.length === 0) {
    console.log(chalk.yellow('\n⚠️  No databases selected. Exiting.\n'));
    return;
  }

  // Step 3: Select auth methods
  const { auth } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'auth',
      message: 'Select authentication method(s):',
      choices: [
        { name: 'JWT', value: 'jwt', checked: true },
        { name: 'Session-based', value: 'session' }
      ]
    }
  ]);

  // Step 4: Select caching
  const { caching } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'caching',
      message: 'Select caching strategy:',
      choices: [
        { name: 'Redis', value: 'redis', checked: true },
        { name: 'Memcached', value: 'memcached' },
        { name: 'In-memory', value: 'inmemory' },
        { name: 'None', value: 'none' }
      ]
    }
  ]);

  // Step 5: Select real-time
  const { realtime } = await inquirer.prompt([
    {
      type: 'list',
      name: 'realtime',
      message: 'Select real-time communication:',
      choices: [
        { name: 'WebSockets (Socket.io)', value: 'websockets' },
        { name: 'Server-Sent Events (SSE)', value: 'sse' },
        { name: 'None (REST only)', value: 'none' }
      ]
    }
  ]);

  // Step 6: Select deployment
  const { deployment } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'deployment',
      message: 'Select deployment target(s):',
      choices: [
        { name: 'Docker/Kubernetes', value: 'docker', checked: true },
        { name: 'AWS (Lambda, ECS, Fargate)', value: 'aws' },
        { name: 'Traditional VPS (PM2, Nginx)', value: 'vps' },
        { name: 'Serverless', value: 'serverless' }
      ]
    }
  ]);

  // Step 7: Output directory
  const { outputDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputDir',
      message: 'Output directory:',
      default: './expressjs-skill-pack'
    }
  ]);

  // Step 8: Confirm
  console.log(chalk.cyan('\n📋 Summary:'));
  console.log(chalk.white(`   ORM: ${orm}`));
  console.log(chalk.white(`   Databases: ${databases.join(', ')}`));
  console.log(chalk.white(`   Auth: ${auth.join(', ')}`));
  console.log(chalk.white(`   Caching: ${caching.join(', ')}`));
  console.log(chalk.white(`   Real-time: ${realtime}`));
  console.log(chalk.white(`   Deployment: ${deployment.join(', ')}`));
  console.log(chalk.white(`   Output: ${outputDir}\n`));

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Generate skill pack?',
      default: true
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Cancelled.\n'));
    return;
  }

  // Generate files
  const outputPath = path.resolve(process.cwd(), outputDir);
  await fs.ensureDir(path.join(outputPath, 'references'));

  console.log(chalk.cyan('\n📦 Generating skill pack...\n'));

  // Copy main SKILL.md
  await fs.copy(
    path.join(templatesPath, 'SKILL.md'),
    path.join(outputPath, 'SKILL.md')
  );
  console.log(chalk.green('   ✓ SKILL.md'));

  // Copy base files
  const baseFiles = await fs.readdir(path.join(templatesPath, 'base'));
  for (const file of baseFiles) {
    await fs.copy(
      path.join(templatesPath, 'base', file),
      path.join(outputPath, 'references', file)
    );
    console.log(chalk.green(`   ✓ ${file}`));
  }

  // Copy ORM file
  if (orm !== 'none') {
    await fs.copy(
      path.join(templatesPath, 'orm', `${orm}.md`),
      path.join(outputPath, 'references', `orm-${orm}.md`)
    );
    console.log(chalk.green(`   ✓ orm-${orm}.md`));
  }

  // Copy database files
  for (const db of databases) {
    const dbFile = path.join(templatesPath, 'database', `${db}.md`);
    if (await fs.pathExists(dbFile)) {
      await fs.copy(dbFile, path.join(outputPath, 'references', `database-${db}.md`));
      console.log(chalk.green(`   ✓ database-${db}.md`));
    }
  }

  // Copy auth files
  for (const authMethod of auth) {
    const authFile = path.join(templatesPath, 'auth', `${authMethod}.md`);
    if (await fs.pathExists(authFile)) {
      await fs.copy(authFile, path.join(outputPath, 'references', `auth-${authMethod}.md`));
      console.log(chalk.green(`   ✓ auth-${authMethod}.md`));
    }
  }

  // Copy caching files
  for (const cache of caching) {
    if (cache !== 'none') {
      const cacheFile = path.join(templatesPath, 'caching', `${cache}.md`);
      if (await fs.pathExists(cacheFile)) {
        await fs.copy(cacheFile, path.join(outputPath, 'references', `caching-${cache}.md`));
        console.log(chalk.green(`   ✓ caching-${cache}.md`));
      }
    }
  }

  // Copy realtime file
  if (realtime !== 'none') {
    const rtFile = path.join(templatesPath, 'realtime', `${realtime}.md`);
    if (await fs.pathExists(rtFile)) {
      await fs.copy(rtFile, path.join(outputPath, 'references', `realtime-${realtime}.md`));
      console.log(chalk.green(`   ✓ realtime-${realtime}.md`));
    }
  }

  // Copy deployment files
  for (const deploy of deployment) {
    const deployFile = path.join(templatesPath, 'deployment', `${deploy}.md`);
    if (await fs.pathExists(deployFile)) {
      await fs.copy(deployFile, path.join(outputPath, 'references', `deployment-${deploy}.md`));
      console.log(chalk.green(`   ✓ deployment-${deploy}.md`));
    }
  }

  // Generate README
  const readme = `# Express.js Production Architecture - Skill Pack

## Configuration

- **ORM**: ${orm}
- **Databases**: ${databases.join(', ')}
- **Authentication**: ${auth.join(', ')}
- **Caching**: ${caching.join(', ')}
- **Real-time**: ${realtime}
- **Deployment**: ${deployment.join(', ')}

## Files

- [SKILL.md](./SKILL.md) - Main overview
- [references/](./references/) - Detailed guides

## Usage

Provide relevant files to Claude when building your Express.js backend.

---
*Generated by global-ai-skills CLI*
`;

  await fs.writeFile(path.join(outputPath, 'README.md'), readme);

  console.log(chalk.green.bold('\n✅ Skill pack generated successfully!\n'));
  console.log(chalk.white('Summary:'));
  console.log(chalk.gray(`  📁 Output: ${outputDir}`));
  console.log(chalk.gray(`  📄 Files: SKILL.md, README.md, references/\n`));
}

async function main() {
  console.log(chalk.blue.bold('\n🚀 AI Skills Fetcher CLI\n'));
  console.log(chalk.gray('Fetch live skill packs from Callstack & Vercel\n'));

  try {
    // Step 1: Select source
    const { sourceKey } = await inquirer.prompt([
      {
        type: 'list',
        name: 'sourceKey',
        message: 'Select a skill source:',
        choices: Object.entries(SOURCES).map(([key, src]) => ({
          name: `${src.name} — ${src.description}`,
          value: key,
          short: src.name
        }))
      }
    ]);

    const source = SOURCES[sourceKey];

    // Handle Express.js local templates
    if (source.type === 'local') {
      await handleExpressJS();
      return;
    }

    console.log(chalk.cyan(`\n🔍 Discovering skills from ${source.name}...\n`));

    // Step 2: Discover available skills
    const availableSkills = await discoverSkills(source);

    if (availableSkills.length === 0) {
      console.log(chalk.yellow('⚠️  No skills found. Exiting.\n'));
      return;
    }

    // Step 3: Select skill pack
    const { skillName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'skillName',
        message: 'Select a skill pack:',
        choices: availableSkills.map(skill => ({
          name: `${skill.displayName}${skill.hasSubSkills ? ` (${skill.subSkills.length} sub-skills)` : ''}`,
          value: skill.name,
          short: skill.displayName
        }))
      }
    ]);

    const selectedSkill = availableSkills.find(s => s.name === skillName);

    let subSkillsToFetch = [];
    if (selectedSkill.hasSubSkills) {
      // Step 4: Select sub-skills
      const { subSkills } = await inquirer.prompt([
        {
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
        }
      ]);

      if (subSkills.includes('__all__')) {
        subSkillsToFetch = selectedSkill.subSkills;
      } else {
        subSkillsToFetch = subSkills;
      }

      if (subSkillsToFetch.length === 0) {
        console.log(chalk.yellow('\n⚠️  No sub-skills selected. Exiting.\n'));
        return;
      }
    }

    // Step 5: Output directory
    const { outputDir } = await inquirer.prompt([
      {
        type: 'input',
        name: 'outputDir',
        message: 'Output directory:',
        default: `./${skillName}`
      }
    ]);

    // Step 6: Confirm
    console.log(chalk.cyan('\n📋 Summary:'));
    console.log(chalk.white(`   Source: ${source.name}`));
    console.log(chalk.white(`   Skill Pack: ${selectedSkill.displayName}`));
    if (selectedSkill.hasSubSkills) {
      console.log(chalk.white(`   Sub-skills: ${subSkillsToFetch.length} selected`));
    }
    console.log(chalk.white(`   Output: ${outputDir}\n`));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Fetch and save skill pack?',
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('\n❌ Cancelled.\n'));
      return;
    }

    // Generate files
    const outputPath = path.resolve(process.cwd(), outputDir);
    await fs.ensureDir(outputPath);
    
    if (selectedSkill.hasSubSkills) {
      await fs.ensureDir(path.join(outputPath, selectedSkill.subSkillsPath));
    }

    console.log(chalk.cyan(`\n📥 Fetching from ${source.name}...\n`));

    const rawBase = `https://raw.githubusercontent.com/${source.repo}/${source.branch}`;

    // Fetch main SKILL.md
    try {
      const skillUrl = `${rawBase}/${source.skillsPath}/${skillName}/SKILL.md`;
      console.log(chalk.gray(`   Fetching SKILL.md...`));
      const content = await fetchRaw(skillUrl);
      await fs.writeFile(path.join(outputPath, 'SKILL.md'), content);
      console.log(chalk.green(`   ✓ SKILL.md`));
    } catch (error) {
      console.log(chalk.yellow(`   ⚠ SKILL.md not found (${error.message})`));
    }

    // Fetch README.md if exists
    try {
      const readmeUrl = `${rawBase}/${source.skillsPath}/${skillName}/README.md`;
      console.log(chalk.gray(`   Fetching README.md...`));
      const content = await fetchRaw(readmeUrl);
      await fs.writeFile(path.join(outputPath, 'README_ORIGINAL.md'), content);
      console.log(chalk.green(`   ✓ README_ORIGINAL.md`));
    } catch (error) {
      // Optional file, skip
    }

    // Fetch sub-skills
    let successCount = 0;
    let failCount = 0;

    if (selectedSkill.hasSubSkills && subSkillsToFetch.length > 0) {
      for (const subSkill of subSkillsToFetch) {
        try {
          const subSkillUrl = `${rawBase}/${source.skillsPath}/${skillName}/${selectedSkill.subSkillsPath}/${subSkill}.md`;
          const content = await fetchRaw(subSkillUrl);
          await fs.writeFile(
            path.join(outputPath, selectedSkill.subSkillsPath, `${subSkill}.md`),
            content
          );
          console.log(chalk.green(`   ✓ ${subSkill}.md`));
          successCount++;
        } catch (error) {
          console.log(chalk.red(`   ✗ ${subSkill}.md: ${error.message}`));
          failCount++;
        }
      }
    }

    // Generate custom README
    await fs.writeFile(
      path.join(outputPath, 'README.md'),
      generateMainReadme(source.name, skillName, subSkillsToFetch, source)
    );

    console.log(chalk.green.bold(`\n✅ Skill pack fetched successfully!\n`));
    console.log(chalk.white('Summary:'));
    console.log(chalk.gray(`  📁 Output: ${outputDir}`));
    console.log(chalk.gray(`  📄 Main files: SKILL.md, README.md`));
    if (selectedSkill.hasSubSkills) {
      console.log(chalk.gray(`  ✓ Sub-skills: ${successCount} fetched`));
      if (failCount > 0) {
        console.log(chalk.yellow(`  ✗ Failed: ${failCount} files`));
      }
    }
    console.log(chalk.gray(`\n  💡 Live skills from ${source.name}`));
    console.log(chalk.gray(`     Re-run anytime to get the latest updates!\n`));

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    if (error.stack) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

main();
