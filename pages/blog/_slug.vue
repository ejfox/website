<template>
  <section id="post-container">
    <nuxt-link to="/" id="home-link"
      :class="['pa3 db lh-solid tc']">
      EJFox.com
    </nuxt-link>

    <article
    v-if="type !== 'audio'"
    :class="['not-audio pa5-ns mb0',
              bgcolorclass,
              textcolorclass,
              type,
              type === 'photos' ? 'bg-near-black' : '',
              type === 'photos' && !textcolorclass ? 'white' : '']">
      <header >
        <time v-if="!hidetimestamp"
          :class="['f6 w-100 sans-serif mb2 pa3 pb0 db ttu tracked o-50']">
          <small>{{ date | moment("MMMM Do, YYYY") }}</small>
        </time>

        <div class="ph3 ph0-ns pv3-ns ph7-1">
          <h1 :class="['f-headline-m f-headline-l lh-title mv1-ns w-60 w-100-ns']">
            <span :class="['tracked-tight']">
              {{ title }}
            </span>
          </h1>
        </div>
      </header>

      <div id="body" :class="['notoserif pt3-ns', type !== 'photos' ? '' : 'ph7-1 f3-ns']">
        <Words v-if="body" :bodyMarkdown="body" />
      </div>
    </article>

    <article
    v-if="type === 'audio'"
    :class="['o-90 tc tl-m tl-l center pa1 pa4-ns mb0',
              bgcolorclass,
              textcolorclass,
              type,
              type === 'photos' ? 'bg-near-black w-100' : 'w-80-m w-80-l',
              type === 'photos' && !textcolorclass ? 'white' : '',
              type === 'audio' && bgcolorclass ? 'article-pop mb3' : '']">
      <header >
        <h1 :class="['lh-title mv1-ns dib-ns mr2', type === 'photos' ? 'tc center' : '']">
            {{ title }}
        </h1>
        <time v-if="!hidetimestamp"
          :class="['sans-serif mb3 mb1-ns db ttu tracked ml0-m o-60']">
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

      <div id="body"
          :class="['notoserif pt4-ns',
                  type !== 'photos' ? 'measure' : 'mw7 center f3-ns']">
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
  },
  async asyncData({ params }) {
    let post = await import('~/content/blog/posts/' + params.slug + '.json');
    if(!post.bgcolorclass) { post.bgcolorclass = ''}
    if(!post.textcolorclass) { post.textcolorclass = '' }
    if(!post.audio) { post.audio = null }
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

.embed-container {
  margin-bottom: 2rem;
  margin-top: 2rem;
}
</style>
