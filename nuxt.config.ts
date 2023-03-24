export default {
  app: {
    head: {
      script: [
      ],
      bodyAttrs: {
        class: "ma0 pa0",
      },
      htmlAttrs: {
        lang: 'en'
      },
      charset: "utf-16",
      title: "EJ Fox",
      meta: [
        {
          name: "description",
          content:
            "EJ Fox: Hacker, Journalist, & Dataviz Specialist finding interesting ways to look at the world by exploring and explaining data ",
        },

        // opengraph tags
        { property: "og:title", content: "EJ Fox" },
        {
          property: "og:description",
          content:
            "EJ Fox: Hacker, Journalist, & Dataviz Specialist finding interesting ways to look at the world by exploring and explaining data ",
        },
        { property: "og:image", content: "https://ejfox.com/og-image.png" },
        { property: "og:url", content: "https://ejfox.com" },
        { property: "og:type", content: "website" },

        // twitter opengraph tags
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@mrejfox" },
        { name: "twitter:creator", content: "@mrejfox" },
        { name: "twitter:title", content: "EJ Fox" },
        {
          name: "twitter:description",
          content:
            "EJ Fox: Hacker, Journalist, & Dataviz Specialist finding interesting ways to look at the world by exploring and explaining data ",
        },
        { name: "twitter:image", content: "https://ejfox.com/og-image.png" },
      ],
    },
  },
  content: {
    documentDriven: true,
    markdown: {
      remarkPlugins: [
        // "~/plugins/remark/wikilinks.js",
        // "remark-obsidian-image-parse",
        "remark-wiki-link",
        "remark-reading-time",
        "remark-gfm",
        "remark-emoji",
        "remark-unwrap-images",
      ]
    },
    highlight: {
      preload: ["sql"],
      theme: {
        // Default theme (same as single string)
        default: "github-light",
        // // Theme used if `html.dark`
        // dark: 'github-dark',
        // // Theme used if `html.light`
        // light: 'min-light',
      },
    },
    watch: {
      ws: {
        port: 4000,
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/rss.xml', '/stats/']
    }
  },
  modules: [
    "@nuxt/content",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    '@nuxt/image-edge',
    "nuxt-icon",
  ],
  // buildModules: [    
  // ],
  // image: {
  //   cloudinary: {
  //     baseURL: 'https://res.cloudinary.com/ejf/image/upload/blog_assets'
  //   }
  // },
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/ejf/image/upload/'
    },
    domains: ['ejfox.com', 'ejfoxcom.netlify.app/'],
    // Use tachyon screen sizes
    // small = 30em
    // medium = 48em
    // large = 64em+
    // we will define the sizes as if the screen width was 1920
    // 30em on a 1920 screen is 480px
    // 48em on a 1920 screen is 768px
    // 64em on a 1920 screen is 1024px
    screens: {
      small: 480,
      medium: 768,
      large: 1920,
      extraLarge: 2560
    }
  },
  css: ["tachyons/css/tachyons.min.css", "~/assets/main.css"],
  pageTransition: {
    name: "page",
    mode: "out-in",
    // mode: 'in-out'
  },
  googleFonts: {
    prefetch: true,
    families: {
      "Signika Negative": [300, 400, 500, 600, 700],
      // "Paytone One": [400],
      "Fjalla One": [400],
      // Finlandica: [400, 500, 700],
    },
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
};


  // unocss: {
  //   // presets
  //   uno: true, // enabled `@unocss/preset-uno`
  //   icons: true, // enabled `@unocss/preset-icons`
  //   attributify: true, // enabled `@unocss/preset-attributify`,
  //   typography: true,

  //   // core options
  //   shortcuts: [],
  //   // rules: [
  //   //   ['dn', { display: 'none' }],
  //   //   ['measure', { 'max-width': '30em' }],
  //   //   ['measure-wide', { 'max-width': '34em' }],
  //   //   ['measure-narrow', { 'max-width': '20em' }],
  //   //   ['lh-solid', { 'line-height': 1 }],
  //   //   ['lh-title', { 'line-height': 1.25 }],
  //   //   ['lh-copy', { 'line-height': 1.5 }],
  //   //   ['list', { 'list-style-type': 'none' }],
  //   //   ['f1', { 'font-size': '3rem' }],
  //   //   ['f2', { 'font-size': '2.25rem' }],
  //   //   ['f3', { 'font-size': '1.5rem' }],
  //   //   ['f4', { 'font-size': '1.25rem' }],
  //   //   ['f5', { 'font-size': '1rem' }],
  //   //   ['f6', { 'font-size': '.875rem' }],
  //   //   ['f7', { 'font-size': '.75rem' }],
  //   //   ['f8', { 'font-size': '.625rem' }],
  //   //   ['f9', { 'font-size': '.5rem' }],
  //   //   ['link', { color: 'inherit', 'text-decoration': 'none' }],
  //   // ],
  // },