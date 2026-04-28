import { describe, it, expect, beforeAll } from "vitest";
import { scanAssets } from "../src/lib/scanner";
import path from "node:path";
import fs from "node:fs/promises";

const fixtureDir = path.resolve(__dirname, "fixtures/basic");

beforeAll(async () => {
  await fs.mkdir(path.join(fixtureDir, "images"), { recursive: true });
  await fs.writeFile(path.join(fixtureDir, "images/logo.png"), "");
  await fs.writeFile(path.join(fixtureDir, "video.mp4"), "");
});

describe("scanAssets", () => {
  it("scans a single source and returns typed entries", async () => {
    const entries = await scanAssets([{ dir: fixtureDir }]);
    expect(entries).toHaveLength(2);
    const logo = entries.find((e) => e.key === "logo.png");
    expect(logo).toBeDefined();
    expect(logo!.type).toBe("image");
    expect(logo!.url).toBe("/images/logo.png");

    const video = entries.find((e) => e.key === "video.mp4");
    expect(video).toBeDefined();
    expect(video!.type).toBe("video");
  });
});
