<template>
  <div class="center db cf w-100 pa2 pa3-ns">
    <section id="hero-projects">
      <a href="https://twitch.tv/enjalot">
        <CloudinaryPhoto
          src="https://res.cloudinary.com/ejf/image/upload/v1612889023/projects-01.png"
          cssClass="pr2"
          containerClass="dib w-50 mv0"
        />
      </a>

      <a href="https://github.com/dataproofer/Dataproofer">
        <CloudinaryPhoto
          src="https://res.cloudinary.com/ejf/image/upload/v1612889022/projects-03.png"
          cssClass="pr2"
          containerClass="dib w-50 mv0"
        />
      </a>

      <a href="https://www.youtube.com/watch?v=p4KIMQsVkt8&feature=youtu.be">
        <CloudinaryPhoto
          cssClass="pr2"
          src="https://res.cloudinary.com/ejf/image/upload/v1612889025/projects-02.png"
          containerClass="dib w-50 mv0"
        />
      </a>

      <a href="https://observablehq.com/collection/@ejfox/generative-art">
        <CloudinaryPhoto
          src="https://res.cloudinary.com/ejf/image/upload/v1612889022/projects-04.png"
          cssClass="pr2"
          containerClass="dib w-50 mv0"
        />
      </a>
    </section>
    <section class="project mv2 ph3" v-for="project in projects">
      <a
        v-if="project.URL"
        target="_blank"
        rel="noopener"
        :title="project.Year + ' for ' + project.Client"
        class="b lh-title link black underline br1"
        :href="project.URL"
      >
        {{ project['Project Name'] }}
      </a>
      <span class="b br1 black" v-else>{{ project['Project Name'] }}</span>
      <small class="ph2 dark-gray tr">
        {{ project['Client'] }}
        <span class="gray">
          <!-- '{{project.Year.slice(-2)}} -->
          {{ project.Year }}
        </span>
      </small>
    </section>
  </div>
</template>

<script>
import Nav from '~/components/Nav.vue'
import CloudinaryPhoto from '~/components/CloudinaryPhoto.vue'
export default {
  components: {
    Nav,
    CloudinaryPhoto,
  },
  data() {
    return {}
  },
  created: function () {},
  activated: function () {},
  computed: {},
  methods: {},
  async asyncData({ params }) {
    let projects = await import('~/static/data/projects.json')
    return { projects: projects }
  },
}
</script>

<style>
#hero-projects a {
  margin: 0;
  padding: 0;
  outline: none;
}
@media screen and (min-width: 620px) {
  .project {
    grid-template-columns: 65% 1fr;
    display: grid;
    grid-column-gap: 5px;
    padding-top: 5px;
  }
}

.project:nth-child(odd) {
  background-color: rgba(5, 5, 5, 0.1);
}
</style>
