# /build

Build all projects in the monorepo.

## Description

This command builds all projects in dependency order using Moon's task runner. It handles both TypeScript and Python projects, ensuring libraries are built before applications that depend on them.

## Usage

```
/build [options]
```

**Options:**
- `--affected` - Only build affected projects
- `--project <name>` - Build specific project
- `--clean` - Clean before building

## What It Does

### TypeScript Projects

- **Libraries** - Compiled with tsup (ESM + CJS + types)
- **Applications** - Built with their respective bundlers:
  - Next.js: `next build`
  - Expo: `expo build` / EAS Build
  - Hono/oRPC/NestJS: `tsup`

### Python Projects

- **Libraries** - Built with `uv build`
- **Applications** - Packaged with `uv build`

## Commands Executed

### Build All

```bash
moon run :build
```

### Build Affected Only

```bash
moon run :build --affected
```

### Build Specific Project

```bash
moon run my-app:build
```

### Clean Build

```bash
moon run :clean && moon run :build
```

## Build Order

Moon automatically determines the correct build order based on dependencies:

```
1. packages/ui-tokens    (no dependencies)
2. packages/ui           (depends on ui-tokens)
3. packages/utils        (no dependencies)
4. apps/web              (depends on ui, utils)
5. apps/api              (depends on utils)
```

## Output

```
## Build Report

### Build Order
1. packages/ui-tokens    ✓ (0.8s)
2. packages/utils        ✓ (1.2s)
3. packages/ui           ✓ (2.1s)
4. apps/api              ✓ (3.5s)
5. apps/web              ✓ (12.4s)

### Build Artifacts

packages/ui-tokens/dist/
  - index.js (2.1 KB)
  - index.d.ts

packages/ui/dist/
  - index.js (15.2 KB)
  - styles.css (8.4 KB)

apps/web/.next/
  - Static pages: 12
  - Server bundles: 5
  - Total size: 1.2 MB

apps/api/dist/
  - index.js (45.3 KB)

### Summary
5 projects built successfully
Total time: 20.0s
```

## Configuration

### Moon Tasks (moon.yml)

```yaml
tasks:
  build:
    command: 'pnpm build'
    inputs:
      - 'src/**/*'
      - 'package.json'
      - 'tsconfig.json'
    outputs:
      - 'dist'
    deps:
      - '^:build'  # Build dependencies first
```

### Caching

Moon caches build outputs. Unchanged projects skip rebuilding:

```
packages/utils: cached (hash unchanged)
packages/ui: building...
```

## Integration

### CI/CD

```yaml
- name: Build
  run: moon run :build

- name: Upload artifacts
  uses: actions/upload-artifact@v4
  with:
    name: build
    path: |
      apps/*/dist
      apps/*/.next
      packages/*/dist
```

### Deployment

```yaml
- name: Build for production
  run: moon run :build
  env:
    NODE_ENV: production

- name: Deploy
  run: |
    # Deploy apps/web to Vercel
    # Deploy apps/api to Railway
```

## Related Commands

- `/check` - Run all quality checks
- `/format` - Format all code
