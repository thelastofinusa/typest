import fs from "node:fs";
import path from "node:path";

// Known lock file names per package manager
const LOCK_FILES: Record<string, string> = {
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "bun.lockb": "bun",
  "package-lock.json": "npm",
};

/**
 * Detect the package manager by searching for lock files in the current directory
 * and up to the root. Returns the detected PM name or 'npm' if none found.
 */
export async function getPackageManager(
  cwd: string = process.cwd(),
): Promise<"npm" | "yarn" | "pnpm" | "bun"> {
  // 1. Walk up from cwd to root looking for any lock file
  let dir = cwd;
  while (true) {
    for (const [lockFile, pmName] of Object.entries(LOCK_FILES)) {
      if (fs.existsSync(path.join(dir, lockFile))) {
        return pmName as any;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break; // reached root
    dir = parent;
  }

  // 2. Default fallback
  return "npm";
}

export function frameworkToPackage(framework: string): string {
  const map: Record<string, string> = {
    vite: "@typest/vite",
    next: "@typest/nextjs",
  };
  return map[framework] ?? "";
}

export function installArgs(pm: string, pkg: string): [string, string[]] {
  switch (pm) {
    case "npm":
      return ["npm", ["install", pkg]];
    case "yarn":
      return ["yarn", ["add", pkg]];
    case "pnpm":
      return ["pnpm", ["add", pkg]];
    case "bun":
      return ["bun", ["add", pkg]];
    default:
      return ["npm", ["install", pkg]];
  }
}
