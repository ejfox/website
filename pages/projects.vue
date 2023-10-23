<template>
  <main class="container mx-auto p-4 flex flex-col justify-between">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <UCard v-for="(project, index) in data.body" :key="index" class="lg:m-4 flex flex-col justify-between">
        <template #header>
          <h2 class="text-2xl lg:text-4xl font-bold leading-tight py-4">
            <a :href="project.URL" class="mr-4">
              {{ project['Project Name'] }}
            </a>

            <span class="block sm:inline-block mt-2 md:mt-0">
              <!-- badge for a year -->
              <UBadge color="gray" size="sm" class="mr-2 mt-1" :href="project.URL">
                <UIcon name="i-heroicons-solid-calendar" class="mr-1" />
                {{ project.Year }}
              </UBadge>

              <UBadge color="gray" size="sm" class="mt-1 mr-2" :href="project.URL">
                <UIcon name="i-heroicons-solid-building-office" class="mr-1" />
                {{ project.Client }}
              </UBadge>

              <UBadge color="gray" size="sm" class="mr-2 mt-1" :href="project.URL">
                <UIcon name="i-heroicons-solid-pencil" class="mr-1" />
                {{ project.Role }}
              </UBadge>


            </span>
          </h2>
        </template>

        <div class="w-full" v-if="project.screenshot">
          <img :src="project.screenshot" class="w-full drop-shadow-md rounded
            h-24 md:h-48 2xl:h-96 object-cover
          " />
        </div>

        <div class="font-light text-gray-400 tracking-wide font-mono text-xs lg:text-base my-1 line-clamp-1 pt-3">
          <a :href="project.URL" target="_blank" rel="noopener noreferrer" class="">
            {{ project.URL }}
          </a>
        </div>

        <div class="flex-grow"></div>

        <div class="flex justify-end">
          <UButton icon="i-heroicons-solid-external-link" color="primary" variant="solid" label="See Project" class="mt-3"
            :trailing="false" />
          <UButton icon="i-heroicons-solid-book-open" v-if="project.blogpost" color="black" variant="solid"
            label="Devblog" class="mx-1 mt-3" :trailing="false" />
        </div>
      </UCard>
    </div>
  </main>
</template>

<script setup>
import { group } from 'd3'

const { data, pending } = await useAsyncData('projects', () =>
  queryContent('/projects').findOne(),
)
</script>