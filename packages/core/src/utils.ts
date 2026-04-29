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

/** Maps asset type → exported function name */
export const TYPE_FUNC_MAP: Record<string, string> = {
  image: "imagePath",
  video: "videoPath",
  audio: "audioPath",
  font: "fontPath",
  raw: "rawPath",
  generic: "assetPath",
};

export function resolveAssetType(
  ext: string,
  typeMap?: Record<string, AssetType>,
  customTypes?: ScanOptions["customTypes"],
) {
  if (typeMap?.[ext]) return typeMap[ext];
  if (customTypes?.[ext]) return customTypes[ext];
  return DEFAULT_TYPE_MAP[ext] ?? "generic";
}

export function buildKeyAndUrl(
  file: string,
  baseDir: string,
  keyStrategy: "relative" | "filename",
  globalBasePath: string,
  sourceBasePath?: string,
): { key: string; url: string } {
  const relativePath = file.replace(/\\/g, "/");
  const key =
    keyStrategy === "filename"
      ? path.basename(file)
      : relativePath.startsWith("./")
        ? relativePath.slice(2)
        : relativePath;
  const parts = [globalBasePath, sourceBasePath, relativePath].filter(Boolean);
  let url = parts.join("/").replace(/\/+/g, "/");
  if (!url.startsWith("/")) url = "/" + url;
  return { key, url };
}

export function uniquifyKeys(
  entries: AssetEntry[],
  baseDir: string,
): AssetEntry[] {
  const seen = new Set<string>();
  return entries.map((entry) => {
    if (seen.has(entry.key)) {
      entry.key = `${entry.key}__${path.basename(baseDir)}`;
    }
    seen.add(entry.key);
    return entry;
  });
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
