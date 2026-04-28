## @typest - Typed asset paths for modern web frameworks

No more broken image URLs, no more string typos – just install the plugin for your bundler and get full autocompletion and compile‑time checking for every asset you reference.

#### How it works

1. **Install** the plugin for your framework.
2. **Configure** it with your asset directories.
3. **Import** `imagePath` (or `videoPath`, `fontPath`, etc.) directly from the plugin package.
4. **Autocomplete** works instantly, and the build fails if an asset is missing.

#### Packages

| Package                           | Description                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| [`@typest/core`](./packages/core) | Scanner, code‑generator, and watcher – the engine used by all framework integrations |
| [`@typest/vite`](./packages/vite) | Vite plugin (works with React, Vue, Svelte, etc.)                                    |

#### Framework support

- **Vite** – `@typest/vite`
- **Nuxt / Remix / Astro** – can use the Vite plugin directly

#### Philosophy

- **Zero‑config by default** – sensible defaults work out‑of‑the‑box.
- **Framework‑agnostic core** – all plugins share the same scanning and code‑generation logic.
- **Type‑safety without runtime overhead** – generated code is pure JavaScript, types are in .d.ts files.
- **No manual regeneration** – assets are re‑scanned automatically when you add or remove files.
