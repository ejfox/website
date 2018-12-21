var glob = require('glob');
var path = require('path');

// Enhance Nuxt's generate process by gathering all content files from Netifly CMS
// automatically and match it to the path of your Nuxt routes.
// The Nuxt routes are generate by Nuxt automatically based on the pages folder.
var dynamicRoutes = getDynamicPaths({
  '/blog': 'blog/posts/*.json'
});

module.exports = {
  modules: [
    '@nuxtjs/markdownit',
    '@nuxtjs/axios'
  ],
  plugins: [
    '~/plugins/vue-moment.js'
  ],
  markdownit: {
    injected: true,
    typographer: true,
    html: true,
    breaks: true,
  },
  axios: {
    // proxyHeaders: false
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'EJ Fox',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'EJFox.com' },
      { hid: 'keywords', name: 'keywords', content: 'design, data, dataviz, maps, d3, javascript' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#CCCCCC' },
  /*
  ** Route config for pre-rendering
  */
  generate: {
    routes: dynamicRoutes
  },

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'shop',
        path: '/shop',
        component: resolve(__dirname, 'pages/shop.vue')
      })

      routes.push({
        name: 'vibes',
        path: '/vibes',
        component: resolve(__dirname, 'pages/vibes.vue')
      })
    }
  },
  /*
  ** Build configuration
  */
  build: {
    // /*
    // ** Run ESLint on save
    // */
    extend(config, { isDev, isClient }) {
      // if (isDev && isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
      node: {
        fs: 'empty'
      }
    }
  }
}

/**
 * Create an array of URLs from a list of files
 * @param {*} urlFilepathTable
 */
function getDynamicPaths(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      var filepathGlob = urlFilepathTable[url];
      return glob
        .sync(filepathGlob, { cwd: 'content' })
        .map(filepath => `${url}/${path.basename(filepath, '.json')}`);
    })
  );
}
