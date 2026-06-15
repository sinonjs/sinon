import { defineConfig } from "vitepress";
import sidebarConfig from "./sidebar.mjs";
import llmstxt from "vitepress-plugin-llms";

export default defineConfig({
  title: "SinonJS",
  description: "Sinon.js documentation",
  base: "/",
  lang: "en",
  head: [
    [
      "link",
      { rel: "icon", type: "image/png", href: "/assets/images/favicon.png" }
    ]
  ],
  srcDir: ".",
  srcExclude: ["**/analysis/**", "**/plans/**", "**/tests/**"],
  cleanUrls: true,
  ignoreDeadLinks: false,
  sitemap: {
    hostname: "https://sinonjs.org"
  },
  vite: {
    plugins: [llmstxt()]
  },
  themeConfig: {
    logo: "/assets/images/logo.png",
    nav: [
      { text: "Getting Started", link: "/getting-started" },
      {
        text: "Concepts",
        activeMatch: "/concepts/",
        items: [
          {
            text: "Core",
            items: [
              { text: "Fakes", link: "/concepts/fakes" },
              { text: "Spies", link: "/concepts/spies" },
              { text: "Stubs", link: "/concepts/stubs" },
              { text: "Fake Timers", link: "/concepts/fake-timers" },
              { text: "Sandboxes", link: "/concepts/sandboxes" }
            ]
          },
          {
            text: "Advanced",
            items: [
              { text: "Matchers", link: "/concepts/matchers" },
              { text: "Assertions", link: "/concepts/assertions" },
              { text: "Mocks", link: "/concepts/mocks" }
            ]
          },
          {
            text: "Extras",
            items: [
              { text: "Promises", link: "/concepts/promises" },
              { text: "Utils", link: "/concepts/utils" }
            ]
          }
        ]
      },
      {
        text: "About",
        items: [{ text: "Sponsors", link: "/sponsors" }]
      }
    ],
    sidebar: sidebarConfig,
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/sinonjs/sinon" }]
  },
  editLink: {
    pattern: "https://github.com/sinonjs/sinon/edit/main/docs/:path",
    text: "Edit this page"
  }
});
