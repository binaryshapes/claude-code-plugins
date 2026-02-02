---
name: init-monorepo
description: Initialize a language-agnostic Moon + Proto monorepo
allowed-tools: |
  Bash(mkdir *)
  Bash(touch *)
  Bash(proto *)
  Bash(moon *)
  Bash(git rev-parse *)
  Bash(git init)
  Read
  Write
  Glob
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
│   └── settings.json          # Claude Code permissions for moon/proto
├── .moon/
│   ├── workspace.yml          # Moon workspace configuration
│   └── toolchains.yml         # Moon toolchain configuration (empty)
├── .prototools                # Proto settings + moon version pinned
├── .gitignore
├── .editorconfig
├── lefthook.yml
├── apps/                      # Application projects
│   └── .gitkeep
├── packages/                  # Shared libraries
│   └── .gitkeep
├── modules/                   # Domain-specific modules
│   └── .gitkeep
├── scripts/                   # CLI tools and scripts
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

### Step 1: Gather Information

Ask for the project name if not provided:
- Default to the current directory name
- Validate it's a valid package name (lowercase, no spaces)

### Step 2: Create Claude Code Settings for the Monorepo

**Note:** This skill already has `allowed-tools` declared in its frontmatter, so Claude Code won't ask for permission during skill execution. The `.claude/settings.json` file created here is for **future users** of the generated monorepo.

Create the `.claude/` directory:

```bash
mkdir -p .claude
```

Then create `.claude/settings.json` with permissions for common monorepo operations:

```json
{
  "permissions": {
    "allow": [
      "Bash(mkdir *)",
      "Bash(touch *)",
      "Bash(proto *)",
      "Bash(moon *)",
      "Bash(pnpm *)",
      "Bash(uv *)",
      "Bash(lefthook *)",
      "Bash(git rev-parse *)",
      "Bash(git init)"
    ]
  }
}
```

**Important - Git permissions policy:** Only verification (`git rev-parse`) and initialization (`git init`) commands are allowed. Strategic git operations (commits, branches, remotes, rebase, push, pull, merge, etc.) are intentionally excluded and require explicit user approval. This prevents accidental repository modifications during scaffolding.

**Note:** Users can create `.claude/settings.local.json` for personal overrides (this file is gitignored by default).

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
| `moon-workspace.yml` | `.moon/workspace.yml` | Moon workspace configuration |
| `moon-toolchains.yml` | `.moon/toolchains.yml` | Moon toolchain configuration |
| `prototools` | `.prototools` | Proto settings (auto-install, auto-clean) |
| `lefthook.yml` | `lefthook.yml` | Pre-commit hooks |
| `gitignore` | `.gitignore` | Git ignore patterns |
| `editorconfig` | `.editorconfig` | Editor configuration |

**Important:** Do NOT copy the `moon-tasks/` directory. Task definitions are added lazily by `/add-app`, `/add-lib`, and `/add-cli` when projects are created.

### Step 7: Pin Moon Version with Proto

Pin Moon v2 to `.prototools` for consistent builds across the team:

```bash
proto pin moon 2.0.0-rc.0 --resolve
```

**Note:** This plugin requires Moon v2 for task inheritance features (`inheritedBy`). The `--resolve` flag pins the exact semantic version. Update to stable v2 when released.

### Step 8: Install Moon via Proto

```bash
proto use
```

This installs Moon (and any other pinned tools) based on `.prototools`.

### Step 9: Create README.md

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

### Step 10: Verify Setup

```bash
moon --version
proto --version
```

### Step 11: Summary

Print a summary:

```
Monorepo initialized successfully!

Created:
  - .claude/settings.json    (Claude Code permissions)
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
