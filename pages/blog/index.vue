<template>
  <section class="pl1 pl4-ns db f3 cf mb4">

    <!-- <section class="category pv5 db cf">
      <h2 class="fl w-third db pr4 lh-title">Everything Else</h2>
      <ul class="fl w-two-thirds db">
        <li v-for="post in posts.filter(d => d.type !== 'photos' && d.type !== 'words')" :key="post.date"
          class="pv2">
          <nuxt-link :to="post._path" :class="['link dim dark-gray']">
            <span class="post-date b f6 db barlowcondensed no-underline">
              <span class="moon-gray">
                {{ post.date | moment("ha") }}
              </span>
              <span class="gray">
                {{ post.date | moment("MMM Do YYYY") }}
              </span>
            </span> {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </section> -->
    <section class="category pv3 db cf">
      <ul class="fl-ns w-two-thirds-l db list">
        <li v-for="post in posts.filter(d => d.type === 'words')" :key="post.date" class="pv2">          
          <nuxt-link :to="post._path" :class="[post.type, 'ttc link underline dim near-black lh-solid']">
            {{ post.title }}
          </nuxt-link>

          <span :class="['post-date tracked b f6 db light-silver no-underline']">{{ post.date | moment("from", "now") }}</span>
        </li>
      </ul>
    </section>

    <!-- <section class="category pv5 db cf">
      <h2 class="fl w-third-l db pr4 lh-title">Photos</h2>
      <ul class="list fl w-two-thirds-l db">
        <li v-for="post in posts.filter(d => d.type === 'photos').slice(0,10)" :key="post.date" class="pv2">
          <span class="post-date tracked b f6 db light-silver barlowcondensed no-underline">{{ post.date | moment("MMMM YYYY") }}</span>
          <nuxt-link :to="post._path" :class="[post.type, 'link underline dim near-black lh-solid']">
             {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </section> -->

    <!-- <section class="category pv5 db cf">
      <h2 class="fl w-third-l db pr4 lh-title">Photos</h2>
      <ul class="list fl w-two-thirds-l db">
        <li v-for="post in photos" :key="post.date" class="pv2">
          <div class="">
            <span :class="['post-date b f6 db light-silver barlowcondensed no-underline']">{{ post.date | moment("MMMM Do YYYY") }} – {{post.files.length}} photos</span>
          </div>

          <nuxt-link 
          :to="`/photo/${post.slug}`"
          class="near-black link underline">
            {{post.title}}
          </nuxt-link>          
        </li>
      </ul>
    </section> -->

    <!-- <section id="allposts" class="category pv4 db cf">
      <h2 class="fl f1 db mr4 lh-title">All posts</h2>
      <ul class="db list">
        <li v-for="post in posts" :key="post.date"
          :class="['tracked lh-title pv3 mr4-ns dib ttu sans-serif br1 no-underline']">
          <nuxt-link :to="post._path" :class="['link dim no-underline dark-gray']">
            <span class="b">
              {{ post.title }}
            </span>
          </nuxt-link>
          <span class="f5 light-silver db di-ns ttu o-80 tracked dn">
            <i :class="['fas', postTypeIcon(post.type)]" />
            {{ post.date | moment("YYYY-MM") }}
          </span>
        </li>
      </ul>
    </section> -->


  <!-- <Footer /> -->

  </section>
</template>

<script>
import Nav from '~/components/Nav.vue';
import Footer from '~/components/Footer.vue';

export default {
  components: {
    Nav,
    Footer
  },
  methods: {
    postTypeIcon: function (postType) {
      // ["words", "code", "video", "audio", "photos"]
      if (postType === 'words') { return 'fa-align-right' }
      if (postType === 'code') { return 'fa-terminal' }
      if (postType === 'video') { return 'fa-video' }
      if (postType === 'audio') { return 'fa-volume-up' }
      if (postType === 'photos') { return 'fa-camera' }
    }
  },
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context('~/content/blog/posts/', false, /\.json$/);

    let posts = context.keys().map(key => ({
      ...context(key),
      _path: `/blog/${key.replace('.json', '').replace('./', '')}`
    }));


    posts = posts.sort(function(a,b) { return new Date(b.date) - new Date(a.date) })
    posts = posts.filter(post => !post.hidden)

    const context2 = require.context('~/content/photos/', false, /\.json$/);

    let photos = context2.keys().map(key => ({
      ...context2(key),
      _path: `/photos/${key.replace('.json', '').replace('./', '')}`
    }))

    return { posts, photos };
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
  /*text-decoration: none;*/
}
</style>
