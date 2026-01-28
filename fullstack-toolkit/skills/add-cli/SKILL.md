---
name: add-cli
description: Add a CLI tool to the monorepo (TypeScript or Python)
---

# /add-cli

Add a CLI (command-line interface) tool to the monorepo.

## Description

This skill scaffolds a CLI tool. CLI tools are placed in the `tools/` directory and can be run directly or installed globally.

- **Python CLIs**: Use `uv init` + post-processing (add Typer + Rich)
- **TypeScript CLIs**: Use templates (no official CLI scaffolder)

## Usage

```
/add-cli
```

The skill will prompt you for:
1. **Language**: TypeScript or Python
2. **Name**: CLI tool name
3. **Binary name** (optional): Command name when installed

## Supported CLIs

| Language | Method | Framework | Features |
|----------|--------|-----------|----------|
| TypeScript | Template | Commander.js + chalk | Argument parsing, colorful output, subcommands |
| Python | `uv init` + deps | Typer + Rich | Type-safe CLI, beautiful terminal UI |

## Instructions

### Step 1: Ask Language

Prompt the user to select a language:

**Question**: "What language would you like to use?"
- **TypeScript** - Node.js CLI with Commander.js
- **Python** - Python CLI with Typer

### Step 2: Ask CLI Name

Prompt for the CLI tool name:
- TypeScript: lowercase, kebab-case (e.g., `my-cli`)
- Python: lowercase, snake_case (e.g., `my_cli`)

### Step 3: Ask Binary Name (Optional)

Prompt for the binary/command name:
- Default: same as project name (with underscores replaced by hyphens for Python)
- Example: If name is `my_tool`, binary could be `my-tool`

### Step 4: Verify/Configure Toolchain

Ensure the appropriate toolchain is configured (same as `/add-app`).

---

## Step 5: Scaffold CLI

### TypeScript CLI - Template

#### 5a. Copy Template

Copy the template from `templates/cli-ts/`:

```bash
cp -r templates/cli-ts/ tools/{{name}}/
```

#### 5b. Post-processing

1. Replace placeholders in all files:
   - `{{name}}` → CLI project name
   - `{{bin}}` → Binary/command name
   - `{{scope}}` → Package scope (from monorepo config)

2. Files to update with placeholders:
   - `package.json` - name, bin field
   - `src/cli.ts` - command name
   - `src/commands/hello.ts` - if needed
   - `tests/cli.test.ts` - command references

---

### Python CLI - Official CLI + Post-processing

#### 5a. Run Official CLI

```bash
uv init tools/{{name}} --lib
```

#### 5b. Post-processing

1. **Add CLI dependencies**:
   ```bash
   cd tools/{{name}}
   uv add typer rich
   ```

2. **Create proper structure**:
   ```bash
   mkdir -p tools/{{name}}/src/{{name}}/commands
   mkdir -p tools/{{name}}/src/{{name}}/utils
   touch tools/{{name}}/src/{{name}}/__init__.py
   touch tools/{{name}}/src/{{name}}/commands/__init__.py
   touch tools/{{name}}/src/{{name}}/utils/__init__.py
   ```

3. **Create `src/{{name}}/__init__.py`**:
   ```python
   """{{name}} CLI tool."""

   __version__ = "0.0.0"
   ```

4. **Create `src/{{name}}/cli.py`**:
   ```python
   """Main CLI entry point."""

   import typer

   from {{name}}.commands.hello import hello


   app = typer.Typer(
       name="{{bin}}",
       help="{{name}} CLI tool",
       add_completion=False,
   )

   # Register commands
   app.command()(hello)


   @app.callback(invoke_without_command=True)
   def main(
       ctx: typer.Context,
       version: bool = typer.Option(False, "--version", "-v", help="Show version"),
   ) -> None:
       """{{name}} CLI tool."""
       if version:
           from {{name}} import __version__
           typer.echo(f"{{bin}} version {__version__}")
           raise typer.Exit()

       if ctx.invoked_subcommand is None:
           typer.echo(ctx.get_help())


   if __name__ == "__main__":
       app()
   ```

5. **Create `src/{{name}}/commands/hello.py`**:
   ```python
   """Hello command."""

   import typer

   from {{name}}.utils.console import success


   def hello(
       name: str = typer.Argument("World", help="Name to greet"),
       loud: bool = typer.Option(False, "--loud", "-l", help="Shout the greeting"),
   ) -> None:
       """Say hello to someone."""
       greeting = f"Hello, {name}!"

       if loud:
           greeting = greeting.upper()

       success(greeting)
   ```

6. **Create `src/{{name}}/utils/console.py`**:
   ```python
   """Console utility functions."""

   from rich.console import Console


   console = Console()


   def info(message: str) -> None:
       """Print an info message."""
       console.print(f"[blue]i[/blue] {message}")


   def success(message: str) -> None:
       """Print a success message."""
       console.print(f"[green]✓[/green] {message}")


   def warning(message: str) -> None:
       """Print a warning message."""
       console.print(f"[yellow]⚠[/yellow] {message}")


   def error(message: str) -> None:
       """Print an error message."""
       console.print(f"[red]✗[/red] {message}")
   ```

7. **Create tests**:
   ```bash
   mkdir -p tools/{{name}}/tests
   touch tools/{{name}}/tests/__init__.py
   ```

8. **Create `tests/test_cli.py`**:
   ```python
   """Tests for CLI."""

   from typer.testing import CliRunner

   from {{name}}.cli import app


   runner = CliRunner()


   class TestCLI:
       """Tests for CLI commands."""

       def test_help(self) -> None:
           result = runner.invoke(app, ["--help"])
           assert result.exit_code == 0
           assert "{{bin}}" in result.output

       def test_version(self) -> None:
           result = runner.invoke(app, ["--version"])
           assert result.exit_code == 0
           assert "version" in result.output

       def test_hello_default(self) -> None:
           result = runner.invoke(app, ["hello"])
           assert result.exit_code == 0
           assert "Hello, World!" in result.output

       def test_hello_with_name(self) -> None:
           result = runner.invoke(app, ["hello", "Claude"])
           assert result.exit_code == 0
           assert "Hello, Claude!" in result.output

       def test_hello_loud(self) -> None:
           result = runner.invoke(app, ["hello", "--loud"])
           assert result.exit_code == 0
           assert "HELLO, WORLD!" in result.output
   ```

9. **Update `pyproject.toml`**:
   ```toml
   [project]
   name = "{{name}}"
   version = "0.0.0"
   description = "{{name}} CLI tool"
   readme = "README.md"
   requires-python = ">=3.12"
   dependencies = [
       "typer>=0.15.0",
       "rich>=13.0.0",
   ]

   [project.optional-dependencies]
   dev = [
       "mypy>=1.0.0",
       "pytest>=8.0.0",
       "ruff>=0.8.0",
   ]

   [project.scripts]
   {{bin}} = "{{name}}.cli:app"

   [build-system]
   requires = ["hatchling"]
   build-backend = "hatchling.build"

   [tool.hatch.build.targets.wheel]
   packages = ["src/{{name}}"]

   [tool.pytest.ini_options]
   testpaths = ["tests"]
   pythonpath = ["src"]
   ```

10. **Create `moon.yml`**:
    ```yaml
    $schema: 'https://moonrepo.dev/schemas/project.json'

    type: 'tool'
    language: 'python'

    tasks:
      run:
        command: 'uv run {{bin}}'
        local: true

      build:
        command: 'uv build'
        inputs:
          - 'src/**/*'
          - 'pyproject.toml'
        outputs:
          - 'dist'

      test:
        command: 'uv run pytest'
        inputs:
          - 'src/**/*'
          - 'tests/**/*'

      lint:
        command: 'uv run ruff check src tests'
        inputs:
          - 'src/**/*'
          - 'tests/**/*'

      format:
        command: 'uv run ruff format src tests'

      typecheck:
        command: 'uv run mypy src'
        inputs:
          - 'src/**/*'

      install:
        command: 'uv sync'

      clean:
        command: 'rm -rf dist .pytest_cache .mypy_cache'
    ```

---

## Step 6: Install Dependencies

**TypeScript:**
```bash
pnpm install
```

**Python:**
```bash
cd tools/{{name}}
uv sync
```

---

## Step 7: Build and Verify

**TypeScript:**
```bash
moon run {{name}}:build
node tools/{{name}}/dist/index.js --help
```

**Python:**
```bash
uv run {{bin}} --help
```

---

## Step 8: Summary

```
Created {{language}} CLI: tools/{{name}}

Binary: {{bin}}

Commands:
  moon run {{name}}:build   # Build CLI
  moon run {{name}}:test    # Run tests

Usage:
  TypeScript: node tools/{{name}}/dist/index.js --help
  Python:     uv run {{bin}} --help

To install globally:
  TypeScript: cd tools/{{name}} && pnpm link --global
  Python:     uv tool install tools/{{name}}
```

---

## Important Notes

- **Python CLIs**: Use `uv init` + add Typer/Rich for latest packaging
- **TypeScript CLIs**: Use template from `templates/cli-ts/` (no official scaffolder)
- CLI tools are placed in `tools/` directory
- TypeScript CLIs are compiled with tsup and include shebang
- Python CLIs can be run directly with `uv run` or installed globally
- Build TypeScript CLI before running tests (tests execute compiled code)
