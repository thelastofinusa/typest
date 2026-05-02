import { whichPM as detect } from "which-pm";

export async function getPackageManager(
  cwd: string = process.cwd(),
): Promise<"npm" | "yarn" | "pnpm" | "bun"> {
  const pm = await detect(cwd);
  const name = pm?.name ?? "npm";

  if (!["npm", "yarn", "pnpm", "bun"].includes(name)) {
    return "npm"; // fallback
  }
  return name as any;
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
