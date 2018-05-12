<template>
  <article :class="type">
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
  max-width: 32rem
}

h1 {
  font-size: 3rem;
  line-height: 1.3em;
  display: block;
}

p {
  margin: 1.5rem 0;
}

#body {
  max-width: 900px;
  text-align: left;
}
</style>
