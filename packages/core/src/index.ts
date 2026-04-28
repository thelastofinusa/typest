export { scanAssets } from "./lib/scanner";
export { watchAssets } from "./lib/watcher";
export { generateRuntimeModule, generateDeclarations } from "./lib/generator";
export type {
  AssetSource,
  AssetEntry,
  AssetType,
  ScanOptions,
  GeneratorOptions,
} from "./types";
export { DEFAULT_TYPE_MAP } from "./utils";
