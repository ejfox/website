<template>
  <section class="pa3 pa4-ns db cf mb4">
    <section class="intro pt2 measure-narrow lh-copy">
      <p class="pv2">
      Hello, my name is <strong>EJ Fox</strong>. I'm a hacker and journalist available for contract work. You can send me an email at <a href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a><small class="ml2 f6 gray">(<a href="#pgp">PGP</a>)</small>. My work focuses on data visualization, systems, and politics.
      </p>

      <p>
        <nuxt-link to="/projects">
          Take a look at some of my work
        </nuxt-link>
         or <a href="/resume.pdf">my resume</a>.
      </p>
      <p class="lh-copy pv3 mt3 mt4-ns">
       <h3 class="mv2">About this site</h3>
       <nuxt-link to="/vibes">Vibes</nuxt-link> is a feed of recent snapshots and inspiration powered by my <a href="https://www.are.na/ej-fox/index">are.na channel</a>. I post things I've made on <nuxt-link to="/creations">creations</nuxt-link>. I export my <a href="https://www.goodreads.com/user/show/9273959-ej-fox">goodreads profile</a> to create my <nuxt-link to="/books">books page</nuxt-link>.
      </p>
    </section>

   <section id="allposts" class="category pv4 db cf f4">
     <h3 class="mv1 mv2-ns dark-gray">Posts</h3>
      <ul class="db list">
        <li v-for="post in posts" :key="post.date"
          :class="['tracked lh-title pv3 mr3 mr4-ns dib ttu sans-serif br1 no-underline']">
          <nuxt-link :to="post._path" :class="['link dim no-underline dark-gray']">
            <span class="b">
              {{ post.title }}
            </span>
          </nuxt-link>
          <span class="light-silver db di-ns ttu o-80 f6">
            <!-- <i :class="['fas', postTypeIcon(post.type)]" /> -->
            {{ post.date | moment("YYYY-MM") }}
            <!-- {{ post.type }} -->
          </span>
        </li>
      </ul>
    </section>

    <!-- <section class="category pv5 db cf">
      <h2 class="fl w-third-ns db pr4 lh-title">Words</h2>
      <ul class="fl w-two-thirds-ns db list">
        <li v-for="post in posts.filter(d => d.type === 'words').slice(0,3)" :key="post.date" class="pv2">
          <span :class="['post-date tracked b f6 db light-silver barlowcondensed no-underline']">{{ post.date | moment("MMMM YYYY") }}</span>
          <nuxt-link :to="post._path" :class="[post.type, 'link underline dim near-black lh-solid']">
            {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </section>

    <section class="category pv5 db cf">
      <h2 class="fl w-third-ns db pr4 lh-title">Photos</h2>
      <ul class="list fl w-two-thirds-ns db">
        <li v-for="post in posts.filter(d => d.type === 'photos').slice(0,3)" :key="post.date" class="pv2">
          <span class="post-date tracked b f6 db light-silver barlowcondensed no-underline">{{ post.date | moment("MMMM YYYY") }}</span>
          <nuxt-link :to="post._path" :class="[post.type, 'link underline dim near-black lh-solid']">
             {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </section> -->

    <Footer />

    <!-- <section class="tc ma4 o-50">
      <p>
        <a href="https://twitter.com/mrejfox?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-show-count="false">Follow me on Twitter (@mrejfox)</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </p>
    </section> -->


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
    return { posts };
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
