import type { AssetEntry } from "../types";
import { TYPE_FUNC_MAP, capitalize } from "../utils";
import { CONST_HEADER } from "./constant";

function groupByType(entries: AssetEntry[]): Map<string, AssetEntry[]> {
  const groups = new Map<string, AssetEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.type) || [];
    list.push(entry);
    groups.set(entry.type, list);
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Runtime module (pure JavaScript)
// ---------------------------------------------------------------------------
export function generateRuntimeModule(entries: AssetEntry[]): string {
  const groups = groupByType(entries);
  let code = CONST_HEADER + `\n`;

  const activeTypes = Object.keys(TYPE_FUNC_MAP).filter(
    (type) => groups.has(type) && groups.get(type)!.length > 0,
  );

  const labels = activeTypes.map((type) => `${capitalize(type)} Assets`);
  const maxLen = Math.max(...labels.map((l) => l.length));
  const boxWidth = maxLen + 4;

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
    code += `export function ${funcName}(key) {\n`;
    code += `  return ${constName}[key];\n`;
    code += `}\n\n`;
  }

  return code;
}

// ---------------------------------------------------------------------------
// Type declarations (.d.ts)
// ---------------------------------------------------------------------------
export function generateDeclarations(entries: AssetEntry[]): string {
  const groups = groupByType(entries);
  let dts = CONST_HEADER + `\n`;

  const activeTypes = Object.keys(TYPE_FUNC_MAP).filter(
    (type) => groups.has(type) && groups.get(type)!.length > 0,
  );

  const labels = activeTypes.map((type) => `${capitalize(type)} Assets`);
  const maxLen = Math.max(...labels.map((l) => l.length));
  const boxWidth = maxLen + 4;

  for (const type of activeTypes) {
    const assets = groups.get(type)!;
    const constName = `${type}Assets`;
    const typeName = `${capitalize(type)}Key`;
    const funcName = TYPE_FUNC_MAP[type];

    const label = `${capitalize(type)} Assets`;
    const leftPad = Math.floor((boxWidth - label.length) / 2);
    const rightPad = boxWidth - label.length - leftPad;
    const top = ` /* ╔${"═".repeat(boxWidth)}╗`;
    const mid = `    ║${" ".repeat(leftPad)}${label}${" ".repeat(rightPad)}║`;
    const bottom = `    ╚${"═".repeat(boxWidth)}╝ */`;

    dts += top + `\n` + mid + `\n` + bottom + `\n`;

    dts += `declare const ${constName}: {\n`;
    assets.forEach((a) => (dts += `  readonly "${a.key}": "${a.url}";\n`));
    dts += `};\n`;
    dts += `type ${typeName} = keyof typeof ${constName};\n`;
    dts += `export declare function ${funcName}(key: ${typeName}): string;\n`;
  }

  return dts;
}
