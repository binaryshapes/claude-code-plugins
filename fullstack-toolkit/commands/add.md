# /add

Add a new project to the monorepo.

## Description

This command is the main entry point for scaffolding new projects. It guides you through adding applications, libraries, or CLI tools to your monorepo with support for both TypeScript and Python.

## Usage

```
/fullstack-toolkit:add
```

## Instructions

When the user invokes `/fullstack-toolkit:add`, follow these steps:

### Step 1: Ask Project Type

Prompt the user to select what they want to add:

**Question**: "What would you like to add to the monorepo?"

| Option | Description |
|--------|-------------|
| **Application** | Web apps, mobile apps, APIs, backend services (placed in `apps/`) |
| **Library** | Reusable packages, UI components, shared utilities (placed in `packages/`) |
| **CLI Tool** | Command-line interfaces and scripts (placed in `tools/`) |

### Step 2: Follow the Appropriate Skill

Based on the user's selection, follow the instructions from the corresponding skill:

#### If Application selected:
Follow the complete instructions from the **add-app** skill:
1. Ask for language (TypeScript / Python)
2. Ask for application type based on language
3. Ask for application name
4. Auto-configure toolchain if needed
5. Scaffold the application
6. Install dependencies

**TypeScript app types:** next, expo, hono, orpc, nestjs
**Python app types:** minimal, fastapi

#### If Library selected:
Follow the complete instructions from the **add-lib** skill:
1. Ask for language (TypeScript / Python)
2. Ask for library type based on language
3. Ask for library name
4. Auto-configure toolchain if needed
5. Scaffold the library
6. Install dependencies

**TypeScript lib types:** ts-lib, react-lib, ui-web, ui-native, ui-both
**Python lib types:** py-lib

#### If CLI Tool selected:
Follow the complete instructions from the **add-cli** skill:
1. Ask for language (TypeScript / Python)
2. Ask for CLI name
3. Ask for binary name (optional)
4. Auto-configure toolchain if needed
5. Scaffold the CLI
6. Install dependencies

### Step 3: Summary

After scaffolding is complete, print a summary with:
- What was created and where
- Available Moon commands for the new project
- Suggested next steps

## Examples

```
User: /fullstack-toolkit:add

Claude: What would you like to add to the monorepo?
  1. Application - Web apps, mobile apps, APIs
  2. Library - Reusable packages and components
  3. CLI Tool - Command-line interfaces

User: Application

Claude: What language would you like to use?
  1. TypeScript
  2. Python

User: TypeScript

Claude: What type of TypeScript application?
  1. next - Next.js web app (latest)
  2. expo - Expo React Native mobile app
  3. hono - Hono edge-first API
  4. orpc - oRPC type-safe API
  5. nestjs - NestJS enterprise backend

User: next

Claude: What's the application name? (lowercase, kebab-case)

User: web-app

Claude: [Creates the Next.js application...]
```

## Project Locations

| Type | Directory | Example |
|------|-----------|---------|
| Application | `apps/` | `apps/web-app/` |
| Library | `packages/` | `packages/shared-utils/` |
| CLI Tool | `tools/` | `tools/my-cli/` |

## Important Notes

- This command requires an initialized monorepo (run `/fullstack-toolkit:init` first)
- First project of a language auto-configures the toolchain
- All projects are integrated with Moon for task orchestration
- Use `moon run <project>:<task>` to run tasks on created projects
