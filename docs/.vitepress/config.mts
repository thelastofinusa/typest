import { defineConfig } from "vitepress";
import { groupIconVitePlugin } from "vitepress-plugin-group-icons";

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
        href: "https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap",
        rel: "stylesheet",
      },
    ],
    ["link", { rel: "stylesheet", href: "/custom.css" }],
  ],
  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
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
      {
        text: "Contributing",
        link: "https://github.com/thelastofinusa/typest/blob/main/CONTRIBUTING.md",
      },
    ],
    darkModeSwitchLabel: "Appearance",
    outline: "deep",
    sidebar: {
      "/": [
        {
          text: "Introduction",
          items: [
            { text: "What is Typest?", link: "/guide/intro" },
            { text: "Package Overview", link: "/guide/plugin" },
          ],
        },
        {
          text: "Get Started",
          items: [
            { text: "Using the CLI", link: "/plugin/cli" },
            { text: "Vite plugin", link: "/plugin/vite" },
            { text: "Next.js plugin", link: "/plugin/next" },
            { text: "Core engine", link: "/plugin/core" },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/thelastofinusa/typest" },
      { icon: "npm", link: "https://www.npmjs.com/org/typest" },
      {
        icon: "producthunt",
        link: "https://www.producthunt.com/products/typest",
      },
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
