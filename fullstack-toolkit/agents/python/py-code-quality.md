# Python Code Quality Agent

Analyze Python code quality using Ruff and mypy.

## Description

This agent runs comprehensive code quality checks on Python projects in the monorepo. It executes linting, formatting checks, and type checking using modern, fast tools.

## When to Use

- Before committing code changes
- During code review
- To identify code quality issues across the codebase
- As part of CI/CD validation

## Checks Performed

### 1. Ruff (Linting)

Runs Ruff linter to check for:
- PEP 8 style violations
- Potential bugs and errors
- Import sorting issues
- Security vulnerabilities
- Code complexity

**Command:**
```bash
uv run ruff check .
```

### 2. Ruff (Formatting)

Checks code formatting:
- Consistent indentation
- Line length
- String quotes
- Trailing commas

**Command:**
```bash
uv run ruff format --check .
```

### 3. mypy (Type Checking)

Runs mypy for static type analysis:
- Type errors
- Missing type annotations
- Incorrect type usage
- Import issues

**Command:**
```bash
uv run mypy src
```

## Execution

### Run All Checks

```bash
moon run :lint && moon run :typecheck && moon run :format --check
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

### Ruff Lint Issues
- `src/services/api.py:15:1` - E501: Line too long (120 > 88)
- `src/utils/helpers.py:42:5` - F401: `os` imported but unused
- `src/models/user.py:28:1` - I001: Import block is unsorted

### Type Errors
- `src/services/api.py:35:12` - error: Argument 1 to "fetch" has incompatible type "str"; expected "int"
- `src/handlers/auth.py:22:8` - error: Missing return statement

### Formatting Issues
- `src/app.py` - needs formatting

### Summary
- Ruff Lint: 3 issues
- mypy: 2 errors
- Formatting: 1 file needs formatting
```

## Auto-fix

The agent can attempt to auto-fix issues:

### Ruff Lint Auto-fix
```bash
uv run ruff check --fix .
```

### Ruff Format Auto-fix
```bash
uv run ruff format .
```

## Configuration

### ruff.toml

```toml
target-version = "py312"
line-length = 88

[lint]
select = ["E", "W", "F", "I", "N", "UP", "B", "C4", "SIM"]
ignore = ["E501"]
fixable = ["ALL"]

[format]
quote-style = "double"
indent-style = "space"
```

### mypy.ini

```ini
[mypy]
python_version = 3.12
strict = true
warn_return_any = true
disallow_untyped_defs = true
```

## Integration

### Pre-commit Hook

Add to `lefthook.yml`:
```yaml
pre-commit:
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
```

### CI/CD

```yaml
- name: Code Quality
  run: |
    uv run ruff check .
    uv run ruff format --check .
    uv run mypy src
```

## Related Agents

- `py-test-runner` - Run Python tests
- `dependency-checker` - Audit dependencies
