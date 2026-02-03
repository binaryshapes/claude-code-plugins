# TypeScript Test Runner Agent

Execute TypeScript tests using Vitest and report results.

## Description

This agent runs tests across TypeScript projects in the monorepo using Vitest. It provides detailed test results, coverage reports, and identifies areas needing test coverage.

## When to Use

- After making code changes
- Before committing/pushing code
- During code review
- To validate functionality
- To check test coverage

## Test Execution

### Run All Tests

```bash
pnpm test
# or
moon run :test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
# or
vitest
```

### Run Tests for Specific Project

```bash
moon run project-name:test
```

### Run Affected Tests Only

```bash
moon run :test --affected
```

### Run Specific Test File

```bash
vitest src/components/Button.test.tsx
```

### Run Tests Matching Pattern

```bash
vitest --grep "should handle click"
```

## Coverage

### Generate Coverage Report

```bash
vitest run --coverage
```

### Coverage Thresholds

Configure in `vitest.config.ts`:
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

## Output Format

### Test Results

```
## Test Results

### Passed Tests (42)
✓ src/components/Button.test.tsx (5 tests)
✓ src/utils/helpers.test.ts (12 tests)
✓ src/services/api.test.ts (8 tests)
...

### Failed Tests (2)
✗ src/hooks/useAuth.test.ts
  - should redirect on logout
    Expected: "/login"
    Received: "/"
    at src/hooks/useAuth.test.ts:45:10

✗ src/components/Form.test.tsx
  - should validate required fields
    TypeError: Cannot read property 'value' of undefined
    at src/components/Form.test.tsx:28:15

### Skipped Tests (1)
○ src/features/experimental.test.ts (skipped)

### Summary
Tests: 42 passed, 2 failed, 1 skipped
Time: 3.45s
```

### Coverage Report

```
## Coverage Report

| File                    | Lines   | Functions | Branches |
|-------------------------|---------|-----------|----------|
| src/components/Button   | 95.2%   | 100%      | 85.7%    |
| src/utils/helpers       | 100%    | 100%      | 100%     |
| src/services/api        | 78.4%   | 85.0%     | 65.0%    |
| src/hooks/useAuth       | 45.2%   | 50.0%     | 40.0%    |

### Uncovered Lines
- src/services/api.ts:45-52 (error handling)
- src/hooks/useAuth.ts:28-35 (token refresh)
- src/hooks/useAuth.ts:67-78 (logout cleanup)

### Overall Coverage: 82.4%
```

## Test Patterns

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

### Component Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Async Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './api';

describe('fetchUser', () => {
  it('should fetch user data', async () => {
    const user = await fetchUser(1);
    expect(user).toHaveProperty('id', 1);
  });
});
```

## Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // or 'happy-dom' for browser
    include: ['**/*.{test,spec}.{ts,tsx}'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
});
```

## Integration

### Pre-push Hook

```yaml
pre-push:
  commands:
    test:
      run: pnpm test
```

### CI/CD

```yaml
- name: Run Tests
  run: pnpm test -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
```

## Related Agents

- `ts-code-quality` - Code quality checks
- `dependency-checker` - Audit dependencies
