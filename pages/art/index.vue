<template>
  <section id="allposts" class="category pa3 pa4-ns db cf pt0">
    <h2 class="dark-gray mt0 mb3 mb4-ns">Art</h2>
    <ul class="db f2 list">
      <li
        v-for="post in art"
        :key="post.date"
        :class="['pt3 pr2 db dib-l w-100 w-50-l br1 v-top']"
      >
        <nuxt-link
          :to="post._path"
          :class="['link dim no-underline dark-gray']"
        >
          <figure class="pa2 pa3-ns mb2 br1 bg-near-black">
            <img :src="post.url" class="br2" />

            <figcaption v-if="post.buyUrl !== ''">
              <a
                class="
                  f7
                  grow
                  no-underline
                  br-pill
                  ph3
                  pv2
                  mt3
                  dib
                  white
                  bg-black
                  tracked
                  sans-serif
                  tl
                  ttu
                "
                :href="post.buyUrl"
              >
                Buy now
              </a>
            </figcaption>
          </figure>
        </nuxt-link>
        <span
          class="f6 light-silver db ttu no-underline o-80 tracked sans-serif"
        >
          {{ post.date | moment('MMMM Do YYYY') }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import Nav from '~/components/Nav.vue'

export default {
  components: {
    Nav,
  },
  methods: {},
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context('~/content/art/', false, /\.json$/)

    let art = context.keys().map((key) => ({
      ...context(key),
      _path: `/art/${key.replace('.json', '').replace('./', '')}`,
    }))

    art = art.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
    return { art }
  },
}
</script>

<style scoped>
ul {
  padding: 0;
}
</style>
