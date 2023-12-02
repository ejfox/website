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

// check if the link looks like #/page/${slug} or has the class "internal" which means it is a wikilink
const isWikilink = computed(() => {
  if (props.href.startsWith("#/page/")) return true;
  if (props.href.startsWith("blog/test#/page/")) return true;

});

// if it is a wikilink, make available an alternative link that actually works
// so http://localhost:3000/blog/test#/page/lack-of-data would become http://localhost:3000/blog/lack-of-data
const remappedWikiLink = computed(() => {
  if (isWikilink.value) {
    const slug = props.href.split("/").pop();
    return `/blog/${slug}`;
  }
});


const slug = computed(() => {
  const slug = props.href.split("/").pop();
  // console.log(props.href, '-->', 'slug', slug)
  return slug
})
// if it is a wikilink, grab the content for the page based on the slug, we will use this to get the title of the page from the markdown
const { data: targetPageData } = await useAsyncData(`content-${slug.value}`, () => {
  return queryContent()
    // .where({_path: `/blog/${slug}`})
    .where({ _path: `/blog/${slug.value}` })
    // .only(['_slug', 'title'])
    .findOne()
})

// console.log(targetPageData.value)


// check if the href is linking to wikipedia, github, youtube, or twitter, and if so, add the social icon
const isSocial = computed(() => {
  return (
    props.href.includes("wikipedia") ||
    props.href.includes("github.com") ||
    props.href.includes("youtube.com") ||
    props.href.includes("twitter.com")
  );
});

const socialPlatform = computed(() => {
  if (props.href.includes("wikipedia")) {
    return "wikipedia";
  } else if (props.href.includes("github.com")) {
    return "github";
  } else if (props.href.includes("youtube.com")) {
    return "youtube";
  } else if (props.href.includes("twitter.com")) {
    return "twitter";
  } else if (props.href.includes("keybase")) {
  } else if (props.href.includes("itunes.apple")) {
    return "apple";
  } else if (props.href.includes("observablehq")) {
    return "observablehq";
  } else if (props.href.includes("pinboard.in")) {
    return "pinboard";
  } else if (props.href.includes("goodreads.com")) {
    return "goodreads";
  } else if (props.href.includes("glitch.com")) {
    return "glitch";
  } else if (props.href.includes("stackoverflow.com")) {
    return "stackoverflow";
  } else if (props.href.includes("mailto:")) {
    return "email";
  } else {
    return null;
  }
});

const isInternalLink = computed(() => {
  // return props.href.startsWith('/') || props.href.startsWith('https://ejfox.com')
  if (isWikilink) return true
  if (props.href.startsWith("/")) return true;
  if (props.href.startsWith("https://ejfox.com")) return true;
  else return false;
});
</script>



<template>
  <NuxtLink :href="isWikilink ? remappedWikiLink : href" :class="[
    'text-gray-900 dark:text-gray-300 font-medium decoration-dotted hover:underline',
    isInternalLink ? 'font-semibold' : '',
  ]" :title="targetPageData ? `${targetPageData.readingTime.words} words / ${targetPageData.readingTime.text}` : ''">
    <span v-if="isWikilink && targetPageData" class="internal-link">
      <span v-if="targetPageData">
        {{ targetPageData.title }}
      </span>
    </span>
    <span v-else>
      <slot />
    </span>
    <!-- wikipedia -->
    <sup v-if="socialPlatform === 'wikipedia'">
      <UIcon name="i-simple-icons-wikipedia" class="ml-1" />
    </sup>
    <!-- github -->
    <sup v-if="socialPlatform === 'github'">
      <UIcon name="i-simple-icons-github" class="ml-1" />
    </sup>
    <!-- youtube -->
    <sup v-if="socialPlatform === 'youtube'">
      <UIcon name="i-simple-icons-youtube" class="ml-1" />
    </sup>
    <!-- twitter -->
    <sup v-if="socialPlatform === 'twitter'">
      <UIcon name="i-simple-icons-twitter" class="ml-1" />
    </sup>
    <!-- apple -->
    <sup v-if="socialPlatform === 'apple'">
      <UIcon name="i-simple-icons-apple" class="ml-1" />
    </sup>
    <!-- observable -->
    <sup v-if="socialPlatform === 'observablehq'">
      <UIcon name="i-simple-icons-observable" class="ml-1" />
    </sup>
    <!-- email -->
    <sup v-if="socialPlatform === 'email'">
      <UIcon name="i-ic-baseline-email" class="ml-1" />
    </sup>
    <sup v-if="socialPlatform === 'pinboard'">
      <UIcon name="i-simple-icons-pinboard" class="ml-1" />
    </sup>
    <!-- stackoverflow -->
    <sup v-if="socialPlatform === 'stackoverflow'">
      <UIcon name="i-simple-icons-stackoverflow" class="ml-1" />
    </sup>
    <!-- glitch -->
    <sup v-if="socialPlatform === 'glitch'">
      <UIcon name="i-simple-icons-glitch" class="ml-1" />
    </sup>
  </NuxtLink>
</template>
<style>
sup {
  font-size: 0.72em;
}

/* add an animation for internal links, the background starts white, and then slowly turns into a rotating rainbow, and back and forth forever */
.internal-link {
  text-decoration: none !important;
  border-bottom: none;
  /* slightly lighter colors so that black text is always readable */
  background: linear-gradient(45deg,
      #ff1a1a,
      #ff9933,
      #4b0082,
      #00e600,
      #1a8cff,
      #4d4dff,
      #9933ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  background-size: 400% 400%;
  -webkit-animation: change 38s ease-in-out infinite;
  -moz-animation: change 38s ease-in-out infinite;
  -o-animation: change 38s ease-in-out infinite;
  animation: change 38s ease-in-out infinite;
}

@-webkit-keyframes change {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@-moz-keyframes change {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@-o-keyframes change {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes change {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
