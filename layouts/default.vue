<template>
  <div class="bg-near-white serif">
    <nuxt-link to="/" id="home-link"
      :class="['sans-serif pa3 ph4-ns f3 db lh-solid link dark-gray underline bn']">
      EJFox.com
    </nuxt-link>

    <Nav />

    <main>
      <transition
        appear
        mode="out-in"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut">
        <nuxt/>
      </transition>
    </main>

    <div class="tc mv2">
      🌞
    </div>
  </div>
</template>
<script>
import Nav from '~/components/Nav.vue';
export default {
  components: {
    Nav
  }
}
</script>

<style lang="stylus">

$serif = Georgia, 'Times New Roman', Times, serif;
$sans-serif = 'Oswald', Arial, Helvetica, sans-serif;

.serif { font-family: $serif; }

.sans-serif { font-family: $sans-serif; }

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

html {
  font-family: Georgia, 'Times New Roman', Times, serif;
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
body {
  scroll-behavior: smooth;
}

a,a:link,a:visited,a:active {
  outline: 0;
}
/* a:link {
  color: #00449E;
}
a:visited {
  color: #5E2CA5;
} */

b, strong {
  font-style: normal;
  font-weight: 700;
}

i, em {
  font-style: italic;
  /* font-weight: 400; */
}

h1,h2,h3,h4,h5,h6 {  
  font-style: normal;
  font-weight: 400;
  font-family: $sans-serif;
}

h1,h2,h3 {
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
  font-style: normal;
  font-weight: 400;
  text-transform: uppercase;
  outline: none;
  border: 0 !important;
}

.animated {
  animation-duration: 0.4s;
  /* transition-timing-function: cubic-bezier(0.870, 0.260, 0.425, 0.885); */
}

pre, code {
  white-space: pre-wrap;
  word-wrap: break-word;
}

pre {
  overflow-x: auto;
}


$black = #292A2B


// Dark mode overrides for Tachyon
@media (prefers-color-scheme: dark) {

  body {
    // background-color: black; 
    background-color: $black
  }

  .bg-near-white {
    background-color: $black
    color white
  }

  h1,h2,h3,h4,h5 {
    color: white !important
  }

  .bg-white, .bg-light-gray {
    background-color: $black
    color white
  }

  a {
    color: white !important;
  }

  .black, .near-black, .dark-gray {
    color white !important
  }
  .white {
    color white !important
  }    
}
</style>
