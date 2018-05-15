<template>
  <section class="w-80 center db f3 cf">

    <section class="pt6 pb4 measure-narrow lh-copy center">
      Hello, my name is <strong>EJ Fox</strong>. I'm a designer at <a href="http://nbcnews.com/specials/">NBC News</a>. You can send me an email at <a href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a>. I specialize in design, data visualization, and storytelling.
      <p>
        <a href="http://portfolio.ejfox.com">Take a look at some of my work.</a>
      </p>
    </section>

    <section class="category pv5 db cf">
      <h2 class="fl w-third-ns db pr4 lh-title">Photos</h2>
      <ul class="fl w-two-thirds db">
        <li v-for="post in posts.filter(d => d.type === 'photos').slice(0,3)" :key="post.date" class="pv2">
          <span class="post-date tracked b f6 db light-silver barlowcondensed no-underline">{{ post.date | moment("MMMM YYYY") }}</span>
          <nuxt-link :to="post._path" :class="[post.type, 'link dim near-black']">
             {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </section>

    <section class="category pv5 db cf">
      <h2 class="fl w-third-ns db pr4 lh-title">Words</h2>
      <ul class="fl w-two-thirds db">
        <li v-for="post in posts.filter(d => d.type === 'words').slice(0,3)" :key="post.date" class="pv2">
          <span class="post-date tracked b f6 db light-silver barlowcondensed no-underline">{{ post.date | moment("MMMM YYYY") }}</span>
          <nuxt-link :to="post._path" :class="[post.type, 'link dim near-black']">
            {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
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

    <section class="category pv5 db cf">
      <h2 class="fl db pr4 pb4 lh-title">Everything</h2>
      <ul class="db f4">
        <li v-for="post in posts" :key="post.date"
          class="pr3 pb2 dib barlowcondensed">
          <span class="f7 tracked light-silver">
            {{ post.date | moment("YYYY-MM") }}
          </span>
          <nuxt-link :to="post._path" :class="['link dim dark-gray']">
            <span class="b">
              {{ post.title }}
            </span>

          </nuxt-link>
        </li>
      </ul>
    </section>


  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue';

export default {
  components: {
    AppLogo
  },
  data() {
    // Using webpacks context to gather all files from a folder
    const context = require.context('~/content/blog/posts/', false, /\.json$/);

    let posts = context.keys().map(key => ({
      ...context(key),
      _path: `/blog/${key.replace('.json', '').replace('./', '')}`
    }));


    posts = posts.sort(function(a,b) { return new Date(b.date) - new Date(a.date) })
    return { posts };
  }
};
</script>

<style>
ul { padding: 0;}
li {
  list-style-type: none;
}
</style>
