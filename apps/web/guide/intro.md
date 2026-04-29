# Introduction

Typest gives you **compile‑time safe, autocompleted asset paths** in any TypeScript frontend project.

No more:

- Typing string paths by hand.
- Finding broken images only after you deploy.
- Manually updating an asset list when files change.

Just install the plugin for your framework, add one line to your config, and import `imagePath` (or `videoPath`, `fontPath`, …) with perfect IntelliSense.

## How it works

1. **Scan** – The plugin watches your `public/` folder (or any directory you configure).
2. **Generate** – A pure‑JavaScript runtime module is served, mapping every asset filename to its public URL.
3. **Declare** – A `.d.ts` file is written with exact string‑literal types for every asset key.
4. **Update** – When you add or remove files, the types refresh automatically.

Your editor sees the actual asset names, your build catches typos, and your production bundle contains nothing extra – the runtime code is just a simple object lookup.
