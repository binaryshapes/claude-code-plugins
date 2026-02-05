---
name: bs:repo:init
description: Initialize a Moon + Proto monorepo with Binary Shapes standards
argument-hint: "[project-name]"
allowed-tools: Bash(proto *), Bash(moon *), Bash(git *), Read, Write, Glob
---

# /bs:repo:init

Initialize a minimal Moon + Proto monorepo.

## Description

This skill creates a minimal, language-agnostic monorepo foundation using Moon as the build system and Proto as the toolchain manager. It creates only the essential structure - language toolchains (Node.js, Python, etc.) are installed when you add your first project.

## Usage

```
/bs:repo:init [name]
```

**Arguments:**
- `name` (optional): Project name. Defaults to current directory name.

## What Gets Created

```
{project}/
├── .claude/
│   └── settings.local.json   # Claude Code permissions (gitignored)
├── .moon/
│   └── workspace.yml         # Moon workspace configuration
├── .prototools               # Proto settings + moon pinned
├── .gitignore
├── .editorconfig
├── apps/                     # Application projects
│   └── .gitkeep
├── packages/                 # Shared libraries
│   └── .gitkeep
├── modules/                  # Domain-specific modules
│   └── .gitkeep
├── scripts/                  # CLI tools and scripts
│   └── .gitkeep
└── README.md
```

## Template Resolution

Templates are located relative to this SKILL.md file at `../../templates/monorepo/`.

**To find the absolute path**, run this glob once at the start:

```
Glob: $HOME/.claude/plugins/cache/**/bs-repo/**/templates/monorepo/settings.local.json
```

Strip the filename to get the template directory. Then use `Read` to read each template and `Write` to create destination files.

---

## Instructions

> **GLOBAL RULE**: All bash commands MUST use relative paths (e.g., `mkdir apps`, NOT `mkdir /full/path/to/apps`). The working directory is the project root.

When the user invokes `/bs:repo:init`, follow these steps:

### Step 1: Create Claude Code Settings (MANDATORY FIRST ACTION)

> **CRITICAL**: This step MUST be executed IMMEDIATELY as the very first action.
> Do NOT run any bash commands, do NOT check prerequisites, do NOT ask questions before this step.
> The permissions file enables all subsequent commands to run without prompts.

1. **Find templates directory** (one glob, one time):

```
Glob: $HOME/.claude/plugins/cache/**/bs-repo/**/templates/monorepo/settings.local.json
```

2. **Read** the matched `settings.local.json`
3. **Write** it to `.claude/settings.local.json` (Write creates parent directories automatically, do NOT use `mkdir`)

Store the template directory path for Step 6.

### Step 2: Gather Information

If the user provided a project name as argument, use it. Otherwise, infer the project name from the current working directory path (already available in context, no bash command needed).

> **Do NOT use `basename`, `pwd`, or any bash command for this step.** The working directory is already visible in the conversation context.

- Validate it's a valid package name (lowercase, no spaces)

### Step 3: Check Prerequisites

Verify that Proto is installed:

```bash
proto --version
```

If not installed:

```
Proto is not installed. Install it with:
curl -fsSL https://moonrepo.dev/install/proto.sh | bash
```

### Step 4: Initialize Git Repository

```bash
git rev-parse --is-inside-work-tree
```

If not a git repository:

```bash
git init
```

### Step 5: Create Directory Structure and Copy Templates

Use the `Write` tool for everything. Write creates parent directories automatically, so no `mkdir` or `touch` needed.

**Create .gitkeep files** (this creates the directories as a side effect):

```
Write: apps/.gitkeep       (empty content)
Write: packages/.gitkeep   (empty content)
Write: modules/.gitkeep    (empty content)
Write: scripts/.gitkeep    (empty content)
```

**Copy templates** from the template directory found in Step 1:

| Template File | Destination |
|---------------|-------------|
| `moon-workspace.yml` | `.moon/workspace.yml` |
| `prototools` | `.prototools` |
| `gitignore` | `.gitignore` |
| `editorconfig` | `.editorconfig` |

For each: `Read` the template, then `Write` to the destination.

### Step 7: Pin Moon with Proto

```bash
proto pin moon 2.0.0-rc.1 --resolve
```

### Step 8: Install Moon via Proto

```bash
proto use
```

### Step 9: Create README.md

```markdown
# {project-name}

A monorepo managed with [Moon](https://moonrepo.dev) and [Proto](https://moonrepo.dev/proto).

## Getting Started

### Prerequisites

- [Proto](https://moonrepo.dev/proto) - Toolchain manager

### Setup

```bash
proto use
```

## Project Structure

- `apps/` - Application projects
- `packages/` - Shared libraries
- `modules/` - Domain-specific modules
- `scripts/` - CLI tools and scripts

## Commands

```bash
moon run <project>:<task>   # Run task in specific project
moon run :task              # Run task in all projects
moon check --all            # Run all checks
```

## Adding Projects

```bash
/bs:app:nextjs    # Next.js app
/bs:app:expo      # Expo mobile app
/bs:app:hono      # Hono API
/bs:app:fastapi   # FastAPI backend
/bs:lib:ts        # TypeScript library
/bs:lib:react     # React library
/bs:lib:py        # Python library
/bs:cli:ts        # TypeScript CLI
/bs:cli:py        # Python CLI
```

## Development Tools

```bash
/bs:tools:typescript   # Configure TypeScript + Moon toolchain
/bs:tools:eslint       # Configure ESLint
/bs:tools:prettier     # Configure Prettier
/bs:tools:tsup         # Configure tsup bundler
/bs:tools:commitlint   # Add commitlint + pre-commit hooks
/bs:tools:release      # Add Release Please for automated releases
/bs:tools:moon         # Generate Moon task definitions
```
```

### Step 10: Verify Setup

```bash
moon --version
```

```bash
proto --version
```

### Step 11: Summary

```
Monorepo initialized successfully!

Created:
  - .claude/settings.local.json  (Claude Code permissions)
  - .moon/workspace.yml          (workspace configuration)
  - .prototools                  (pinned tool versions)
  - .gitignore
  - .editorconfig
  - README.md

Tools pinned:
  - Moon: <version>

Next steps:
  1. Add your first project: /bs:app:nextjs, /bs:lib:ts, etc.
  2. Configure toolchain: /bs:tools:typescript, /bs:tools:eslint, /bs:tools:prettier
  3. Optional: /bs:tools:commitlint for pre-commit hooks
  4. Optional: /bs:tools:release for automated releases

Note: Language toolchains (Node.js, Python) are installed automatically
when you add your first project of that type.
```

---

## Important Notes

- **Minimal by design** - Only essential files are created
- **Language-agnostic** - No Node.js/Python until first project is added
- **Moon is pinned** in `.prototools` for consistent builds
- **No package.json** - Created when first TypeScript project is added
- **No commitlint** - Add with `/bs:tools:commitlint`
- **No release automation** - Add with `/bs:tools:release`
