import path from "node:path";
import fs from "node:fs/promises";
import type { Plugin, ResolvedConfig } from "vite";
import { scanAssets, watchAssets } from "@typest/core";
import type { AssetSource, AssetEntry } from "@typest/core";
import { ASSET_IMPORT_PATH } from "./lib/utils";
import {
  generateDeclarationModule,
  generateVirtualModule,
} from "./lib/codegen";

export interface ViteTypedAssetsOptions {
  sources: AssetSource[];
}

const RESOLVED_ASSET_IMPORT_PATH = "\0" + ASSET_IMPORT_PATH;
const DECLARATION_FILE = "src/assets.d.ts";

export function typedAssets(options: ViteTypedAssetsOptions): Plugin {
  let config: ResolvedConfig;
  let cachedRuntimeCode: string | undefined;
  let enqueue = Promise.resolve();
  let closeWatcher: (() => void) | undefined;
  const { sources } = options;

  const writeDeclarations = async (entries: AssetEntry[]) => {
    const dts = generateDeclarationModule(entries);
    const fullPath = path.resolve(config.root, DECLARATION_FILE);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, dts, "utf-8");
  };

  const regenerate = async () => {
    const entries = await scanAssets(sources);
    const runtimeCode = generateVirtualModule(entries);
    await writeDeclarations(entries);
    cachedRuntimeCode = runtimeCode;
    return runtimeCode;
  };

  return {
    name: "vite-plugin-typed-assets",
    enforce: "pre",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(id) {
      if (id === ASSET_IMPORT_PATH) return RESOLVED_ASSET_IMPORT_PATH;
    },

    async load(id) {
      if (id === RESOLVED_ASSET_IMPORT_PATH) {
        if (!cachedRuntimeCode) await regenerate();
        return cachedRuntimeCode ?? "";
      }
    },

    async configureServer(server) {
      await regenerate();
      const watcher = watchAssets(sources, (entries) => {
        enqueue = enqueue.then(async () => {
          const runtimeCode = generateVirtualModule(entries);
          await writeDeclarations(entries);
          cachedRuntimeCode = runtimeCode;

          const mod = server.moduleGraph.getModuleById(
            RESOLVED_ASSET_IMPORT_PATH,
          );
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        });
      });

      closeWatcher = () => {
        void watcher.close();
      };
      server.httpServer?.once("close", closeWatcher);
    },

    async buildStart() {
      await regenerate();
    },

    buildEnd() {
      closeWatcher?.();
      closeWatcher = undefined;
    },
  };
}
