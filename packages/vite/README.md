## @typest/vite

Vite plugin for typed asset paths (autocomplete + type-checking).

This package has two entrypoints:

- `@typest/vite/plugin` — Vite plugin (used in `vite.config.ts`)
- `@typest/vite` — virtual module (used in your app code)

#### Install

```bash
npm install -D @typest/vite
```

#### Configure Vite

```ts
import { defineConfig } from "vite";
import { typedAssets } from "@typest/vite/plugin";

export default defineConfig({
  plugins: [
    typedAssets({
      sources: [{ dir: "public" }],
    }),
  ],
});
```

#### Use in app code

```ts
import { imagePath } from "@typest/vite";

imagePath("favicon.svg");
```

#### What it does

- Serves a virtual module at `@typest/vite` with exports like `imagePath`, `videoPath`, etc.
- Writes `src/assets.d.ts` in your project root so TypeScript knows the exact keys.
- Re-scans assets when files are added/removed during dev.

#### Options

- `sources`: directories to scan
  - `dir`: folder path (absolute or project-root-relative)
  - `include`: glob patterns (default `["**/*"]`)
  - `exclude`: glob patterns to ignore
  - `basePath`: URL prefix to prepend for that source (e.g. `"/images"`)
  - `typeMap`: extension → type overrides per source
- `generator.perType` (default `true`): generates `imagePath`/`videoPath`/... instead of a single `assetPath`
