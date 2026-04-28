export type AssetType =
  | "image"
  | "video"
  | "audio"
  | "font"
  | "raw"
  | "generic";

export interface AssetSource {
  /** Absolute or cwd‑relative path to the directory containing assets */
  dir: string;
  // /** Glob patterns for files to include (relative to `dir`). Default: ['**/*'] */
  include?: string[];
  /** Glob patterns to exclude (relative to `dir`). */
  exclude?: string[];
  /** A public path prefix that gets prepended to the asset URL (e.g. "/images") */
  basePath?: string;
  /** Override the default extension → asset type mapping for this source */
  typeMap?: Record<string, AssetType>;
}

export interface AssetEntry {
  /** Unique key – relative file path (without extension influence) */
  key: string;
  /** Public URL for the asset */
  url: string;
  /** Detected or mapped asset type */
  type: AssetType;
  /** Original file extension (without dot) */
  ext: string;
}

export interface ScanOptions {
  /**
   * Strategy for building keys:
   * - 'filename': key is the filename including extension (default)
   * - 'relative': key is the file path relative to its source directory
   */
  keyStrategy?: "relative" | "filename";
  /** Additional extension → type mappings (merged with defaults) */
  customTypes?: Record<string, AssetType>;
  /** Global public path prefix prepended to every URL (useful for CDN) */
  globalBasePath?: string;
}

export interface GeneratorOptions {
  /** If true (default), generate separate functions per asset type (image, video, etc.) */
  perType?: boolean;
}
