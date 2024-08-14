<template>
  <main class="blogpost mx-auto p-5 md:p-10 lg:p-20">
    <div class="py-2">
      <BackToBlogLink />
      <PasswordProtection v-if="isHidden" />
      <ObsidianEditButton v-if="DEV" :page="page" />
    </div>


    <div :class="['text-gray-900', isHidden ? 'blur-lg select-none pointer-events-none' : '']">
      <ContentDoc>
        <template v-slot="{ doc }">
          <div class="">
            <ContentRenderer :value="doc">
              <PageMetadata :doc="doc" class="py-4 lg:py-8" />
              <div
                class="prose lg:prose-xl dark:prose-invert prose-pre:bg-gray-100 dark:prose-pre:bg-gray-950 prose-pre:leading-8 prose-pre:py-2 prose-pre:my-4 lg:prose-pre:my-6">
                <ContentRendererMarkdown :value="doc" />
              </div>
            </ContentRenderer>
          </div>
        </template>

        <template #not-found>
          <NotFoundMessage />
        </template>
      </ContentDoc>
    </div>

    <BlogNavigation :prev="prev" :next="next" />
  </main>
</template>

<script setup>
import { timeFormat } from 'd3-time-format'
import { generatePassword } from '~/helpers'
import { useRouteQuery } from '@vueuse/router'

const { page } = useContent()
const formatDate = timeFormat("%B %Y")
const DEV = import.meta.dev

const isHidden = computed(() => page.value?.hidden)

function generateObsidianDeepLink(page) {
  const path = page._path.replace('/blog/', '')
  return `obsidian://open?vault=ejfox&file=${path}`
}

const allBlogPosts = await queryContent('blog').find()
const sortedBlogPosts = allBlogPosts.sort((a, b) => {
  const dateA = a.modified || a.date
  const dateB = b.modified || b.date
  return dateA && dateB ? new Date(dateB) - new Date(dateA) : 0
})

const filteredBlogPosts = sortedBlogPosts.filter(post => !post.title.includes('!') && !post.hidden)

const currentPostIndex = filteredBlogPosts.findIndex(post => post?._path === page.value?._path)
const prev = filteredBlogPosts[currentPostIndex + 1]
const next = filteredBlogPosts[currentPostIndex - 1]

const ogImageUrl = computed(() => {
  const title = page.value.title.toUpperCase()
  const urlEncodedTitle = encodeURIComponent(title)
  const pageElements = page.value?.body?.children
  const cloudinaryPhoto = pageElements?.find(el => el?.props?.src?.includes('cloudinary'))

  if (cloudinaryPhoto) {
    const cloudinaryPhotoId = cloudinaryPhoto.props.src.split('/').slice(-2).join('/')
    return `https://res.cloudinary.com/ejf/image/upload/dpr_2.0,c_fill,g_auto,w_1200/fl_progressive:semi,c_fill,h_630,g_auto/dpr_2.0,co_rgb:FFF,fl_region_relative,w_0.5,l_text:FjallaOne-Regular.ttf_92:${urlEncodedTitle}/${cloudinaryPhotoId}`
  } else {
    const bgImg = 'templates/og-image-generated-bg.png'
    return `https://res.cloudinary.com/ejf/image/upload/g_north_west,co_rgb:fff,x_440,y_200,w_690,h_320,c_fit,l_text:FjallaOne-Regular.ttf_${ogImageFontsize.value}:${urlEncodedTitle}/${bgImg}`
  }
})
</script>

<style scoped>
.blogpost h1,
.blogpost h2 {
  @apply text-5xl lg:text-6xl xl:text-8xl my-0.5 mb-2 font-bold !important;
}
</style>