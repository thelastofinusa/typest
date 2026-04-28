import fg from "fast-glob";
import path from "node:path";
import type { AssetEntry, AssetSource, ScanOptions } from "../types";
import { resolveAssetType, buildKeyAndUrl } from "../utils";

export async function scanAssets(
  sources: AssetSource[],
  options: ScanOptions = {},
): Promise<AssetEntry[]> {
  const {
    keyStrategy = "filename",
    customTypes,
    globalBasePath = "",
  } = options;
  const entries: (AssetEntry & { _sourceDir: string })[] = [];

  for (const source of sources) {
    const baseDir = path.resolve(source.dir);
    const include = source.include ?? ["**/*"];
    const exclude = source.exclude ?? [];

    const files = await fg(include, {
      cwd: baseDir,
      absolute: false,
      ignore: exclude,
      onlyFiles: true,
      dot: false,
    });

    for (const file of files) {
      const ext = path.extname(file).slice(1).toLowerCase();
      const type = resolveAssetType(ext, source.typeMap, customTypes);
      const { key, url } = buildKeyAndUrl(
        file,
        baseDir,
        keyStrategy,
        globalBasePath,
        source.basePath,
      );
      entries.push({ key, url, type, ext, _sourceDir: baseDir });
    }
  }

  // De-duplicate keys by appending a source-specific suffix
  const keyCount = new Map<string, number>();
  const finalEntries: AssetEntry[] = [];

  for (const entry of entries) {
    let candidateKey = entry.key;
    if (keyCount.has(candidateKey)) {
      const count = keyCount.get(candidateKey)!;
      // Use the parent directory of the source as a discriminator
      const dirName = path.basename(entry._sourceDir);
      candidateKey = `${entry.key}__${dirName}`;
      // Further collisions may happen but extremely unlikely
    }
    keyCount.set(entry.key, (keyCount.get(entry.key) ?? 0) + 1);
    finalEntries.push({
      key: candidateKey,
      url: entry.url,
      type: entry.type,
      ext: entry.ext,
    });
  }

  return finalEntries;
}
