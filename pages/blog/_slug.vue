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
        <Words v-if="bodyHtml" :bodyHtml="bodyHtml" />
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
        <Words v-if="bodyHtml" :bodyHtml="bodyHtml" />
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
      if (!this.bodyHtml) return ''
      let noHtmlBody = this.bodyHtml
      noHtmlBody = noHtmlBody.replace(/<(?:.|\n)*?>/gm, '')
      return truncate(noHtmlBody, 100)
    }
  },
  head () {
    return {
      title: this.emojiIcon + ' ' + this.title + ' | EJ Fox',
      meta: [{
        'name': 'EJ Fox | ' + this.title,
        'description': this.shortDescription,
        'og:description': this.shortDescription,
        'og:title': this.title,
        'og:type': 'article',
        'twitter:title': this.title,
        'twitter:creator': 'mrejfox',
        'twitter:description': this.emojiIcon + ' ' + this.shortDescription
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
  watch: {
    post: function () {
      this.bodyHtml = this.parseMarkdown(this.body)
    }
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

      $('p').each(function(i, el){ $(el).addClass('lh-copy measure pa3') })
      $('ul').each(function(i, el){ $(el).addClass('measure pv1 pa2 pa4-ns pa0-m pa0-l') })
      $('img').each(function(i, el){ $(el).addClass('center mt4 pa0 w-100') })
      $('pre').each(function(i, el){ $(el).addClass('pa1 bg-dark-gray white br1 pv2-ns ph4-ns') })
      $('code').each(function(i, el){ $(el).addClass('bg-dark-gray white br1 f6') })
      $('li').each(function(i, el){ $(el).addClass('mb2') })
      $('li > p').each(function(i, el){ $(el).removeClass('measure') })
      $('h2').each(function(i, el){ $(el).addClass('ph3 mv2 dark-gray') })
      $('h3').each(function(i, el){ $(el).addClass('ph3 mv1 tracked ttu dark-gray') })
      $('h4').each(function(i, el){ $(el).addClass('ph3 mv0 dark-gray') })
      $('cite').each(function(i, el){ $(el).addClass('db sans-serif ttu gray tracked mt2') })
      $('blockquote').each(function(i, el){ $(el).addClass('dark-gray mv3 f3-l ph2 ph4-ns lh-copy measure center') })
      $('blockquote > p').each(function(i, el){
        $(el).removeClass('lh-copy measure center pv3 ph3 ph0-m ph0-l')
        $(el).addClass('i b')
      })

      // If we wanted to do something special for different links
      // $('a').each(function(i, el){
      //   let $link = $(this)
      //   const linkSrc = $link.attr('href')
      //   const url = new URL(linkSrc)
      //
      //   if (url.hostname === 'api.observablehq.com') {
      //
      //   }
      // })

      // Here we go through each image, which is just a link to the fullsize in the CMS
      // We build a responsive srcset and the right queries in the URL so it works well on mobile
      $('img').each(function(i, el){
        let $image = $(this)
        const imgSrc = $image.attr('src')
        const url = new URL(imgSrc)

        // If it's a link to cloudinary, perform our operations, otherwise we leave it alone
        // c_scale,dpr_auto,w_1080,q_auto:best
        if (url.hostname === 'res.cloudinary.com') {
          // Generate SMALL image URL
          let urlS = new URL(imgSrc)
          let urlSPaths = urlS.pathname.split('/')
          urlSPaths.splice(urlSPaths.length-2, 0, 'fl_progressive:semi,q_jpegmini,c_scale,dpr_auto,w_320')
          urlS.pathname = urlSPaths.join('/')
          // Generate MEDIUM image URL
          let urlM = new URL(imgSrc)
          let urlMPaths = urlM.pathname.split('/')
          urlMPaths.splice(urlMPaths.length-2, 0, 'fl_progressive:semi,c_scale,dpr_auto,w_920')
          urlM.pathname = urlMPaths.join('/')
          // Generate LARGE image URL
          let urlL = new URL(imgSrc)
          let urlLPaths = urlL.pathname.split('/')
          urlLPaths.splice(urlLPaths.length-2, 0, 'fl_progressive:semi,c_scale,dpr_auto,w_1280')
          urlL.pathname = urlLPaths.join('/')

          let srcSet = [
            urlS.toString() + ' 320w',
            urlM.toString() + ' 920w',
            urlL.toString() + ' 1280w',
          ]

          let sizes = [
            '(max-width: 320px) 280px',
            '(max-width: 720px) 980px',
            '1000px'
          ]

          $image.attr('srcset', srcSet.join(', \n'))
          $image.attr('sizes', sizes.join(', \n'))
          $image.attr('src', urlM.toString())
          // $image.addClass('shadow-4-l')
        }
      })

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
