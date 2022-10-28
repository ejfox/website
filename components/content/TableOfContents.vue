<template>
  <ul
    class="list w-100 w-third-ns ba br2 b--light-gray pv3 ph4 f5 f4-ns fr ml2 ml5-ns"
  >
    <h2 class="tc mv1 near-black db dn-ns">Table of contents</h2>
    <li v-for="link of toc.links" :key="link.id" class="mv1 pv1 tr">
      <a :href="`#${link.id}`" class="link black underline">{{ link.text }}</a>
    </li>
  </ul>
</template>
<script setup>
const { toc } = useContent();
</script>
