<template>
  <section class="db mb4">
    <section class="intro lh-copy f3 measure ml6">
      <ContentDoc />
    </section>

    <div id="hcard-EJ-Fox" class="vcard w-100 f6 tc dn">
      <img
        src="https://gravatar.com/avatar/4a503ee102c67cc632d77f97721d83f7"
        alt="Photo of EJ Fox"
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
<script setup>
import anime from "animejs/lib/anime.es.js";
onMounted(() => {
  // use anime to animate the intro text
  // anime({
  //   targets: ".intro p",
  //   translateX: ["-100%", 0],
  //   easing: "easeInQuad",
  //   duration: 1200,
  //   delay: 100
  // });

  // anime({
  //   targets: ".intro p",
  //   opacity: [0, 1],
  //   easing: "easeOutQuad",
  //   duration: 1300,
  // });
});
</script>

<style>
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

.intro p {
  /* color: purple; */
  display: block;
  margin-left: 0 !important;
  max-width: 24rem;
  text-align: justify;
}
</style>
