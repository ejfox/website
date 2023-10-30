<script setup>
definePageMeta({
  title: 'EJ Fox',
  meta: [
    { name: 'keywords', content: 'EJ Fox, Portfolio, Web Development, Vue, Nuxt' }
  ]
})
</script>

<template>
  <section class="">
    <section
      class="p-8 lg:px-24 max-w-prose text-3xl lg:text-5xl text-justify prose-p:leading-normal prose-a:underline prose-a:decoration-primary xl:py-32">
      <ContentDoc />
    </section>

    <div id=" hcard-EJ-Fox" class="vcard invisible">
      <img src="https://gravatar.com/avatar/4a503ee102c67cc632d77f97721d83f7" alt="Photo of EJ Fox" class="photo dn" />
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
