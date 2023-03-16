<template>
  <ul
    class="list w-100 w-20-l measure bt bb ba-l br2 b--light-gray-l pv3 pv4-l ph4 f5 f4-ns fr-l mr6-l ml3 center left-l bg-light-gray"
  >
    <h2 class="tl tc-l mb4 near-black db f3 fw2">Table of contents</h2>
    <li v-for="link of toc.links" :key="link.id" class="mv1 pv1  f4 fw3">
      <a :href="`#${link.id}`" class="link black underline">{{ link.text }}</a>
    </li>
  </ul>
</template>
<script setup>
const { toc } = useContent();
</script>
