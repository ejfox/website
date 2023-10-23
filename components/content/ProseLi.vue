<template>
  <li class="max-w-prose striped">
    <slot />
  </li>
</template>
<style>
.striped:nth-child(even) {
  opacity: 0.95;
}
</style>
