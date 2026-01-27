---
name: toolchain
description: Manage Proto toolchain configuration for all languages
---

# /toolchain

Manage Proto toolchain configuration for all languages.

## Description

This skill manages the Proto toolchain configuration, allowing you to list, add, upgrade, pin tool versions, and setup complete language toolchains across your monorepo.

## Usage

```
/toolchain <subcommand> [options]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `list` | Show current tool versions |
| `add <tool> [version]` | Add a tool to the toolchain |
| `upgrade [tool]` | Upgrade tools to latest versions |
| `pin <tool> <version>` | Pin a specific tool version |
| `setup-typescript` | Setup complete TypeScript toolchain |
| `setup-python` | Setup complete Python toolchain |
| `sync` | Sync package.json with .prototools versions |

---

## Subcommand Details

### list

Show all configured tools and their versions.

```
/toolchain list
```

**Output example:**

```
Proto Toolchain:
  node     22.13.1   (pinned)
  pnpm     10.5.2    (pinned)
  python   3.13.1    (pinned)
  uv       0.5.14    (pinned)
```

---

### add

Add a new tool to the toolchain.

```
/toolchain add <tool> [version]
```

**Arguments:**

- `tool`: Tool name (node, pnpm, python, uv, bun, deno, go, rust, etc.)
- `version` (optional): Specific version, "lts" for LTS version, or omit for LTS default

**Examples:**

```
/toolchain add node          # Add Node.js LTS
/toolchain add node lts      # Add Node.js LTS
/toolchain add python 3.14   # Add Python 3.14
/toolchain add bun 1.2.0     # Add specific Bun version
```

---

### upgrade

Upgrade tool(s) to latest versions.

```
/toolchain upgrade [tool]
```

**Arguments:**

- `tool` (optional): Specific tool to upgrade. If omitted, upgrades all.

**Examples:**

```
/toolchain upgrade          # Upgrade all tools
/toolchain upgrade node     # Upgrade only Node.js
```

---

### pin

Pin a tool to a specific version.

```
/toolchain pin <tool> <version>
```

**Examples:**

```
/toolchain pin node 20.18.0
/toolchain pin python 3.11.9
```

---

### setup-typescript

Setup the complete TypeScript toolchain for a monorepo. This includes:

- Node.js and pnpm (LTS versions via Proto)
- Root `package.json` with workspaces and scripts
- TypeScript configuration (`tsconfig.base.json`)
- ESLint configuration (`eslint.config.js`)
- Prettier configuration (`prettier.config.js`)
- Vitest configuration (`vitest.config.ts`)
- Pre-commit hooks in `lefthook.yml`

```
/toolchain setup-typescript
```

**Note:** This is automatically called by `/add-app` when adding the first TypeScript project.

---

### setup-python

Setup the complete Python toolchain for a monorepo. This includes:

- Python and uv (LTS versions via Proto)
- Ruff configuration (`ruff.toml`)
- Mypy configuration (`mypy.ini`)
- Pre-commit hooks in `lefthook.yml`

```
/toolchain setup-python
```

**Note:** This is automatically called by `/add-app` when adding the first Python project.

---

### sync

Synchronize `package.json` with the actual versions in `.prototools`. Use this after upgrading tools to ensure consistency.

```
/toolchain sync
```

This updates:

- `packageManager` field with the pnpm version from `.prototools`
- `engines.node` field with the node version from `.prototools`

---

## Instructions

### For `/toolchain list`

1. Read the `.prototools` file
2. Run `proto list` to get installed versions
3. Display formatted output

```bash
proto list
```

---

### For `/toolchain add <tool> [version]`

1. Validate the tool name is supported by Proto
2. If version not specified, use "lts"
3. Pin the tool:

```bash
proto pin <tool> <version>
```

4. Install the tool:

```bash
proto install <tool>
```

5. Verify installation:

```bash
proto run <tool> -- --version
```

---

### For `/toolchain upgrade [tool]`

1. Run upgrade:

```bash
proto upgrade <tool>   # or just: proto upgrade
```

2. After upgrade, run `/toolchain sync` to update package.json

---

### For `/toolchain pin <tool> <version>`

1. Validate the version exists:

```bash
proto list-remote <tool> | grep <version>
```

2. Pin the version:

```bash
proto pin <tool> <version>
```

3. Install:

```bash
proto install <tool>
```

4. Run `/toolchain sync` to update package.json

---

### For `/toolchain setup-typescript`

1. **Check if already configured:**

```bash
grep -q "node" .prototools 2>/dev/null
```

If node is already in `.prototools`, skip to step 6.

2. **Add Node.js and pnpm via Proto:**

```bash
proto pin node lts
proto pin pnpm lts
proto install node
proto install pnpm
```

3. **Read the pinned versions from `.prototools`:**

```bash
# Parse TOML to get exact versions
NODE_VERSION=$(grep '^node' .prototools | sed 's/.*= *"//' | sed 's/".*//')
PNPM_VERSION=$(grep '^pnpm' .prototools | sed 's/.*= *"//' | sed 's/".*//')
```

4. **Create root `package.json`** with dynamic versions:

```json
{
  "name": "{{PROJECT_NAME}}",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@<PNPM_VERSION>",
  "engines": {
    "node": ">=<NODE_VERSION>"
  },
  "workspaces": ["apps/*", "packages/*", "tools/*"],
  "scripts": {
    "build": "moon run :build",
    "dev": "moon run :dev",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "moon run :test",
    "test:watch": "vitest",
    "clean": "moon run :clean"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.0",
    "@types/node": "^22.0.0",
    "eslint": "^9.39.0",
    "eslint-config-prettier": "^9.1.0",
    "lefthook": "^1.10.0",
    "prettier": "^3.8.0",
    "tsup": "^8.5.0",
    "tsx": "^4.19.0",
    "typescript": "^5.9.0",
    "typescript-eslint": "^8.53.0",
    "vitest": "^4.0.0"
  }
}
```

Replace `<NODE_VERSION>` and `<PNPM_VERSION>` with the actual values from step 3.

5. **Copy config files from `templates/toolchain-ts/`:**

- `tsconfig.base.json`
- `eslint.config.js`
- `prettier.config.js`
- `vitest.config.ts`

6. **Add TypeScript hooks to `lefthook.yml`:**

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,jsx,ts,tsx}"
      run: pnpm eslint {staged_files}
    format:
      glob: "*.{js,jsx,ts,tsx,json,md,yml,yaml}"
      run: pnpm prettier --check {staged_files}
    typecheck:
      run: pnpm typecheck
```

7. **Install dependencies:**

```bash
proto use
pnpm install
```

---

### For `/toolchain setup-python`

1. **Check if already configured:**

```bash
grep -q "python" .prototools 2>/dev/null
```

If python is already in `.prototools`, skip to step 4.

2. **Add Python and uv via Proto:**

```bash
proto pin python lts
proto pin uv lts
proto install python
proto install uv
```

3. **Copy config files from `templates/toolchain-py/`:**

- `ruff.toml`
- `mypy.ini`

4. **Add Python hooks to `lefthook.yml`:**

```yaml
pre-commit:
  parallel: true
  commands:
    ruff-check:
      glob: "*.py"
      run: uv run ruff check {staged_files}
    ruff-format:
      glob: "*.py"
      run: uv run ruff format --check {staged_files}
    mypy:
      glob: "*.py"
      run: uv run mypy {staged_files}
```

5. **Install toolchain:**

```bash
proto use
```

---

### For `/toolchain sync`

1. **Read versions from `.prototools`:**

```bash
NODE_VERSION=$(grep '^node' .prototools | sed 's/.*= *"//' | sed 's/".*//')
PNPM_VERSION=$(grep '^pnpm' .prototools | sed 's/.*= *"//' | sed 's/".*//')
```

2. **Update `package.json`:**

If `package.json` exists and contains `packageManager` or `engines`:

- Update `packageManager` to `pnpm@<PNPM_VERSION>`
- Update `engines.node` to `>=<NODE_VERSION>`

3. **Report changes:**

```
Synced package.json with .prototools:
  packageManager: pnpm@10.5.2
  engines.node: >=22.13.1
```

---

## Supported Tools

Proto supports many tools. Common ones include:

| Tool | Description |
|------|-------------|
| `node` | Node.js runtime |
| `npm` | Node package manager |
| `pnpm` | Fast, disk-efficient package manager |
| `yarn` | Alternative package manager |
| `bun` | All-in-one JavaScript runtime |
| `deno` | Secure JavaScript/TypeScript runtime |
| `python` | Python runtime |
| `uv` | Fast Python package manager |
| `go` | Go programming language |
| `rust` | Rust programming language |
| `moon` | Moon task runner (usually bundled) |

For full list: `proto list-plugins`

---

## Example Workflows

### Initial Setup

```
# Setup TypeScript toolchain
/toolchain setup-typescript

# Or setup Python toolchain
/toolchain setup-python

# Check what's installed
/toolchain list
```

### Upgrading

```
# Upgrade all tools
/toolchain upgrade

# Sync package.json with new versions
/toolchain sync
```

### Adding Additional Tools

```
# Add Bun as an alternative runtime
/toolchain add bun

# Pin to specific version
/toolchain pin bun 1.2.0
```

---

## Important Notes

- Tool versions are stored in `.prototools`
- Proto manages isolated tool installations (no global pollution)
- Different projects can use different versions via nested `.prototools`
- Always run `/toolchain sync` after upgrading to keep `package.json` consistent
- `setup-typescript` and `setup-python` are idempotent (safe to run multiple times)
