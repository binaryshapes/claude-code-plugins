---
name: toolchain
description: Manage Proto toolchain configuration for all languages
---

# /toolchain

Manage Proto toolchain configuration for all languages.

## Description

This skill manages the Proto toolchain configuration, allowing you to list, add, upgrade, and pin tool versions across your monorepo.

## Usage

```
/toolchain <subcommand> [options]
```

**Subcommands:**
- `list` - Show current tool versions
- `add <tool> [version]` - Add a tool to the toolchain
- `upgrade [tool]` - Upgrade tools to latest versions
- `pin <tool> <version>` - Pin a specific tool version

## Subcommand Details

### list

Show all configured tools and their versions.

```
/toolchain list
```

**Output example:**
```
Proto Toolchain:
  node     22.0.0    (pinned)
  pnpm     9.15.0    (pinned)
  python   3.12.0    (pinned)
  uv       0.5.0     (pinned)
```

### add

Add a new tool to the toolchain.

```
/toolchain add <tool> [version]
```

**Arguments:**
- `tool`: Tool name (node, pnpm, python, uv, bun, deno, go, rust, etc.)
- `version` (optional): Specific version or "latest"

**Examples:**
```
/toolchain add node          # Add latest Node.js
/toolchain add python 3.12   # Add Python 3.12
/toolchain add bun latest    # Add latest Bun
```

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

### pin

Pin a tool to a specific version.

```
/toolchain pin <tool> <version>
```

**Arguments:**
- `tool`: Tool to pin
- `version`: Exact version to pin

**Examples:**
```
/toolchain pin node 20.18.0
/toolchain pin python 3.11.9
```

## Instructions

### For `/toolchain list`

1. Read the `.prototools` file
2. Parse the TOML configuration
3. Run `proto list` to get installed versions
4. Display formatted output showing each tool and version

```bash
proto list
```

### For `/toolchain add <tool> [version]`

1. Validate the tool name is supported by Proto
2. If version not specified, use "latest"
3. Update `.prototools` file:

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

### For `/toolchain upgrade [tool]`

1. If specific tool:
   ```bash
   proto upgrade <tool>
   ```

2. If all tools:
   ```bash
   proto upgrade
   ```

3. Update `.prototools` with new versions
4. Show what was upgraded

### For `/toolchain pin <tool> <version>`

1. Validate the version exists:
   ```bash
   proto list-remote <tool> | grep <version>
   ```

2. Pin the version:
   ```bash
   proto pin <tool> <version>
   ```

3. Reinstall if needed:
   ```bash
   proto install <tool>
   ```

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

## Example Workflow

```
# Initialize toolchain
/toolchain add node 22
/toolchain add pnpm latest

# Later, upgrade everything
/toolchain upgrade

# Pin to specific version for stability
/toolchain pin node 22.0.0

# Check current state
/toolchain list
```

## Important Notes

- Tool versions are stored in `.prototools`
- Proto manages isolated tool installations (no global pollution)
- Different projects can use different versions via nested `.prototools`
- TypeScript toolchain (node, pnpm) is auto-added by `/ts-add-app`
- Python toolchain (python, uv) is auto-added by `/py-add-app`
