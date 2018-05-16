<template>
  <section id="post-container">
    <nuxt-link to="/" id="home-link" class="tc f2 pv3 db lh-title">EJFox.com</nuxt-link>

    <article :class="[bgcolorclass, textcolorclass, 'center', 'pa4 mb5', type, type === 'photos' ? 'bg-black' : '', type === 'photos' ? 'white' : '', type === 'photos' ? 'w-100' : 'w-80']">
      <header class="f3">
        <time :class="['f6 w-100 sans-serif mb2 db ttu tracked o-40', type === 'photos' ? '' : 'tc']"><small>{{ date | moment("MMMM Do, YYYY") }}</small></time>
        <div class="center pt4-ns ph7-1">
          <h1 class="f-headline-l f2 lh-title mv1-ns">
            <span class="bg-black-20 pa1 tracked-tight">
              {{ title }}
            </span>
          </h1>
        </div>
      </header>

      <div v-if="audio.length > 1" class="w-100">
        <AudioPlayer
          :sources="[audio]"
          :loop="true"
        />
      </div>

      <div id="body" :class="['lh-copy notoserif pt4-ns', type !== 'photos' ? 'measure' : 'w-100']">
        <div v-html="$md.render(body)" class="contentWrapper content"></div>
      </div>
    </article>
  </section>
</template>

<script>
import AudioPlayer from '~/components/AudioPlayer.vue';

export default {
  components: {
    AudioPlayer
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


    return post;
  }
};
</script>


<style>

a:link, a:hover {
  color: black;
  text-decoration: underline;
}

a:visited, a:focus {
  color: #363636;
  text-decoration: none;
}
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

article.photos img {
  margin: 3.5rem 0
}

/* article.photos p {
  max-width: 32rem;
} */

img {
  max-width: 100%;
}

p {
  margin: 1.5rem 0;
}
</style>
