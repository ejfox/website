<template>
  <section id="allposts" class="category pa2 pa5-ns db cf tc">
    <h2 class="dark-gray">Photos</h2>
    <ul class="db f2 list">
      <li v-for="post in photo" :key="post.date"
        :class="['tracked lh-title pv3 mr4-ns dib ttu sans-serif br1 no-underline']">
        <nuxt-link :to="post._path" :class="['link dim no-underline dark-gray']">
          <span class="b">
            <!-- {{ post.title }} -->
            <Photo :url="'https'+post.photo" />
          </span>
        </nuxt-link>
        <!-- 
          <span class="f5 light-silver db di-ns ttu o-80 tracked">
          {{ post.date | moment("YYYY-MM") }}
        </span>
        
        <img :src="'https'+post.photo" />
        --> 
      </li>
    </ul>
  </section>
</template>

<script>
import Nav from '~/components/Nav.vue';
import Photo from '~/components/Photo.vue'
export default {
  components: {
    Nav,
    Photo
  },
  methods: {
  },
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context('~/content/photo/', false, /\.json$/);
    let photo = context.keys().map(key => ({
      ...context(key),
      _path: `/photo/${key.replace('.json', '').replace('./', '')}`
    }));


    photo = photo.sort(function(a,b) { return new Date(b.date) - new Date(a.date) })
    return { photo };
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
