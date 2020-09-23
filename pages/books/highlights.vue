<template>
  <section class="center db cf pa3 pa4-l">

    <section class="" id="highlights">
      <h2 class="mv2 mh0 pa3 ph0">Book highlights</h2>
      <section
        v-for="book in highlights">
        <h3
          class="mt2 mt4-ns pv2 b--dark-gray"
          :id="book.slug">
          <nuxt-link 
            :to="'/books/'+book.slug+'/'"
            class="link black underline">
            {{book.title}}
          </nuxt-link>
          <span class="gray db-ns">{{book.author}}</span>
          </h3>
          <div v-if="book.highlights.length === 1">
            {{book.highlights.length}} highlight
          </div>

          <div v-else>
            {{book.highlights.length}} highlighted passages
          </div>
        
        <!-- <section
          v-for="(highlight, i) in book.highlights"
          class="mv4 book-highlights"
          :id="book.slug+'-'+i">
          <a
            class="gray db link sans-serif"
            :href="'/books/#' + book.slug + '-' + i">
            #{{i+1}}
            <span class="book-attribution moon-gray ml1">
              {{book.title}} by {{book.author}}
            </span>
          </a>
          <span
            class="bg-light-yellow">
            {{highlight}}
          </span>
        </section> -->
      </section>
    </section>

    <!-- <h2 class="mb2 dark-gray">Want to read</h2>
    <section class="mv3 measure">
      <p>These are books that I've acquired or have come up in my research but that I haven't had a chance to read yet.</p>
    </section>
    <section class="gray">
      <BookList :books="toReadLibrary" />
    </section> -->

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
    Nav
  },
  data() {
    return {
      title: 'Highlights | EJ Fox',
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
