---
name: init-monorepo
description: Initialize a language-agnostic Moon + Proto monorepo
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
├── .moon/
│   ├── workspace.yml          # Moon workspace configuration
│   └── toolchains.yml         # Moon toolchain configuration (empty)
├── .prototools                # Proto settings + moon version pinned
├── .gitignore
├── .editorconfig
├── lefthook.yml
├── apps/                      # Application projects
├── packages/                  # Shared libraries
├── tools/                     # CLI tools
└── README.md
```

**Note:** The `.moon/tasks/` directory is created lazily when you add your first project. Task definitions are copied based on project type:
- First TypeScript app → `typescript-app.yml`
- First Python app → `python-app.yml`
- Using Next.js → `tag-next.yml`
- etc.

## Instructions

When the user invokes `/init-monorepo`, follow these steps:

### Step 1: Gather Information

Ask for the project name if not provided:
- Default to the current directory name
- Validate it's a valid package name (lowercase, no spaces)

### Step 2: Check Prerequisites

Verify that Proto is installed:

```bash
proto --version
```

If not installed, inform the user:

```
Proto is not installed. Install it with:
curl -fsSL https://moonrepo.dev/install/proto.sh | bash
```

### Step 3: Initialize Git Repository

If not already a git repository:

```bash
git init
```

### Step 4: Create Directory Structure

```bash
mkdir -p apps packages tools .moon
```

### Step 5: Copy Configuration Files from Templates

Copy the following files from `templates/monorepo/`:

| Template File | Destination | Description |
|---------------|-------------|-------------|
| `moon-workspace.yml` | `.moon/workspace.yml` | Moon workspace configuration |
| `moon-toolchains.yml` | `.moon/toolchains.yml` | Moon toolchain configuration |
| `prototools` | `.prototools` | Proto settings (auto-install, auto-clean) |
| `lefthook.yml` | `lefthook.yml` | Pre-commit hooks |
| `gitignore` | `.gitignore` | Git ignore patterns |
| `editorconfig` | `.editorconfig` | Editor configuration |

**Important:** Do NOT copy the `moon-tasks/` directory. Task definitions are added lazily by `/add-app`, `/add-lib`, and `/add-cli` when projects are created.

### Step 6: Pin Moon Version with Proto

Pin the latest Moon version to `.prototools` for consistent builds across the team:

```bash
proto pin moon --resolve
```

This ensures everyone uses the same Moon version. The `--resolve` flag pins the exact semantic version.

### Step 7: Install Moon via Proto

```bash
proto use
```

This installs Moon (and any other pinned tools) based on `.prototools`.

### Step 8: Create README.md

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
- `tools/` - CLI tools

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

### Step 9: Verify Setup

```bash
moon --version
proto --version
```

### Step 10: Summary

Print a summary:

```
Monorepo initialized successfully!

Created:
  - .moon/workspace.yml      (workspace configuration)
  - .moon/toolchains.yml     (toolchain configuration)
  - .prototools              (pinned tool versions)
  - .gitignore
  - .editorconfig
  - lefthook.yml
  - README.md

Moon version pinned: <version from proto pin>

Next steps:
  1. Add your first project: /add-app
  2. Configure hooks: /hooks
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
- **No task files initially** - added when first project of each type is created
- **Language toolchains are lazy** - only configured when first needed
- **No lock-in** - standard Moon/Proto setup, no plugin-specific modifications
