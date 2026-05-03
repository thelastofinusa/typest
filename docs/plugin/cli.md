# Using the CLI

The **Typest command-line tool** – detect your framework, install the correct plugin, and optionally auto‑configure your config file. One command, fully interactive.

## Installation

::: code-group

```sh [npm]
$ npx @typest/cli config
```

```sh [yarn]
$ yarn @typest/cli config
```

```sh [pnpm]
$ pnpm dlx @typest/cli config
```

```sh [bun]
$ bunx --bun @typest/cli config
```

:::

Or install it globally:

::: code-group

```sh [npm]
$ npm install -g @typest/cli
```

```sh [yarn]
$ yarn install -g @typest/cli
```

```sh [pnpm]
$ pnpm add -g @typest/cli
```

```sh [bun]
$ bun add -g @typest/cli
```

:::

## Usage

```bash
typest config                     # run in the target project directory
typest config --dir /path/to/app  # point to a different directory
```

The CLI will:

1. 🔍 **Detect** your project’s framework (Vite or Next.js)
2. ❓ **Confirm** the detection with you
3. 📦 **Ask** which package manager to use (npm, yarn, pnpm, or bun)
4. 🔧 **Ask** whether to safely auto-update your config (AST merge, no overwrite)
5. 📥 **Install** the correct `@typest/*` plugin
6. 📋 **Optionally show** manual setup instructions (if auto-config is declined)
7. 🚀 **Done** – start your dev server once to generate types

## Interactive workflow example

```
┌  Welcome to Typest CLI
│
◇  Detected vite project. Continue?
│  Yes
│
◇  Which package manager do you want to use?
│  pnpm
│
◇  Update your config file automatically? (safe merge, no overwrites)
│  Yes
│
◇  Install @typest/vite using pnpm?
│  Yes
│
│  Installing @typest/vite with pnpm…
│  @typest/vite installed.
│
└  ✅ config updated · @typest/vite installed
   (Start your dev server to generate the type declarations.)
```

If auto-config is declined, configuration happens last:

```
...
◇  Update your config file automatically? (safe merge, no overwrites)
│  No
│
◇  Install @typest/vite using pnpm?
│  Yes
│
◇   ─────────────────────────────────────────────────────────────╮
│                                                                │
│  Manual setup instructions: Open vite.config.ts and add:       │
│                                                                │
│  1. Import the plugin                                          │
│     import { typedAssets } from '@typest/vite/plugin';         │
│                                                                │
│  2. Add it to your plugins                                     │
│     plugins: [typedAssets({ sources: [{ dir: 'public' }] })],  │
│                                                                │
├────────────────────────────────────────────────────────────────╯
│
└  ✅ Setup complete (Start your dev server to generate the type declarations.)
```

## Options

| Option             | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `-d, --dir <path>` | Path to the project directory (default: current directory) |
| `-y, --yes`        | Skip prompts and use defaults                              |
| `-h, --help`       | Show help                                                  |
| `-v, --version`    | Show version                                               |

## Notes

- Config updates use **safe AST merging** (no full file overwrite).
- Manual setup is only shown if you decline auto-configuration.
- The CLI does not run your dev server – run it once afterward so type declarations can be generated.
- Only works with existing Vite or Next.js projects.
