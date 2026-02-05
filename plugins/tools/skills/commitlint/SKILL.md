---
name: bs:tools:commitlint
description: Configure commitlint and pre-commit hooks with Lefthook
allowed-tools: Bash(pnpm *), Bash(lefthook *), Bash(ls *), Read, Write, Edit, Glob
---

# /bs:tools:commitlint

Configure commitlint and pre-commit hooks for the monorepo.

## Description

This skill sets up:
- **Commitlint** - Enforce Conventional Commits format
- **Lefthook** - Fast git hooks manager
- **Pre-commit hooks** - Lint and format staged files

## Usage

```
/bs:tools:commitlint
```

## What Gets Created/Modified

```
{project}/
├── commitlint.config.mjs    # Commitlint configuration (NEW)
├── lefthook.yml             # Git hooks configuration (NEW/MODIFIED)
└── package.json             # Added commitlint dependencies (MODIFIED)
```

## Prerequisites

- Monorepo initialized with `/bs:repo:init`
- Toolchains pinned via `/bs:tools:proto node pnpm lefthook`

## Template Resolution

Templates are located relative to this SKILL.md file at `./templates/`.

**To find the absolute path**, use the Glob tool with the `$HOME` variable (do NOT use `~`, it does not expand in Glob):

```
Glob: $HOME/.claude/plugins/cache/**/bs-tools/**/skills/commitlint/templates/commitlint.config.mjs
```

Strip the filename to get the template directory.

---

## Instructions

### Step 1: Find Templates Directory

> **IMPORTANT**: Use `$HOME` instead of `~` in the glob pattern. The `~` character is NOT expanded by the Glob tool.

```
Glob: $HOME/.claude/plugins/cache/**/bs-tools/**/skills/commitlint/templates/commitlint.config.mjs
```

Strip the filename to get `TEMPLATES_DIR`.

### Step 2: Check Prerequisites

Verify monorepo structure exists:

```bash
ls .moon/workspace.yml
```

If not found, inform user to run `/bs:repo:init` first.

### Step 3: Verify Toolchains

Verify that `node`, `pnpm`, and `lefthook` are available:

```bash
proto status
```

If any of `node`, `pnpm`, or `lefthook` are NOT pinned, inform the user:

```
Required toolchains are missing. Run first:
/bs:tools:proto node pnpm lefthook
```

**Do NOT attempt to pin tools here.** Toolchain management is handled by `/bs:tools:proto`.

Also verify `package.json` exists:

```bash
ls package.json
```

If missing, inform user to run `/bs:tools:proto node pnpm` which creates it.

### Step 4: Ask Configuration Questions

Ask the user:

1. **Commit convention**: Conventional Commits (default) or custom?
2. **Custom scopes**: Any project-specific scopes to enforce? (e.g., `api`, `web`, `ui`) Leave empty to allow any scope.
3. **Pre-commit hooks**: Which hooks to enable?
   - Detect automatically based on installed tools (recommended)
   - Manual selection

### Step 5: Create commitlint.config.mjs

Read the template from `TEMPLATES_DIR/commitlint.config.mjs`.

If user specified custom scopes in Q2, extend the config:

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['api', 'web', 'ui']],
  },
};
```

Otherwise, use the template as-is.

### Step 6: Install Commitlint Dependencies

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

### Step 7: Create/Update lefthook.yml

Read the template from `TEMPLATES_DIR/lefthook.yml` as the base.

### Step 8: Detect Languages and Add Pre-commit Hooks

Check which languages/tools are in the project:

**If ESLint detected** (check for `eslint.config.ts` or `eslint` in package.json):

```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      glob: "*.{ts,tsx,js,jsx}"
      run: pnpm eslint --fix {staged_files}
```

**If Prettier detected** (check for `prettier.config.js` or `prettier` in package.json):

```yaml
pre-commit:
  parallel: true
  commands:
    prettier:
      glob: "*.{ts,tsx,js,jsx,json,md,css,scss}"
      run: pnpm prettier --write {staged_files}
```

**If Python detected** (check for `pyproject.toml` or `*.py` files):

```yaml
pre-commit:
  parallel: true
  commands:
    ruff-check:
      glob: "*.py"
      run: uv run ruff check --fix {staged_files}
    ruff-format:
      glob: "*.py"
      run: uv run ruff format {staged_files}
```

Merge all detected hooks into the `pre-commit.commands` section.

### Step 9: Install Lefthook Hooks

```bash
lefthook install
```

### Step 10: Summary

```
Commitlint + Lefthook configured successfully!

Created:
  - commitlint.config.mjs
  - lefthook.yml

Installed:
  - @commitlint/cli
  - @commitlint/config-conventional
  - lefthook (via proto)

Active hooks:
  - commit-msg: Validates commit messages (Conventional Commits)
  - pre-commit: [list detected hooks]

Commit format:
  <type>(<scope>): <description>

  Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

Examples:
  feat(api): add user authentication
  fix(web): resolve login redirect issue
  chore(deps): update dependencies
```

---

## Conventional Commits

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `build` - Build system changes
- `ci` - CI configuration changes
- `chore` - Maintenance tasks
- `revert` - Revert previous commit
