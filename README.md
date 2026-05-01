## @typest — Typed asset paths for modern frontend

Typed asset paths for TypeScript projects. Framework integrations provide a virtual module you import from (with autocomplete + type-checking), backed by a shared core that scans asset folders and generates runtime JS + `.d.ts`.

<div style="position: relative; width: 100%; padding-bottom: 56.25%; margin: 32px auto;">
  <iframe
    src="https://www.youtube.com/embed/ga9O8Tq4MTQ?si=DQ_Kb_0gQrN9EavY"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
  ></iframe>
</div>

#### Repository layout

- `packages/core` — framework-agnostic scanner, watcher, and code generators
- `packages/*` — framework integrations (Vite today; more coming)
- `examples/*` — working example apps for each integration

#### Packages

| Package                               | What it is                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`@typest/core`](./packages/core)     | Scanner + watcher + generators (used by all integrations)                                  |
| [`@typest/vite`](./packages/vite)     | Vite plugin: generates types + serves a virtual module for runtime asset URL resolution    |
| [`@typest/nextjs`](./packages/nextjs) | Next.js plugin: generates types + serves a virtual module for runtime asset URL resolution |

Planned integrations include packages for Next.js, Vue tooling, and other ecosystems.

#### Contributing

We welcome fixes, features, and docs improvements!
See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup steps, coding conventions, and the pull request process.

#### License

MIT — see [LICENSE](./LICENSE) for details.
