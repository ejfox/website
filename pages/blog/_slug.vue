<template>
<div class="slug-container cf">
  <article id="post-container w-100 fl">
    <!-- Article header -->
    <header class="ph3-ns w-100">
      <div class="ph2 ph3-ns">
        <h1 :class="['f-headline sans-serif-flyweight lh-solid mv0 mv1-ns', (type === 'photos') || (type === 'audio') ? 'tc' : '']">
          {{ title }}
        </h1>
      </div>

      <div v-if="dek">
        <div class="mv3 i pa3-ns tc tl-ns w-100 db">{{dek}}</div>
      </div>

      <div v-if="inprogress === true"
        class="bg-dark-gray white pa4 mv2 tc">
          <h2 class="ma0 pa2 ba br2 w-two-thirds-l center">This post is in progress</h2>
          <p class="pt3">I would really appreciate your feedback!</p>
          <p class="pa3">Get in touch...</p>
          <h3 class="tracked"><a class="white" href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a> or <a class="white" href="http://twitter.com/mrejfox">@mrejfox</a> </h3>
      </div>

      <!-- Timestamp -->
      <time v-if="!hidetimestamp"
        :class="['f3 w-100 sans-serif mb2 pl0 pb0 db ttu tracked o-50']">
        <small class="mv3 pa3-ns tc tl-ns w-100 db">{{ date | moment("MMMM Do, YYYY") }}</small>
      </time>
    </header>
    <!-- Non-audio blog post types -->
    <section
    v-if="type !== 'audio'"
    :class="['w-100  not-audio mb0 pa1 pa3-ns',
              bgcolorclass,
              textcolorclass,
              type]">

      <div id="body" :class="[type !== 'photos' ? '' : 'ph7-1 f3-ns mr3-l']">
        <!-- <ol
          v-if="toc.length > 1"
          class="f6 list ma2 mh3-l fl-l pv3 ph1 ba-ns b--gray mw5 o-60">
          <li class="ph1 ph3-ns mv2 lh-solid b"
            v-for="(t, i) in toc">

            <span class="gray mr1 sans-serif">
              {{i+1}}
            </span>
            <a
              class="link black underline"
              :href="t.slug">{{t.text}}</a>
          </li>
        </ol> -->

        <Words v-if="body" :bodyMarkdown="body" />
      </div>
    </section>

    <!-- Audio post types -->
    <section
      v-if="type === 'audio'"
      :class="['tc center pa1 pa4-ns mb0']">
      <div v-if="audio" class="w-100">
        <AudioPlayer
          :sources="[audio]"
          :loop="false"
          :bg="'bg-gray'"/>
      </div>
      <div id="body" :class="['tl pt4-ns center f3-ns']">
        <Words v-if="body" :bodyMarkdown="body" />
      </div>
    </section>
  </article>
</div>
</template>

<script>
import AudioPlayer from '~/components/AudioPlayer.vue';
import Words from '~/components/blogtypes/words.vue'
import Nav from '~/components/Nav.vue';
import URL from 'url-parse'
// import _ from 'lodash'
import marked from 'marked'
import truncate from 'truncate'
import cheerio from 'cheerio'

export default {
  scrollToTop: true,
  components: {
    AudioPlayer,
    Words,
    Nav
  },
  data: function () {
    return {
      emojiIcon: '📓'
    }
  },
  computed: {
  },
  head () {
    return {
      title: this.emojiIcon + ' ' + this.title + ' | EJ Fox',
      meta: [
        { property: 'name', content: this.title },
        { property: 'description', content: this.shortDescription },
        { property: 'og:description', content: this.shortDescription },
        { property: 'og:title', content: 'EJ Fox | ' + this.title },
        { property: 'og:type', content: 'article' },
        { property: 'twitter:title', content: 'EJ Fox | ' + this.title },
        { property: 'twitter:creator', content: 'mrejfox' },
        { property: 'twitter:description', content: this.emojiIcon + ' ' + this.shortDescription }
      ]
    }
  },
  async asyncData({ params }) {
    let post = await import('~/content/blog/posts/' + params.slug + '.json');
    if(!post.body && post.bodyContent) { post.body = post.bodyContent }
    if(!post.bgcolorclass) { post.bgcolorclass = ''}
    if(!post.textcolorclass) { post.textcolorclass = '' }
    if(!post.audio) { post.audio = null }
    if(!post.inprogress) { post.inprogress = null }
    if(!post.dek) { post.dek = null }

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

    if(!post.dek) {
      let noHtmlBody = post.body
      noHtmlBody = noHtmlBody.replace(/<(?:.|\n)*?>/gm, '')
      post.shortDescription = truncate(noHtmlBody, 120)
    } else {
      post.shortDescription = post.dek
    }
    return post;
  },
  created: function () {
    this.setEmojiIcon()
  },
  activated: function () {
  },
  methods: {
    setEmojiIcon () {
      if (this.type === 'photos') {
        this.emojiIcon = '📷'
      } else if (this.type === 'code') {
        this.emojiIcon = '💻'
      } else if (this.type === 'audio') {
        this.emojiIcon = '🎵'
      }
    }
  },
};
</script>

<style scoped>
@media screen and (max-width: 640px) {
  h1, h2, h3, h4, h5 {
    word-wrap: break-word;
    hyphens: auto;
  }
}

@media screen and (min-width: 640px) {
  .f-headline {
    font-size: 10rem;
  }
}

article li
  list-style-type circle

article.photos h1 {
  text-align: center;
}

article.photos img {
  margin: 3rem 0
}

article.photos img:first-child {
  margin-top: 0;
}

.article-pop {
  border-radius: 4px;
  border-top: 1px solid rgba(250,250,250,0.1);
  border-bottom: 1px solid rgba(25,25,25,0.1);
  box-shadow: 2px 2px 12px 0px rgba( 0, 0, 0, 0.15 );
}

/* article.photos p {
  max-width: 32rem;
} */

img {
  max-width: 100%;
}

blockquote cite {
  font-family: "Knockout 66 A", "Knockout 66 B" !important;
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
</style>
