<template>
  <main class="container mx-auto p-4 flex flex-col justify-between">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(project, index) in data.body"
        :key="index"
        class="p-4 flex flex-col justify-between border border-transparent"
      >
        <div class="header">
          <h2 class="text-2xl lg:text-4xl font-bold leading-tight py-4">
            <a :href="project.URL" class="mr-4">
              {{ project['Project Name'] }}
            </a>
          </h2>
        </div>

        <div class="w-full" v-if="project.screenshot">
          <img
            :src="project.screenshot"
            class="w-full drop-shadow-md rounded h-24 md:h-48 2xl:h-96 object-cover"
          />
        </div>

        <div
          class="flex flex-wrap justify-start items-baseline gap-2 pt-2 mt-2 md:mt-0"
        >
          <!-- badge for a year -->
          <div
            class="inline-flex items-baseline text-gray-600 px-1 py-0.5 text-xs font-medium"
          >
            <UIcon
              name="i-heroicons-solid-calendar"
              class="text-gray-500 mr-1 align-text-bottom h-3 w-3"
            />
            {{ project.Year }}
          </div>

          <div
            class="inline-flex items-baseline text-gray-600 px-1 py-0.5 text-xs font-medium"
          >
            <UIcon
              name="i-heroicons-solid-building-office"
              class="text-gray-500 mr-1 align-text-bottom h-3 w-3"
            />
            {{ project.Client }}
          </div>

          <div
            class="inline-flex items-baseline text-gray-600 px-1 py-0.5 text-xs font-medium"
          >
            <UIcon
              name="i-heroicons-solid-pencil"
              class="text-gray-500 mr-1 align-text-bottom h-3 w-3"
            />
            {{ project.Role }}
          </div>
        </div>

        <!-- <div
          class="font-light text-gray-400 tracking-wide font-mono text-xs lg:text-base my-1 line-clamp-1 pt-3"
        >
          <a
            :href="project.URL"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary-500 dark:text-primary-900"
          >
            {{ project.URL }}
          </a>
        </div> -->

        <div
          v-if="project?.Description"
          class="font-light text-gray-400 dark:text-gray-600 tracking-wide text-xs lg:text-base my-1 py-3 lg:py-5"
        >
          {{ project.Description }}
        </div>

        <div class="flex">
          <UButton color="white" @click="goToProject(project.URL)">
            See Project
          </UButton>
          <UButton
            v-if="project.blogpost"
            color="primary"
            class="ml-2"
            @click="goToBlogPost(project.blogpost)"
          >
            Devblog
          </UButton>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { group } from 'd3'

const { data, pending } = await useAsyncData('projects', () =>
  queryContent('/projects').findOne(),
)

function goToProject(url) {
  window.open(url, '_blank')
}

function goToBlogPost(url) {
  window.open(url, '_blank')
}
</script>
