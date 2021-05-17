var glob = require('glob')
var path = require('path')
var webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

// Enhance Nuxt's generate process by gathering all content files from Netifly CMS
// automatically and match it to the path of your Nuxt routes.
// The Nuxt routes are generate by Nuxt automatically based on the pages folder.
var dynamicRoutes = getDynamicPaths({
  '/blog': 'blog/posts/*.json',
  '/audio': 'audio/*.json',
  '/photo': 'photos/*.json',
})

module.exports = {
  target: 'static',
  modules: ['@nuxtjs/axios', '@nuxtjs/google-analytics'],
  plugins: ['~/plugins/vue-moment.js'],
  googleAnalytics: {
    id: 'UA-319549-1',
  },
  buildModules: ['@nuxtjs/color-mode'],
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
      {
        hid: 'description',
        name: 'description',
        content: '💻 Hacker-journalist – 📧 ejfox@ejfox.com ',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'design, data, dataviz, maps, d3, javascript, hacking, art, dataviz tools, data journalism, infographics, freelance, freelancer, consultant, dataviz expert',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#6f6f6f' },
  /*
   ** Route config for pre-rendering
   */
  generate: {
    routes: dynamicRoutes,
  },
  router: {},
  /*
   ** Build configuration
   */
  build: {
    hardSource: true,
    cache: true,
    parallel: true,
    cssSourceMap: false,
    devMiddleware: {
      headers: {
        'Cache-Control': 'no-store',
        Vary: '*',
      },
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: false,
        openAnalyzer: false,
        logLevel: 'info',
      }),
    ],
    //analyze: true,
    extend(config, { isDev, isClient }) {
      node: {
        fs: 'empty'
      }
    },
  },
}

/**
 * Create an array of URLs from a list of files
 * @param {*} urlFilepathTable
 */
function getDynamicPaths(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map((url) => {
      var filepathGlob = urlFilepathTable[url]
      return glob
        .sync(filepathGlob, { cwd: 'content' })
        .map((filepath) => `${url}/${path.basename(filepath, '.json')}`)
    }),
  )
}
