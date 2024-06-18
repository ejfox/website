<template>
  <main class="blogpost mx-auto p-5 md:p-10 lg:p-20">
    <!-- back to blog link -->
    <NuxtLink to="/blog" class="text-gray-500 hover:text-gray-700">
      <UIcon name="i-heroicons-arrow-left" class="mr-2" />
      Back to blog
    </NuxtLink>

    <div v-if="isHidden">
      <div class="text-8xl text-red-500">This is a draft / private page</div>

      <div class="text-lg text-gray-900 my-8">
        You need a password to access this page
      </div>
    </div>

    <div v-if="page">
      <NuxtLink v-if="isHidden && password === 'showpassword'" :to="{
      path: page?._path,
      query: { password: generatePassword(page?._path) },
    }" class="text-xs text-gray-500 block mt-4">
        Password protected:
        <UIcon name="i-heroicons-lock-closed" class="" />
        {{ page._path }}?password=
        {{ generatePassword(page?._path) }}
      </NuxtLink>
    </div>

    <div :class="[
      'text-gray-900',
      isHidden ? 'blur-lg select-none pointer-events-none' : '',
    ]">
      <ContentDoc>
        <template v-slot="{ doc }">
          <div>

            <div
              class="prose xl:prose-xl dark:prose-invert dark:prose-pre:bg-black prose-pre:bg-neutral-50 prose-pre:text-neutral-500 prose-pre:py-2 prose-pre:my-1">
              <!-- <ContentRenderer :value="doc" class="" /> -->
              <ContentRenderer :value="doc">
                <PageMetadata :doc="doc" />

                <!-- if we are on DEV, show an obsidian deeplink for editing -->
                <div v-if="DEV" class="">
                  <UButton color="white" @click="navigateTo(generateObsidianDeepLink(page), { external: true })">
                    Edit in Obsidian
                  </UButton>
                </div>

                <ContentRendererMarkdown :value="doc" />
              </ContentRenderer>
            </div>
          </div>
        </template>

        <template #not-found>
          <div class="text-8xl text-center p-4 dark:text-white min-h-96">
            <!-- <h1
            class="mx-auto inline-block min-h-96"
          >Document not found</h1> -->
            <UIcon name="i-svg-spinners-wind-toy" class="my-8" />
            <span class="block mr-2 uppercase">Not found</span>
          </div>
        </template>

        <!-- <template #empty>
          <h1>Document is empty</h1>
        </template> -->
      </ContentDoc>
    </div>

    <div class="clearfix py-8 px-4 md:px-8">
      <NuxtLink v-if="prev" :to="prev._path"
        class="dim px-4 py-4 w-40 w-20-ns text-gray-500 block absolute left-2 lh-title">
        <span class="inline-block">&#8592;</span>
        {{ prev.title }}
        <div class="text-gray-500 text-sm font-light">
          {{ formatDate(new Date(prev.date)) }}
        </div>
        <!-- <p class="moon-gray fw1 f6 mv0 pv2">{{ countWords(prev) }} words</p> -->
      </NuxtLink>

      <NuxtLink v-if="next" :to="next._path"
        class="dim px-4 py-4 w-40 w-20-ns text-gray-500 block absolute right-2 lh-title text-right">
        {{ next.title }}
        <span class="inline-block">&#8594;</span>
        <div class="text-gray-500 text-sm font-light text-right">
          {{ formatDate(new Date(next.date)) }}
        </div>
        <!-- <p class="moon-gray fw1 f6 mv0 tr pv2">{{ countWords(next) }} words</p> -->
      </NuxtLink>
    </div>
  </main>
</template>
<script setup>
import { timeFormat } from 'd3-time-format'
import { generatePassword } from '~/helpers'
import { useRouteQuery } from '@vueuse/router'

const { toc, page, excerpt } = useContent();


const formatDate = timeFormat("%B %Y");

// get DEV from the public runtime config
// const { DEV } = useRuntimeConfig().public;
// console.log('DEV', DEV);


const isHidden = computed(() => {
  return page.value?.hidden
})

// const publicRuntimeConfig = useRuntimeConfig();
// console.log('publicRuntimeConfig', publicRuntimeConfig);
// const formatBlogDate = timeFormat('%B %d, %Y')

const DEV = import.meta.dev

function generateObsidianDeepLink(page) {


  let path = page._path
  // the path starts with /blog/ which we need to strip out
  path = path.replace('/blog/', '')
  return `obsidian://open?vault=ejfox&file=${path}`
}

// TODO: The prev / next are based on the directory structure
// NOT the data, which I assumed was the case
// so I need to figure out a better way to make computed prev/next
// by querying all of the available blog posts and then sorting them
// and then finding the current one and then getting the next and prev

// first get a list of articles with queryContent
// const allBlogPosts = await queryContent('blog').find()
// modify our query to remove any blog posts with a ! in the title
const allBlogPosts = await queryContent('blog').find()

// then sort them by modified (or date if modified is not there)
const sortedBlogPosts = allBlogPosts.sort((a, b) => {
  if (a.modified && b.modified) {
    return new Date(b.modified) - new Date(a.modified)
  } else if (a.date && b.date) {
    return new Date(b.date) - new Date(a.date)
  } else {
    return 0
  }
})

// remove any blog posts with a ! anywhere in the title
const filteredBlogPosts = sortedBlogPosts.filter((post) => {
  return !post.title.includes('!') && !post.hidden
})

// then find the current one
const currentPostIndex = filteredBlogPosts.findIndex(
  (post) => post?._path === page.value?._path,
)

// then get the next and prev
const prev = filteredBlogPosts[currentPostIndex + 1]

const next = filteredBlogPosts[currentPostIndex - 1]

const ogImageUrl = computed(() => {
  // template URL https://res.cloudinary.com/ejf/image/upload/g_north_west,co_rgb:fff,x_440,y_240,w_290,h_170,c_fit,l_text:FjallaOne-Regular.ttf_72:Ready%20to%20party/templates/og-image-generated-bg.png

  const title = page.value.title.toUpperCase()
  const urlEncodedTitle = encodeURIComponent(title)

  const bgImg = 'templates/og-image-generated-bg.png'

  // there are two different ogImageUrl schemes
  // if the post has a cloudinary photo, we will use the first one as the background image
  // otherwise we will use our template
  const pageElements = page.value?.body?.children

  // a pageElement looks like this
  //   {
  //     "type": "element",
  //     "tag": "img",
  //     "props": {
  //         "src": "https://res.cloudinary.com/ejf/image/upload/v1544846833/20180509-DSCF9221.jpg"
  //     },
  //     "children": []
  // }

  const cloudinaryPhoto = pageElements?.find((el) =>
    el?.props?.src?.includes('cloudinary'),
  )

  // extract the cloudinaryPhoto ID from the URL
  // a URL looks like this
  // https://res.cloudinary.com/ejf/image/upload/fl_progressive:semi,c_scale,dpr_auto,w_1600/v1544846833/20180509-DSCF9221.jpg
  // and an ID looks like this
  // v1544846833/20180509-DSCF9221.jpg
  // so if we split by / we need the last 2 values
  const cloudinaryPhotoId = cloudinaryPhoto?.props?.src
    ?.split('/')
    .slice(-2)
    .join('/')

  if (cloudinaryPhoto) {
    // the cloudinaryPhotoId photo can be any size or aspect ratio, so we need to transform it to fit our template
    // we do this by using the cloudinary image transformation API
    // https://cloudinary.com/documentation/image_transformations
    // we use the 'fill' transformation to fill the template with the photo
    // we use the 'crop' transformation to crop the photo to the template aspect ratio
    // we use the 'gravity' transformation to position the photo in the template
    // we use the 'scale' transformation to scale the photo to the template size

    const url = `https://res.cloudinary.com/ejf/image/upload/dpr_2.0,c_fill,g_auto,w_1200/fl_progressive:semi,c_fill,h_630,g_auto/dpr_2.0,co_rgb:FFF,fl_region_relative,w_0.5,l_text:FjallaOne-Regular.ttf_92:${urlEncodedTitle}/${cloudinaryPhotoId}`
    return url
  } else {
    const url = `https://res.cloudinary.com/ejf/image/upload/g_north_west,co_rgb:fff,x_440,y_200,w_690,h_320,c_fit,l_text:FjallaOne-Regular.ttf_${ogImageFontsize.value}:${urlEncodedTitle}/${bgImg}`
    return url
  }
})
</script>
<style>
/* strong {
  color: #E7040F;
} */

.blogpost h1,
.blogpost h2,
{
@apply text-5xl lg:text-6xl xl:text-8xl my-0.5 mb-2 font-bold !important;
}
</style>
