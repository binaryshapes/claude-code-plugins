# /check

Run all quality checks across the monorepo.

## Description

This command runs comprehensive quality checks including linting, type checking, and tests for both TypeScript and Python projects.

## Usage

```
/check [options]
```

**Options:**
- `--affected` - Only check affected projects
- `--fix` - Auto-fix issues where possible
- `--no-tests` - Skip running tests

## What It Runs

### TypeScript Projects

1. **Linting** - ESLint with project configuration
2. **Type Checking** - TypeScript compiler (tsc --noEmit)
3. **Formatting** - Prettier check
4. **Tests** - Vitest (unless --no-tests)

### Python Projects

1. **Linting** - Ruff linter
2. **Type Checking** - mypy
3. **Formatting** - Ruff format check
4. **Tests** - pytest (unless --no-tests)

## Commands Executed

### All Projects

```bash
# TypeScript
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test

# Python
uv run ruff check .
uv run mypy .
uv run ruff format --check .
uv run pytest
```

### Affected Only

```bash
moon run :lint --affected
moon run :typecheck --affected
moon run :test --affected
```

### With Auto-fix

```bash
# TypeScript
pnpm lint:fix
pnpm format

# Python
uv run ruff check --fix .
uv run ruff format .
```

## Output

```
## Quality Check Report

### TypeScript
✓ ESLint: 0 errors, 0 warnings
✓ TypeScript: No type errors
✓ Prettier: All files formatted
✓ Tests: 142 passed

### Python
✓ Ruff: 0 issues
✓ mypy: No type errors
✓ Formatting: All files formatted
✓ Tests: 38 passed

### Summary
All checks passed!
```

## Integration

### Pre-commit

Add to `lefthook.yml`:
```yaml
pre-commit:
  commands:
    check:
      run: moon run :lint && moon run :typecheck
```

### CI/CD

```yaml
- name: Quality Check
  run: |
    pnpm lint
    pnpm typecheck
    pnpm format:check
    pnpm test
```

## Related Commands

- `/format` - Format all code
- `/build` - Build all projects
