## @typest/nextjs

Next.js plugin for **typed asset paths** – autocomplete & type‑checking for every static file in your `public` directory.

Works with Webpack and Turbopack.

---

### Install

```bash
npm install @typest/nextjs
```

---

### Quick start

**1. Wrap your Next.js config (`next.config.ts`)**

```ts
import type { NextConfig } from "next";
import { withTypedAssets } from "@typest/nextjs/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withTypedAssets({
  sources: [{ dir: "public" }],
})(nextConfig);
```

**2. Start the dev server (important!)**

```bash
npm run dev
```

The plugin scans your assets and creates a type declaration file (`assets.d.ts`) at the project root.
This happens **only when the dev server runs** – until then your editor can't provide autocomplete.

**3. Import and use**

```tsx
import Image from "next/image";
import { imagePath } from "@typest/nextjs";

export default function Home() {
  return <Image src={imagePath("next.svg")} alt="next" />;
}
```

Now `imagePath('…')` will list every file in your `public` folder.

---

### How it works

- The config wrapper runs **before** Next.js starts and scans your asset directories.
- It writes an `assets.d.ts` file that augments the `@typest/nextjs` module with exact string‑literal keys.
- The runtime (`@typest/nextjs`) provides simple fallback functions that return the key with a leading slash – zero bundler configuration needed.
- On subsequent dev server starts, the types are regenerated automatically.

No runtime overhead, no webpack or Turbopack plugin required.

---

### Configuration

All you can configure is the **sources** array.

```ts
withTypedAssets({
  sources: [{ dir: "public" }, { dir: "public/images", basePath: "/images" }],
});
```

#### `sources`

An array of asset directories to scan. Each entry:

| Option     | Type                        | Default     | Description                                                                                                                   |
| ---------- | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `dir`      | `string`                    | required    | Path to the asset folder (relative to project root).                                                                          |
| `basePath` | `string`                    | `undefined` | Public URL prefix for assets in this directory (e.g. `"/images"`).                                                            |
| `include`  | `string[]`                  | `["**/*"]`  | Glob patterns to include.                                                                                                     |
| `exclude`  | `string[]`                  | `[]`        | Glob patterns to ignore.                                                                                                      |
| `typeMap`  | `Record<string, AssetType>` | `undefined` | Override the built‑in extension → type mapping. Valid types: `"image"`, `"video"`, `"audio"`, `"font"`, `"raw"`, `"generic"`. |

> **Important:** The generated type declarations are written to `assets.d.ts` in your project root and are automatically picked up by Next.js’s default `tsconfig.json`. You don't need to add anything to `tsconfig.json`.

---

### Importing

Always import from `@typest/nextjs` (the package root). Exports are created only for asset types that have at least one file:

```ts
import {
  imagePath,
  videoPath, // only available if you have video files
} from "@typest/nextjs";
```

No empty categories – your editor will only suggest what's real.

---

### Troubleshooting

#### Autocomplete isn't working

- **You must run the dev server at least once.** The declaration file is generated when you start `next dev`.
- Delete any old generated files (`assets.d.ts`) to remove stale types.
- Restart the TypeScript server in your editor: `Cmd+Shift+P` → _TypeScript: Restart TS server_.

#### Images are broken

- Make sure the files are inside `public/` (Next.js only serves static files from there).
- Check that `basePath` matches the URL structure. If you put files in `public/images`, set `basePath: '/images'`.

---

### Zero config – by design

This plugin intentionally has no extra options beyond `sources`.
It follows the Next.js way: sensible defaults that work out of the box with both Webpack and Turbopack. If you need more control, reach for `@typest/core` and build your own integration.
