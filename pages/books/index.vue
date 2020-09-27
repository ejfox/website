<template>
  <section class="center db cf pa3 pa4-l">
    <!-- <section
      class="mv4 ph2 pb1 black b--gray bn lh-solid">
      <h2 class="mb2 dark-gray lh-title">Currently reading</h2>
      <BookList :current="true" :books="currentReadingLibrary" />
    </section> -->

    <h2 class="mb2 dark-gray">Books I've read</h2>
    <section class="mv3 measure dark-gray pa2">
      <ul class="list ma0 pa0">
        <li>★ did not like it</li>
        <li>★★ it was ok</li>
        <li>★★★ liked it</li>
        <li>★★★★ really liked it</li>
        <li>★★★★★ it was amazing</li>
      </ul>      
    </section>

    <nuxt-link class="link underline " to="/books/highlights">View all book highlights</nuxt-link>

    <!-- <p class="ma2 mv4">Hovering on stars will show my review in a tooltip, if available (indicated by yellow stars).</p> -->
    <BookList class="db" :books="readLibrary" />

    <section id="footer">
      <small class="db tc">
        Powered by <a href="https://www.goodreads.com/user/show/9273959-ej-fox">goodreads</a>
      </small>
    </section>

  </section>
</template>

<script>
import slugify from 'slugify'
import filter from 'lodash/filter'
import matchesProperty from 'lodash/matchesProperty'
import BookList from '~/components/BookList.vue'
import Nav from '~/components/Nav.vue'

export default {
  components: {
    BookList,
    Nav
  },
  data() {
    return {
      title: '📕 Books & Highlights | EJ Fox',
      description: 'A collection of books I\'ve read, ratings, and excerpts.'
    }
  },
  head () {
    return {
      title: this.title,
      meta: [{
        'name': 'EJ Fox | ' + this.title,
        'description': this.description,
        'og:description': this.description,
        'og:title': this.title,
        'og:type': 'article',
        'twitter:title': this.title,
        'twitter:creator': 'mrejfox',
        'twitter:description': '📖 ' + this.description
      }]
    }
  },
  created: function () {
  },
  activated: function () {
  },
  computed: {
    readLibrary: function () {
      return filter(this.library, matchesProperty('Exclusive Shelf', 'read'))
    },
    toReadLibrary: function () {
      return filter(this.library, matchesProperty('Exclusive Shelf', 'to-read'))
    },
    currentReadingLibrary: function () {
      return filter(this.library, matchesProperty('Exclusive Shelf', 'currently-reading'))
    },
    notFinishedLibrary: function () {
      return filter(this.library, matchesProperty('Exclusive Shelf', 'not-finished'))
    }

  },
  methods: {
    bookTitleSlug: function (bookTitleString) {
      return slugify(bookTitleString, {lower: true, symbols: false})
    }
  },
  async asyncData ({ params }) {
    let library = await import('~/static/data/goodreads_library_export.json');
    let highlights = await import('~/static/data/book_highlights.json');

    highlights.map(b => {
        b.slug = slugify(b.title, {lower: true, symbols: false})
    })

    library.map(b => {
        b.slug = slugify(b.Title, {lower: true, symbols: false})
    })
    return { library, highlights }
  }
};
</script>
<style>
.book {
  grid-template-columns: 55% 1fr 1fr;
  display: grid;
  grid-column-gap: 5px;
  padding-top: 5px;
}
.book.current {
  grid-template-columns: 65% 1fr;
}

#footer {
  font-size: 14px;
  font-family: Courier, 'Courier New', monospace;
}

.book-attribution {
  opacity: 0;
  transition: all 0.25s ease-out;
  cursor: default;
}

.book-highlights:hover .book-attribution {
  opacity: 1;
}

#nav {
  text-align: center;
}
#nav li {
  display: inline-block;
}
</style>
