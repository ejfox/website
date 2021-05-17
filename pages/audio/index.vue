<template>
  <section id="allposts" class="category pa3 pa4-ns db cf pt0">
    <h2 class="dark-gray mt0 mb3 mb4-ns">Sounds</h2>
    <ul class="db f2 list">
      <li
        v-for="post in audio"
        :key="post.date"
        :class="[
          'pv3 pr2 db dib-l w-100 w-50-l ttu sans-serif br1 lh-title v-top',
        ]"
      >
        <nuxt-link
          :to="post._path"
          :class="['link dim no-underline dark-gray']"
        >
          <span class="b">
            {{ post.title }}
          </span>
        </nuxt-link>
        <span class="f6 light-silver db ttu no-underline o-80 tracked">
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
    const context = require.context('~/content/audio/', false, /\.json$/)

    let audio = context.keys().map((key) => ({
      ...context(key),
      _path: `/audio/${key.replace('.json', '').replace('./', '')}`,
    }))

    audio = audio.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
    audio = audio.filter((post) => !post.hidden)
    return { audio }
  },
}
</script>

<style scoped>
ul {
  padding: 0;
}
/* li { list-style-type: none } */

.intro a:link,
.intro a:hover {
  color: black;
  text-decoration: underline;
}

.intro a:visited,
.intro a:focus {
  color: #414346;
  text-decoration: none;
}
</style>
