<template>
  <div class="">
    <nuxt-link to="/" id="home-link"
      :class="['pa3 f3 db lh-solid tc link black underline bn']">
      EJFox.com
    </nuxt-link>

    <transition
      appear
      mode="out-in"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut">
      <nuxt/>
    </transition>

    <div class="tc mv2">
      🌞
    </div>
  </div>
</template>

<style>
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

html {
  font-family: "Hoefler Text A", "Hoefler Text B";
  font-style: normal;
  font-weight: 400;

  font-size: 16px;
  font-size: 1.3em;
  line-height: 1.4em;
  /* word-spacing: 1px; */
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

b, strong {
  font-family: "Hoefler Text A", "Hoefler Text B";
  font-style: normal;
  font-weight: 700;
}

i, em {
  font-family: "Hoefler Text A", "Hoefler Text B";
  font-style: italic;
  font-weight: 400;
}

.notoserif {
  /* font-family: 'Noto Serif', 'Georgia', serif; */
}

.barlowcondensed {
  /* font-family: 'Barlow Condensed', -apple-system, sans-serif; */
  /* font-family: "Knockout 68 A", "Knockout 68 B", Courier; */
  font-family: "Knockout 66 A", "Knockout 66 B";
  font-style: normal;
  font-weight: 400;
}

h1,h2,h3,h4,h5,h6 {
  /* font-family: 'Barlow Condensed', -apple-system, sans-serif; */
  font-family: "Knockout 66 A", "Knockout 66 B";
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
}

h2 {
  font-size: 5em;
  line-height: 0.9em;
}

h3 {
  font-size: 3em;
  line-height: 1em
}


h4 {
  font-size: 2.2em;
  line-height: 1em;
}
#home-link {
  font-family: "Knockout 68 A", "Knockout 68 B";
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
  outline: none;
  border: 0 !important;
  /* font-family: 'Barlow Condensed', -apple-system, sans-serif; */
}

.animated {
  animation-duration: 0.3s;
  /* transition-timing-function: cubic-bezier(0.870, 0.260, 0.425, 0.885); */
}

pre, code {
  white-space: pre-wrap;
  word-wrap: break-word;
}

pre {
  overflow-x: auto;
}
</style>
