<template>
<footer class="center db ttu sans-serif ma0 mt2 mt5-ns f3 tc">
  <a
    :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']"
    href="https://github.com/ejfox">
    GitHub
  </a>

  <a
    :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']"
    href="http://instagram.com/ejfoxphotos">
    Instagram
  </a>

  <a
    :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']"
    href="https://www.linkedin.com/in/ejfox/">
    LinkedIn
  </a>



  <!--
  <nuxt-link to="/bookmarks" :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']">
    recent bookmarks
  </nuxt-link>

  <nuxt-link to="/vibes" :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']">
    vibes &amp; inspiration
  </nuxt-link>

  <nuxt-link to="/books" :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']">
    books
  </nuxt-link>
  -->
  <a
  :class="['db dib-ns link pa3 bn ma2 no-underline gray bg-light-gray']"
  href="https://calendly.com/ejfox/hangout/">
    calendar
  </a>

  <section id="pgp" class="center tc sans-serif ttu gray mv1 mv5-ns lh-copy">
    <p>PGP: <a href="/pgp.txt" class="link underline gray">5D30 A33E 08E3 5B89 15B4  C7E2 E207 8E65 3FE3 89CD</a> </p>
  </section>
</footer>
</template>

<script>

export default {
  name: 'Footer',
  props: {},
  data: function () {
    return {
    }
  },
  computed: {
  },
  mounted: function () {    
    
  },
  methods: {
    
  }
}
</script>

<style scoped>

</style>
