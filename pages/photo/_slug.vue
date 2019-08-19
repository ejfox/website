<template>
<div class="slug-container cf">
  <section id="post-container w-100">
    <article
      :class="['tc center pa1 pa4-ns mb0']">
      
      <Photo
         :url="'https' + photo" />
      <div v-if="dek" class="measure center pa1 lh-copy">
        {{ dek }}
      </div>
      <!-- Timestamp -->
      <time
        :class="['f4 w-100 sans-serif mb2 pl0 pb0 db ttu tracked o-20 tc']">
        <small class="">{{ date | moment("MMMM Do, YYYY") }}</small>
      </time>
    </article>
  </section>
</div>
</template>

<script>
// import AudioPlayer from '~/components/AudioPlayer.vue';
// import Words from '~/components/blogtypes/words.vue'
import Photo from '~/components/Photo.vue'
// import URL from 'url-parse'
// import _ from 'lodash'
// import marked from 'marked'
// import truncate from 'truncate'
// import cheerio from 'cheerio'
// import slug from 'slug'

export default {
  scrollToTop: true,
  components: {
    Words,
    Photo
  },
  data: function () {
    return {
      emojiIcon: '📷'
    }
  },
  computed: {
  },
  head () {
    return {
      title: this.emojiIcon + ' ' + this.title + ' | EJ Fox',
      meta: [{
        'name': 'EJ Fox | ' + this.title,
        'description': this.emojiIcon,
        'og:description': this.emojiIcon,
        'og:title': this.title,
        'og:type': 'article',
        'twitter:title': this.title,
        'twitter:creator': 'mrejfox',
        'twitter:description': this.emojiIcon + ' ' + this.emojiIcon
      }]
    }
  },
  async asyncData({ params }) {
    let post = await import('~/content/photo/' + params.slug + '.json');
    if(!post.bgcolorclass) { post.bgcolorclass = ''}
    if(!post.textcolorclass) { post.textcolorclass = '' }
    if(!post.audio) { post.audio = null }
    if(!post.inprogress) { post.inprogress = null }
    return post;
  },
  created: function () {
  },
  activated: function () {
  },
  methods: {
    
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
