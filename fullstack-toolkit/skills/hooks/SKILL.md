---
name: hooks
description: Configure hooks for pre-commit, CI/CD, and Claude Code
allowed-tools: Bash(lefthook *), Bash(pnpm *), Bash(uv *), Bash(mkdir *), Read, Write, Edit, Glob
---

# /hooks

Configure hooks for pre-commit, CI/CD, and Claude Code.

## Description

This skill helps set up various hooks to automate code quality, testing, and CI/CD workflows.

## Usage

```
/hooks <type> [options]
```

**Types:**
- `pre-commit` - Configure Lefthook pre-commit hooks
- `ci` - Generate GitHub Actions CI/CD workflows
- `claude` - Configure Claude Code hooks

## Pre-commit Hooks

### Usage

```
/hooks pre-commit [--install]
```

**Options:**
- `--install`: Also install Lefthook if not present

### What It Configures

Updates `lefthook.yml` with language-appropriate hooks based on what's in the project:

**For TypeScript projects (if detected):**
```yaml
pre-commit:
  parallel: true
  commands:
    ts-lint:
      glob: "*.{ts,tsx,js,jsx}"
      run: pnpm lint:staged {staged_files}
    ts-typecheck:
      glob: "*.{ts,tsx}"
      run: pnpm typecheck
    ts-format:
      glob: "*.{ts,tsx,js,jsx,json,md}"
      run: pnpm prettier --check {staged_files}
    ts-test:
      glob: "*.{ts,tsx}"
      run: pnpm vitest run --changed

pre-push:
  commands:
    ts-build:
      run: pnpm build
```

**For Python projects (if detected):**
```yaml
pre-commit:
  parallel: true
  commands:
    py-lint:
      glob: "*.py"
      run: uv run ruff check {staged_files}
    py-format:
      glob: "*.py"
      run: uv run ruff format --check {staged_files}
    py-typecheck:
      glob: "*.py"
      run: uv run mypy {staged_files}
    py-test:
      glob: "*.py"
      run: uv run pytest --co -q

pre-push:
  commands:
    py-test-full:
      run: uv run pytest
```

### Instructions

1. Check what languages are configured in `.prototools`:
   ```bash
   cat .prototools
   ```

2. Check for existing `lefthook.yml`

3. Generate hooks configuration based on detected languages

4. If `--install` flag is present:
   ```bash
   # Install Lefthook
   pnpm add -Dw lefthook
   # Or for non-Node projects
   brew install lefthook

   # Initialize hooks
   lefthook install
   ```

5. Verify hooks are installed:
   ```bash
   lefthook run pre-commit
   ```

## CI/CD Workflows

### Usage

```
/hooks ci [--provider github|gitlab] [--template minimal|standard|full]
```

**Options:**
- `--provider`: CI provider (default: github)
- `--template`: Workflow template (default: standard)

### Templates

**minimal**: Basic lint and test
```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: moonrepo/setup-toolchain@v0
      - run: moon ci
```

**standard**: Lint, typecheck, test, build
```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup toolchain
        uses: moonrepo/setup-toolchain@v0

      - name: Run CI
        run: moon ci

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()
        with:
          files: ./coverage/lcov.info
```

**full**: CI + Release + Deploy workflows

### Instructions

1. Create `.github/workflows/` directory if needed

2. Generate workflow files based on template:
   - `ci.yml` - Continuous integration
   - `release.yml` - Semantic release (for `full` template)
   - `deploy.yml` - Deployment (for `full` template)

3. Detect languages and add appropriate steps

4. Copy files from `hooks/ci/` templates

## Claude Code Hooks

### Usage

```
/hooks claude [--auto-fix] [--check-on-edit]
```

**Options:**
- `--auto-fix`: Auto-fix linting issues after edits
- `--check-on-edit`: Run checks before each edit

### What It Configures

Creates/updates `.claude/settings.local.json`:

```json
{
  "hooks": {
    "preToolCall": [
      {
        "matcher": "Edit|Write",
        "command": "moon check --affected",
        "description": "Check affected projects before edit"
      }
    ],
    "postToolCall": [
      {
        "matcher": "Edit|Write",
        "command": "pnpm lint:fix ${file} && uv run ruff format ${file}",
        "description": "Auto-fix after edit"
      }
    ]
  }
}
```

### Instructions

1. Check if `.claude/` directory exists, create if not

2. Read existing `.claude/settings.local.json` if present

3. Merge hook configuration based on options

4. Write updated configuration

5. Show summary of configured hooks

## Examples

```bash
# Set up pre-commit hooks
/hooks pre-commit --install

# Generate GitHub Actions CI
/hooks ci --provider github --template standard

# Configure Claude Code auto-fix
/hooks claude --auto-fix

# Full setup
/hooks pre-commit --install
/hooks ci --template full
/hooks claude --auto-fix --check-on-edit
```

## Hook Templates Location

The hook templates are stored in:
- `hooks/pre-commit/` - Lefthook configurations
- `hooks/ci/` - GitHub Actions workflows
- `hooks/claude/` - Claude Code hook configurations

## Important Notes

- Lefthook runs hooks in parallel by default for speed
- CI workflows use Moon's `moon ci` for intelligent affected-only runs
- Claude Code hooks help maintain code quality during AI-assisted development
- All hooks are non-blocking by default (can be configured to block)
