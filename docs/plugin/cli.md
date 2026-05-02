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
🔍 Scanning /Users/me/my-vite-app ...
? Detected vite project. Is that correct? › (Y/n)
? Which package manager do you want to use? › pnpm
? Automatically update your config? (safe merge, no overwrites) › (Y/n)
✅ Updated vite.config.ts (AST merged)

? Install @typest/vite using pnpm? › (Y/n)
📦 Installing @typest/vite with pnpm...

🚀 Done! Start your dev server once to generate the type declarations.
```

If auto-config is declined:

```
🔧 Skipping config update...

📋 Manual setup required:
<instructions printed here>
```

## Options

| Option             | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `-d, --dir <path>` | Path to the project directory (default: current directory) |
| `-h, --help`       | Show help                                                  |
| `-v, --version`    | Show version                                               |

## Notes

- Config updates use **safe AST merging** (no full file overwrite).
- Manual setup is only shown if you decline auto-configuration.
- The CLI does not run your dev server – run it once afterward so type declarations can be generated.
- Only works with existing Vite or Next.js projects.
