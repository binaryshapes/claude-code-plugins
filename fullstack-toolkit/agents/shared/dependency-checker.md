# Dependency Checker Agent

Audit dependencies for security vulnerabilities and outdated packages across TypeScript and Python projects.

## Description

This agent performs comprehensive dependency auditing for both TypeScript (npm/pnpm) and Python (pip/uv) projects. It checks for security vulnerabilities, outdated packages, and license compliance issues.

## When to Use

- Regularly (weekly/monthly) to check for vulnerabilities
- Before releases
- During security reviews
- To plan dependency updates
- As part of CI/CD pipeline

## Checks Performed

### 1. Security Vulnerabilities

#### Node.js (pnpm)
```bash
pnpm audit
```

#### Python (pip-audit)
```bash
uv run pip-audit
```

### 2. Outdated Packages

#### Node.js
```bash
pnpm outdated
```

#### Python
```bash
uv pip list --outdated
```

### 3. License Compliance

#### Node.js
```bash
npx license-checker --summary
```

#### Python
```bash
uv run pip-licenses
```

## Execution

### Run Full Audit

```bash
# TypeScript
pnpm audit
pnpm outdated

# Python
uv run pip-audit
uv pip list --outdated
```

### Run Security Check Only

```bash
pnpm audit --audit-level=high
uv run pip-audit --strict
```

### Run for Specific Project

```bash
cd apps/my-app
pnpm audit
```

## Output Format

### Security Report

```
## Security Audit Report

### Critical Vulnerabilities (2)

#### lodash@4.17.15
- Severity: CRITICAL
- CVE: CVE-2021-23337
- Description: Prototype pollution in lodash
- Fix: Upgrade to lodash@4.17.21
- Affected: apps/web, packages/utils

#### pyyaml@5.3.1
- Severity: HIGH
- CVE: CVE-2020-14343
- Description: Arbitrary code execution
- Fix: Upgrade to pyyaml@5.4.1
- Affected: apps/api

### High Vulnerabilities (1)

#### axios@0.21.0
- Severity: HIGH
- CVE: CVE-2021-3749
- Description: Inefficient regex
- Fix: Upgrade to axios@0.21.2
- Affected: apps/web

### Summary
- Critical: 2
- High: 1
- Medium: 3
- Low: 5
```

### Outdated Packages Report

```
## Outdated Packages Report

### TypeScript Projects

| Package      | Current | Wanted  | Latest  | Location     |
|--------------|---------|---------|---------|--------------|
| react        | 18.2.0  | 18.2.0  | 19.0.0  | apps/web     |
| typescript   | 5.3.0   | 5.3.3   | 5.7.2   | root         |
| vitest       | 1.0.0   | 1.0.4   | 2.1.0   | root         |

### Python Projects

| Package      | Current | Latest  | Location     |
|--------------|---------|---------|--------------|
| fastapi      | 0.110.0 | 0.115.0 | apps/api     |
| pydantic     | 2.5.0   | 2.10.0  | apps/api     |

### Update Recommendations

#### Safe Updates (patch/minor)
- typescript: 5.3.0 → 5.3.3
- vitest: 1.0.0 → 1.0.4

#### Major Updates (review needed)
- react: 18.2.0 → 19.0.0 (breaking changes)
- vitest: 1.0.0 → 2.1.0 (breaking changes)
```

### License Report

```
## License Compliance Report

### TypeScript Dependencies

| License     | Count | Packages                          |
|-------------|-------|-----------------------------------|
| MIT         | 245   | react, typescript, vitest, ...    |
| Apache-2.0  | 23    | @aws-sdk/*, firebase, ...         |
| ISC         | 18    | glob, semver, ...                 |
| BSD-3       | 5     | @anthropic/*, ...                 |

### Python Dependencies

| License     | Count | Packages                          |
|-------------|-------|-----------------------------------|
| MIT         | 32    | fastapi, pydantic, ...            |
| Apache-2.0  | 8     | google-*, ...                     |
| BSD-3       | 5     | numpy, pandas, ...                |

### Potential Issues
- GPL-3.0: 1 package (copyleft license, review usage)
- Unknown: 2 packages (review manually)
```

## Auto-fix

### Update All Packages

```bash
# TypeScript - update to latest within range
pnpm update

# TypeScript - update to latest (including major)
pnpm update --latest

# Python - update all
uv sync --upgrade
```

### Fix Specific Vulnerability

```bash
# TypeScript
pnpm update lodash@4.17.21

# Python
uv add pyyaml@5.4.1 --upgrade
```

## Configuration

### Audit Ignore (package.json)

```json
{
  "pnpm": {
    "auditConfig": {
      "ignoreCves": ["CVE-2023-12345"]
    }
  }
}
```

### License Allow List

```json
{
  "license-checker": {
    "onlyAllow": ["MIT", "Apache-2.0", "ISC", "BSD-3-Clause"]
  }
}
```

## Integration

### CI/CD

```yaml
- name: Security Audit
  run: |
    pnpm audit --audit-level=high
    uv run pip-audit --strict
  continue-on-error: true

- name: License Check
  run: |
    npx license-checker --onlyAllow="MIT;Apache-2.0;ISC;BSD-3-Clause"
```

### Scheduled Audit

```yaml
name: Weekly Audit

on:
  schedule:
    - cron: '0 0 * * 1'  # Every Monday

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Audit dependencies
        run: |
          pnpm audit
          uv run pip-audit
```

## Related Agents

- `ts-code-quality` - TypeScript code quality
- `py-code-quality` - Python code quality
- `ts-test-runner` - TypeScript tests
- `py-test-runner` - Python tests
