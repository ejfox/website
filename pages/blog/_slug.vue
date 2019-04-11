<template>
<div class="slug-container cf">
  <section id="post-container w-100 w-two-thirds-ns fl">
    <div v-if="inprogress === true"
      class="bg-dark-gray pa4 mv2 tc">
        <h2 class="ma0 pa2 ba br2">This post is in progress</h2>
        <p class="pt3">I would really appreciate your feedback!</p>
        <p class="pa3">Get in touch...</p>
        <h3 class="tracked"><a class="" href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a> or <a class="" href="http://twitter.com/mrejfox">@mrejfox</a> </h3>
    </div>

    <!-- Article header -->
    <header class="ph3-ns w-100">
      <div class="ph2 ph3-ns">
        <h1 :class="['f-headline lh-solid mv0 mv1-ns', (type === 'photos') || (type === 'audio') ? 'tc' : '']">
          {{ title }}
        </h1>
      </div>

      <!-- Timestamp -->
      <time v-if="!hidetimestamp"
        :class="['f3 w-100 sans-serif mb2 pl0 pb0 db ttu tracked o-50']">
        <small class="mv3 pa3-ns tc tl-ns w-100 db">{{ date | moment("MMMM Do, YYYY") }}</small>
      </time>
    </header>

    <ul class="w-100 w-third-ns fl list pa3 bb bt b--dark-gray bn-ns">
      <li class="ph3-ns"><nuxt-link class="link underline" to="/">Home</nuxt-link></li>
      <li class="ph3-ns"><nuxt-link class="link underline" to="/bookmarks">Bookmarks</nuxt-link></li>
      <li class="ph3-ns"><nuxt-link class="link underline" to="/vibes">Vibes</nuxt-link></li>
    </ul>

    <!-- Non-audio blog post types -->
    <article
    v-if="type !== 'audio'"
    :class="['w-100 w-two-thirds-l fl not-audio mb0 pa1 pa3-ns',
              bgcolorclass,
              textcolorclass,
              type]">

      <div id="body" :class="[type !== 'photos' ? '' : 'ph7-1 f3-ns mr3-l']">
        <Words v-if="body" :bodyMarkdown="body" />
      </div>
    </article>

    <!-- Audio post types -->
    <article
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
    </article>
  </section>
</div>
</template>

<script>
import AudioPlayer from '~/components/AudioPlayer.vue';
import Words from '~/components/blogtypes/words.vue'
import URL from 'url-parse'
import _ from 'lodash'
import marked from 'marked'
import truncate from 'truncate'
import cheerio from 'cheerio'

export default {
  scrollToTop: true,
  components: {
    AudioPlayer,
    Words
  },
  data: function () {
    return {
      emojiIcon: '📓',
      bodyHtml: null
    }
  },
  computed: {
    shortDescription: function () {
      return this.createShortDescription()
    }
  },
  head () {
    return {
      title: this.emojiIcon + ' ' + this.title + ' | EJ Fox',
      meta: [{
        'name': 'EJ Fox | ' + this.title,
        'description': this.createShortDescription(),
        'og:description': this.createShortDescription(),
        'og:title': this.title,
        'og:type': 'article',
        'twitter:title': this.title,
        'twitter:creator': 'mrejfox',
        'twitter:description': this.emojiIcon + ' ' + this.createShortDescription()
      }]
    }
  },
  async asyncData({ params }) {
    let post = await import('~/content/blog/posts/' + params.slug + '.json');
    if(!post.bgcolorclass) { post.bgcolorclass = ''}
    if(!post.textcolorclass) { post.textcolorclass = '' }
    if(!post.audio) { post.audio = null }
    if(!post.inprogress) { post.inprogress = null }
    return post;
  },
  created: function () {
    this.bodyHtml = this.parseMarkdown(this.body)
    this.setEmojiIcon()
  },
  methods: {
    createShortDescription () {
      let noHtmlBody = this.body
      noHtmlBody = noHtmlBody.replace(/<(?:.|\n)*?>/gm, '')
      return truncate(noHtmlBody, 100)
    },
    setEmojiIcon () {
      if (this.type === 'photos') {
        this.emojiIcon = '📷'
      } else if (this.type === 'code') {
        this.emojiIcon = '💻'
      } else if (this.type === 'audio') {
        this.emojiIcon = '🎵'
      }
    },
    parseMarkdown: function(markdown) {
      // console.log('Parsing markdown...')
      // Build markdown parser
      const markdownRenderer = marked.setOptions({
        renderer: new marked.Renderer(),
        // highlight: function (code) {
        //   return require('highlight.js').highlightAuto(code).value
        // }
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        xhtml: true
      })
      let parsedMarkdown = markdownRenderer(markdown)

      // Load parsed markdown into cheerio so we can do
      // jquery-style manipulations on the HTML
      const $ = cheerio.load(parsedMarkdown)

      // return parsed, sliced, and diced markdown
      return $.html()
    }
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  h1, h2, h3, h4, h5 {
    word-wrap: break-word;
    hyphens: auto;
  }
}

.f-headline {
  @media (min-width: 640px) {
    font-size: 12rem;
  }
}

article li
  list-style-type circle
/*
article {
  padding: 2rem;
  margin-top: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

article.photos p {
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
article.photos img {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}
article.photos h1 {
  text-align: center;
} */

article.photos h1 {
  text-align: center;
}

article.photos img {
  margin: 3rem 0
}

article.photos img:first-child {
  margin-top: 0;
}

/* article.audio {
  border-radius: 4px;
  border-top: 1px solid rgba(250,250,250,0.1);
  border-bottom: 1px solid rgba(25,25,25,0.1);

  box-shadow: 2px 2px 12px 0px rgba( 0, 0, 0, 0.15 );
} */

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
  color: pink;
  background-color: red;
  font-family: "Knockout 66 A", "Knockout 66 B" !important;
  font-style: normal !important;
  font-weight: 400;
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
