<template>
  <div class="p-4 lg:p-10 prose dark:prose-invert mx-auto text-xl lg:text-2xl max-w-screen-md">
    <NuxtLink to="/reading" class="link">
      <h1 class="text-xl font-extrabold tracking-tight dark:text-white">
        📖 Reading
      </h1>
    </NuxtLink>
    <ContentDoc v-slot="{ doc }" :head="false" class="leading-loose" />
  </div>
</template>
<style>
hr {
  margin-top: 4rem;
  margin-bottom: 4rem;
}
</style>