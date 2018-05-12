<template>
  <article :class="type">
    <nuxt-link to="/">Home</nuxt-link>

    <h1>{{ title }}</h1>

    <div id="body">
      <div v-html="$md.render(body)" class="contentWrapper content"></div>
    </div>
  </article>
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

article {
  padding: 2rem;
  margin-top: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  font-size: 3rem;
  line-height: 1em;
  display: block;
  margin: 1rem 0;
}

p {
  margin: 1.5rem 0;
}

#body {
  max-width: 900px;
  text-align: left;
}
</style>
