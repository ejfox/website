<template>
  <section id="post-container">
    <nuxt-link to="/" id="home-link" class="tc f2 pv3 db lh-title">Home</nuxt-link>

    <article :class="['center mw7', 'pa4', type, type === 'photos' ? 'bg-black' : '', type === 'photos' ? 'washed-blue' : '', type === 'photos' ? 'w-100' : 'measure-wide']">
      <header class="f2 measure-narrow">
        <time class="f6 w-100 sans-serif mb2 db ttu tracked tc o-40"><small>{{ date | moment("MMMM Do, YYYY") }}</small></time>
        <div class="mw9 center pt5-ns ph7-1">
          <h1 class="f-headline-l lh-title measure-narrow mv0">
            <span class="bg-black-10 pa1 tracked-tight">
              {{ title }}
            </span>
          </h1>
        </div>
      </header>

      <div id="body" :class="['lh-copy notoserif', type !== 'photos' ? 'measure' : '']">
        <div v-html="$md.render(body)" class="contentWrapper content"></div>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  async asyncData({ params }) {
    // const postPromise = process.BROWSER_BUILD
    //   ? import('~/content/blog/posts/' + params.slug + '.json')
    //   : Promise.resolve(
    //       require('~/content/blog/posts/' + params.slug + '.json')
    //     );

    let post = await import('~/content/blog/posts/' + params.slug + '.json');
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

article.photos-post img {
  margin: 2.5rem 0
}
img {
  max-width: 100%;
}

p {
  margin: 1.5rem 0;
}
</style>
