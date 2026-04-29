import { defineConfig, HeadConfig } from "vitepress";

export default defineConfig({
  title: "Typest",
  description:
    "Import every asset with autocomplete and confidence — no strings attached.",
  lastUpdated: true,
  themeConfig: {
    siteTitle: "Typest",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/intro" },
      { text: "Packages", link: "/guide/packages" },
    ],
    sidebar: {
      "/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/intro" },
            { text: "Overview", link: "/guide/packages" },
            {
              text: "Packages",
              items: [
                { text: "Vite", link: "/packages/vite" },
                { text: "Next.js" },
                { text: "Core", link: "/packages/core" },
              ],
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/thelastofinusa/typest" },
    ],
    footer: {
      message:
        "Released under the <a target='_blank' href='https://github.com/thelastofinusa/typest/blob/main/LICENSE'>MIT License</a>.",
      copyright:
        "Copyright © 2026-present <a target='_blank' href='https://x.com/thelastofinusa'>Holiday.</a>",
    },
    editLink: {
      pattern: ({ filePath }) => {
        if (filePath.startsWith("packages/")) {
          return `https://github.com/thelastofinusa/typest/edit/main/${filePath}`;
        } else {
          return `https://github.com/thelastofinusa/typest/edit/main/docs/${filePath}`;
        }
      },
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
    },
  },
});
