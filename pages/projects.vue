<template>
  <div class="center db cf pa3 pa4-l">
    <section
      class="project mv3"
      v-for="project in projects">
      <a
        class="b lh-title"
        :href="project.URL">{{project['Project Name']}}</a>
      <small class="ph2 dark-gray">{{project['Client']}}</small>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  components: {
  },
  data() {
    return {
    }
  },
  created: function () {
  },
  activated: function () {
  },
  computed: {

  },
  methods: {
  },
  async asyncData ({ params }) {
    let projects = await import('~/static/data/projects.json');
    return { projects: projects }
  }
};
</script>

<style>
@media screen and (min-width: 620px) {
  .project {
    grid-template-columns: 65% 1fr;
    display: grid;
    grid-column-gap: 5px;
    padding-top: 5px;
  }
}

</style>
