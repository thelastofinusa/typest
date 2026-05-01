# Introduction

Typest brings **type‑safe, autocompleted asset paths** to every TypeScript frontend project – so you never have to leave your editor to look up a file name again.

Modern web applications reference dozens, sometimes hundreds of static assets: images, fonts, icons, videos, and more. Without tooling, you’re left with a fragile manual workflow:

1. Drop a file into the `public` folder.
2. Check the exact file name.
3. Go back to your code and type the path as a string.
4. Hope you didn’t misspell it.
5. Deploy – and discover broken images only when a user reports them.

That loop is slow, error‑prone, and completely avoidable.

<iframe width="600" height="315" src="https://www.youtube.com/embed/ga9O8Tq4MTQ?si=DQ_Kb_0gQrN9EavY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />

Typest replaces it with **automatic, always‑correct paths** that your editor understands.
Install the plugin for your framework, point it at your asset folders, and import `imagePath`, `videoPath`, `fontPath`, or any other generated helper – all with perfect IntelliSense.

> Change an asset? Add a new one? Delete one that’s no longer used? The types update instantly, and your build catches any stale references before they reach production.

## How it works

1. **Scan** – The plugin watches the directories you configure (typically `public/`).
2. **Generate** – A pure‑JavaScript module is created that maps every asset filename to its actual public URL.
3. **Declare** – A `.d.ts` file gives TypeScript an exact, literal union of every available asset key.
4. **Update** – Whenever a file is added or removed, the types are refreshed automatically – no manual regeneration, no restart required.

Your editor shows you exactly which assets exist. Your build fails if you reference a file that doesn’t.
And your application bundles contain nothing extra – the runtime code is a simple object lookup, shipped as fast as a handwritten string.

Typest doesn’t just save keystrokes. It eliminates an entire class of bugs that slip through manual review and land in production unnoticed.
