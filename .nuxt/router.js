import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _3e3b97ab = () => import('../pages/vibes.vue' /* webpackChunkName: "pages/vibes" */).then(m => m.default || m)
const _28df9114 = () => import('../pages/portfolio.vue' /* webpackChunkName: "pages/portfolio" */).then(m => m.default || m)
const _2bb8d1ab = () => import('../pages/bookmarks.vue' /* webpackChunkName: "pages/bookmarks" */).then(m => m.default || m)
const _6a135938 = () => import('../pages/shop.vue' /* webpackChunkName: "pages/shop" */).then(m => m.default || m)
const _7d26e21f = () => import('../pages/blog/_slug.vue' /* webpackChunkName: "pages/blog/_slug" */).then(m => m.default || m)
const _283ac100 = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)



if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/vibes",
			component: _3e3b97ab,
			name: "vibes"
		},
		{
			path: "/portfolio",
			component: _28df9114,
			name: "portfolio"
		},
		{
			path: "/bookmarks",
			component: _2bb8d1ab,
			name: "bookmarks"
		},
		{
			path: "/shop",
			component: _6a135938,
			name: "shop"
		},
		{
			path: "/blog/:slug?",
			component: _7d26e21f,
			name: "blog-slug"
		},
		{
			path: "/",
			component: _283ac100,
			name: "index"
		},
		{
			path: "/shop",
			component: _6a135938,
			name: "shop"
		},
		{
			path: "/vibes",
			component: _3e3b97ab,
			name: "vibes"
		}
    ],
    
    
    fallback: false
  })
}
