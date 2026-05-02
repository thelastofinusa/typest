import fs from "node:fs";
import path from "node:path";

export function detectFramework(cwd: string): string | null {
  // Vite
  if (
    fs.existsSync(path.join(cwd, "vite.config.ts")) ||
    fs.existsSync(path.join(cwd, "vite.config.js")) ||
    fs.existsSync(path.join(cwd, "vite.config.mjs"))
  )
    return "vite";

  // Next.js
  if (
    fs.existsSync(path.join(cwd, "next.config.ts")) ||
    fs.existsSync(path.join(cwd, "next.config.js")) ||
    fs.existsSync(path.join(cwd, "next.config.mjs"))
  )
    return "next";

  // package.json dependencies
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return null;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  if (deps["vite"]) return "vite";
  if (deps["next"]) return "next";

  return null;
}
