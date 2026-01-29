# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Claude Code plugin (fullstack-toolkit) that provides skills, agents, commands, and templates for scaffolding and managing fullstack monorepos using Moon + Proto. It supports TypeScript and Python projects.

## Architecture

```
fullstack-toolkit/
├── .claude-plugin/plugin.json   # Plugin manifest
├── skills/                      # User-invocable slash commands
│   ├── init-monorepo/           # /init-monorepo - Initialize monorepo
│   ├── add-app/                 # /add-app - Add app (TS/Python)
│   ├── add-lib/                 # /add-lib - Add library (TS/Python/UI)
│   ├── add-cli/                 # /add-cli - Add CLI tool (TS/Python)
│   ├── toolchain/               # /toolchain - Manage Proto toolchain
│   └── hooks/                   # /hooks - Configure pre-commit hooks
├── agents/                      # Automated quality/test agents
│   ├── typescript/              # ts-code-quality, ts-test-runner
│   ├── python/                  # py-code-quality, py-test-runner
│   └── shared/                  # dependency-checker
├── commands/                    # /add, /init, /check, /format, /build
├── templates/                   # Scaffolding templates (flat structure)
│   ├── toolchain-ts/            # TypeScript toolchain configs
│   ├── toolchain-py/            # Python toolchain configs
│   ├── monorepo/                # Base monorepo files
│   ├── app-orpc/                # oRPC app template
│   ├── lib-ts/                  # Pure TypeScript library
│   ├── lib-react/               # React library
│   ├── lib-ui/                  # UI library (web + native)
│   └── cli-ts/                  # TypeScript CLI
└── hooks/claude/settings.json   # Claude Code hooks configuration
```

## Key Concepts

### Toolchain Management
- **Proto**: Manages language runtimes (node, pnpm, python, uv)
- **Moon**: Task runner with caching and dependency-aware execution
- Toolchains are auto-configured on first language-specific skill invocation

### Project Structure (Generated Monorepos)
- `apps/` - Application projects
- `packages/` - Shared libraries
- `modules/` - Domain-specific modules
- `scripts/` - CLI tools and scripts

## Common Commands

### Quality Checks
```bash
# TypeScript
pnpm lint                    # ESLint
pnpm typecheck               # tsc --noEmit
pnpm format:check            # Prettier
pnpm test                    # Vitest

# Python
uv run ruff check .          # Linting
uv run mypy .                # Type checking
uv run ruff format --check . # Format check
uv run pytest                # Tests

# Moon (all projects)
moon run :lint --affected
moon run :test --affected
moon run :build
```

### Build
```bash
moon run :build              # Build all projects
moon run project-name:build  # Build specific project
```

## Code Style

### TypeScript
- Prefer `const` over `let`
- Prefer arrow functions
- Use type imports (`import type { X }`)
- Use single quotes

### Python
- Use type hints
- Use docstrings
- Line length: 88 characters

## Templates

Templates use placeholders:
- `{{name}}` - Project/application name
- `{{port}}` - Development port
- `{{scope}}` - Package scope
- `{{PROJECT_NAME}}` - Root project name
