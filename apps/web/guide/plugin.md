# Packages Overview

Typest is split into a few focused packages. Install only what you need.

| Package                          | Description                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| [`@typest/vite`](/plugin/vite)   | Vite plugin – works with React, Vue, Svelte, and every Vite‑based project.                |
| [`@typest/nextjs`](/plugin/next) | Next.js plugin – same experience for Next.js projects.                                    |
| [`@typest/core`](/plugin/core)   | Scanner, code generator, and file watcher. The engine used by all framework integrations. |

## Which plugin should I install?

- **I use Vite** → install `@typest/vite`, add the plugin to `vite.config.ts`.
- **I use Next.js** → install `@typest/nextjs`, add the plugin to `next.config.ts`.
- **I use something else** → use the `typest` CLI to see if your setup is supported, or build your own integration using `@typest/core`.

## Shared features

All framework plugins inherit the same behavior from the core:

- **Automatic file scanning** – watches your configured directories.
- **Filename‑based keys by default** – `favicon.svg` is referenced as `"favicon.svg"`.
- **Multi‑type support** – generates `imagePath`, `videoPath`, `audioPath`, `fontPath`, etc.
- **Sync of types** – a `.d.ts` file is generated and kept up‑to‑date as you add / remove assets.

For a deep dive into the core API, check out the [`core documentation`](/plugin/core).
