<template>
  <section id="post-container">
    <!-- Article header -->
    <header class="ph3-ns">
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

    <!-- Non-audio blog post types -->
    <article
    v-if="type !== 'audio'"
    :class="['not-audio mb0 pa3-ns',
              bgcolorclass,
              textcolorclass,
              type,
              type === 'photos' ? 'bg-near-black' : '',
              type === 'photos' && !textcolorclass ? 'white' : '']">

      <div id="body" :class="['pt3-ns', type !== 'photos' ? '' : 'ph7-1 f3-ns']">
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
    return post;
  },
  mounted: function () {
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
  h1 {
    word-wrap: break-word;
    hyphens: auto;
  }
}

.f-headline {
  @media (min-width: 640px) {
    font-size: 12rem;
  }
}


/*
h2 {
  font-size: 2.75rem;
  line-height: 1.2em;
}

h3 {
  font-size: 1.3rem;
  line-height: 1.1em;
}

h3,h4,h5,h6 {
  opacity: 0.75;
}

*/
a:link, a:hover {
  color: black;
  text-decoration: underline;
}

a:visited, a:focus {
  color: #363636;
  text-decoration: none;
}
/*

@media (max-width: 640px) {
  article.not-audio {
    border: 0 solid #f4f4f4;
  }
}
@media (min-width: 641px) {
  article.not-audio {
    border: 0.5em solid #f4f4f4;
  }
} */

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
