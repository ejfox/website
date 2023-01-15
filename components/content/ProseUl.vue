<template>
  <ul class="mh1 mh3-ns ml6-l measure-wide list lh-copy">
    <slot />
  </ul>
</template>
<style>
/* style nested lists */
ul ul {
  margin-left: 2.25em !important;
  width: 50%;

}

ul ul li {
  list-style-type: square;
}

/* remove bottom border from last li in nested list */
ul ul li:last-child {
  border-bottom: none;
}


</style>