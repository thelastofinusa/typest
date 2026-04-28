## @typest/core

_Scan asset folders, detect file types, and generate typed JavaScript & TypeScript code._

#### Installation

```bash
npm install @typest/core
```

#### What it does

- `scanAssets` – walks directories, returns every asset with its public URL and detected type.
- `generateRuntimeModule` – creates a browser‑ready JS module that exports functions like `imagePath`, `videoPath`.
- `generateDeclarations` – builds a `.d.ts` file with exact string‑literal keys (perfect autocomplete).
- `watchAssets` – watches folders and fires a callback on every change.

#### Quick example

```ts
import {
  scanAssets,
  generateRuntimeModule,
  generateDeclarations,
} from "@typest/core";

const entries = await scanAssets([{ dir: "public" }]);

const runtimeJS = generateRuntimeModule(entries); // pure JS – serve as virtual module
const typesDts = generateDeclarations(entries); // write to disk for TypeScript
```

> Each entry: `{ key: "logo.png", url: "/logo.png", type: "image", ext: "png" }`

#### API at a glance

```ts
scanAssets(sources: AssetSource[], options?: ScanOptions): Promise<AssetEntry[]>
generateRuntimeModule(entries: AssetEntry[], options?: GeneratorOptions): string
generateDeclarations(entries: AssetEntry[], options?: GeneratorOptions): string
watchAssets(sources, callback, options?): FSWatcher
```

- **keyStrategy** defaults to `"filename"` → keys are short (`"favicon.svg"`).
- **perType** (default `true`) generates `imagePath`, `videoPath`, etc.; `false` gives a single `assetPath`.
- Built‑in type map covers `png`, `mp4`, `woff2`, … and you can override it.
