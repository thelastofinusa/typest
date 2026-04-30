# @typest/vite

Vite plugin for **typed asset paths** – autocomplete & type‑checking for every static file in your `public` directory.

This package has two entrypoints:

- `@typest/vite/plugin` — Vite plugin (used in `vite.config.ts`)
- `@typest/vite` — virtual module (used in your app code)

## Installation

::: code-group

```sh [npm]
$ npm install @typest/vite
```

```sh [yarn]
$ yarn install @typest/vite
```

```sh [pnpm]
$ pnpm install @typest/vite
```

```sh [bun]
$ bun add @typest/vite
```

:::

## Quick start

**1. Add the plugin to `vite.config.ts`**

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

**2. Start the dev server (important!)**

::: code-group

```sh [npm]
$ npm run dev
```

```sh [yarn]
$ yarn run dev
```

```sh [pnpm]
$ pnpm run dev
```

```sh [bun]
$ bun run dev
```

:::

The plugin scans your assets and creates a type declaration file (`src/assets.d.ts`).
This happens **only when the dev server runs** – until then your editor can’t provide autocomplete.

**3. Import and use**

```tsx [App.tsx]
import { imagePath } from "@typest/vite";

<img src={imagePath("logo.png")} />;
```

Now `imagePath('…')` will list every image in your `public` folder.

## How it works

- Scans the directories you configured.
- Serves a **virtual module** at `@typest/vite` that exports `imagePath`, `videoPath`, etc. – **only for asset types that actually exist**.
- Writes a `src/assets.d.ts` that augments the module with exact string‑literal keys.
- Watches for file changes and refreshes the types automatically.

No runtime overhead – the generated code is a simple object lookup.

## Configuration

All you can (and need to) configure is the **sources** array.

```ts
typedAssets({
  sources: [{ dir: "public" }, { dir: "public/images", basePath: "/images" }],
});
```

### `sources`

An array of asset directories to scan. Each entry:

| Option     | Type                        | Default     | Description                                                                                                                   |
| ---------- | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `dir`      | `string`                    | required    | Path to the asset folder (relative to project root).                                                                          |
| `basePath` | `string`                    | `undefined` | Public URL prefix for assets in this directory (e.g. `"/images"`).                                                            |
| `include`  | `string[]`                  | `["**/*"]`  | Glob patterns to include.                                                                                                     |
| `exclude`  | `string[]`                  | `[]`        | Glob patterns to ignore.                                                                                                      |
| `typeMap`  | `Record<string, AssetType>` | `undefined` | Override the built‑in extension → type mapping. Valid types: `"image"`, `"video"`, `"audio"`, `"font"`, `"raw"`, `"generic"`. |

> **Important:** The generated type declarations are written to `src/assets.d.ts` and are automatically picked up by TypeScript. You don’t need to add anything to `tsconfig.json`.

## Importing

Always import from `@typest/vite` (the package root). Exports are created only for asset types that have at least one file:

```ts
import {
  imagePath,
  videoPath, // only available if you have video files
} from "@typest/vite";
```

No empty categories – your editor will only suggest what’s real.

## Troubleshooting

### Autocomplete isn’t working

- **You must run the dev server at least once.** The declaration file is generated when you start `vite dev`.
- Delete old generated files (`src/assets.d.ts`) to remove stale types.
- The `assets.d.ts` **must** be within the `src/` directory.
- Restart the TypeScript server in your editor: `Cmd+Shift+P` → _TypeScript: Restart TS server_.

### Images are broken

- Make sure the files are inside `public/` (Vite only serves static files from there).
- Check that `basePath` matches the URL structure. If you put files in `public/images/`, set `basePath: "/images"`, or `public/videos/`, set `basePath: "/videos"`.

### Build fails with TypeScript errors in the virtual module

Ensure you have the latest version. The virtual module is plain JavaScript – if you see TypeScript errors about it, the plugin may not be intercepting correctly. Reinstall and restart your dev server.
