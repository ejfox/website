<template>
  <div class="slug-container cf">
    <nuxt-link to="/art/" class="pa4 pb1">Back to list of all art</nuxt-link>
    <section id="post-container w-100">
      <!-- Article header -->
      <header class="ph3-ns w-100 mb0 mt4"></header>
      <article :class="['tc center pa1 pa4-ns pt0 mb0']">
        <figure>
          <img :src="url" :alt="caption" />
          <a class="f6 grow no-underline br-pill ph3 pv2 mv2 dib white bg-black tracked sans-serif tl" :href="buyUrl">
            Buy now
          </a>
          <figcaption class="measure" v-html="caption" />
        </figure>
      </article>
    </section>
  </div>
</template>

<script>
import URL from 'url-parse'
import marked from 'marked'
import AudioPlayer2 from '~/components/AudioPlayer2.vue'
import Words from '~/components/blogtypes/words.vue'

export default {
  scrollToTop: true,
  components: {},
  data: function () {
    return {
      emojiIcon: '🎨',
      bodyHtml: null,
    }
  },
  computed: {},
  head() {
    return {
      title: this.emojiIcon + ' ' + this.title + ' | EJ Fox',
      meta: [
        {
          name: 'EJ Fox | ' + this.title,
          description: this.emojiIcon,
          'og:description': this.emojiIcon,
          'og:title': this.title,
          'og:type': 'article',
          'twitter:title': this.title,
          'twitter:creator': 'mrejfox',
          'twitter:description': this.emojiIcon + ' ' + this.emojiIcon,
        },
      ],
    }
  },
  async asyncData({ params }) {
    let post = await import('~/content/art/' + params.slug + '.json')
    return post
  },
  created: function () {},
  activated: function () {},
}
</script>

<style scoped>
figcaption {
  font-size: 1.2em;
  line-height: 1.2em;
  text-align: left;
}
</style>
