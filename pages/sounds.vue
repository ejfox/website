<template>
  <section id="allposts" class="category pa2 pa5-ns db cf tc">
    <h2 class="dark-gray">Sounds</h2>
    <ul class="db f2 list">
      <li v-for="post in audio" :key="post.date"
        :class="['tracked lh-title pv3 mr4-ns dib ttu sans-serif br1 no-underline']">
        <nuxt-link :to="post._path" :class="['link dim no-underline dark-gray']">
          <span class="b">
            {{ post.title }}
          </span>
        </nuxt-link>
        <span class="f5 light-silver db di-ns ttu o-80 tracked">
          {{ post.date | moment("YYYY-MM") }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import Nav from '~/components/Nav.vue';

export default {
  components: {
    Nav
  },
  methods: {
  },
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context('~/content/audio/', false, /\.json$/);

    let audio = context.keys().map(key => ({
      ...context(key),
      _path: `/audio/${key.replace('.json', '').replace('./', '')}`
    }));


    audio = audio.sort(function(a,b) { return new Date(b.date) - new Date(a.date) })
    audio = audio.filter(post => !post.hidden)
    return { audio };
  }
};
</script>

<style scoped>
ul { padding: 0;}
/* li { list-style-type: none } */

.intro a:link, .intro a:hover {
  color: black;
  text-decoration: underline;
}

.intro a:visited, .intro a:focus {
  color: #414346;
  text-decoration: none;
}
</style>
