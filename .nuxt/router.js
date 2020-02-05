import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _358f3c9e = () => import('../pages/donate.vue' /* webpackChunkName: "pages/donate" */).then(m => m.default || m)
const _3e3b97ab = () => import('../pages/vibes.vue' /* webpackChunkName: "pages/vibes" */).then(m => m.default || m)
const _94f66088 = () => import('../pages/projects.vue' /* webpackChunkName: "pages/projects" */).then(m => m.default || m)
const _5bcfe250 = () => import('../pages/books.vue' /* webpackChunkName: "pages/books" */).then(m => m.default || m)
const _d001727a = () => import('../pages/photos.vue' /* webpackChunkName: "pages/photos" */).then(m => m.default || m)
const _6a135938 = () => import('../pages/shop.vue' /* webpackChunkName: "pages/shop" */).then(m => m.default || m)
const _bc5203f4 = () => import('../pages/sounds.vue' /* webpackChunkName: "pages/sounds" */).then(m => m.default || m)
const _ee50acbc = () => import('../pages/creations.vue' /* webpackChunkName: "pages/creations" */).then(m => m.default || m)
const _7edd8367 = () => import('../pages/blog/index.vue' /* webpackChunkName: "pages/blog/index" */).then(m => m.default || m)
const _7a6d643f = () => import('../pages/audio/_slug.vue' /* webpackChunkName: "pages/audio/_slug" */).then(m => m.default || m)
const _7d26e21f = () => import('../pages/blog/_slug.vue' /* webpackChunkName: "pages/blog/_slug" */).then(m => m.default || m)
const _4b6e78ca = () => import('../pages/photo/_slug.vue' /* webpackChunkName: "pages/photo/_slug" */).then(m => m.default || m)
const _283ac100 = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)



const scrollBehavior = async (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      }

      const findEl = async (hash, x) => {
        return document.querySelector(hash) ||
          new Promise((resolve, reject) => {
            if (x > 50) {
              return resolve()
            }
            setTimeout(() => { resolve(findEl(hash, ++x || 1)) }, 100)
          })
      }

      if (to.hash) {
        let el = await findEl(to.hash)
        if ('scrollBehavior' in document.documentElement.style) {
          return window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
        } else {
          return window.scrollTo(0, el.offsetTop)
        }
      }

      return { x: 0, y: 0 }
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
			path: "/donate",
			component: _358f3c9e,
			name: "donate"
		},
		{
			path: "/vibes",
			component: _3e3b97ab,
			name: "vibes"
		},
		{
			path: "/projects",
			component: _94f66088,
			name: "projects"
		},
		{
			path: "/books",
			component: _5bcfe250,
			name: "books"
		},
		{
			path: "/photos",
			component: _d001727a,
			name: "photos"
		},
		{
			path: "/shop",
			component: _6a135938,
			name: "shop"
		},
		{
			path: "/sounds",
			component: _bc5203f4,
			name: "sounds"
		},
		{
			path: "/creations",
			component: _ee50acbc,
			name: "creations"
		},
		{
			path: "/blog",
			component: _7edd8367,
			name: "blog"
		},
		{
			path: "/audio/:slug?",
			component: _7a6d643f,
			name: "audio-slug"
		},
		{
			path: "/blog/:slug",
			component: _7d26e21f,
			name: "blog-slug"
		},
		{
			path: "/photo/:slug?",
			component: _4b6e78ca,
			name: "photo-slug"
		},
		{
			path: "/",
			component: _283ac100,
			name: "index"
		}
    ],
    
    
    fallback: false
  })
}
