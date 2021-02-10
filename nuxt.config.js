var glob = require("glob");
var path = require("path");
var webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

// var marked = require('marked')
// import marked from 'marked'
// Build markdown parser
// const markdownRenderer = marked.setOptions({
//   renderer: new marked.Renderer(),
//   pedantic: false,
//   gfm: true,
//   tables: false,
//   breaks: false,
//   sanitize: false,
//   smartLists: false,
//   smartypants: true,
//   xhtml: false
// })

// Enhance Nuxt's generate process by gathering all content files from Netifly CMS
// automatically and match it to the path of your Nuxt routes.
// The Nuxt routes are generate by Nuxt automatically based on the pages folder.
var dynamicRoutes = getDynamicPaths({
  "/blog": "blog/posts/*.json",
  "/audio": "audio/*.json",
  "/photo": "photos/*.json",
});

function createFeed(feed) {
  feed.options = {
    title: "EJ Fox: Writing",
    link: "https://ejfox.com/writing.xml",
    description: "All writing posted on EJFox.com",
  };
  const context = require.context("~/content/blog/posts/", false, /\.json$/);

  let posts = context.keys().map((key) => ({
    ...context(key),
    _path: `/blog/${key.replace(".json", "").replace("./", "")}`,
  }));

  posts = posts.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  posts = posts.filter((post) => !post.hidden);
  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      description: post.dek,
      link: `https://ejfox.com/blog/${post.base.split(".")[0]}`,
      id: post.sourceBase,
      content: post.bodyContent,
    });
  });

  feed.addContributor({
    name: "EJ Fox",
    email: "ejfox@ejfox.com",
    link: "https://ejfox.com",
  });
  return feed;
}

module.exports = {
  modules: ["@nuxtjs/axios", 
    "@nuxtjs/google-analytics", 
    "@nuxtjs/feed"
  ],
  feed: [
    {
      path: '/writing.xml',
      createFeed,
      cacheTime: 1000 * 60 * 15,
      type: 'rss2'
    }
  ],
  plugins: ["~/plugins/vue-moment.js"],
  googleAnalytics: {
    id: "UA-319549-1",
  },
  axios: {
    // proxyHeaders: false
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "EJ Fox",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "💻 Hacker-journalist – 📧 ejfox@ejfox.com ",
      },
      {
        hid: "keywords",
        name: "keywords",
        content:
          "design, data, dataviz, maps, d3, javascript, hacking, art, dataviz tools, data journalism, infographics, freelance, freelancer, consultant, dataviz expert",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#6f6f6f" },
  /*
   ** Route config for pre-rendering
   */
  generate: {
    routes: dynamicRoutes,
  },
  router: {
    scrollBehavior: async (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }

      const findEl = async (hash, x) => {
        return (
          document.querySelector(hash) ||
          new Promise((resolve, reject) => {
            if (x > 50) {
              return resolve();
            }
            setTimeout(() => {
              resolve(findEl(hash, ++x || 1));
            }, 100);
          })
        );
      };

      if (to.hash) {
        let el = await findEl(to.hash);
        if ("scrollBehavior" in document.documentElement.style) {
          return window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        } else {
          return window.scrollTo(0, el.offsetTop);
        }
      }

      return { x: 0, y: 0 };
    },
    // Add a custom route (everything in /pages/ is automatically added)
    // extendRoutes (routes, resolve) {
    //   routes.push({
    //     name: 'shop',
    //     path: '/shop',
    //     component: resolve(__dirname, 'pages/shop.vue')
    //   })
    //
  },
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
        "Cache-Control": "no-store",
        Vary: "*",
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
        analyzerMode: "static",
        generateStatsFile: false,
        openAnalyzer: false,
        logLevel: "info",
      }),
    ],
    //analyze: true,
    extend(config, { isDev, isClient }) {
      node: {
        fs: "empty";
      }
    },
  },
};

/**
 * Create an array of URLs from a list of files
 * @param {*} urlFilepathTable
 */
function getDynamicPaths(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map((url) => {
      var filepathGlob = urlFilepathTable[url];
      return glob
        .sync(filepathGlob, { cwd: "content" })
        .map((filepath) => `${url}/${path.basename(filepath, ".json")}`);
    })
  );
}
