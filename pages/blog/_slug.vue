<template>
  <section id="post-container">
    <nuxt-link to="/" id="home-link"
    :class="['tc center f3 pa3 db lh-solid']">EJFox.com</nuxt-link>

    <article
    v-if="type !== 'audio'"
    :class="['not-audio pa5-ns mb0 center', bgcolorclass, textcolorclass, type, type === 'photos' ? 'bg-near-black' : '', type === 'photos' && !textcolorclass ? 'white' : '']">
      <header >
        <time v-if="!hidetimestamp"
          :class="['f6 w-100 sans-serif mb2 db ttu tracked o-50 tc']">
          <small>{{ date | moment("MMMM Do, YYYY") }}</small>
        </time>
        <div class="center pt4-ns ph7-1">
          <h1 :class="['tc f-headline-m f-headline-l lh-title mv1-ns']">
            <span :class="['pa1 tracked-tight', audio ? '' : 'bg-black-20']">
              {{ title }}
            </span>
          </h1>
        </div>
      </header>

      <div id="body" :class="['notoserif pt4-ns', type !== 'photos' ? '' : 'mw7 center f3-ns']">
        <Words v-if="body" :bodyMarkdown="body" />
      </div>
    </article>

    <article
    v-if="type === 'audio'"
    :class="['o-90 tc tl-m tl-l', bgcolorclass, textcolorclass, 'center', 'pa1 pa4-ns mb0', type, type === 'photos' ? 'bg-near-black' : '', type === 'photos' && !textcolorclass ? 'white' : '', type === 'photos' ? 'w-100' : 'w-80-m w-80-l', type === 'audio' && bgcolorclass ? 'article-pop mb3' : '']">
      <header >
        <h1 :class="['lh-title mv1-ns dib-ns mr2']">
            {{ title }}
        </h1>
        <time v-if="!hidetimestamp"
          :class="['sans-serif mb2 dib-ns ttu tracked ml0-m o-60']">
          <small>{{ date | moment("MMMM Do, YYYY") }}</small>
        </time>
      </header>

      <div v-if="audio" class="w-100">
        <AudioPlayer
          :sources="[audio]"
          :loop="false"
          :bg="bgcolorclass.length > 1 ? bgcolorclass : 'bg-gray'"
        />
      </div>

      <div id="body" :class="['notoserif pt4-ns', type !== 'photos' ? 'measure' : 'mw7 center f3-ns']">
        <Words v-if="body"
          :bodyMarkdown="body" />
      </div>
    </article>
  </section>
</template>

<script>
import AudioPlayer from '~/components/AudioPlayer.vue';
import Words from '~/components/blogtypes/words.vue'
import cheerio from 'cheerio'
import URL from 'url-parse'
import _ from 'lodash'

export default {
  components: {
    AudioPlayer,
    Words
  },
  methods: {
    parseMarkdown: function(markdown) {
      let parsedMarkdown = this.$md.render(markdown)
      const $ = cheerio.load(parsedMarkdown)

      $('p').each(function(i, el){
        $(el).addClass('lh-copy measure center pv3 ph3 ph0-m ph0-l')
      })

      $('img').each(function(i, el){
        $(el).addClass('center mv4')
      })

      $('ul').each(function(i, el){
        $(el).addClass('measure pv1 center pa4 pa0-m pa0-l')
      })

      $('li').each(function(i, el){
        $(el).addClass('mb2')
      })

      $('li > p').each(function(i, el){
        $(el).removeClass('measure')
      })

      $('h2').each(function(i, el){
        $(el).addClass('tc mv4')
      })

      $('h3').each(function(i, el){
        $(el).addClass('tc mv3 tracked ttu')
      })

      $('h4').each(function(i, el){
        $(el).addClass('tc mv2 tracked')
      })

      $('a').each(function(i, el){
        let $link = $(this)
        const linkSrc = $link.attr('href')
        const url = new URL(linkSrc)

        if (url.hostname === 'api.observablehq.com') {

        }
      })

      $('img').each(function(i, el){
        let $image = $(this)
        const imgSrc = $image.attr('src')
        const url = new URL(imgSrc)

        /*
        Full size: https://res.cloudinary.com/ejf/image/upload/v1526535166/20161227-untitled_shoot-527.jpg

        Scaled to 1290 width http://res.cloudinary.com/ejf/image/upload/c_scale,dpr_auto,w_1290,q_auto:best/v1526535166/20161227-untitled_shoot-527.jpg
        Scaled to 920 width https://res.cloudinary.com/ejf/image/upload/c_scale,dpr_auto,w_920/v1526535166/20161227-untitled_shoot-527.jpg
                            https://res.cloudinary.com/ejf/image/upload/v1526535161/c_scale,dpr_auto,w_1080/20161119-untitled_shoot-007.jpg


        <img srcset="elva-fairy-320w.jpg 320w,
                   elva-fairy-480w.jpg 480w,
                   elva-fairy-800w.jpg 800w"
           sizes="(max-width: 320px) 280px,
                  (max-width: 480px) 440px,
                  800px"
           src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">

        */

        if (url.hostname === 'res.cloudinary.com') {
          // c_scale,dpr_auto,w_1080,q_auto:best

          let urlS = new URL(imgSrc)
          let urlSPaths = urlS.pathname.split('/')
          urlSPaths.splice(urlSPaths.length-2, 0, 'c_scale,dpr_auto,w_320')
          urlS.pathname = urlSPaths.join('/')

          let urlM = new URL(imgSrc)
          let urlMPaths = urlM.pathname.split('/')
          urlMPaths.splice(urlMPaths.length-2, 0, 'c_scale,dpr_auto,w_920')
          urlM.pathname = urlMPaths.join('/')

          let urlL = new URL(imgSrc)
          let urlLPaths = urlL.pathname.split('/')
          urlLPaths.splice(urlLPaths.length-2, 0, 'c_scale,dpr_auto,w_1280')
          urlL.pathname = urlLPaths.join('/')

          // url.pathname = paths
          // $image.attr('src', url.toString())

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

          // url.pathname = paths.join('/')
          $image.attr('srcset', srcSet.join(', \n'))
          $image.attr('sizes', sizes.join(', \n'))
          $image.attr('src', urlM.toString())
          $image.addClass('shadow-4-l')
        } else {
          $image.attr('src', url.toString())
        }

        // let newUrl = cloudinary.url(imgSrc, {width: 720, crop: "scale"})
        // let newUrl = 'http://via.placeholder.com/350x150'

      })
      return $.html()
      // return markdown
    }
  },
  async asyncData({ params }) {
    // const postPromise = process.BROWSER_BUILD
    //   ? import('~/content/blog/posts/' + params.slug + '.json')
    //   : Promise.resolve(
    //       require('~/content/blog/posts/' + params.slug + '.json')
    //     );

    let post = await import('~/content/blog/posts/' + params.slug + '.json');
    if(!post.bgcolorclass) {
      post.bgcolorclass = ''
    }

    if(!post.textcolorclass) {
      post.textcolorclass = ''
    }

    if(!post.audio) {
      post.audio = null
    }


    return post;
  }
};
</script>


<style scoped>
@media (max-width: 640px) {
  h1 {
    word-wrap: break-word;
    hyphens: auto;
  }
}

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

a:link, a:hover {
  color: black;
  text-decoration: underline;
}

a:visited, a:focus {
  color: #363636;
  text-decoration: none;
}

@media (max-width: 640px) {
  article.not-audio {
    border: 0 solid #f4f4f4;
  }
}
@media (min-width: 641px) {
  article.not-audio {
    border: 0.5em solid #f4f4f4;
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

.embed-container {
  margin-bottom: 2rem;
  margin-top: 2rem;
}
</style>
