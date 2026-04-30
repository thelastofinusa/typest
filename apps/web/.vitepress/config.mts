import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

export default defineConfig({
  title: "Typest",
  description:
    "Import every asset with autocomplete and confidence — no strings attached.",
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
        rel: "stylesheet",
      },
    ],
    ["link", { rel: "stylesheet", href: "/custom.css" }],
  ],
  markdown: {
    config(md) {
      groupIconMdPlugin(md);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
  themeConfig: {
    siteTitle: "Typest",
    logo: "/favicon.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/intro" },
      { text: "Overview", link: "/guide/plugin" },
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
      pattern:
        "https://github.com/thelastofinusa/typest/edit/main/apps/web/:path",
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
    },
  },
});
