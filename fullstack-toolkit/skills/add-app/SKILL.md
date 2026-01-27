---
name: add-app
description: Add an application to the monorepo (TypeScript or Python)
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
- Copy TypeScript configs (`tsconfig.base.json`, `eslint.config.js`, `prettier.config.js`, `vitest.config.ts`)
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

---

## Step 5: Scaffold Application (Official CLI + Post-processing)

### TypeScript: Next.js (`next`)

#### 5a. Run Official CLI

```bash
pnpm create next-app@latest apps/{{name}} \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-git \
  --use-pnpm \
  --import-alias "@/*"
```

#### 5b. Post-processing

1. **Remove unnecessary files** (already handled by monorepo):
   ```bash
   rm -f apps/{{name}}/.eslintrc.json
   rm -f apps/{{name}}/README.md
   rm -f apps/{{name}}/.gitignore
   ```

2. **Update `package.json`** - Remove redundant scripts, keep framework-specific ones:
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

3. **Update `tsconfig.json`** - Extend base config:
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "plugins": [{ "name": "next" }],
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

4. **Create `moon.yml`**:
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   type: 'application'
   language: 'typescript'
   platform: 'node'

   tasks:
     dev:
       command: 'pnpm dev'
       local: true
       persistent: true

     build:
       command: 'pnpm build'
       inputs:
         - 'src/**/*'
         - 'public/**/*'
         - 'package.json'
         - 'next.config.*'
         - 'tailwind.config.*'
         - 'tsconfig.json'
       outputs:
         - '.next'

     start:
       command: 'pnpm start'
       deps:
         - '~:build'

     lint:
       command: 'pnpm lint'
       inputs:
         - 'src/**/*'

     typecheck:
       command: 'pnpm typecheck'
       inputs:
         - 'src/**/*'
         - 'tsconfig.json'
   ```

**Default port:** 3000

---

### TypeScript: Expo (`expo`)

#### 5a. Run Official CLI

```bash
pnpm create expo-app@latest apps/{{name}} --template blank-typescript
```

#### 5b. Post-processing

1. **Remove unnecessary files**:
   ```bash
   rm -f apps/{{name}}/.gitignore
   rm -f apps/{{name}}/README.md
   ```

2. **Update `package.json`** - Clean scripts:
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

3. **Create `moon.yml`**:
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   type: 'application'
   language: 'typescript'
   platform: 'node'

   tasks:
     dev:
       command: 'pnpm dev'
       local: true
       persistent: true

     android:
       command: 'pnpm android'
       local: true
       persistent: true

     ios:
       command: 'pnpm ios'
       local: true
       persistent: true

     lint:
       command: 'pnpm lint'
       inputs:
         - 'app/**/*'
         - 'components/**/*'

     typecheck:
       command: 'pnpm typecheck'
       inputs:
         - 'app/**/*'
         - 'components/**/*'
         - 'tsconfig.json'
   ```

---

### TypeScript: Hono (`hono`)

#### 5a. Run Official CLI

```bash
pnpm create hono@latest apps/{{name}} --template cloudflare-workers
```

> Note: User may be prompted to select a template. Recommend `cloudflare-workers` for edge deployment or `nodejs` for traditional Node.js.

#### 5b. Post-processing

1. **Remove unnecessary files**:
   ```bash
   rm -f apps/{{name}}/.gitignore
   rm -f apps/{{name}}/README.md
   ```

2. **Update `package.json`**:
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

3. **Create `moon.yml`**:
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   type: 'application'
   language: 'typescript'
   platform: 'node'

   tasks:
     dev:
       command: 'pnpm dev'
       local: true
       persistent: true

     build:
       command: 'pnpm build'
       inputs:
         - 'src/**/*'
         - 'package.json'
         - 'wrangler.toml'

     deploy:
       command: 'pnpm deploy'
       deps:
         - '~:build'

     lint:
       command: 'pnpm lint'
       inputs:
         - 'src/**/*'

     typecheck:
       command: 'pnpm typecheck'
       inputs:
         - 'src/**/*'
         - 'tsconfig.json'
   ```

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

1. **Remove unnecessary files**:
   ```bash
   rm -f apps/{{name}}/.eslintrc.js
   rm -f apps/{{name}}/.prettierrc
   rm -f apps/{{name}}/README.md
   rm -f apps/{{name}}/.gitignore
   ```

2. **Update `package.json`** - Clean scripts:
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

3. **Create `moon.yml`**:
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   type: 'application'
   language: 'typescript'
   platform: 'node'

   tasks:
     dev:
       command: 'pnpm dev'
       local: true
       persistent: true

     build:
       command: 'pnpm build'
       inputs:
         - 'src/**/*'
         - 'package.json'
         - 'tsconfig*.json'
         - 'nest-cli.json'
       outputs:
         - 'dist'

     start:
       command: 'pnpm start:prod'
       deps:
         - '~:build'

     test:
       command: 'pnpm test'
       inputs:
         - 'src/**/*'
         - 'test/**/*'

     test:e2e:
       command: 'pnpm test:e2e'
       inputs:
         - 'src/**/*'
         - 'test/**/*'

     lint:
       command: 'pnpm lint'
       inputs:
         - 'src/**/*'

     typecheck:
       command: 'pnpm typecheck'
       inputs:
         - 'src/**/*'
         - 'tsconfig.json'
   ```

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

5. **Create `moon.yml`**:
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   type: 'application'
   language: 'python'

   tasks:
     run:
       command: 'uv run {{name}}'
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
   ```

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

4. **Create `moon.yml`**:
   ```yaml
   $schema: 'https://moonrepo.dev/schemas/project.json'

   type: 'application'
   language: 'python'

   tasks:
     dev:
       command: 'uv run uvicorn {{name}}.main:app --reload --port {{port}}'
       local: true
       persistent: true

     start:
       command: 'uv run uvicorn {{name}}.main:app --port {{port}}'

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
   ```

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

## Step 7: Summary

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
