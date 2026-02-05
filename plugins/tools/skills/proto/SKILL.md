---
name: bs:tools:proto
description: Pin and install Proto toolchains (Node.js, pnpm, Python, uv, Lefthook, etc.)
argument-hint: "[node] [pnpm] [python] [uv] [lefthook]"
allowed-tools: Bash(proto *), Bash(pnpm init), Bash(ls *), Read, Write, Edit, Glob, WebFetch
---

# /bs:tools:proto

Pin and install development toolchains via Proto.

## Description

This skill centralizes all Proto toolchain management. It handles:
- **Pinning tools** in `.prototools` with version resolution
- **Registering third-party plugins** (e.g., Lefthook) before pinning
- **Creating package.json** when Node.js toolchain is selected
- **Running `proto use`** to install everything

Other `bs:tools:*` skills delegate toolchain installation to this skill.

## Usage

```bash
/bs:tools:proto                    # Interactive - asks which tools to install
/bs:tools:proto node pnpm         # Pin specific tools
/bs:tools:proto python uv         # Pin Python toolchain
/bs:tools:proto lefthook          # Pin Lefthook (registers plugin automatically)
```

## What Gets Modified

```
{project}/
├── .prototools    # Pinned tool versions (MODIFIED)
└── package.json   # Created if Node.js toolchain selected and missing (NEW)
```

## Prerequisites

- Monorepo initialized with `/bs:repo:init`
- Proto installed

---

## Instructions

### Step 1: Check Prerequisites

Verify Proto is installed:

```bash
proto --version
```

If not installed, inform user:

```
Proto is not installed. Install it with:
curl -fsSL https://moonrepo.dev/install/proto.sh | bash
```

Verify monorepo structure:

```bash
ls .moon/workspace.yml
```

If not found, inform user to run `/bs:repo:init` first.

### Step 2: Check Current State

See what's already pinned:

```bash
proto status
```

### Step 3: Determine Tools to Install

**If arguments were provided** (e.g., `/bs:tools:proto node pnpm`), use those directly.

**If no arguments**, ask the user which toolchains to install:

1. **Node.js** - JavaScript runtime (pins `node`)
2. **pnpm** - Package manager (pins `pnpm`, requires Node.js)
3. **Python** - Python runtime (pins `python`)
4. **uv** - Python package manager (pins `uv`, requires Python)
5. **Lefthook** - Git hooks manager (pins `lefthook`, requires plugin registration)

Pre-select tools that are already pinned as "installed". Only offer to pin tools that are missing.

If all requested tools are already pinned, inform the user and exit.

### Step 4: Register Third-Party Plugins (if needed)

Some tools are NOT built-in Proto plugins and must be registered before pinning.

**Lefthook**:

```bash
proto plugin add lefthook "https://raw.githubusercontent.com/ageha734/proto-plugins/refs/heads/master/toml/lefthook.toml"
```

> **If the plugin URL above fails**: Search for an updated locator at the [Proto third-party tools registry](https://moonrepo.dev/docs/proto/tools), look for "lefthook", and use the new locator with `proto plugin add`.

### Step 5: Pin Selected Tools

Pin each selected tool. Use `--resolve` to get the actual version number.

**Node.js**:
```bash
proto pin node lts --resolve
```

**pnpm** (auto-include if Node.js selected and pnpm not pinned):
```bash
proto pin pnpm latest --resolve
```

**Python**:
```bash
proto pin python latest --resolve
```

**uv** (auto-include if Python selected and uv not pinned):
```bash
proto pin uv latest --resolve
```

**Lefthook** (requires plugin registration from Step 4):
```bash
proto pin lefthook latest --resolve
```

### Step 6: Install All Pinned Tools

```bash
proto use
```

### Step 7: Create package.json (if Node.js toolchain)

If Node.js was pinned and `package.json` does NOT exist:

```bash
ls package.json
```

If missing, create it:

```bash
pnpm init
```

Then edit it to set:
- `"private": true`
- `"type": "module"`
- `"workspaces": ["apps/*", "packages/*", "modules/*", "scripts/*"]`

### Step 8: Summary

```
Proto toolchains configured successfully!

Pinned:
  - node: [version]
  - pnpm: [version]
  - lefthook: [version]

Installed via: proto use

Created:
  - package.json (if new)

.prototools updated with pinned versions.
```

---

## Supported Tools Reference

### Built-in Proto Plugins (no registration needed)

| Tool | Pin Command | Notes |
|------|-------------|-------|
| Node.js | `proto pin node lts --resolve` | JavaScript runtime |
| pnpm | `proto pin pnpm latest --resolve` | Node.js package manager |
| Python | `proto pin python latest --resolve` | Python runtime |
| uv | `proto pin uv latest --resolve` | Python package/project manager |
| Moon | `proto pin moon latest --resolve` | Already pinned by `/bs:repo:init` |

### Third-Party Plugins (registration required)

| Tool | Plugin Registration | Notes |
|------|-------------------|-------|
| Lefthook | `proto plugin add lefthook "https://raw.githubusercontent.com/ageha734/proto-plugins/refs/heads/master/toml/lefthook.toml"` | Git hooks manager |

> **Finding plugins**: Browse the [Proto third-party tools registry](https://moonrepo.dev/docs/proto/tools) for available plugins and their locators.

### Adding Future Tools

To add support for a new tool:

1. Check if it's a built-in plugin: `proto plugin list`
2. If not, search the [registry](https://moonrepo.dev/docs/proto/tools) for a third-party plugin
3. Register with `proto plugin add <name> "<locator>"`
4. Pin with `proto pin <name> latest --resolve`
5. Install with `proto use`
