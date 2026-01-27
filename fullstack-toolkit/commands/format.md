# /format

Format all code in the monorepo.

## Description

This command formats all code using the appropriate formatter for each language - Prettier for TypeScript/JavaScript and Ruff for Python.

## Usage

```
/format [options]
```

**Options:**
- `--check` - Check formatting without making changes
- `--staged` - Only format staged files

## What It Does

### TypeScript/JavaScript

Uses Prettier to format:
- `.ts`, `.tsx` - TypeScript files
- `.js`, `.jsx` - JavaScript files
- `.json` - JSON files
- `.md` - Markdown files
- `.yml`, `.yaml` - YAML files
- `.css` - CSS files

### Python

Uses Ruff to format:
- `.py` - Python files

## Commands Executed

### Format All

```bash
# TypeScript
pnpm prettier --write .

# Python
uv run ruff format .
```

### Check Only

```bash
# TypeScript
pnpm prettier --check .

# Python
uv run ruff format --check .
```

### Staged Files Only

```bash
# TypeScript
pnpm prettier --write $(git diff --cached --name-only --diff-filter=ACMR "*.ts" "*.tsx" "*.js" "*.json")

# Python
uv run ruff format $(git diff --cached --name-only --diff-filter=ACMR "*.py")
```

## Output

### Formatting Applied

```
## Formatting Report

### TypeScript/JavaScript
Formatted 23 files:
  - src/components/Button.tsx
  - src/utils/helpers.ts
  - src/hooks/useAuth.ts
  ...

### Python
Formatted 8 files:
  - src/api/routes.py
  - src/models/user.py
  - tests/test_api.py
  ...

### Summary
31 files formatted
```

### Check Mode

```
## Formatting Check

### Files needing formatting:

TypeScript:
  - src/components/Button.tsx
  - src/utils/helpers.ts

Python:
  - src/api/routes.py

Run '/format' to fix these files.
```

## Configuration

### Prettier (prettier.config.js)

```javascript
export default {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
};
```

### Ruff (ruff.toml)

```toml
[format]
quote-style = "double"
indent-style = "space"
line-ending = "lf"
```

## Integration

### Pre-commit Hook

```yaml
pre-commit:
  commands:
    format:
      glob: "*.{ts,tsx,js,jsx,json,md,py}"
      run: |
        pnpm prettier --check {staged_files}
        uv run ruff format --check {staged_files}
```

### Editor Integration

Most editors can be configured to format on save using these tools.

## Related Commands

- `/check` - Run all quality checks
- `/build` - Build all projects
