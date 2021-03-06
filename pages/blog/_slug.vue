<template>
  <div class="slug-container cf">
    <article id="post-container w-100 mt2">
      <!-- Article header -->
      <header class="mt2 ph3-ns w-100">
        <div class="ph2 ph3-ns">
          <h1
            :class="[
              'f1 f-subheadline-ns sans-serif-flyweight lh-solid mv0 mv1-ns',
              type === 'photos' || type === 'audio' ? 'tc' : '',
            ]"
          >
            {{ title }}
          </h1>
        </div>

        <div v-if="dek">
          <div class="mv3 i pa1 pa3-ns tc tl-ns w-100 db">{{ dek }}</div>
        </div>

        <div
          v-if="inprogress === true"
          class="bg-dark-gray white pa4 mv2 br2 f6"
        >
          <h3 class="ma0 pa2 pv3 ba br2 tc">This post is in progress</h3>
          <p class="pt3">
            I would really appreciate your feedback for things I could improve.
          </p>
          <p class="pt3">Get in touch via email or Twitter...</p>

          <h4 class="link">
            <a class="white link lh-title" href="mailto:ejfox@ejfox.com"
              >ejfox@ejfox.com</a
            >
            <br />
            or
            <a class="white link lh-title" href="http://twitter.com/mrejfox"
              >@mrejfox</a
            >
          </h4>
        </div>
      </header>
      <!-- Non-audio blog post types -->
      <section
        v-if="type !== 'audio'"
        :class="['w-100  not-audio mb0 pa1 pa3-ns', type]"
      >
        <div id="body" :class="[type !== 'photos' ? '' : 'ph7-1 f3-ns mr3-l']">
          <Words v-if="body" :bodyMarkdown="body" />
        </div>
      </section>

      <!-- Audio post types -->
      <section v-if="type === 'audio'" :class="['tc center pa1 pa4-ns mb0']">
        <div v-if="audio" class="w-100">
          <AudioPlayer2 :sources="[audio]" :loop="false" :bg="'bg-gray'" />
        </div>
        <div id="body" :class="['tl pt4-ns center f3-ns']">
          <Words v-if="body" :bodyMarkdown="body" />
        </div>
      </section>

      <!-- Timestamp -->
      <time :class="['f3 w-100 sans-serif mb2 pl0 pb0 db ttu tracked o-50']">
        <small class="mv3 pa3-ns tc tl-ns w-100 db">
          {{ date | moment('MMMM Do, YYYY') }}
          <span class="ml3 gray" v-if="isToday(date)">
            {{ date | moment('from', 'now') }}
          </span>
        </small>
      </time>
    </article>

    <nuxt-link class="link underline pa3" to="/blog"
      >Want to see what else I've written?</nuxt-link
    >
  </div>
</template>

<script>
// import AudioPlayer2 from "~/components/AudioPlayer2.vue";
// import Words from "~/components/blogtypes/words.vue";
// import Nav from "~/components/Nav.vue";
const AudioPlayer2 = () => import('~/components/AudioPlayer2.vue')
const Words = () => import('~/components/blogtypes/words.vue')
const Nav = () => import('~/components/Nav.vue')
// import marked from 'marked'
import truncate from 'truncate'
import moment from 'moment'

export default {
  scrollToTop: true,
  components: {
    AudioPlayer2,
    Words,
    Nav,
  },
  data: function () {
    return {
      emojiIcon: '📓',
    }
  },
  computed: {},
  head() {
    return {
      title: this.title + ' ' + this.emojiIcon + ' EJ Fox',
      meta: [
        { property: 'name', content: this.title },
        { property: 'description', content: this.shortDescription },
        { property: 'og:description', content: this.shortDescription },
        { property: 'og:title', content: this.title },
        { property: 'og:type', content: 'article' },
        { property: 'twitter:title', content: this.title },
        { property: 'twitter:creator', content: 'mrejfox' },
        {
          property: 'twitter:description',
          content: this.emojiIcon + ' ' + this.shortDescription,
        },
      ],
    }
  },
  async asyncData({ params }) {
    let post = await import('~/content/blog/posts/' + params.slug + '.json')
    if (!post.body && post.bodyContent) {
      post.body = post.bodyContent
    }
    if (!post.audio) {
      post.audio = null
    }
    if (!post.dek) {
      post.dek = null
    }

    // let toc = marked.lexer(post.body)
    // // console.log(post.body, toc)
    // toc = _.filter(toc, (t) => {
    //   return t.type === 'heading' && t.depth < 3
    // })
    // toc.map(t => {
    //   t.slug = '#'+slug(t.text, {lower: true, symbols: false})
    //   return t
    // })
    // post.toc = toc

    if (!post.dek) {
      let noHtmlBody = post.body
      noHtmlBody = noHtmlBody.replace(/<(?:.|\n)*?>/gm, '')
      post.shortDescription = truncate(noHtmlBody, 120)
    } else {
      post.shortDescription = post.dek
    }
    return post
  },
  created: function () {
    this.setEmojiIcon()
  },
  activated: function () {},
  methods: {
    setEmojiIcon() {
      if (this.type === 'photos') {
        this.emojiIcon = '📷'
      } else if (this.type === 'code') {
        this.emojiIcon = '💻'
      } else if (this.type === 'audio') {
        this.emojiIcon = '🎵'
      }
    },
    isToday(date) {
      const today = moment()
      // 2020-02-14T21:19:39-04:00
      date = moment(date)
      return (
        date.date() == today.date() &&
        date.month() == today.month() &&
        date.year() == today.year()
      )
    },
  },
}
</script>

<style scoped lang="scss">
@media screen and (min-width: 640px) {
  .f-headline {
    margin-top: 0.12em;
    font-size: 5.4rem;
    line-height: 0.92em;
  }
}

li list-style-type circle article.photos h1 {
  text-align: center;
}

article.photos img {
  margin: 3rem 0;
}

article.photos img:first-child {
  margin-top: 0;
}

.article-pop {
  border-radius: 4px;
  border-top: 1px solid rgba(250, 250, 250, 0.1);
  border-bottom: 1px solid rgba(25, 25, 25, 0.1);
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.15);
}

/* article.photos p {
  max-width: 32rem;
} */

img {
  max-width: 100%;
}

blockquote cite {
  font-family: 'Knockout 66 A', 'Knockout 66 B' !important;
}

pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100vw;
  overflow: auto;
}

code {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.embed-container {
  margin-bottom: 2rem;
  margin-top: 2rem;
}

ol, ul {
  line-height: 1.1em;
  margin-top: 1em;
  margin-bottom: 1em;
}

</style>
