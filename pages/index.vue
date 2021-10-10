<template>
  <section class="pa3 pa4-ns db cf mb4">
    <section class="intro pt2 measure-narrow lh-copy tj">
      <p class="pv2">
        Hello, my name is <strong>EJ Fox</strong>. I'm a hacker and journalist
        available for contract work. My work focuses on data visualization,
        systems, and politics. You can send me an email at
        <a href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a>
      </p>

      <p class="tl">
        Take a look at <nuxt-link to="/projects"> some of my work </nuxt-link>
        or <a href="/resume.pdf">my resume</a>.
      </p>
      <p class="lh-copy pv2 tj">
        Sometimes I take
        <nuxt-link to="/photo/">photos</nuxt-link>, <br />
        make <nuxt-link to="/audio/">sounds</nuxt-link> <br />
        or <nuxt-link to="/art/">art</nuxt-link>.
      </p>
    </section>
    <Footer />

    <div id="hcard-EJ-Fox" class="vcard w-100 f6 tc dn">
      <img
        src="https://gravatar.com/avatar/4a503ee102c67cc632d77f97721d83f7"
        alt="Gravatar photo of EJ Fox"
        class="photo dn"
      />
      <div><a class="url fn db" href="https://ejfox.com">EJ Fox</a></div>
      <a class="email db" href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a>
      <div class="adr">
        <span class="locality">Beacon</span>,
        <span class="region">New York</span>

        <div class="country-name ml1 b">United States</div>
      </div>

      <div class="tel sans-serif">(260) 673-5369</div>
    </div>
  </section>
</template>

<script>
import Nav from '~/components/Nav.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Nav,
    Footer,
  },
  methods: {}
}
</script>

<style scoped>
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
