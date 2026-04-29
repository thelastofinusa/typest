import type { AssetEntry } from "@typest/core";
import {
  groupByType,
  capitalize,
  TYPE_FUNC_MAP,
  ASSET_IMPORT_PATH,
} from "./utils";
import { CONST_HEADER } from "./constant";

/**
 * Generate the `declare module` block that gives TypeScript exact keys.
 */
export function generateDeclarationModule(entries: AssetEntry[]): string {
  const groups = groupByType(entries);
  let dts = CONST_HEADER + `\ndeclare module "${ASSET_IMPORT_PATH}" {\n`;

  const activeTypes = Object.keys(TYPE_FUNC_MAP).filter(
    (type) => groups.has(type) && groups.get(type)!.length > 0,
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
    dts += `  export function ${funcName}(key: ${typeName}): string;\n`;
  }

  dts += `}\n`;
  return dts;
}

/**
 * Generate the pure‑JavaScript virtual module served at runtime.
 */
export function generateVirtualModule(entries: AssetEntry[]): string {
  const groups = groupByType(entries);
  let code = CONST_HEADER + `\n`;

  const activeTypes = Object.keys(TYPE_FUNC_MAP).filter(
    (type) => groups.has(type) && groups.get(type)!.length > 0,
  );

  // Determine the maximum label length (e.g. "Generic Assets" = 15)
  const labels = activeTypes.map((type) => `${capitalize(type)} Assets`);
  const maxLen = Math.max(...labels.map((l) => l.length));
  const boxWidth = maxLen + 4; // 2 spaces padding on each side

  for (const type of activeTypes) {
    const assets = groups.get(type)!;
    const constName = `${type}Assets`;
    const funcName = TYPE_FUNC_MAP[type];

    const label = `${capitalize(type)} Assets`;
    const leftPad = Math.floor((boxWidth - label.length) / 2);
    const rightPad = boxWidth - label.length - leftPad;
    const top = ` /* ╔${"═".repeat(boxWidth)}╗`;
    const mid = `    ║${" ".repeat(leftPad)}${label}${" ".repeat(rightPad)}║`;
    const bottom = `    ╚${"═".repeat(boxWidth)}╝ */`;

    code += top + `\n` + mid + `\n` + bottom + `\n`;

    code += `export const ${constName} = {\n`;
    assets.forEach((a) => (code += `  "${a.key}": "${a.url}",\n`));
    code += `};\n\n`;
    code += `export function ${funcName}(key) { return ${constName}[key]; }\n\n`;
  }

  return code;
}
