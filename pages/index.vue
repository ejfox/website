<template>
  <section class="w-80 center db border-black f3">

    <section class="category pv5 db cf">
      <h2 class="fl w-third db pr4 lh-title">Photos</h2>
      <ul class="fl w-two-thirds db">
        <li v-for="post in posts.filter(d => d.type === 'photos').slice(0,3)" :key="post.date" class="pv2">
          <nuxt-link :to="post._path" :class="[post.type, 'link dim near-black']">
            <span class="post-date b f6 db gray barlowcondensed no-underline">{{ post.date | moment("MMMM YYYY") }}</span> {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </section>

    <section class="category pv5 db cf">
      <h2 class="fl w-third db pr4 lh-title">Words</h2>
      <ul class="fl w-two-thirds db">
        <li v-for="post in posts.filter(d => d.type === 'words').slice(0,3)" :key="post.date" class="pv2">
          <nuxt-link :to="post._path" :class="[post.type, 'link dim near-black']">
            <span class="post-date b f6 db gray barlowcondensed no-underline">{{ post.date | moment("MMMM YYYY") }}</span> {{ post.title }}
          </nuxt-link>
        </li>
      </ul>
    </section>

    <section class="category pv5 db cf">
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

    const posts = context.keys().map(key => ({
      ...context(key),
      _path: `/blog/${key.replace('.json', '').replace('./', '')}`
    }));

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
