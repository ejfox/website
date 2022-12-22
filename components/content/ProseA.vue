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
  // return true
  console.log(props.href, props.href.startsWith("#/page/"), props.href.startsWith("blog/test#/page/"))
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

// if it is a wikilink, grab the content for the page based on the slug, we will use this to get the title of the page from the markdown
// const wikilinkTargetPage = computed(() => {
// make async
// const wikilinkTargetPage = computed(async () => {
//   if (isWikilink.value) {
//     const slug = props.href.split("/").pop();
//     // const page = $content("blog", slug).fetch();
//     // instead use queryContent like: 
//     //   return queryContent('/').where({ director: { $in: ['Hayao Miyazaki', 'Yoshifumi Kondō'] } }).find()
//     // find where _path is 'blog/${slug}'
//       const page = await queryContent('/').where({ _path: `blog/lack-of-data` }).find()
//       .then((page) => {
//         console.log('page ->', page)
//         return page
//       })

//       return page
//   }
// });

const wikilinkTargetPage = ref(null)
const slug = computed(() => {
  const slug = props.href.split("/").pop();
  return slug
})
// if it is a wikilink, grab the content for the page based on the slug, we will use this to get the title of the page from the markdown
const { data: targetPageData } = await useAsyncData(`content-${slug}`, () =>{
    return queryContent()
    // .where({_path: `/blog/${slug}`})
    .where({_path: `/blog/${slug.value}`})
    // .only(['_slug', 'title'])
    .findOne()
  })

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
  if (isWikilink) return true
  if (props.href.startsWith("/")) return true;
  if (props.href.startsWith("https://ejfox.com")) return true;
  else return false;
});

// check if the href is linking to a file, and if so, add the file icon
</script>

<template>
  <NuxtLink
    :href="isWikilink ? remappedWikiLink : href"
    :class="[
      'link near-black dim fw5',
      isInternalLink ? 'fw6' : 'underline',
    ]"
    :title="targetPageData ? `${targetPageData.readingTime.words} words / ${targetPageData.readingTime.text}` : ''"
  >
    <span v-if="isWikilink && targetPageData"
    class="internal-link">
      {{ targetPageData.title }}
  </span>
  <span v-else>
  <slot />
  </span>
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
    <!-- <sub v-if="isWikilink">
      <Icon name="ph:graph-bold" class="" />
    </sub> -->
    <!-- <small v-if="isInternalLink">
      <Icon name="ic:baseline-open-in-new" class="ml1" />
    </small> -->
  </NuxtLink>
</template>
<style>
sup {
  font-size: 0.72em;
}

/* add an animation for internal links, the background starts white, and then slowly turns into a rotating rainbow, and back and forth forever */
.internal-link {
  text-decoration: none;
  border-bottom: none;
  /* slightly lighter colors so that black text is always readable */
  background: linear-gradient(
    45deg,
    #ff1a1a,
    #ff9933,
    #4b0082,
    #00e600,
    #1a8cff,
    #4d4dff,
    #9933ff
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  background-size: 400% 400%;
  -webkit-animation: change 32s ease-in-out infinite;
  -moz-animation: change 32s ease-in-out infinite;
  -o-animation: change 32s ease-in-out infinite;
  animation: change 32s ease-in-out infinite;
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
