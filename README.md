## @typest — Typed asset paths for modern frontend

Typed asset paths for TypeScript projects. Framework integrations provide a virtual module you import from (with autocomplete + type-checking), backed by a shared core that scans asset folders and generates runtime JS + `.d.ts`.

<p align="center">
  <a href="https://www.youtube.com/watch?v=ga9O8Tq4MTQ">
    <span style="display: inline-block; width: 508px;">
      <img
        src="https://img.youtube.com/vi/ga9O8Tq4MTQ/maxresdefault.jpg"
        alt="Watch the video"
        style="width: 100%;"
      />
    </span>
  </a>
</p>

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
