export default {
  // ssr: false, // for netlify deploy
  modules: [
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@nuxt/content',
    // "nuxt-icon",
    '@nuxtjs/google-fonts',
    // '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],
  ui: {
    icons: 'all',
  },
  useRuntimeConfig: {
    public: {
      DEV: process.env.NODE_ENV !== 'production',
    },
  },
  content: {
    documentDriven: true,
    markdown: {
      remarkPlugins: [
        'remark-wiki-link',
        'remark-reading-time',
        'remark-gfm',
        'remark-emoji',
        'remark-unwrap-images',
        'remark-wiki-link',
        'remark-external-links',
      ],
    },
    // highlight: {
    //   preload: ['sql'],
    //   theme: {
    //     default: 'github-light',
    //     dark: 'github-dark',
    //   },
    // },
  },
  // image: {
  //   provider: 'cloudinary',
  //   cloudinary: {
  //     baseURL: 'https://res.cloudinary.com/ejf/image/upload/',
  //   },
  //   domains: ['ejfox.com', 'ejfoxcom.netlify.app/'],
  //   screens: {
  //     small: 480,
  //     medium: 768,
  //     large: 1920,
  //     extraLarge: 2560,
  //   },
  // },
  googleFonts: {
    prefetch: true,
    families: {
      'Signika Negative': [200, 300, 400, 500, 600, 700, 800],
      // "Paytone One": [400],
      'Fjalla One': [400],
      // Finlandica: [400, 500, 700],
      'Red Hat Mono': [400],
    },
  },
  // nitro: {
  //   prerender: {
  //     crawlLinks: true,
  //     failOnError: false,
  //   },
  // },
  app: {
    head: {
      script: [],
      bodyAttrs: {
        class: '',
      },
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-16',
      title: 'EJ Fox',
      meta: [
        {
          name: 'description',
          content:
            'EJ Fox: Hacker, Journalist, & Dataviz Specialist finding interesting ways to look at the world by exploring and explaining data ',
        },

        // opengraph tags
        { property: 'og:title', content: 'EJ Fox' },
        {
          property: 'og:description',
          content:
            'EJ Fox: Hacker, Journalist, & Dataviz Specialist finding interesting ways to look at the world by exploring and explaining data ',
        },
        { property: 'og:image', content: 'https://ejfox.com/og-image.png' },
        { property: 'og:url', content: 'https://ejfox.com' },
        { property: 'og:type', content: 'website' },

        // twitter opengraph tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@mrejfox' },
        { name: 'twitter:creator', content: '@mrejfox' },
        { name: 'twitter:title', content: 'EJ Fox' },
        {
          name: 'twitter:description',
          content:
            'EJ Fox: Hacker, Journalist, & Dataviz Specialist finding interesting ways to look at the world by exploring and explaining data ',
        },
        { name: 'twitter:image', content: 'https://ejfox.com/og-image.png' },
      ],
    },
  },
}
