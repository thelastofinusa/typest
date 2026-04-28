import path from "node:path";
import type { AssetEntry, AssetType, ScanOptions } from "./types";

export const DEFAULT_TYPE_MAP: Record<string, AssetType> = {
  png: "image",
  jpg: "image",
  jpeg: "image",
  webp: "image",
  gif: "image",
  svg: "image",
  ico: "image",
  bmp: "image",
  mp4: "video",
  webm: "video",
  avi: "video",
  mov: "video",
  mkv: "video",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  flac: "audio",
  aac: "audio",
  woff: "font",
  woff2: "font",
  ttf: "font",
  eot: "font",
  otf: "font",
  txt: "raw",
  csv: "raw",
  json: "raw",
  xml: "raw",
  yaml: "raw",
  yml: "raw",
};

/**
 * Determine asset type from extension.
 * Custom types per source can override the default.
 */
export function resolveAssetType(
  ext: string,
  typeMap?: Record<string, AssetType>,
  customTypes?: ScanOptions["customTypes"],
): AssetType {
  // source-level type map overrides everything
  if (typeMap?.[ext]) return typeMap[ext];
  if (customTypes?.[ext]) return customTypes[ext];
  return DEFAULT_TYPE_MAP[ext] ?? "generic";
}

/**
 * Build key and URL for a file.
 */
export function buildKeyAndUrl(
  file: string,
  baseDir: string,
  keyStrategy: "relative" | "filename",
  globalBasePath: string,
  sourceBasePath?: string,
): { key: string; url: string } {
  // Normalize file path to forward slashes
  const relativePath = file.replace(/\\/g, "/");
  let key: string;
  if (keyStrategy === "filename") {
    key = path.basename(file);
  } else {
    // Remove leading ./ if any
    key = relativePath.startsWith("./") ? relativePath.slice(2) : relativePath;
  }

  // Build URL: globalBasePath + sourceBasePath + relativePath
  const parts = [globalBasePath, sourceBasePath, relativePath].filter(Boolean);
  let url = parts.join("/");
  // Normalise multiple slashes
  url = url.replace(/\/+/g, "/");
  // Ensure leading slash
  if (!url.startsWith("/")) url = "/" + url;

  return { key, url };
}

/**
 * Ensure unique keys in an asset list.
 * If duplicate found, rename by appending the last directory segment of baseDir.
 */
export function uniquifyKeys(
  entries: AssetEntry[],
  baseDir: string,
): AssetEntry[] {
  const seen = new Set<string>();
  return entries.map((entry) => {
    if (seen.has(entry.key)) {
      const dirName = path.basename(baseDir);
      entry.key = `${entry.key}__${dirName}`;
    }
    seen.add(entry.key);
    return entry;
  });
}
