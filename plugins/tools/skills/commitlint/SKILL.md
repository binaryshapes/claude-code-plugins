---
name: bs:tools:commitlint
description: Configure commitlint and pre-commit hooks with Lefthook
allowed-tools: Bash(proto *), Bash(pnpm *), Bash(pnpm init), Bash(lefthook *), Bash(mkdir *), Bash(ls *), Read, Write, Edit, Glob
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
├── .prototools              # Lefthook + Node.js + pnpm pinned (MODIFIED)
└── package.json             # Created if missing, commitlint deps added (NEW/MODIFIED)
```

## Prerequisites

- Monorepo initialized with `/bs:repo:init`
- Proto installed

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

### Step 3: Ensure Node.js and pnpm Are Available

Check if Node.js and pnpm are pinned in `.prototools`:

```bash
proto status
```

If Node.js or pnpm are NOT pinned, pin them now:

```bash
proto pin node lts --resolve
proto pin pnpm latest --resolve
proto use
```

This is required because `/bs:repo:init` only pins Moon — Node.js and pnpm are added when the first TypeScript tooling is needed.

### Step 4: Ensure package.json Exists

Check if root `package.json` exists:

```bash
ls package.json
```

If it does NOT exist, create it:

```bash
pnpm init
```

Then edit it to add `"type": "module"` and set `"private": true`.

### Step 5: Ask Configuration Questions

Ask the user:

1. **Commit convention**: Conventional Commits (default) or custom?
2. **Custom scopes**: Any project-specific scopes to enforce? (e.g., `api`, `web`, `ui`) Leave empty to allow any scope.
3. **Pre-commit hooks**: Which hooks to enable?
   - Detect automatically based on installed tools (recommended)
   - Manual selection

### Step 6: Register and Pin Lefthook with Proto

Lefthook is NOT a built-in Proto plugin. It must be registered first:

```bash
proto plugin add lefthook "https://raw.githubusercontent.com/nicklasmoeller/proto-lefthook-plugin/main/plugin.toml"
```

Then pin and install:

```bash
proto pin lefthook latest --resolve
proto use
```

### Step 7: Create commitlint.config.mjs

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

### Step 8: Install Commitlint Dependencies

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

### Step 9: Create/Update lefthook.yml

Read the template from `TEMPLATES_DIR/lefthook.yml` as the base.

### Step 10: Detect Languages and Add Pre-commit Hooks

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

### Step 11: Install Lefthook Hooks

```bash
lefthook install
```

### Step 12: Summary

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
