## @typest — Typed asset paths (monorepo)

Typed asset paths for TypeScript projects. Framework integrations provide a virtual module you import from (with autocomplete + type-checking), backed by a shared core that scans asset folders and generates runtime JS + `.d.ts`.

#### Repository layout

- `packages/core` — framework-agnostic scanner, watcher, and code generators
- `packages/*` — framework integrations (Vite today; more coming)
- `examples/*` — working example apps for each integration

#### Packages

| Package                           | What it is                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| [`@typest/core`](./packages/core) | Scanner + watcher + generators (used by all integrations)                               |
| [`@typest/vite`](./packages/vite) | Vite plugin: generates types + serves a virtual module for runtime asset URL resolution |

Planned integrations include packages for Next.js, Vue tooling, and other ecosystems.

#### Quickstart (Vite)

Install:

```bash
npm install -D @typest/vite
```

Configure Vite (plugin entrypoint):

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

Use in app code (virtual module entrypoint):

```ts
import { imagePath } from "@typest/vite";

imagePath("favicon.svg");
```
