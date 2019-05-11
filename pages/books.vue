<template>
  <section class="center db cf pa3 pa4-l">
    <h2 class="mb2 dark-gray">Currently reading</h2>
    <BookList :books="currentReadingLibrary" />

    <h2 class="mb2 dark-gray">Books read</h2>
    <BookList :books="readLibrary" />

    <h2 class="mb2 dark-gray">Want to read</h2>
    <section class="mv3 measure">
      <p>These are books that I've acquired or have come up in my research but that I haven't had a chance to read yet. I have a bad habit of starting books and not finishing them, and those are included here too.</p>
    </section>
    <BookList :books="toReadLibrary" />
  </section>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import BookList from '~/components/BookList.vue';

export default {
  components: {
    BookList
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
    readLibrary: function () {
      return _.filter(this.library, _.matchesProperty('Exclusive Shelf', 'read'))
    },
    toReadLibrary: function () {
      return _.filter(this.library, _.matchesProperty('Exclusive Shelf', 'to-read'))
    },
    currentReadingLibrary: function () {
      return _.filter(this.library, _.matchesProperty('Exclusive Shelf', 'currently-reading'))
    }

  },
  methods: {
  },
  async asyncData ({ params }) {
    let library = await import('~/static/data/goodreads_library_export.json');
    return { library: library }
  }
};
</script>

<style>
@media screen and (min-width: 620px) {
  .book {
    grid-template-columns: 55% 1fr 1fr;
    display: grid;
    grid-column-gap: 5px;
    padding-top: 5px;
  }
}

</style>
