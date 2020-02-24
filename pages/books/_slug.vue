<template>
  <section class="center db cf pa3 pa4-l">
    <section class="measure" v-if="book">
      <h2 class="mv4 dark-gray">
        <span class="">{{book.title}}</span> 
        <span class="gray ma0 ml2 ml0-ns db-ns">by {{book.author}}</span>         
      </h2>
      <nuxt-link to="/books/#highlights" class="black">
        Back to list of books with highlights
      </nuxt-link>

      <h4 class="mt4">Highlights</h4>      

        <section
          v-for="(highlight, i) in book.highlights"
          class="mv4 book-highlights"
          :id="i+1">
          <h5 class="serif">
            <a
              class="gray db link sans-serif"
              :href="'/books/' + book.slug + '/#' + (+i + 1)">
              #{{i+1}}
            </a>
          </h5>
          <span
            class="bg-light-yellow">
            {{highlight}}
          </span>
        </section>
      </section>      

      <section id="footer">
        <small class="db tc">
          Powered by <a class="link black underline" href="https://www.goodreads.com/user/show/9273959-ej-fox">goodreads</a>
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

    const bookSlug = params.slug    

    highlights.map(b => {
        b.slug = slugify(b.title, {lower: true, symbols: false})
    })

    library.map(b => {
        b.slug = slugify(b.Title, {lower: true, symbols: false})
    })

    const book = _.find(highlights, (h) => {
      return h.slug === bookSlug
    })
    return { library, highlights, book }
  }
};
</script>
<style lang="stylus">
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

@media (prefers-color-scheme: dark) {
  .bg-light-yellow {
    background-color rgba(255,255,255,0.1) !important
  }    
}
</style>
