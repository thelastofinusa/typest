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
      { text: "Plugins", link: "/guide/plugin" },
    ],
    sidebar: {
      "/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/intro" },
            { text: "Overview", link: "/guide/plugin" },
            {
              text: "Plugins",
              items: [
                { text: "Vite", link: "/plugin/vite" },
                { text: "Next.js", link: "/plugin/next" },
                { text: "Core", link: "/plugin/core" },
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
