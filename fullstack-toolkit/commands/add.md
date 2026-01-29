---
name: add
description: Add a new project to the monorepo (app, library, or CLI)
---

# /add

Add a new project to the monorepo.

## Usage

```
/fullstack-toolkit:add
```

## Instructions

When the user invokes `/fullstack-toolkit:add`, follow these steps:

### Step 1: Ask Project Type

Prompt the user to select what they want to add:

**Question**: "What would you like to add to the monorepo?"

| Option | Description | Skill |
|--------|-------------|-------|
| **Application** | Web apps, mobile apps, APIs (placed in `apps/`) | `/add-app` |
| **Library** | Reusable packages, UI components (placed in `packages/`) | `/add-lib` |
| **CLI Tool** | Command-line interfaces (placed in `scripts/`) | `/add-cli` |

### Step 2: Delegate to the Appropriate Skill

Based on the user's selection, execute the corresponding skill following its complete instructions:

- **Application** → Execute `/add-app` skill (see `skills/add-app/SKILL.md`)
- **Library** → Execute `/add-lib` skill (see `skills/add-lib/SKILL.md`)
- **CLI Tool** → Execute `/add-cli` skill (see `skills/add-cli/SKILL.md`)

## Important Notes

- This command requires an initialized monorepo (run `/fullstack-toolkit:init` first)
- First project of a language auto-configures the toolchain via `/toolchain` skill
- All projects are integrated with Moon for task orchestration
