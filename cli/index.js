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
    skillsPath: 'skills'
  },
  vercel: {
    name: 'Vercel Agent Skills',
    repo: 'vercel-labs/agent-skills',
    branch: 'main',
    url: 'https://github.com/vercel-labs/agent-skills',
    description: 'React, Next.js & composition best practices (40+ rules)',
    skillsPath: 'skills'
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
