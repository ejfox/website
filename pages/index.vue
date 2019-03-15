<template>
  <section class="w-80 center db f3 cf mb4">

    <section class="intro pt6 pb4 measure-narrow lh-copy center">
      <p class="pb4">
        Hello, my name is <strong>EJ Fox</strong>. I'm a designer and hacker working at <a href="http://nbcnews.com/specials/">NBC News</a>. You can send me an email at <a href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a>. My work focuses on design, data visualization, and storytelling.
      </p>

      <p>
        <a class="" href="http://portfolio.ejfox.com">Take a look at some of my work</a> or <a href="http://ejfox.com/resume.pdf">my resume</a>
      </p>
    </section>

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

    <section id="allposts" class="category pv5 db cf">
      <!-- <h2 class="fl f1 pl2 db mr4 lh-title">All posts</h2> -->
      <ul class="db f2 list">
        <li v-for="post in posts" :key="post.date"
          :class="['tracked lh-title pv3 mr4-ns dib ttu sans-serif-flyweight br1 no-underline', post.bgcolorclass, post.textcolorclass]">
          <nuxt-link :to="post._path" :class="['link dim no-underline dark-gray', post.textcolorclass]">
            <span class="b">
              {{ post.title }}
            </span>
          </nuxt-link>
          <span class="f5 light-silver db di-ns ttu o-80 tracked">
            <i :class="['fas', postTypeIcon(post.type)]" />
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

    <section class="center db ttu barlowcondensed ma5 f2 tc">
      <a
        :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']"
        href="https://github.com/ejfox">
        GitHub
      </a>

      <a
        :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']"
        href="http://instagram.com/ejfoxphotos">
        Instagram
      </a>

      <nuxt-link to="/bookmarks" :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']">
        recent bookmarks
      </nuxt-link>

      <nuxt-link to="/vibes" :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']">
        vibes &amp; inspiration
      </nuxt-link>

      <a
      :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']"
      href="https://calendly.com/ejfox/hangout/">calendar</a>

    </section>

    <section class="center f2 tc sans-serif ttu gray mv5 lh-copy">
      <p>PGP: <a href="/keybase.txt" class="link underline gray">5D30 A33E 08E3 5B89 15B4  C7E2 E207 8E65 3FE3 89CD</a> </p>
    </section>

    <!-- <section class="tc ma4 o-50">
      <p>
        <a href="https://twitter.com/mrejfox?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-show-count="false">Follow me on Twitter (@mrejfox)</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </p>
    </section> -->


  </section>
</template>

<script>
export default {
  components: {
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

<style>
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
