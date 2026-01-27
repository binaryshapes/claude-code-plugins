# Fullstack Toolkit

A Claude Code plugin for scaffolding and managing language-agnostic monorepos using [Moon](https://moonrepo.dev/) (task runner) and [Proto](https://moonrepo.dev/proto) (toolchain manager).

## Features

- **Language-Agnostic Monorepos** - Single monorepo for TypeScript and Python projects
- **Smart Toolchain Management** - Proto ensures reproducible environments across machines
- **Intelligent Task Orchestration** - Moon handles caching, dependencies, and affected-only runs
- **Multiple App Templates** - Next.js, Expo, Hono, oRPC, NestJS, FastAPI, and more
- **Comprehensive Quality Gates** - Linting, type checking, formatting, and testing
- **Claude Code Integration** - Auto-fix hooks for seamless development
- **CI/CD Ready** - GitHub Actions workflows and pre-commit hooks included

## Installation

### Option 1: Install from Marketplace (Recommended)

If this plugin is available in a marketplace, install it directly:

```shell
# Inside Claude Code
/plugin install fullstack-toolkit@marketplace-name
```

### Option 2: Add as a Marketplace

Add this repository as a plugin marketplace to access all plugins:

```shell
# Add the marketplace from GitHub
/plugin marketplace add ccosming/fullstack-toolkit

# Then install the plugin
/plugin install fullstack-toolkit@ccosming-fullstack-toolkit
```

To install from a specific branch or tag:

```shell
/plugin marketplace add https://github.com/ccosming/fullstack-toolkit.git#v1.0.0
```

### Option 3: Local Development

For local development or testing, clone and load directly:

```bash
# Clone the repository
git clone https://github.com/ccosming/fullstack-toolkit.git

# Start Claude Code with the plugin loaded
claude --plugin-dir ./fullstack-toolkit
```

You can load multiple plugins simultaneously:

```bash
claude --plugin-dir ./fullstack-toolkit --plugin-dir ./another-plugin
```

### Verify Installation

After installation, verify the plugin is loaded:

```shell
# Open the plugin manager
/plugin

# Or run /help to see available commands
/help
```

You should see the plugin's skills listed with the `fullstack-toolkit:` namespace (e.g., `/fullstack-toolkit:init-monorepo`).

### Managing the Plugin

```shell
# Disable without uninstalling
/plugin disable fullstack-toolkit@ccosming-fullstack-toolkit

# Re-enable
/plugin enable fullstack-toolkit@ccosming-fullstack-toolkit

# Uninstall completely
/plugin uninstall fullstack-toolkit@ccosming-fullstack-toolkit

# Update marketplace to get latest version
/plugin marketplace update ccosming-fullstack-toolkit
```

### Installation Scopes

When installing via the `/plugin` UI, you can choose:

| Scope | Description |
|-------|-------------|
| **User** | Install for yourself across all projects (default) |
| **Project** | Install for all collaborators on this repository |
| **Local** | Install for yourself in this repository only |

## Quick Start

After installing the plugin, all commands are available with the `fullstack-toolkit:` namespace:

```shell
# Initialize a new monorepo
/fullstack-toolkit:init my-project

# Add a project (app, library, or CLI) - guided flow
/fullstack-toolkit:add

# Or use specific skills directly
/fullstack-toolkit:add-app    # Add an application
/fullstack-toolkit:add-lib    # Add a library
/fullstack-toolkit:add-cli    # Add a CLI tool

# Set up pre-commit hooks
/fullstack-toolkit:hooks
```

> **Note**: When testing locally with `--plugin-dir`, the same namespaced commands apply.

## Skills

> **Note**: All skills are namespaced with `fullstack-toolkit:` prefix (e.g., `/fullstack-toolkit:init-monorepo`). The tables below show the skill name without the prefix for brevity.

### Core

| Skill | Description |
|-------|-------------|
| `/init-monorepo` | Initialize a Moon + Proto monorepo with base structure |
| `/toolchain` | Manage Proto toolchain versions (list, add, upgrade, pin) |
| `/hooks` | Configure pre-commit, CI, and Claude Code hooks |

### Scaffolding

| Skill | Description |
|-------|-------------|
| `/add-app` | Add an application (TypeScript: next, expo, hono, orpc, nestjs / Python: minimal, fastapi) |
| `/add-lib` | Add a library (TypeScript: ts-lib, react-lib, ui / Python: py-lib) |
| `/add-cli` | Add a CLI tool (TypeScript with Commander.js / Python with Typer) |

## Commands

| Command | Description |
|---------|-------------|
| `/add` | Add a new project (app, library, or CLI) - main entry point |
| `/init` | Initialize a new Moon + Proto monorepo |
| `/check` | Run all quality checks (lint, type check, format, test) |
| `/format` | Format all code with Prettier and Ruff |
| `/build` | Build all projects with Moon orchestration |

## Agents

Automated quality and testing agents that run in the background:

| Agent | Purpose |
|-------|---------|
| `ts-code-quality` | ESLint, Prettier check, TypeScript compiler |
| `ts-test-runner` | Vitest with coverage reporting |
| `py-code-quality` | Ruff linter, formatter check, mypy |
| `py-test-runner` | pytest with coverage |
| `dependency-checker` | Security audit and license compliance |

## Project Structure

After initialization, your monorepo will have this structure:

```
my-project/
├── .moon/
│   └── workspace.yml       # Moon workspace configuration
├── .prototools             # Proto toolchain versions
├── apps/                   # Application projects
├── packages/               # Shared libraries
├── tools/                  # Internal CLI tools
├── lefthook.yml            # Pre-commit hooks
├── .gitignore
└── .editorconfig
```

## Technology Stack

### TypeScript Ecosystem
- Node.js (LTS), pnpm (latest)
- React, Next.js, Expo (latest versions via official CLIs)
- Vitest, Testing Library
- ESLint, Prettier, TypeScript 5.7
- tsup for bundling
- Tailwind CSS, shadcn/ui

### Python Ecosystem
- Python 3.12, uv
- FastAPI 0.115, Uvicorn
- pytest with coverage
- Ruff, mypy

### DevOps
- Moon task runner
- Proto toolchain manager
- Lefthook for git hooks
- GitHub Actions

## Configuration

### Claude Code Hooks

The plugin includes auto-fix hooks that run during development:

- **Pre-edit**: Runs `moon check --affected` before file changes
- **Post-edit (TypeScript)**: ESLint auto-fix
- **Post-edit (Python)**: Ruff formatting

### Pre-commit Hooks

Parallel execution of quality checks:

- TypeScript: ESLint, Prettier, tsc, Vitest
- Python: Ruff lint/format, mypy, pytest
- Commit message validation (conventional commits)

### CI/CD

GitHub Actions workflows for:

- Pull request validation
- Coverage reporting with Codecov
- Deployment pipelines

## Development Workflow

```
Edit code → Auto-fix hooks → /check → git commit → CI pipeline
```

1. Edit files - Claude Code hooks auto-fix on save
2. Run `/check` for full validation
3. Commit - Lefthook validates changes
4. Push - Full test suite runs
5. CI - GitHub Actions pipeline executes

## Requirements

### Prerequisites

Before installing this plugin, ensure you have:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI version **1.0.33 or later** (run `claude --version` to check)
- Git 2.x or later

> **Tip**: If the `/plugin` command is not recognized, update Claude Code to the latest version.

### Automatic Dependencies

The following tools are automatically installed when needed:

| Tool | Installed When |
|------|----------------|
| [Moon](https://moonrepo.dev/) | Running `/init-monorepo` |
| [Proto](https://moonrepo.dev/proto) | Running `/init-monorepo` |
| Node.js + pnpm | Adding first TypeScript project |
| Python + uv | Adding first Python project |

## License

MIT

## Author

Carlos Cosming ([@ccosming](https://github.com/ccosming))
