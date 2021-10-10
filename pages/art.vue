<template>
  <section class="pa3 pa4-ns db cf mb4">
    <h2 class="mb4">Art</h2>
    <p class="measure pv4">
      hello world
    </p>
  </section>
</template>

<script>
import CloudinaryPhoto from '~/components/CloudinaryPhoto.vue'
export default {
  components: {
    CloudinaryPhoto,
  },
  methods: {},
  data() {
    return {
      title: 'Services',
      shortDescription: 'Hire me to make things for you: ejfox@ejfox.com',
    }
  },
  head() {
    return {
      title: 'Services | EJ Fox',
      meta: [
        { property: 'name', content: this.title },
        { property: 'description', content: this.shortDescription },
        { property: 'og:description', content: this.shortDescription },
        { property: 'og:title', content: this.title },
        {
          property: 'og:image',
          content:
            'https://res.cloudinary.com/ejf/image/upload/w_1200,h_900,c_thumb,g_auto/v1612889033/service-images_datavizdesign-01.png',
        },
        { property: 'og:type', content: 'article' },
        { property: 'twitter:title', content: this.title },
        { property: 'twitter:creator', content: 'mrejfox' },
        {
          property: 'twitter:description',
          content: this.emojiIcon + ' ' + this.shortDescription,
        },
      ],
    }
  },
}
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
  img {
    filter: invert(1);
  }
}

h1,
h2,
h3,
h4,
h5,
h6 {
  word-wrap: break-word;
}

p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

ul {
  padding: 0;
}
/* li { list-style-type: none } */

.intro a:link,
.intro a:hover {
  color: black;
  text-decoration: underline;
}

.intro a:visited,
.intro a:focus {
  color: #414346;
  /*text-decoration: none;*/
}
</style>
