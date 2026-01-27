# Claude Code Plugins

Internal plugin marketplace for Binary Shapes team. Use these plugins without publishing to the official Anthropic marketplace.

## Available Plugins

| Plugin | Description | Version |
|--------|-------------|---------|
| [fullstack-toolkit](./fullstack-toolkit) | Modular toolkit for fullstack applications using Moon + Proto | 1.0.0 |

## Installation

### Step 1: Add the Marketplace

**From a local clone:**
```shell
/plugin marketplace add ./path/to/claude-code-plugins
```

**From GitHub (once pushed):**
```shell
/plugin marketplace add binaryshapes/claude-code-plugins
```

### Step 2: Install Plugins

```shell
/plugin install fullstack-toolkit@binaryshapes-plugins
```

Or use the interactive UI:
```shell
/plugin
```
Then navigate to the **Discover** tab to browse and install plugins.

## Usage

Once installed, plugin skills are namespaced. Use them like this:

### fullstack-toolkit Skills

```
/fullstack-toolkit:init-monorepo    # Initialize a Moon + Proto monorepo
/fullstack-toolkit:toolchain        # Manage proto toolchain configuration
/fullstack-toolkit:hooks            # Configure hooks (pre-commit, CI, Claude Code)

# TypeScript
/fullstack-toolkit:ts-add-app       # Add TypeScript app (next, expo, hono, orpc, nestjs)
/fullstack-toolkit:ts-add-lib       # Add TypeScript library
/fullstack-toolkit:ts-add-cli       # Add TypeScript CLI tool

# Python
/fullstack-toolkit:py-add-app       # Add Python app (minimal, fastapi)
/fullstack-toolkit:py-add-lib       # Add Python library
/fullstack-toolkit:py-add-cli       # Add Python CLI tool

# UI
/fullstack-toolkit:ui-add-lib       # Add shared UI library (shadcn, NativeWind)
```

### Commands

```
/fullstack-toolkit:check            # Run all quality checks
/fullstack-toolkit:format           # Format all code
/fullstack-toolkit:build            # Build all projects
```

## Team Setup

### Option 1: Clone as Sibling (Recommended)

```bash
# Clone next to your project
git clone https://github.com/binaryshapes/claude-code-plugins.git ../claude-code-plugins

# Add the marketplace in Claude Code
/plugin marketplace add ../claude-code-plugins
```

### Option 2: Pre-configure for Team Members

Add to your project's `.claude/settings.json` to auto-prompt team members:

```json
{
  "extraKnownMarketplaces": {
    "binaryshapes-plugins": {
      "source": {
        "source": "github",
        "repo": "binaryshapes/claude-code-plugins"
      }
    }
  },
  "enabledPlugins": {
    "fullstack-toolkit@binaryshapes-plugins": true
  }
}
```

When team members trust the project folder, they'll be prompted to install the marketplace and plugins automatically.

## Managing Plugins

**List marketplaces:**
```shell
/plugin marketplace list
```

**Update marketplace (fetch latest plugins):**
```shell
/plugin marketplace update binaryshapes-plugins
```

**Disable a plugin:**
```shell
/plugin disable fullstack-toolkit@binaryshapes-plugins
```

**Uninstall a plugin:**
```shell
/plugin uninstall fullstack-toolkit@binaryshapes-plugins
```

**Remove marketplace:**
```shell
/plugin marketplace remove binaryshapes-plugins
```

## Adding New Plugins

1. Create a new folder for your plugin
2. Add a `.claude-plugin/plugin.json` manifest
3. Add your skills, agents, commands, and templates
4. Update `.claude-plugin/marketplace.json` to include the new plugin

### Plugin Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json       # Plugin manifest (required)
├── skills/               # Slash commands (SKILL.md files)
├── agents/               # Custom agent definitions
├── commands/             # Composite commands
├── hooks/                # Event handlers (hooks.json)
├── .mcp.json             # MCP server configurations
├── CLAUDE.md             # Plugin documentation for Claude
└── README.md             # Human-readable documentation
```

### Marketplace Entry

Add to `.claude-plugin/marketplace.json`:

```json
{
  "name": "my-plugin",
  "source": "./my-plugin",
  "description": "Description of your plugin",
  "version": "1.0.0"
}
```

## Auto-Updates

Enable auto-updates for the marketplace through the UI:

1. Run `/plugin`
2. Go to **Marketplaces** tab
3. Select `binaryshapes-plugins`
4. Choose **Enable auto-update**

This will automatically fetch the latest plugins when Claude Code starts.

## License

MIT
