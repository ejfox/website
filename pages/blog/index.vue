<template>
  <section class="pl1 pl4-ns db f3 cf mb4">
    <section class="category pv3 db cf">
      <ul class="fl-ns w-two-thirds-l db list">
        <li
          v-for="(post, i) in posts.filter((d) => d.type === 'words')"
          :key="post._path"
          class="pv3"
        >
          <nuxt-link
            :to="post._path"
            :class="[post.type, 'ttc link underline dim near-black lh-solid']"
          >
            {{ post.title }}
          </nuxt-link>

          <div class="f6 w-two-thirds light-silver lh-copy pv2 mv0">
            <span>{{post.dek}}</span>
          </div>

          <span :class="['post-date tracked f6 db light-silver no-underline pb2 mv0']"
            ><strong>{{ post.date | moment('from', 'now') }}</strong> /
            <span class="ttu">{{ post.date | moment('Y.MM') }}</span>          
          </span>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
import Nav from '~/components/Nav.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Nav,
    Footer,
  },
  methods: {
    postTypeIcon: function (postType) {
      // ["words", "code", "video", "audio", "photos"]
      if (postType === 'words') {
        return 'fa-align-right'
      }
      if (postType === 'code') {
        return 'fa-terminal'
      }
      if (postType === 'video') {
        return 'fa-video'
      }
      if (postType === 'audio') {
        return 'fa-volume-up'
      }
      if (postType === 'photos') {
        return 'fa-camera'
      }
    },
  },
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context('~/content/blog/posts/', false, /\.json$/)

    let posts = context.keys().map((key) => ({
      ...context(key),
      _path: `/blog/${key.replace('.json', '').replace('./', '')}`,
    }))

    posts = posts.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })
    posts = posts.filter((post) => !post.hidden)

    const context2 = require.context('~/content/photos/', false, /\.json$/)

    let photos = context2.keys().map((key) => ({
      ...context2(key),
      _path: `/photos/${key.replace('.json', '').replace('./', '')}`,
    }))

    return { posts, photos }
  },
}
</script>

<style scoped>
ul {
  padding: 0;
}
/* li { list-style-type: none } */

a:visited {
  color: #999 !important;
}
</style>
