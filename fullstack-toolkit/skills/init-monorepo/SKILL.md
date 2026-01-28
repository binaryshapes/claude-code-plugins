---
name: init-monorepo
description: Initialize a language-agnostic Moon + Proto monorepo
---

# /init-monorepo

Initialize a language-agnostic Moon + Proto monorepo.

## Description

This skill creates a bare monorepo foundation without any language-specific tooling. Languages are auto-detected and configured when you add the first project of that type using `/add-app`.

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
│   ├── workspace.yml
│   └── tasks/
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
├── .prototools
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
| `prototools` | `.prototools` | Proto toolchain configuration |
| `lefthook.yml` | `lefthook.yml` | Pre-commit hooks |
| `gitignore` | `.gitignore` | Git ignore patterns |
| `editorconfig` | `.editorconfig` | Editor configuration |

### Step 6: Create README.md

Create `README.md` with the following content (replace `{project-name}` with actual name):

```markdown
# {project-name}

A monorepo managed with [Moon](https://moonrepo.dev) and [Proto](https://moonrepo.dev/proto).

## Getting Started

### Prerequisites

- [Proto](https://moonrepo.dev/proto) - Toolchain manager

### Setup

proto use
moon run :install

## Project Structure

- `apps/` - Application projects
- `packages/` - Shared libraries
- `tools/` - CLI tools

## Commands

moon run <project>:<task>    # Run a task
moon run :task               # Run task in all projects
moon run :check --affected   # Check affected projects
```

### Step 7: Initialize Moon

```bash
moon setup
```

### Step 8: Verify Setup

```bash
moon --version
proto --version
```

### Step 9: Summary

Print a summary:

```
Monorepo initialized successfully!

Created:
  - .moon/workspace.yml
  - .moon/tasks/ (centralized task definitions)
  - .prototools
  - .gitignore
  - .editorconfig
  - lefthook.yml
  - README.md

Task inheritance configured for:
  - TypeScript: apps, libraries, CLIs
  - Python: apps, libraries
  - Framework overrides: Next.js, Expo, Hono, NestJS, FastAPI

Next steps:
  1. Add a project: /add-app
  2. Configure hooks: /hooks
```

## Important Notes

- This skill does NOT add any language-specific tooling
- TypeScript toolchain (node, pnpm) is auto-configured on first TypeScript project
- Python toolchain (python, uv) is auto-configured on first Python project
- The monorepo starts completely empty - ready to grow with your needs
