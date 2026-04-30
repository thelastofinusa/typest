# Who should use @typest/core?

`@typest/core` is the **engine** that scans your asset folders, detects file types, and generates typed JavaScript & TypeScript code. It is also the engine that powers the framework plugins.
If you're using **Vite** or **Next.js**, you almost certainly want the higher‑level plugin instead:

- [`@typest/vite`](/plugin/vite) – one‑line setup, automatic dev‑server integration.
- [`@typest/nextjs`](/plugin/next) – same experience for Next.js projects.

::: tip You only need `@typest/core` directly when you are:

- Building a **custom integration** for a bundler or framework we don’t yet support (Webpack, Rollup, etc.).
- Creating a **bespoke asset pipeline** that needs manual control over scanning, code generation, or watching.
- Writing **tooling** (CLIs, build scripts, linters) that operates on asset directories.

For everyone else, the framework plugins provide the exact same output with zero configuration beyond listing your asset folders.
If you're unsure, start with the plugin – you can always drop down to the core later if your needs outgrow it.
:::

## Installation

::: code-group

```sh [npm]
$ npm install @typest/core
```

```sh [yarn]
$ yarn install @typest/core
```

```sh [pnpm]
$ pnpm install @typest/core
```

```sh [bun]
$ bun add @typest/core
```

:::

## What it does

- `scanAssets` – walks directories and returns every file with its public URL, detected type, and a unique key.
- `generateRuntimeModule` – produces a browser‑ready JavaScript file that exports `imagePath`, `videoPath`, etc., only for asset types that actually exist.
- `generateDeclarations` – builds a `.d.ts` file with exact literal types so editors can provide perfect autocomplete.
- `watchAssets` – watches asset folders and fires a callback on every change.

Framework plugins like [`@typest/vite`](/plugin/vite) and [`@typest/nextjs`](/plugin/next) are thin wrappers around these four functions.

## Quick example

```ts
import {
  scanAssets,
  generateRuntimeModule,
  generateDeclarations,
} from "@typest/core";

const entries = await scanAssets([{ dir: "public" }]);

const runtimeJS = generateRuntimeModule(entries); // serve as virtual module
const typesDts = generateDeclarations(entries); // write to disk for TypeScript
```

Each entry: `{ key: "logo.png", url: "/logo.png", type: "image", ext: "png" }`

## Scan options

```ts
import { scanAssets } from "@typest/core";

const entries = await scanAssets(
  [
    {
      dir: "public/assets",
      include: ["**/*"],
      exclude: ["**/*.psd"],
      basePath: "/assets",
      typeMap: { glb: "raw" }, // override extension → type mapping
    },
  ],
  {
    keyStrategy: "filename", // default – keys are just the filename
    globalBasePath: "",
    customTypes: { glb: "raw" }, // global type overrides
  },
);
```

### `AssetSource`

| Option     | Type                        | Default     | Description                                                    |
| ---------- | --------------------------- | ----------- | -------------------------------------------------------------- |
| `dir`      | `string`                    | required    | Path to the asset folder (relative to project root).           |
| `basePath` | `string`                    | `undefined` | Public URL prefix (e.g. `"/images"`).                          |
| `include`  | `string[]`                  | `["**/*"]`  | Glob patterns to include.                                      |
| `exclude`  | `string[]`                  | `[]`        | Glob patterns to exclude.                                      |
| `typeMap`  | `Record<string, AssetType>` | `undefined` | Override the default extension → type mapping for this source. |

### `ScanOptions`

| Option           | Type                         | Default      | Description                                                                                                                  |
| ---------------- | ---------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `keyStrategy`    | `"filename"` or `"relative"` | `"filename"` | How keys are built. `"filename"` uses only the filename (`logo.png`); `"relative"` includes the subpath (`images/logo.png`). |
| `customTypes`    | `Record<string, AssetType>`  | `undefined`  | Additional extension → type mappings merged with the defaults.                                                               |
| `globalBasePath` | `string`                     | `""`         | Prepend this to every generated URL (useful for CDN).                                                                        |

## Watching

```ts
import { watchAssets } from "@typest/core";

const watcher = watchAssets([{ dir: "public", basePath: "" }], (entries) => {
  // Re‑generate your runtime module and declarations here
  console.log("Assets changed:", entries.length);
});

// Later:
watcher.close();
```

## Default type map

| Extension                                                        | Type      |
| ---------------------------------------------------------------- | --------- |
| `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`, `.ico`, `.bmp` | `image`   |
| `.mp4`, `.webm`, `.avi`, `.mov`, `.mkv`                          | `video`   |
| `.mp3`, `.wav`, `.ogg`, `.flac`, `.aac`                          | `audio`   |
| `.woff`, `.woff2`, `.ttf`, `.eot`, `.otf`                        | `font`    |
| `.txt`, `.csv`, `.json`, `.xml`, `.yaml`, `.yml`                 | `raw`     |
| everything else                                                  | `generic` |

You can override these per‑source or globally via `typeMap` / `customTypes`.

## Building your own plugin

If you're creating a framework integration (e.g., for Webpack or a new bundler), use the core like this:

```ts
import {
  scanAssets,
  generateRuntimeModule,
  generateDeclarations,
} from "@typest/core";

// 1. Scan
const entries = await scanAssets([{ dir: "public" }]);

// 2. Serve the runtime module as a virtual module
const runtimeCode = generateRuntimeModule(entries);

// 3. Write the declarations somewhere TypeScript can find them
const dts = generateDeclarations(entries);
await fs.writeFile("src/assets.d.ts", dts);
```

For a complete real‑world example, see the source of [`@typest/vite`](https://github.com/thelastofinusa/typest).

## API

```ts
scanAssets(sources: AssetSource[], options?: ScanOptions): Promise<AssetEntry[]>

generateRuntimeModule(entries: AssetEntry[]): string

generateDeclarations(entries: AssetEntry[]): string

watchAssets(
  sources: AssetSource[],
  callback: (entries: AssetEntry[]) => void,
  options?: ScanOptions,
  watchOptions?: chokidar.WatchOptions
): FSWatcher
```

- **Keys are filenames by default** – clean, short, predictable.
- **Only existing asset types are emitted** – no empty objects or unused functions.
- **All paths are normalised** – forward slashes, leading slash prepended automatically.
