<template>
  <section class="center db cf pa3 pa4-l">
    <h2 class="mb2 dark-gray">Currently reading</h2>
    <BookList :books="currentReadingLibrary" />

    <h2 class="mb2 dark-gray">Books read</h2>
    <section class="mv3 measure">
      <p class="mv2">I use the goodreads scale for stars.</p>
      <ul>
        <li>★ did not like it</li>
        <li>★★ it was ok</li>
        <li>★★★ liked it</li>
        <li>★★★★ really liked it</li>
        <li>★★★★★ it was amazing</li>
      </ul>
      <p class="mv2">Hovering on stars will show my review in a tooltip, if available.</p>
    </section>
    <BookList :books="readLibrary" />

    <!-- <h2 class="mb2 dark-gray">Not finished</h2>
    <section class="mv3 measure">
      <p>Books I've started but I'm not actively reading.</p>
    </section>
    <section class="gray">
      <BookList :books="notFinishedLibrary" />
    </section> -->

    <h2 class="mb2 dark-gray">Want to read</h2>
    <section class="mv3 measure">
      <p>These are books that I've acquired or have come up in my research but that I haven't had a chance to read yet.</p>
    </section>
    <section class="gray">
      <BookList :books="toReadLibrary" />
    </section>


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
    },
    notFinishedLibrary: function () {
      return _.filter(this.library, _.matchesProperty('Exclusive Shelf', 'not-finished'))
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
