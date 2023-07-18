<template>
  <ul
    class="list w-100 w-20-l measure br2 pv3 pv4-l ph4 f5 f4-ns fr-l mr6-l ml3 center left-l bg-near-white"
  >
    <h2 class="tl tc-l mb3 mt1 near-black db f3 fw4 ph1">Table of contents</h2>
    <ol  class="mv1 pv1 f4">
      <li v-for="(link, i) of toc.links" :key="link.id" class="dib v-top pa2">
        <span class="b ph1">{{i+1}}</span>
        <a :href="`#${link.id}`" class="link mid-gray underline">
          
          {{ link.text }}</a>
      </li>
    </ol>
  </ul>
</template>
<script setup>
const { toc } = useContent();
</script>
<style>
/* even though the display elements are inline block, we still want to show the number of the list item */
ol {
  list-style: decimal;
}

/* remove the default padding and margin */
ol,
ul {
  padding: 0;
  margin: 0;
}

</style>