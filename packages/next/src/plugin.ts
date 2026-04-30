import path from "node:path";
import fs from "node:fs/promises";
import { scanAssets } from "@typest/core";
import type { AssetSource, AssetEntry } from "@typest/core";
import { CONST_HEADER } from "./lib/constant";
import {
  ASSET_IMPORT_PATH,
  capitalize,
  groupByType,
  TYPE_FUNC_MAP,
} from "./lib/utils";

export interface NextTypedAssetsOptions {
  sources: AssetSource[];
}

const DECLARATION_FILE = "assets.d.ts"; // project root – always included by Next.js tsconfig

export function withTypedAssets(options: NextTypedAssetsOptions) {
  const { sources } = options;

  return async (nextConfig: any): Promise<any> => {
    const entries = await scanAssets(sources);
    const groups = groupByType(entries);

    // let dts = `declare module '@typest/nextjs' {\n`;
    let dts = CONST_HEADER + `\ndeclare module "${ASSET_IMPORT_PATH}" {\n`;

    const activeTypes = Object.keys(TYPE_FUNC_MAP).filter(
      (t) => groups.has(t) && groups.get(t)!.length > 0,
    );

    // Determine the maximum label length (e.g. "Generic Assets" = 15)
    const labels = activeTypes.map((type) => `${capitalize(type)} Assets`);
    const maxLen = Math.max(...labels.map((l) => l.length));
    const boxWidth = maxLen + 4; // 2 spaces padding on each side

    for (const type of activeTypes) {
      const assets = groups.get(type)!;
      const constName = `${type}Assets`;
      const typeName = `${capitalize(type)}Key`;
      const funcName = TYPE_FUNC_MAP[type];

      // Box header
      const label = `${capitalize(type)} Assets`;
      const leftPad = Math.floor((boxWidth - label.length) / 2);
      const rightPad = boxWidth - label.length - leftPad;
      const top = `  /* ╔${"═".repeat(boxWidth)}╗`;
      const mid = `     ║${" ".repeat(leftPad)}${label}${" ".repeat(rightPad)}║`;
      const bottom = `     ╚${"═".repeat(boxWidth)}╝ */`;

      dts += top + `\n` + mid + `\n` + bottom + `\n`;

      dts += `  const ${constName}: {\n`;
      assets.forEach((a) => (dts += `    readonly "${a.key}": "${a.url}";\n`));
      dts += `  };\n`;
      dts += `  type ${typeName} = keyof typeof ${constName};\n`;
      dts += `  export function ${funcName}(key: ${typeName}): string;\n\n`;
    }

    dts += `}\n`;

    const fullPath = path.resolve(DECLARATION_FILE);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, dts, "utf-8");

    return nextConfig;
  };
}
