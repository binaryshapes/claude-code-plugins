# /init

Initialize a language-agnostic Moon + Proto monorepo.

## Description

This command creates a bare monorepo foundation without any language-specific tooling. Languages are auto-detected and configured when you add the first project of that type using `/fullstack-toolkit:add-app`.

## Usage

```
/fullstack-toolkit:init [name]
```

**Arguments:**
- `name` (optional): Project name. Defaults to current directory name.

## What Gets Created

```
{project}/
├── .moon/
│   └── workspace.yml          # Moon workspace config (empty projects)
├── .prototools                 # Proto base config (no tools yet)
├── .gitignore                  # Git ignore patterns
├── .editorconfig               # Editor configuration
├── lefthook.yml                # Pre-commit hooks (base structure)
├── apps/                       # Application projects (empty)
├── packages/                   # Shared libraries (empty)
├── tools/                      # CLI tools (empty)
└── README.md                   # Project readme
```

## Instructions

When the user invokes `/fullstack-toolkit:init`, follow these steps:

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

Create the base directories:
```bash
mkdir -p apps packages tools .moon
```

### Step 5: Create Configuration Files

Create `.moon/workspace.yml`:

```yaml
$schema: 'https://moonrepo.dev/schemas/workspace.json'

# Projects configuration - will be populated by language-specific skills
projects:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'

# Version control
vcs:
  manager: 'git'
  defaultBranch: 'main'

# Telemetry
telemetry: false
```

Create `.prototools`:

```toml
# Proto toolchain configuration
# Languages will be auto-added when you use /fullstack-toolkit:add-app

[settings]
auto-install = true
auto-clean = true
```

Create `.gitignore`:

```gitignore
# Dependencies
node_modules/
.pnpm-store/
__pycache__/
*.pyc
.venv/
venv/

# Build outputs
dist/
build/
.next/
.expo/
*.egg-info/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.coverage
htmlcov/
.pytest_cache/

# Moon
.moon/cache/
.moon/docker/

# Proto
.proto/
```

Create `.editorconfig`:

```editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{py,pyi}]
indent_size = 4

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

Create `lefthook.yml`:

```yaml
# Lefthook pre-commit hooks
# Language-specific hooks will be added by /fullstack-toolkit:add-app

pre-commit:
  parallel: true
  commands: {}

pre-push:
  parallel: true
  commands: {}
```

Create `README.md`:

```markdown
# {project-name}

A monorepo managed with [Moon](https://moonrepo.dev) and [Proto](https://moonrepo.dev/proto).

## Getting Started

### Prerequisites

- [Proto](https://moonrepo.dev/proto) - Toolchain manager

### Setup

```bash
# Install toolchain
proto use

# Install dependencies (after adding projects)
moon run :install
```

## Project Structure

```
├── apps/          # Application projects
├── packages/      # Shared libraries
└── tools/         # CLI tools
```

## Commands

```bash
# Run a task
moon run <project>:<task>

# Run task in all projects
moon run :task

# Check affected projects
moon run :check --affected
```
```

### Step 6: Initialize Moon

```bash
moon setup
```

### Step 7: Verify Setup

Run verification:
```bash
moon --version
proto --version
```

### Step 8: Summary

Print a summary:

```
Monorepo initialized successfully!

Created:
  - .moon/workspace.yml (Moon workspace)
  - .prototools (Proto toolchain)
  - .gitignore
  - .editorconfig
  - lefthook.yml (pre-commit hooks)
  - README.md

Next steps:
  1. Add a project:         /fullstack-toolkit:add
  2. Configure hooks:       /fullstack-toolkit:hooks
```

## Important Notes

- This command does NOT add any language-specific tooling
- TypeScript toolchain (node, pnpm) is auto-configured on first TypeScript project
- Python toolchain (python, uv) is auto-configured on first Python project
- The monorepo starts completely empty - ready to grow with your needs
