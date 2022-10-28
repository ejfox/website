<template>
  <li class="pa2 bb b--moon-gray striped"><slot /></li>
</template>
<style>
/* add a dark background to every other list item */
.striped:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
