# Python Test Runner Agent

Execute Python tests using pytest and report results.

## Description

This agent runs tests across Python projects in the monorepo using pytest. It provides detailed test results, coverage reports, and identifies areas needing test coverage.

## When to Use

- After making code changes
- Before committing/pushing code
- During code review
- To validate functionality
- To check test coverage

## Test Execution

### Run All Tests

```bash
uv run pytest
# or
moon run :test
```

### Run Tests with Verbose Output

```bash
uv run pytest -v
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
uv run pytest tests/test_api.py
```

### Run Tests Matching Pattern

```bash
uv run pytest -k "test_login"
```

## Coverage

### Generate Coverage Report

```bash
uv run pytest --cov
```

### Generate HTML Coverage Report

```bash
uv run pytest --cov --cov-report=html
```

### Coverage Thresholds

Configure in `pyproject.toml`:
```toml
[tool.coverage.run]
source = ["src"]
branch = true

[tool.coverage.report]
fail_under = 80
```

## Output Format

### Test Results

```
## Test Results

### Passed Tests (38)
✓ tests/test_api.py::TestAPI::test_fetch_user (0.12s)
✓ tests/test_api.py::TestAPI::test_create_user (0.08s)
✓ tests/test_utils.py::test_format_date (0.01s)
...

### Failed Tests (2)
✗ tests/test_auth.py::TestAuth::test_logout_redirect
  AssertionError: Expected "/login", got "/"

  def test_logout_redirect():
      result = logout()
  >   assert result.redirect == "/login"
  E   AssertionError: assert "/" == "/login"

  tests/test_auth.py:45

✗ tests/test_form.py::TestForm::test_validate_required
  TypeError: 'NoneType' object is not subscriptable

  tests/test_form.py:28

### Skipped Tests (1)
○ tests/test_experimental.py::test_new_feature (skipped: experimental)

### Summary
Tests: 38 passed, 2 failed, 1 skipped
Duration: 2.34s
```

### Coverage Report

```
## Coverage Report

| File                    | Stmts | Miss | Branch | Cover |
|-------------------------|-------|------|--------|-------|
| src/api/client.py       | 45    | 2    | 12     | 95.2% |
| src/utils/helpers.py    | 28    | 0    | 8      | 100%  |
| src/services/auth.py    | 52    | 12   | 16     | 78.4% |
| src/handlers/form.py    | 38    | 18   | 10     | 45.2% |

### Uncovered Lines
- src/services/auth.py:45-52 (error handling)
- src/services/auth.py:67-78 (token refresh)
- src/handlers/form.py:28-35 (validation edge cases)

### Overall Coverage: 82.4%
```

## Test Patterns

### Unit Tests

```python
def test_add():
    """Test addition function."""
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
```

### Class-based Tests

```python
class TestCalculator:
    """Tests for Calculator class."""

    @pytest.fixture
    def calc(self) -> Calculator:
        """Create calculator instance."""
        return Calculator()

    def test_add(self, calc: Calculator) -> None:
        """Test addition."""
        assert calc.add(1, 2) == 3
```

### Async Tests

```python
@pytest.mark.asyncio
async def test_fetch_user():
    """Test async user fetch."""
    user = await fetch_user(1)
    assert user["id"] == 1
```

### Parameterized Tests

```python
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add_parameterized(a: int, b: int, expected: int) -> None:
    """Test addition with various inputs."""
    assert add(a, b) == expected
```

## Configuration

### pyproject.toml

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["src"]
asyncio_mode = "auto"
addopts = ["--strict-markers", "--strict-config", "-ra"]

[tool.coverage.run]
source = ["src"]
branch = true
```

## Integration

### Pre-push Hook

```yaml
pre-push:
  commands:
    py-test:
      run: uv run pytest
```

### CI/CD

```yaml
- name: Run Tests
  run: uv run pytest --cov

- name: Upload Coverage
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage.xml
```

## Related Agents

- `py-code-quality` - Code quality checks
- `dependency-checker` - Audit dependencies
