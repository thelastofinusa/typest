import type { AssetEntry } from "@typest/core";

/** The import path users write in their code */
export const ASSET_IMPORT_PATH = "@typest/nextjs";

/** Maps asset type → function name */
export const TYPE_FUNC_MAP: Record<string, string> = {
  image: "imagePath",
  video: "videoPath",
  audio: "audioPath",
  font: "fontPath",
  raw: "rawPath",
  generic: "assetPath",
};

export function groupByType(entries: AssetEntry[]): Map<string, AssetEntry[]> {
  const groups = new Map<string, AssetEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.type) || [];
    list.push(entry);
    groups.set(entry.type, list);
  }
  return groups;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
