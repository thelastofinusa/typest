import chalk from "chalk";
import { createHeader } from "./header";

/**
 * Returns the full content for the configuration file.
 * `framework` must be "vite" or "next".
 */
export function generateConfig(framework: string, version: string): string {
  const header = createHeader({ framework, version });

  if (framework === "vite") {
    return `${header}
import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import { typedAssets } from '@typest/vite/plugin';

export default defineConfig({
  plugins: [
    react(),
    typedAssets({ sources: [{ dir: 'public' }] }),
  ],
});
`;
  }

  if (framework === "next") {
    return `${header}
import type { NextConfig } from 'next';
import { withTypedAssets } from '@typest/nextjs/plugin';

const nextConfig: NextConfig = {};

export default withTypedAssets({
  sources: [{ dir: 'public' }],
})(nextConfig);
`;
  }

  return "";
}

export function getConfigFileName(framework: string): string {
  if (framework === "vite") return "vite.config.ts";
  if (framework === "next") return "next.config.ts";
  return "";
}

export function manualInstructions(framework: string): string {
  if (framework === "vite") {
    return [
      `Open ${chalk.cyan("vite.config.ts")} and add:\n`,

      chalk.gray("1. Import the plugin"),

      chalk.white(
        `   ${chalk.green(
          "import { typedAssets } from '@typest/vite/plugin';",
        )}\n`,
      ),

      chalk.gray("2. Add it to your plugins"),

      chalk.white(
        `   ${chalk.green(
          "plugins: [typedAssets({ sources: [{ dir: 'public' }] })],",
        )}`,
      ),
    ].join("\n");
  }

  if (framework === "next") {
    return [
      `Open ${chalk.cyan("next.config.ts")} and update:\n`,

      chalk.gray("1. Import the helper"),

      chalk.white(
        `   ${chalk.green(
          "import { withTypedAssets } from '@typest/nextjs/plugin';",
        )}\n`,
      ),

      chalk.gray("2. Wrap your config"),

      chalk.white(
        `   ${chalk.green(
          "export default withTypedAssets({ sources: [{ dir: 'public' }] })({ ... });",
        )}`,
      ),
    ].join("\n");
  }

  return "";
}
