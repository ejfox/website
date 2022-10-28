<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  blank: {
    type: Boolean,
    default: false,
  },
});

// check if the href is linking to wikipedia, github, youtube, or twitter, and if so, add the social icon
const isSocial = computed(() => {
  return (
    props.href.includes("wikipedia") ||
    props.href.includes("github") ||
    props.href.includes("youtube") ||
    props.href.includes("twitter")
  );
});

const socialPlatform = computed(() => {
  if (props.href.includes("wikipedia")) {
    return "wikipedia";
  } else if (props.href.includes("github")) {
    return "github";
  } else if (props.href.includes("youtube")) {
    return "youtube";
  } else if (props.href.includes("twitter")) {
    return "twitter";
  } else if (props.href.includes("keybase")) {
    return "keybase";
  } else if (props.href.includes("itunes.apple")) {
    return "apple";
  } else if (props.href.includes("observablehq")) {
    return "observablehq";
  } else if (props.href.includes("mailto:")) {
    return "email";
  } else {
    return null;
  }
});

const isInternalLink = computed(() => {
  // return props.href.startsWith('/') || props.href.startsWith('https://ejfox.com')
  if (props.href.startsWith("/")) return true;
  if (props.href.startsWith("https://ejfox.com")) return true;
  else return false;
});

// check if the href is linking to a file, and if so, add the file icon
</script>

<template>
  <NuxtLink
    :href="href"
    :class="[
      'link near-black dim fw5',
      isInternalLink ? 'fw6 underline' : 'underline',
    ]"
  >
    <slot />
    <sup v-if="socialPlatform === 'wikipedia'">
      <Icon name="simple-icons:wikipedia" class="ml1" />
    </sup>
    <sup v-if="socialPlatform === 'github'">
      <Icon name="simple-icons:github" class="ml1" />
    </sup>
    <sup v-if="socialPlatform === 'youtube'">
      <Icon name="simple-icons:youtube" class="ml1" />
    </sup>
    <sup v-if="socialPlatform === 'twitter'">
      <Icon name="simple-icons:twitter" class="ml1" />
    </sup>
    <sup v-if="socialPlatform === 'keybase'">
      <Icon name="simple-icons:keybase" class="ml1" />
    </sup>
    <sup v-if="socialPlatform === 'apple'">
      <Icon name="simple-icons:apple" class="ml1" />
    </sup>
    <sup v-if="socialPlatform === 'observablehq'">
      <Icon name="simple-icons:observable" class="ml1" />
    </sup>
    <sup v-if="socialPlatform === 'email'">
      <Icon name="ic:baseline-email" class="ml1" />
    </sup>
    <small v-if="isInternalLink">
      <!-- <Icon name="ic:baseline-open-in-new" class="ml1" /> -->
    </small>
  </NuxtLink>
</template>
<style>
sup {
  font-size: 0.72em;
}
</style>
