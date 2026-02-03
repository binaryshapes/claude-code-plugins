# TypeScript Code Quality Agent

Analyze TypeScript code quality using ESLint, Prettier, and TypeScript compiler.

## Description

This agent runs comprehensive code quality checks on TypeScript projects in the monorepo. It executes linting, formatting checks, and type checking, providing detailed reports with file:line references for any issues found.

## When to Use

- Before committing code changes
- During code review
- To identify code quality issues across the codebase
- As part of CI/CD validation

## Checks Performed

### 1. ESLint (Linting)

Runs ESLint with the project's configuration to check for:
- Code style violations
- Potential bugs and errors
- Best practice violations
- Import/export issues
- TypeScript-specific rules

**Command:**
```bash
pnpm lint
```

### 2. Prettier (Formatting)

Checks code formatting against Prettier configuration:
- Consistent indentation
- Line length
- Quote style
- Trailing commas
- Other formatting rules

**Command:**
```bash
pnpm format:check
```

### 3. TypeScript (Type Checking)

Runs the TypeScript compiler in check mode:
- Type errors
- Missing types
- Incorrect type usage
- Import resolution issues

**Command:**
```bash
pnpm typecheck
```

## Execution

### Run All Checks

```bash
moon run :lint && moon run :typecheck && pnpm format:check
```

### Run on Specific Project

```bash
moon run project-name:lint
moon run project-name:typecheck
```

### Run on Affected Projects Only

```bash
moon run :lint --affected
moon run :typecheck --affected
```

## Output Format

The agent provides structured output with:

```
## Code Quality Report

### ESLint Issues
- `src/components/Button.tsx:15:3` - error: Unexpected console statement (no-console)
- `src/utils/helpers.ts:42:10` - warning: 'unused' is defined but never used (@typescript-eslint/no-unused-vars)

### Type Errors
- `src/services/api.ts:28:5` - error TS2322: Type 'string' is not assignable to type 'number'

### Formatting Issues
- `src/App.tsx` - needs formatting

### Summary
- ESLint: 2 errors, 1 warning
- TypeScript: 1 error
- Prettier: 1 file needs formatting
```

## Auto-fix

The agent can attempt to auto-fix issues:

### ESLint Auto-fix
```bash
pnpm lint:fix
```

### Prettier Auto-fix
```bash
pnpm format
```

## Configuration

The agent uses project-level configuration files:

- `eslint.config.ts` - ESLint flat config (TypeScript)
- `prettier.config.js` - Prettier configuration
- `tsconfig.json` / `tsconfig.base.json` - TypeScript configuration

## Integration

### Pre-commit Hook

Add to `lefthook.yml`:
```yaml
pre-commit:
  commands:
    ts-lint:
      glob: "*.{ts,tsx}"
      run: pnpm lint:staged {staged_files}
    ts-typecheck:
      run: pnpm typecheck
    ts-format:
      glob: "*.{ts,tsx,js,jsx,json}"
      run: pnpm prettier --check {staged_files}
```

### CI/CD

```yaml
- name: Code Quality
  run: |
    pnpm lint
    pnpm typecheck
    pnpm format:check
```

## Related Agents

- `ts-test-runner` - Run TypeScript tests
- `dependency-checker` - Audit dependencies
