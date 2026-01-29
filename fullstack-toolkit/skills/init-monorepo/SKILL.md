---
name: init-monorepo
description: Initialize a language-agnostic Moon + Proto monorepo
---

# /init-monorepo

Initialize a language-agnostic Moon + Proto monorepo.

## Description

This skill creates a bare monorepo foundation using Moon as the build system and Proto as the toolchain manager. Languages are auto-detected and configured when you add the first project of that type using `/add-app`, `/add-lib`, or `/add-cli`.

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
│   ├── toolchains.yml          # Moon toolchain configuration
│   └── tasks/                 # Centralized task definitions
│       ├── _shared.yml          # Shared fileGroups
│       ├── typescript-app.yml   # TypeScript app tasks
│       ├── typescript-lib.yml   # TypeScript lib tasks
│       ├── typescript-cli.yml   # TypeScript CLI tasks
│       ├── python-app.yml       # Python app tasks
│       ├── python-lib.yml       # Python lib tasks
│       ├── tag-next.yml         # Next.js overrides
│       ├── tag-expo.yml         # Expo overrides
│       ├── tag-hono.yml         # Hono overrides
│       ├── tag-nestjs.yml       # NestJS overrides
│       ├── tag-fastapi.yml      # FastAPI overrides
│       └── tag-orpc.yml         # oRPC overrides
├── .prototools                # Proto toolchain versions (moon pinned)
├── .gitignore
├── .editorconfig
├── lefthook.yml
├── apps/
├── packages/
├── tools/
└── README.md
```

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
mkdir -p apps packages tools .moon/tasks
```

### Step 5: Copy Configuration Files from Templates

Copy the following files from `templates/monorepo/`:

| Template File | Destination | Description |
|---------------|-------------|-------------|
| `moon-workspace.yml` | `.moon/workspace.yml` | Moon workspace configuration |
| `moon-toolchains.yml` | `.moon/toolchains.yml` | Moon toolchain configuration |
| `moon-tasks/_shared.yml` | `.moon/tasks/_shared.yml` | Shared fileGroups |
| `moon-tasks/typescript-app.yml` | `.moon/tasks/typescript-app.yml` | TypeScript app tasks |
| `moon-tasks/typescript-lib.yml` | `.moon/tasks/typescript-lib.yml` | TypeScript lib tasks |
| `moon-tasks/typescript-cli.yml` | `.moon/tasks/typescript-cli.yml` | TypeScript CLI tasks |
| `moon-tasks/python-app.yml` | `.moon/tasks/python-app.yml` | Python app tasks |
| `moon-tasks/python-lib.yml` | `.moon/tasks/python-lib.yml` | Python lib tasks |
| `moon-tasks/tag-next.yml` | `.moon/tasks/tag-next.yml` | Next.js overrides |
| `moon-tasks/tag-expo.yml` | `.moon/tasks/tag-expo.yml` | Expo overrides |
| `moon-tasks/tag-hono.yml` | `.moon/tasks/tag-hono.yml` | Hono overrides |
| `moon-tasks/tag-nestjs.yml` | `.moon/tasks/tag-nestjs.yml` | NestJS overrides |
| `moon-tasks/tag-fastapi.yml` | `.moon/tasks/tag-fastapi.yml` | FastAPI overrides |
| `moon-tasks/tag-orpc.yml` | `.moon/tasks/tag-orpc.yml` | oRPC overrides |
| `prototools` | `.prototools` | Proto settings (auto-install, auto-clean) |
| `lefthook.yml` | `lefthook.yml` | Pre-commit hooks |
| `gitignore` | `.gitignore` | Git ignore patterns |
| `editorconfig` | `.editorconfig` | Editor configuration |

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
  - .moon/toolchains.yml      (toolchain configuration)
  - .moon/tasks/             (centralized task definitions)
  - .prototools              (pinned tool versions)
  - .gitignore
  - .editorconfig
  - lefthook.yml
  - README.md

Moon version pinned: <version from proto pin>

Task inheritance configured for:
  - TypeScript: apps, libraries, CLIs
  - Python: apps, libraries
  - Framework overrides: Next.js, Expo, Hono, NestJS, FastAPI, oRPC

Next steps:
  1. Add your first project: /add-app
  2. Configure hooks: /hooks
  3. Setup language toolchain: /toolchain
```

---

## Toolchain Integration

### How It Works

1. **Proto** manages tool versions via `.prototools`
2. **Moon** uses Proto for automatic tool installation via `.moon/toolchains.yml`
3. When you run `moon run :task`, Moon ensures correct tool versions are used

### Adding Language Toolchains

When you add your first TypeScript or Python project, use `/toolchain` to configure:

**TypeScript:**
```bash
/toolchain setup-typescript
```

This will:
- Pin `node` and `pnpm` versions in `.prototools`
- Configure `.moon/toolchains.yml` for Node.js
- Create `package.json` with pnpm workspaces
- Run `proto use` to install tools
- Run `pnpm install` to install dependencies

**Python:**
```bash
/toolchain setup-python
```

This will:
- Pin `python` and `uv` versions in `.prototools`
- Configure `.moon/toolchains.yml` for Python
- Run `proto use` to install tools

### Ensuring Package Manager Usage

After adding a project with `/add-app`, `/add-lib`, or `/add-cli`:

1. The skill invokes `/toolchain setup-<language>` if not already configured
2. Toolchain runs `proto use` to ensure tools are installed
3. For TypeScript: runs `pnpm install` to install dependencies
4. For Python: runs `uv sync` in the project directory

This ensures dependencies are always installed after scaffolding.

---

## Important Notes

- **Moon is pinned** in `.prototools` for consistent builds
- **Language toolchains are lazy** - only configured when first needed
- **Task inheritance** - projects inherit tasks from `.moon/tasks/` based on type/language/tags
- **No lock-in** - standard Moon/Proto setup, no plugin-specific modifications
