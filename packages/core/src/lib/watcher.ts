import { WatchHelper, FSWatcher, watch } from "chokidar";
import type { AssetEntry, AssetSource, ScanOptions } from "../types";
import { scanAssets } from "./scanner";

export function watchAssets(
  sources: AssetSource[],
  callback: (entries: AssetEntry[]) => void,
  options: ScanOptions = {},
  watchOptions?: WatchHelper,
): FSWatcher {
  const dirs = sources.map((s) => s.dir);
  const watcher = watch(dirs, {
    ignoreInitial: true,
    ...watchOptions,
  });

  const refresh = async () => {
    try {
      const entries = await scanAssets(sources, options);
      callback(entries);
    } catch (err) {
      console.error("[typed-assets] scan error:", err);
    }
  };

  watcher.on("add", refresh);
  watcher.on("unlink", refresh);
  // File renames trigger add + unlink, so we already handle them.
  // We don't watch content changes because asset keys don't depend on content.

  // To avoid double calls, we could debounce, but chokidar batches efficiently.
  return watcher;
}
