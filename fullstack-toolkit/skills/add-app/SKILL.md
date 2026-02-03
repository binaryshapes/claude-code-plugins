---
name: add-app
description: Add an application to the monorepo (TypeScript or Python)
allowed-tools: Bash(mkdir *), Bash(touch *), Bash(rm * apps/*), Bash(cp *), Bash(grep *), Bash(cd *), Bash(pnpm *), Bash(uv *), Bash(proto *), Bash(moon *), Read, Write, Glob, Skill
---

# /add-app

Add an application to the monorepo.

## Description

This skill scaffolds a complete application using **official CLI tools** from each framework, then applies post-processing to integrate it with the Moon monorepo structure. This ensures you always get the latest versions and best practices from each framework.

## Usage

```
/add-app
```

The skill will prompt you for:
1. **Language**: TypeScript or Python
2. **Type**: Application type (varies by language)
3. **Name**: Application name

## Supported Applications

### TypeScript Applications

| Type | CLI Used | Description |
|------|----------|-------------|
| `next` | `create-next-app` | Next.js with App Router, React, Tailwind CSS |
| `expo` | `create-expo-app` | Expo React Native for iOS/Android |
| `hono` | `create-hono` | Hono edge-first API framework |
| `orpc` | template | oRPC type-safe API (no official CLI) |
| `nestjs` | `@nestjs/cli` | NestJS enterprise backend |

### Python Applications

| Type | CLI Used | Description |
|------|----------|-------------|
| `minimal` | `uv init` | Minimal Python application |
| `fastapi` | `uv init` + deps | FastAPI web API |

## Template Resolution

This skill uses template files from the plugin directory. Before copying templates:

1. **Locate the plugin root**: Find where the `fullstack-toolkit` plugin is installed by searching for its `plugin.json` file. The plugin contains a `templates/` directory with all necessary files.

2. **Use Read and Write tools**: Instead of shell `cp` commands, use Claude's Read tool to read template contents and Write tool to create files. This ensures templates are found regardless of working directory.

3. **Template locations** (relative to plugin root):
   - `templates/monorepo/moon-tasks/` - Task definition files
   - `templates/app-orpc/` - oRPC application template
   - `templates/toolchain-ts/` - TypeScript toolchain configs
   - `templates/toolchain-py/` - Python toolchain configs

**Example**: To copy a task file, read from the plugin's template and write to the project:
```
Read: <plugin-root>/templates/monorepo/moon-tasks/typescript-app.yml
Write: .moon/tasks/typescript-app.yml
```

---

## Instructions

### Step 1: Ask Language

Prompt the user to select a language:

**Question**: "What language would you like to use?"
- **TypeScript** - Node.js applications with full type safety
- **Python** - Python applications with modern tooling

### Step 2: Ask Application Type

Based on the language selection, prompt for application type:

**If TypeScript**:
"What type of TypeScript application?"
- **next** - Next.js web app (latest version)
- **expo** - Expo React Native mobile app
- **hono** - Hono edge-first API
- **orpc** - oRPC type-safe API
- **nestjs** - NestJS enterprise backend

**If Python**:
"What type of Python application?"
- **minimal** - Minimal Python application
- **fastapi** - FastAPI web API

### Step 3: Ask Application Name

Prompt for the application name:
- TypeScript: lowercase, kebab-case (e.g., `my-web-app`)
- Python: lowercase, snake_case preferred (e.g., `my_api`)

### Step 3b: Ask NativeWind (Expo only)

**If the user selected `expo`**, ask about NativeWind support:

"Would you like to add NativeWind (Tailwind CSS for React Native)?"
- **Yes** - Add NativeWind with Tailwind CSS support
- **No** - Use standard React Native StyleSheet

### Step 4: Auto-configure Toolchain

The toolchain configuration is delegated to the `/toolchain` skill to ensure consistency and avoid duplication.

#### For TypeScript

Check if TypeScript toolchain exists:

```bash
grep -q "node" .prototools 2>/dev/null
```

If not configured, invoke `/toolchain setup-typescript`. This will:

- Add Node.js and pnpm (LTS versions) via Proto
- Create root `package.json` with workspaces and dynamic versions from `.prototools`
- Copy TypeScript configs (`tsconfig.base.json`, `eslint.config.ts`, `prettier.config.js`, `vitest.config.ts`)
- Add TypeScript hooks to `lefthook.yml`
- Run `proto use` and `pnpm install`

See `/toolchain setup-typescript` for full details.

#### For Python

Check if Python toolchain exists:

```bash
grep -q "python" .prototools 2>/dev/null
```

If not configured, invoke `/toolchain setup-python`. This will:

- Add Python and uv (LTS versions) via Proto
- Copy Python configs (`ruff.toml`, `mypy.ini`)
- Add Python hooks to `lefthook.yml`
- Run `proto use`

See `/toolchain setup-python` for full details.

### Step 4b: Copy Task Definitions (Lazy Loading)

Task definitions are copied from `templates/monorepo/moon-tasks/` to `.moon/tasks/` only when needed.

#### Create tasks directory if it doesn't exist:

```bash
mkdir -p .moon/tasks
```

#### For TypeScript Applications:

Check and copy if not exists:

```bash
# Copy typescript-app.yml if not exists
[ ! -f .moon/tasks/typescript-app.yml ] && cp templates/monorepo/moon-tasks/typescript-app.yml .moon/tasks/
```

#### For Python Applications:

```bash
# Copy python-app.yml if not exists
[ ! -f .moon/tasks/python-app.yml ] && cp templates/monorepo/moon-tasks/python-app.yml .moon/tasks/
```

#### For Framework-Specific Tags:

Based on the application type, also copy the tag file:

| App Type | Tag File |
|----------|----------|
| `next` | `tag-next.yml` |
| `expo` | `tag-expo.yml` |
| `hono` | `tag-hono.yml` |
| `nestjs` | `tag-nestjs.yml` |
| `orpc` | `tag-orpc.yml` |
| `fastapi` | `tag-fastapi.yml` |

Example for Next.js:
```bash
[ ! -f .moon/tasks/tag-next.yml ] && cp templates/monorepo/moon-tasks/tag-next.yml .moon/tasks/
```

---

## Step 5: Scaffold Application (Official CLI + Post-processing)

### TypeScript: Next.js (`next`)

#### 5a. Run Official CLI

```bash
pnpm create next-app@latest apps/{{name}} \
  --yes \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --disable-git \
  --use-pnpm \
  --import-alias "@/*"
```

**Important flags:**
- `--yes` - Use defaults for all options (required for non-interactive mode)
- `--disable-git` - Skip git initialization (monorepo already has git)
- `--turbopack` - Enable Turbopack (default in recent versions)
- `--tailwind` - Include Tailwind CSS (default in recent versions)
- `--typescript` - TypeScript project (default in recent versions)

#### 5b. Post-processing

1. **Merge `.gitignore` into root** - Consolidate scaffold gitignore entries avoiding duplications:

   Read the scaffold's `.gitignore` and for each non-empty, non-comment line:
   - Normalize the pattern (remove trailing slashes for comparison)
   - Check if the pattern already exists in root `.gitignore` (with or without trailing slash)
   - Only append if not already present
   - Group new entries under a framework-specific comment section

   ```bash
   if [ -f apps/{{name}}/.gitignore ]; then
     # Collect new entries
     NEW_ENTRIES=""
     while IFS= read -r line || [ -n "$line" ]; do
       # Skip empty lines and comments
       [[ -z "$line" || "$line" =~ ^# ]] && continue

       # Normalize: remove trailing slash for comparison
       normalized="${line%/}"

       # Check if pattern exists (with or without trailing slash)
       if ! grep -qE "^${normalized}/?$" .gitignore 2>/dev/null; then
         NEW_ENTRIES="${NEW_ENTRIES}${line}\n"
       fi
     done < apps/{{name}}/.gitignore

     # Append new entries under a section header if any
     if [ -n "$NEW_ENTRIES" ]; then
       echo "" >> .gitignore
       echo "# Next.js" >> .gitignore
       echo -e "$NEW_ENTRIES" >> .gitignore
     fi
   fi
   ```

   **Note:** The root `.gitignore` from `/init-monorepo` already includes common patterns. Only framework-specific patterns (like `.next/`, `.vercel/`) should be added.

2. **Remove unnecessary files** (already handled by monorepo):
   ```bash
   rm -f apps/{{name}}/.eslintrc.json
   rm -f apps/{{name}}/README.md
   rm -f apps/{{name}}/.gitignore
   ```

3. **Clean up `/public` directory** - Remove default Next.js branding assets (keep favicon):
   ```bash
   rm -f apps/{{name}}/public/*.svg
   rm -f apps/{{name}}/public/*.png
   # Keep favicon.ico - apps typically need one
   ```

4. **Simplify `src/app/page.tsx`** - Replace with minimal Hello World:
   ```tsx
   export default function Home() {
     return (
       <main className="flex min-h-screen items-center justify-center">
         <h1 className="text-4xl font-bold">Hello, world!</h1>
       </main>
     );
   }
   ```

5. **Simplify `src/app/layout.tsx`** - Clean metadata and remove font imports:
   ```tsx
   import type { Metadata } from "next";
   import "./globals.css";

   export const metadata: Metadata = {
     title: "{{name}}",
     description: "{{name}} application",
   };

   export default function RootLayout({
     children,
   }: Readonly<{
     children: React.ReactNode;
   }>) {
     return (
       <html lang="en">
         <body>{children}</body>
       </html>
     );
   }
   ```

6. **Simplify `src/app/globals.css`** - Keep only Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

7. **Update `package.json`** - Remove redundant scripts, keep framework-specific ones:
   ```json
   {
     "name": "{{name}}",
     "version": "0.0.0",
     "private": true,
     "scripts": {
       "dev": "next dev --port {{port}}",
       "build": "next build",
       "start": "next start",
       "lint": "eslint src --max-warnings 0",
       "typecheck": "tsc --noEmit"
     }
   }
   ```

8. **Update `tsconfig.json`** - Extend base config with Next.js specific options:
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "jsx": "preserve",
       "lib": ["dom", "dom.iterable", "esnext"],
       "plugins": [{ "name": "next" }],
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

   **Note:** `jsx: "preserve"` is required for Next.js, and `lib` must include DOM types.

9. **Create `moon.yml`** (simplified - tasks inherited from `.moon/tasks/`):
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   layer: 'application'
   language: 'typescript'
   stack: 'frontend'
   tags: ['frontend', 'next']
   ```

   > Tasks (`dev`, `build`, `start`, `lint`, `typecheck`, `test`, `clean`) are automatically inherited from `.moon/tasks/typescript-app.yml` and `.moon/tasks/tag-next.yml`.

**Default port:** 3000

---

### TypeScript: Expo (`expo`)

#### 5a. Run Official CLI

```bash
pnpm create expo-app@latest apps/{{name}} --template blank-typescript
```

#### 5b. Post-processing

1. **Merge `.gitignore` into root** - Before removing, consolidate scaffold gitignore entries:
   ```bash
   if [ -f apps/{{name}}/.gitignore ]; then
     while IFS= read -r line || [ -n "$line" ]; do
       if [ -n "$line" ] && ! grep -qxF "$line" .gitignore 2>/dev/null; then
         echo "$line" >> .gitignore
       fi
     done < apps/{{name}}/.gitignore
   fi
   ```

2. **Remove unnecessary files**:
   ```bash
   rm -f apps/{{name}}/.gitignore
   rm -f apps/{{name}}/README.md
   ```

3. **Clean up `/assets` directory** - Remove default Expo assets:
   ```bash
   rm -f apps/{{name}}/assets/*.png
   ```

4. **Simplify `App.tsx`** - Replace with minimal Hello World:
   ```tsx
   import { StyleSheet, Text, View } from "react-native";

   export default function App() {
     return (
       <View style={styles.container}>
         <Text style={styles.title}>Hello, world!</Text>
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       alignItems: "center",
       justifyContent: "center",
     },
     title: {
       fontSize: 32,
       fontWeight: "bold",
     },
   });
   ```

5. **Update `app.json`** - Clean configuration:
   ```json
   {
     "expo": {
       "name": "{{name}}",
       "slug": "{{name}}",
       "version": "1.0.0",
       "orientation": "portrait",
       "userInterfaceStyle": "light",
       "newArchEnabled": true,
       "ios": {
         "supportsTablet": true
       },
       "android": {
         "adaptiveIcon": {
           "backgroundColor": "#ffffff"
         }
       },
       "web": {
         "bundler": "metro"
       }
     }
   }
   ```

6. **Update `package.json`** - Clean scripts:
   ```json
   {
     "name": "{{name}}",
     "version": "0.0.0",
     "scripts": {
       "dev": "expo start",
       "android": "expo start --android",
       "ios": "expo start --ios",
       "web": "expo start --web",
       "build:android": "eas build --platform android",
       "build:ios": "eas build --platform ios",
       "lint": "eslint .",
       "typecheck": "tsc --noEmit"
     }
   }
   ```

7. **Create `moon.yml`** (simplified - tasks inherited from `.moon/tasks/`):
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   layer: 'application'
   language: 'typescript'
   stack: 'frontend'
   tags: ['mobile', 'expo']
   ```

   > Tasks (`dev`, `android`, `ios`, `web`, `lint`, `typecheck`, `test`, `clean`) are automatically inherited from `.moon/tasks/typescript-app.yml` and `.moon/tasks/tag-expo.yml`.

#### 5c. NativeWind Setup (if selected)

If the user opted for NativeWind support, perform these additional steps:

1. **Install NativeWind dependencies**:
   ```bash
   cd apps/{{name}}
   pnpm add nativewind react-native-reanimated react-native-safe-area-context
   pnpm add -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss
   ```

2. **Create `tailwind.config.js`**:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
     presets: [require("nativewind/preset")],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

3. **Create `global.css`**:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Update `babel.config.js`**:
   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
     };
   };
   ```

5. **Create `metro.config.js`**:
   ```javascript
   const { getDefaultConfig } = require("expo/metro-config");
   const { withNativeWind } = require("nativewind/metro");

   const config = getDefaultConfig(__dirname);

   module.exports = withNativeWind(config, { input: "./global.css" });
   ```

6. **Create `nativewind-env.d.ts`** (TypeScript support):
   ```typescript
   /// <reference types="nativewind/types" />
   ```

7. **Replace `App.tsx`** with NativeWind version:
   ```tsx
   import "./global.css";
   import { Text, View } from "react-native";

   export default function App() {
     return (
       <View className="flex-1 items-center justify-center">
         <Text className="text-3xl font-bold">Hello, world!</Text>
       </View>
     );
   }
   ```

---

### TypeScript: Hono (`hono`)

#### 5a. Run Official CLI

```bash
pnpm create hono@latest apps/{{name}} --template cloudflare-workers
```

> Note: User may be prompted to select a template. Recommend `cloudflare-workers` for edge deployment or `nodejs` for traditional Node.js.

#### 5b. Post-processing

1. **Merge `.gitignore` into root** - Before removing, consolidate scaffold gitignore entries:
   ```bash
   if [ -f apps/{{name}}/.gitignore ]; then
     while IFS= read -r line || [ -n "$line" ]; do
       if [ -n "$line" ] && ! grep -qxF "$line" .gitignore 2>/dev/null; then
         echo "$line" >> .gitignore
       fi
     done < apps/{{name}}/.gitignore
   fi
   ```

2. **Remove unnecessary files**:
   ```bash
   rm -f apps/{{name}}/.gitignore
   rm -f apps/{{name}}/README.md
   ```

3. **Update `package.json`**:
   ```json
   {
     "name": "{{name}}",
     "version": "0.0.0",
     "scripts": {
       "dev": "wrangler dev",
       "build": "wrangler deploy --dry-run",
       "deploy": "wrangler deploy",
       "lint": "eslint src",
       "typecheck": "tsc --noEmit"
     }
   }
   ```

4. **Create `moon.yml`** (simplified - tasks inherited from `.moon/tasks/`):
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   layer: 'application'
   language: 'typescript'
   stack: 'backend'
   tags: ['backend', 'api', 'hono']
   ```

   > Tasks (`dev`, `build`, `deploy`, `lint`, `typecheck`, `test`, `clean`) are automatically inherited from `.moon/tasks/typescript-app.yml` and `.moon/tasks/tag-hono.yml`.

**Default port:** 8787

---

### TypeScript: NestJS (`nestjs`)

#### 5a. Run Official CLI

```bash
pnpm dlx @nestjs/cli@latest new {{name}} \
  --directory apps/{{name}} \
  --package-manager pnpm \
  --skip-git \
  --strict
```

#### 5b. Post-processing

1. **Merge `.gitignore` into root** - Before removing, consolidate scaffold gitignore entries:
   ```bash
   if [ -f apps/{{name}}/.gitignore ]; then
     while IFS= read -r line || [ -n "$line" ]; do
       if [ -n "$line" ] && ! grep -qxF "$line" .gitignore 2>/dev/null; then
         echo "$line" >> .gitignore
       fi
     done < apps/{{name}}/.gitignore
   fi
   ```

2. **Remove unnecessary files**:
   ```bash
   rm -f apps/{{name}}/.eslintrc.js
   rm -f apps/{{name}}/.prettierrc
   rm -f apps/{{name}}/README.md
   rm -f apps/{{name}}/.gitignore
   ```

3. **Update `package.json`** - Clean scripts:
   ```json
   {
     "name": "{{name}}",
     "version": "0.0.0",
     "scripts": {
       "dev": "nest start --watch",
       "build": "nest build",
       "start": "node dist/main",
       "start:prod": "node dist/main",
       "lint": "eslint src --max-warnings 0",
       "typecheck": "tsc --noEmit",
       "test": "jest",
       "test:watch": "jest --watch",
       "test:e2e": "jest --config ./test/jest-e2e.json"
     }
   }
   ```

4. **Create `moon.yml`** (simplified - tasks inherited from `.moon/tasks/`):
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   layer: 'application'
   language: 'typescript'
   stack: 'backend'
   tags: ['backend', 'api', 'nestjs']
   ```

   > Tasks (`dev`, `build`, `start`, `test`, `test-e2e`, `lint`, `typecheck`, `clean`) are automatically inherited from `.moon/tasks/typescript-app.yml` and `.moon/tasks/tag-nestjs.yml`.

**Default port:** 3000

---

### TypeScript: oRPC (`orpc`)

> Note: oRPC doesn't have an official CLI. Use the template from `templates/app-orpc/`.

#### 5a. Copy Template

```bash
cp -r templates/app-orpc/ apps/{{name}}/
```

#### 5b. Post-processing

1. Replace `{{name}}` and `{{port}}` placeholders in all files

2. **Create `moon.yml`** (already in template)

**Default port:** 3002

---

### Python: Minimal (`minimal`)

#### 5a. Run Official CLI

```bash
uv init apps/{{name}} --lib
```

#### 5b. Post-processing

1. **Restructure to `src/` layout**:
   ```bash
   mkdir -p apps/{{name}}/src/{{name}}
   mv apps/{{name}}/src/*.py apps/{{name}}/src/{{name}}/
   touch apps/{{name}}/src/{{name}}/__init__.py
   ```

2. **Update `pyproject.toml`**:
   ```toml
   [project]
   name = "{{name}}"
   version = "0.0.0"
   description = "{{name}} application"
   requires-python = ">=3.12"
   dependencies = []

   [project.optional-dependencies]
   dev = [
       "mypy>=1.14.0",
       "pytest>=8.3.0",
       "pytest-cov>=4.1.0",
       "ruff>=0.9.0",
   ]

   [project.scripts]
   {{name}} = "{{name}}.main:main"

   [build-system]
   requires = ["hatchling"]
   build-backend = "hatchling.build"

   [tool.hatch.build.targets.wheel]
   packages = ["src/{{name}}"]
   ```

3. **Create `src/{{name}}/main.py`**:
   ```python
   def main() -> None:
       """Main entry point."""
       print("Hello from {{name}}!")


   if __name__ == "__main__":
       main()
   ```

4. **Create `tests/` directory with basic test**

5. **Create `moon.yml`** (simplified - tasks inherited from `.moon/tasks/`):
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   layer: 'application'
   language: 'python'
   stack: 'backend'
   tags: ['backend', 'cli']
   ```

   > Tasks (`dev`, `build`, `test`, `lint`, `format`, `format-check`, `typecheck`, `install`, `clean`) are automatically inherited from `.moon/tasks/python-app.yml`.

---

### Python: FastAPI (`fastapi`)

#### 5a. Run Official CLI

```bash
uv init apps/{{name}} --lib
```

#### 5b. Post-processing

1. **Add FastAPI dependencies**:
   ```bash
   cd apps/{{name}}
   uv add fastapi uvicorn[standard] pydantic
   ```

2. **Restructure to FastAPI layout**:
   ```
   apps/{{name}}/
   ├── src/
   │   └── {{name}}/
   │       ├── __init__.py
   │       ├── main.py
   │       ├── routes/
   │       │   ├── __init__.py
   │       │   └── health.py
   │       └── models/
   │           ├── __init__.py
   │           └── health.py
   ├── tests/
   │   ├── __init__.py
   │   └── test_health.py
   ├── moon.yml
   └── pyproject.toml
   ```

3. **Create `src/{{name}}/main.py`**:
   ```python
   from fastapi import FastAPI
   from {{name}}.routes import health

   app = FastAPI(
       title="{{name}}",
       description="{{name}} API",
       version="0.0.0",
   )

   app.include_router(health.router, prefix="/health", tags=["health"])


   @app.get("/")
   async def root() -> dict[str, str]:
       return {"message": "Welcome to {{name}}"}
   ```

4. **Create `moon.yml`** (simplified - tasks inherited from `.moon/tasks/`):
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   layer: 'application'
   language: 'python'
   stack: 'backend'
   tags: ['backend', 'api', 'fastapi']
   ```

   > Tasks (`dev`, `start`, `build`, `test`, `lint`, `format`, `format-check`, `typecheck`, `install`, `clean`) are automatically inherited from `.moon/tasks/python-app.yml` and `.moon/tasks/tag-fastapi.yml`.

**Default port:** 8000

---

## Step 6: Install Dependencies

**TypeScript:**
```bash
pnpm install
```

**Python:**
```bash
cd apps/{{name}}
uv sync
```

---

## Step 7: Register in Release Please

Add the new application to `release-please-config.json` for independent versioning:

```json
{
  "packages": {
    "apps/{{name}}": {}
  }
}
```

**Implementation:** Read the existing `release-please-config.json`, add the new package path to the `packages` object, and write it back.

Also initialize the version in `.release-please-manifest.json`:

```json
{
  "apps/{{name}}": "0.0.0"
}
```

---

## Step 8: Summary

```
Created {{language}} application: apps/{{name}}

Type: {{type}}
Port: {{port}} (if applicable)

Commands:
  moon run {{name}}:dev       # Start development server
  moon run {{name}}:build     # Build for production
  moon run {{name}}:test      # Run tests
  moon run {{name}}:lint      # Run linter

Next steps:
  1. cd apps/{{name}}
  2. Start the dev server: moon run {{name}}:dev
  3. Start developing!
```

---

## Default Ports

| Type | Default Port |
|------|--------------|
| next | 3000 |
| expo | 8081 |
| hono | 8787 |
| orpc | 3002 |
| nestjs | 3000 |
| fastapi | 8000 |

## Important Notes

- **Always uses latest versions** - Official CLIs ensure you get the most recent stable releases
- **Post-processing integrates with monorepo** - Adds `moon.yml`, adjusts configs
- **Removes redundant files** - ESLint, Prettier, and git configs are handled at root level
- **First app of a language auto-configures the toolchain**
- **TypeScript apps use pnpm workspaces**
- **Python apps use uv for dependency management**
