---
name: init-monorepo
description: Initialize a language-agnostic Moon + Proto monorepo
allowed-tools: Bash(mkdir *), Bash(touch *), Bash(proto *), Bash(moon *), Bash(pnpm *), Bash(lefthook *), Bash(git rev-parse *), Bash(git init), Read, Write, Glob
---

# /init-monorepo

Initialize a language-agnostic Moon + Proto monorepo.

## Description

This skill creates a bare monorepo foundation using Moon as the build system and Proto as the toolchain manager. Language toolchains and task definitions are added automatically when you create your first project using `/add-app`, `/add-lib`, or `/add-cli`.

## Usage

```
/init-monorepo [name]
```

**Arguments:**
- `name` (optional): Project name. Defaults to current directory name.

## What Gets Created

```
{project}/
├── .claude/
│   └── settings.json              # Claude Code permissions for moon/proto
├── .github/
│   └── workflows/
│       └── release.yml            # Release Please GitHub Action
├── .moon/
│   ├── workspace.yml              # Moon workspace configuration
│   └── toolchains.yml             # Moon toolchain configuration (empty)
├── .prototools                    # Proto settings + moon/node/pnpm pinned
├── .release-please-manifest.json  # Release Please manifest (empty initially)
├── .gitignore
├── .editorconfig
├── commitlint.config.mjs          # Commitlint configuration
├── lefthook.yml                   # Git hooks (includes commit-msg for commitlint)
├── package.json                   # Root package.json for commitlint
├── release-please-config.json     # Release Please configuration
├── apps/                          # Application projects
│   └── .gitkeep
├── packages/                      # Shared libraries
│   └── .gitkeep
├── modules/                       # Domain-specific modules
│   └── .gitkeep
├── scripts/                       # CLI tools and scripts
│   └── .gitkeep
└── README.md
```

**Note:** The `.moon/tasks/` directory is created lazily when you add your first project. Task definitions are copied based on project type:
- First TypeScript app → `typescript-app.yml`
- First Python app → `python-app.yml`
- Using Next.js → `tag-next.yml`
- etc.

## Template Resolution

This skill uses template files from the plugin directory:

1. **Locate the plugin root**: Find where the `fullstack-toolkit` plugin is installed by searching for its `plugin.json` file.

2. **Use Read and Write tools**: Instead of shell `cp` commands, use Claude's Read tool to read template contents and Write tool to create files.

3. **Template locations** (relative to plugin root):
   - `templates/monorepo/` - Base monorepo files (workspace.yml, gitignore, etc.)

---

## Instructions

When the user invokes `/init-monorepo`, follow these steps:

### Step 1: Create Claude Code Settings (FIRST)

**This MUST be the very first step** to grant permissions for subsequent commands and avoid repeated permission prompts.

#### 1a. Check if directory is empty

Check if the current directory is empty (excluding hidden files like `.git`):

```bash
ls -A | grep -v '^\.git$' | head -1
```

#### 1b. Create settings based on directory state

**If directory is empty:** Create the settings file directly without asking.

**If directory is NOT empty:** Ask the user: "The current directory is not empty. Do you want to create `.claude/settings.json` to enable fullstack-toolkit permissions?"
- If yes, proceed to create the file
- If no, abort the skill execution

#### 1c. Create the settings file

```bash
mkdir -p .claude
```

Then copy the settings template from `templates/monorepo/claude-settings.json` to `.claude/settings.json`.

**Why this is first:** The settings file grants permission for all fullstack-toolkit skills. Once created, Claude Code will not ask for permission to execute skill commands during this session and future sessions.

**Note:** Users can create `.claude/settings.local.json` for personal overrides (this file is gitignored by default).

### Step 2: Gather Information

Ask for the project name if not provided:
- Default to the current directory name
- Validate it's a valid package name (lowercase, no spaces)

### Step 3: Check Prerequisites

Verify that Proto is installed:

```bash
proto --version
```

If not installed, inform the user:

```
Proto is not installed. Install it with:
curl -fsSL https://moonrepo.dev/install/proto.sh | bash
```

### Step 4: Initialize Git Repository

Check if already a git repository:

```bash
git rev-parse --is-inside-work-tree
```

If not already a git repository, initialize it:

```bash
git init
```

### Step 5: Create Directory Structure

```bash
mkdir -p apps packages modules scripts .moon
```

Create `.gitkeep` files to ensure empty directories are tracked by Git:

```bash
touch apps/.gitkeep packages/.gitkeep modules/.gitkeep scripts/.gitkeep
```

### Step 6: Copy Configuration Files from Templates

Copy the following files from `templates/monorepo/`:

| Template File | Destination | Description |
|---------------|-------------|-------------|
| `claude-settings.json` | `.claude/settings.json` | Claude Code skill permissions |
| `moon-workspace.yml` | `.moon/workspace.yml` | Moon workspace configuration |
| `moon-toolchains.yml` | `.moon/toolchains.yml` | Moon toolchain configuration |
| `prototools` | `.prototools` | Proto settings (auto-install, auto-clean) |
| `lefthook.yml` | `lefthook.yml` | Git hooks (includes commit-msg for commitlint) |
| `gitignore` | `.gitignore` | Git ignore patterns |
| `editorconfig` | `.editorconfig` | Editor configuration |
| `commitlint.config.mjs` | `commitlint.config.mjs` | Commitlint configuration |
| `release-please-config.json` | `release-please-config.json` | Release Please configuration |
| `release-please-manifest.json` | `.release-please-manifest.json` | Release Please manifest |
| `github-workflows-release.yml` | `.github/workflows/release.yml` | Release Please GitHub Action |

**Important:** Do NOT copy the `moon-tasks/` directory. Task definitions are added lazily by `/add-app`, `/add-lib`, and `/add-cli` when projects are created.

**Note:** Create `.github/workflows/` directory before copying the release workflow:
```bash
mkdir -p .github/workflows
```

### Step 7: Pin Moon and Lefthook with Proto

Pin Moon v2 and Lefthook to `.prototools` for consistent builds across the team:

```bash
proto pin moon 2.0.0-rc.1 --resolve
proto pin lefthook latest --resolve
```

**Note:** This plugin requires Moon v2 for task inheritance features (`inheritedBy`). Lefthook is managed via a Proto plugin defined in the prototools template. The `--resolve` flag pins the exact semantic version.

### Step 8: Pin Node.js and pnpm with Proto

Pin Node.js and pnpm for commitlint and monorepo tooling:

```bash
proto pin node lts --resolve
proto pin pnpm latest --resolve
```

**Note:** Node.js uses `lts` but pnpm and lefthook use `latest` (they don't support the `lts` alias). These tools are required for commitlint and release-please tooling, regardless of the languages used in your projects.

### Step 9: Install Tools via Proto

```bash
proto use
```

This installs Moon, Lefthook, Node.js, pnpm, and any other pinned tools based on `.prototools`.

### Step 10: Create Root package.json

Create a minimal `package.json` for commitlint:

```json
{
  "name": "{project-name}",
  "private": true,
  "type": "module",
  "devDependencies": {}
}
```

### Step 11: Install Commitlint

Install commitlint and the conventional config:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

### Step 12: Install Lefthook Hooks

Initialize lefthook to register the git hooks:

```bash
lefthook install
```

This registers the `commit-msg` hook that runs commitlint on every commit.

### Step 13: Create README.md

Create `README.md` with the following content (replace `{project-name}` with actual name):

```markdown
# {project-name}

A monorepo managed with [Moon](https://moonrepo.dev) and [Proto](https://moonrepo.dev/proto).

## Getting Started

### Prerequisites

- [Proto](https://moonrepo.dev/proto) - Toolchain manager

### Setup

```bash
# Install all pinned tools (moon, node, pnpm, python, uv, etc.)
proto use

# Install project dependencies
moon run :install
```

## Project Structure

- `apps/` - Application projects
- `packages/` - Shared libraries
- `modules/` - Domain-specific modules
- `scripts/` - CLI tools and scripts

## Commands

```bash
# Run a task in a specific project
moon run <project>:<task>

# Run a task in all projects
moon run :task

# Run tasks only in affected projects
moon run :check --affected

# Build all projects
moon run :build
```

## Adding Projects

```bash
# Add an application
/add-app

# Add a library
/add-lib

# Add a CLI tool
/add-cli
```

## Toolchain

This monorepo uses Proto for toolchain management. Versions are pinned in `.prototools`:

```bash
# View pinned versions
cat .prototools

# Install/update all tools
proto use

# Pin a new tool version
proto pin <tool> <version>
```
```

### Step 14: Verify Setup

```bash
moon --version
proto --version
node --version
pnpm --version
```

### Step 15: Summary

Print a summary:

```
Monorepo initialized successfully!

Created:
  - .claude/settings.json           (Claude Code permissions)
  - .github/workflows/release.yml   (Release Please workflow)
  - .moon/workspace.yml             (workspace configuration)
  - .moon/toolchains.yml            (toolchain configuration)
  - .prototools                     (pinned tool versions)
  - .release-please-manifest.json   (release manifest)
  - .gitignore
  - .editorconfig
  - commitlint.config.mjs           (commit message linting)
  - lefthook.yml                    (git hooks)
  - package.json                    (root package for tooling)
  - release-please-config.json      (release configuration)
  - README.md

Tools pinned:
  - Moon: <version>
  - Node.js: <version>
  - pnpm: <version>

Next steps:
  1. Add your first project: /add-app
  2. Push to GitHub to enable Release Please
```

---

## Lazy Task Loading

Task definitions are NOT created during init. They are added when projects are created:

| When you create... | Tasks copied |
|-------------------|--------------|
| TypeScript app | `typescript-app.yml` |
| TypeScript library | `typescript-lib.yml` |
| TypeScript CLI | `typescript-cli.yml` |
| Python app | `python-app.yml` |
| Python library | `python-lib.yml` |
| Next.js app | `tag-next.yml` |
| Expo app | `tag-expo.yml` |
| Hono app | `tag-hono.yml` |
| NestJS app | `tag-nestjs.yml` |
| FastAPI app | `tag-fastapi.yml` |
| oRPC app | `tag-orpc.yml` |

This keeps the monorepo clean and only includes what you actually use.

---

## Important Notes

- **Moon is pinned** in `.prototools` for consistent builds
- **Node.js and pnpm are always installed** for commitlint and monorepo tooling
- **Commitlint enforces Conventional Commits** - all commits must follow the format
- **Release Please automates versioning** - creates release PRs on push to main
- **Independent releases** - each app/package can have its own version
- **No task files initially** - added when first project of each type is created
- **Language toolchains are lazy** - only configured when first needed
- **No lock-in** - standard Moon/Proto setup, no plugin-specific modifications

## Conventional Commits

Commitlint enforces [Conventional Commits](https://www.conventionalcommits.org/). Format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Examples:**
```
feat(api): add user authentication
fix(web): resolve login redirect issue
chore(deps): update dependencies
```

## Release Please

Release Please creates release PRs automatically when commits are pushed to `main`. It:

1. Analyzes commits since last release
2. Determines version bump (major/minor/patch) based on commit types
3. Creates a release PR with updated CHANGELOG.md
4. When merged, creates a GitHub release with tags

**Configuration:**
- `release-please-config.json` - Release settings
- `.release-please-manifest.json` - Current versions (updated automatically)

**Adding a new package to releases:** When you create a new app/library, add it to `release-please-config.json`:

```json
{
  "packages": {
    "apps/my-app": {},
    "packages/my-lib": {}
  }
}
```
