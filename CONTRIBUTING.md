# Contributing to Typest

Thanks for your interest in contributing! Whether you're fixing a bug, adding a feature, or improving documentation, this guide will help you get started.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [pnpm](https://pnpm.io/) v9 or later

### Setup

```bash
git clone https://github.com/thelastofinusa/typest.git
cd typest
pnpm install
```

### Build all packages

```bash
pnpm run build
```

### Run tests

```bash
pnpm run test
```

The monorepo structure is managed by [Turborepo](https://turbo.build) and pnpm workspaces.

---

## Development workflow

1. **Create a branch** – `git checkout -b feature/my-feature` or `fix/some-bug`.
2. **Make your changes** – keep them focused and minimal.
3. **Test locally** – use the example projects in `examples/` to verify your changes.
4. **Run lint and tests** – `pnpm run lint && pnpm run test` (ensure everything passes).
5. **Commit** – write clear, imperative commit messages (e.g., `Add support for custom file extensions`).
6. **Push and open a pull request** – describe what you changed and why.

---

## Project structure

| Package         | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| `packages/core` | Asset scanner, code generator, and file watcher – used by all framework plugins. |
| `packages/vite` | Vite plugin – serves a virtual module and generates type declarations.           |
| `examples/*`    | Sample projects to test plugins locally.                                         |

The shared build tooling lives in the root: `tsconfig.base.json`, `turbo.json`, and `pnpm-workspace.yaml`.

---

## Coding conventions

- **TypeScript strict mode** – all packages use `strict: true`.
- **No unused locals or parameters** – enforced by the tsconfig.
- **Generated file headers** – do not manually edit files that start with the auto‑generated banner.
- **Keep the API surface small** – prefer sensible defaults over configuration options.
- **Test core functions** – unit tests live in `packages/core/test/`.

---

## Pull request guidelines

- Reference an existing issue if applicable.
- Include a clear description of the problem and solution.
- Add tests for new functionality or bug fixes.
- Ensure the CI pipeline passes (build, test, lint).
- Keep pull requests small – one logical change per PR.

---

## Reporting issues

Open an issue on [GitHub Issues](https://github.com/thelastofinusa/typest/issues) and include:

- Your framework and package versions (e.g., `@typest/vite@0.1.1`, `vite@8.0.10`)
- A minimal reproduction repository or code snippet
- The expected behavior vs. what actually happened

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License (see [LICENSE](./LICENSE)).
