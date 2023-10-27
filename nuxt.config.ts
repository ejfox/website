export default {
  modules: [
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxtjs/google-fonts', // "nuxt-icon",
    '@vueuse/nuxt',
    '@nuxt/image',
  ],
  ui: {
    icons: 'all'
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
      ],
    },
    highlight: {
      preload: ['sql'],
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/rss.xml', '/stats/'],
    },
  },
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/ejf/image/upload/',
    },
    domains: ['ejfox.com', 'ejfoxcom.netlify.app/'],
    screens: {
      small: 480,
      medium: 768,
      large: 1920,
      extraLarge: 2560,
    },
  },
  googleFonts: {
    prefetch: true,
    families: {
      'Signika Negative': [300, 400, 500, 600, 700],
      // "Paytone One": [400],
      'Fjalla One': [400],
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
}