---
name: add-lib
description: Add a library to the monorepo (TypeScript or Python)
---

# /add-lib

Add a reusable library to the monorepo.

## Description

This skill scaffolds a reusable library package. Libraries are placed in the `packages/` directory and can be imported by apps and other packages.

- **Python libraries**: Use `uv init --lib` + post-processing
- **TypeScript libraries**: Use templates (no official CLIs available)

## Usage

```
/add-lib
```

The skill will prompt you for:
1. **Language**: TypeScript or Python
2. **Type**: Library type (varies by language)
3. **Name**: Library name

## Supported Libraries

### TypeScript Libraries

| Type | Description |
|------|-------------|
| `ts-lib` | Pure TypeScript library with dual ESM/CJS via tsup |
| `react-lib` | React component library |
| `ui` | UI component library with web and native support (shadcn/ui + NativeWind) |

### Python Libraries

| Type | Description |
|------|-------------|
| `py-lib` | Python library with type hints and PEP 561 |

## Instructions

### Step 1: Ask Language

Prompt the user to select a language:

**Question**: "What language would you like to use?"
- **TypeScript** - TypeScript/JavaScript libraries
- **Python** - Python libraries

### Step 2: Ask Library Type

Based on the language selection, prompt for library type:

**If TypeScript**:
"What type of TypeScript library?"
- **ts-lib** - Pure TypeScript library (utilities, business logic, API clients)
- **react-lib** - React component library (hooks, components, providers)
- **ui** - UI components with web and native exports

**If Python**:
Skip this step - Python has only one library type (`py-lib`).

### Step 3: Ask Library Name

Prompt for the library name:
- TypeScript: lowercase, kebab-case (e.g., `shared-utils`)
- Python: lowercase, snake_case (e.g., `shared_utils`)

For UI library, suggest default name: `ui`

### Step 4: Verify/Configure Toolchain

Ensure the appropriate toolchain is configured (same as `/add-app`).

---

## Step 5: Scaffold Library

### Python: Library (`py-lib`) - Official CLI + Post-processing

#### 5a. Run Official CLI

```bash
uv init packages/{{name}} --lib
```

#### 5b. Post-processing

1. **Create proper `src/` layout structure**:
   ```bash
   mkdir -p packages/{{name}}/src/{{name}}/lib
   touch packages/{{name}}/src/{{name}}/__init__.py
   touch packages/{{name}}/src/{{name}}/py.typed
   touch packages/{{name}}/src/{{name}}/lib/__init__.py
   ```

2. **Create example module and tests**

3. **Update `pyproject.toml`** with proper configuration

4. **Create `moon.yml`** with Python tasks (build, test, lint, format, typecheck)

---

### TypeScript: Pure Library (`ts-lib`) - Template

#### 5a. Copy Template

```bash
cp -r templates/lib-ts/ packages/{{name}}/
```

#### 5b. Post-processing

1. Replace `{{name}}` and `{{scope}}` placeholders in all files

2. Ensure `tsconfig.json` extends `../../tsconfig.base.json`

3. **Create `moon.yml`** with TypeScript tasks (build, dev, test, lint, typecheck)

---

### TypeScript: React Library (`react-lib`) - Template

#### 5a. Copy Template

```bash
cp -r templates/lib-react/ packages/{{name}}/
```

#### 5b. Post-processing

1. Replace `{{name}}` and `{{scope}}` placeholders

2. **Create `moon.yml`** (same as ts-lib)

---

### TypeScript: UI Library (`ui`) - Template

This creates a unified UI library with support for both web and native platforms.

#### 5a. Copy Template

```bash
cp -r templates/lib-ui/ packages/{{name}}/
```

Default name: `ui`

#### 5b. Structure

```
packages/ui/
├── src/
│   ├── index.ts              # Common exports (tokens, utils)
│   ├── utils.ts              # cn() utility
│   ├── tokens/               # Design tokens (colors, spacing)
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   └── spacing.ts
│   ├── web/                  # Web components (React DOM)
│   │   ├── index.ts
│   │   └── components/
│   │       └── button.tsx
│   └── native/               # Native components (React Native)
│       ├── index.ts
│       └── components/
│           └── button.tsx
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── tailwind.config.ts
└── moon.yml
```

#### 5c. Package exports

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./web": "./dist/web/index.js",
    "./native": "./src/native/index.ts"
  }
}
```

#### 5d. Usage in apps

```typescript
// Common utilities and tokens
import { cn, colors } from '@scope/ui';

// Web components (Next.js, React web apps)
import { Button } from '@scope/ui/web';

// Native components (Expo, React Native)
import { Button } from '@scope/ui/native';
```

#### 5e. Post-processing

1. Replace `{{name}}` and `{{scope}}` placeholders in all files:
   - `package.json` - name, scope
   - `tsconfig.json` - if needed
   - `tailwind.config.ts` - if needed

2. The template already includes `moon.yml` with all necessary tasks (build, dev, lint, typecheck)

---

## Step 5f: Integrate UI Library with Existing Apps (UI library only)

When creating a UI library (`ui` type), automatically integrate it with existing TypeScript apps.

### 5f.1 Detect Existing Apps

```bash
# Find all TypeScript apps
ls apps/*/package.json 2>/dev/null
```

### 5f.2 Ask User Which Apps to Integrate

For each detected app, identify its type:
- **Next.js**: Has `next` in dependencies
- **Expo**: Has `expo` in dependencies

Ask: "Which apps should use the UI library?"
- List all detected apps with checkboxes
- Default: All apps selected

### 5f.3 For Each Selected App

#### A. Add UI library dependency

Add to `apps/{{app}}/package.json`:

```json
{
  "dependencies": {
    "@{{scope}}/ui": "workspace:*"
  }
}
```

#### B. Configure Tailwind (Next.js apps only)

Update `apps/{{app}}/tailwind.config.ts` to include UI library paths and extend its theme:

```typescript
import type { Config } from 'tailwindcss';
import uiConfig from '../../packages/ui/tailwind.config';

const config: Config = {
  // Extend UI library config to get design tokens
  presets: [uiConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include UI library components
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

#### C. Import UI Styles (Next.js apps only)

Add UI library styles import to `apps/{{app}}/src/app/globals.css`:

```css
@import '@{{scope}}/ui/styles.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add CSS variables for UI components */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

#### D. Configure NativeWind (Expo apps only)

For Expo apps, ensure NativeWind is configured to include UI library:

Update `apps/{{app}}/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    // Include UI library components
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 5f.4 Summary of Integration

```
Integrated @{{scope}}/ui with:
  - apps/web (Next.js) - Added dependency + Tailwind config
  - apps/mobile (Expo) - Added dependency + NativeWind config
```

---

## Step 6: Install Dependencies

**TypeScript:**
```bash
pnpm install
```

**Python:**
```bash
cd packages/{{name}}
uv sync
```

---

## Step 7: Build Library

```bash
moon run {{name}}:build
```

---

## Step 8: Summary

```
Created {{language}} library: packages/{{name}}

Type: {{type}}
Package name: @{{scope}}/{{name}} (or {{name}} for Python)

Commands:
  moon run {{name}}:build    # Build library
  moon run {{name}}:dev      # Watch mode (TypeScript only)
  moon run {{name}}:test     # Run tests

To use in other packages:
  TypeScript:
    1. Add to package.json: "@{{scope}}/{{name}}": "workspace:*"
    2. Import: import { ... } from '@{{scope}}/{{name}}';

  Python:
    1. Add to pyproject.toml: "{{name}}"
    2. Add to [tool.uv.sources]: {{name}} = { workspace = true }
    3. Import: from {{name}} import ...
```

---

## Consuming Libraries

### TypeScript

In `apps/my-app/package.json`:
```json
{
  "dependencies": {
    "@{{scope}}/{{name}}": "workspace:*"
  }
}
```

### UI Library specific

```typescript
// In a Next.js app
import { Button } from '@scope/ui/web';

// In an Expo app
import { Button } from '@scope/ui/native';

// Common utilities everywhere
import { cn, colors, spacing } from '@scope/ui';
```

### Python

In `apps/my_app/pyproject.toml`:
```toml
[project]
dependencies = ["{{name}}"]

[tool.uv.sources]
{{name}} = { workspace = true }
```

---

## Important Notes

- **Python libraries**: Use `uv init --lib` for latest Python packaging standards
- **TypeScript libraries**: Use templates (no official CLIs for library scaffolding)
- Libraries are placed in `packages/` directory
- TypeScript libraries use dual ESM/CJS output for compatibility
- Python libraries include `py.typed` marker for PEP 561 compliance
- **UI library** exports separate paths for web (`/web`) and native (`/native`) platforms
- Moon handles dependency graph for builds automatically
