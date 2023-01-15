<template>
  <ol class="mh1 mh3-ns ml6-l measure-wide lh-copy list">
    <slot />
  </ol>
</template>
<style>
/* add numbers to list items */
ol li {
  counter-increment: item;
}

ol li::before {
  content: counter(item) ". ";
  font-weight: bold;
  margin-right: 0.5em;
}

/* add numbers to nested list items */
ol ol li {
  counter-increment: item 1;
}

ol ol li::before {
  content: counter(item) ". ";
  font-weight: bold;
  margin-right: 0.5em;
}
</style>
