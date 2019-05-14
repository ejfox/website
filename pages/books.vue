<template>
  <section class="center db cf pa3 pa4-l">

    <section id="nav" class="w-100 db cf">

    </section>

    <section
      class="mv4 pa4 pb0 b--gray ba measure center">
      <h2 class="mb2 dark-gray tc lh-title">Currently reading</h2>
      <BookList :books="currentReadingLibrary" />
    </section>

    <h2 class="mb2 dark-gray">Books read</h2>
    <section class="mv3 measure dark-gray">
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

    <section class="measure">
      <h2 class="mv4 dark-gray">Book highlights</h2>
      <section
        v-for="book in highlights">
        <h3
          class="mt2 pv2 bt b--dark-gray"
          :id="book.slug">
            <a :href="'#'+book.slug"
              class="link black">
              {{book.title}}
            </a>

          </h3>
        <h4 class="gray">{{book.author}}</h4>
        <section
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
        </section>
      </section>
    </section>

    <h2 class="mb2 dark-gray">Want to read</h2>
    <section class="mv3 measure">
      <p>These are books that I've acquired or have come up in my research but that I haven't had a chance to read yet.</p>
    </section>
    <section class="gray">
      <BookList :books="toReadLibrary" />
    </section>

    <section id="footer">
      <small class="db tc">
        Powered by <a href="https://www.goodreads.com/user/show/9273959-ej-fox">goodreads</a>
      </small>
    </section>

  </section>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import slug from 'slug'
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
    bookTitleSlug: function (bookTitleString) {
      return slug(bookTitleString, {lower: true, symbols: false})
    }
  },
  async asyncData ({ params }) {
    let library = await import('~/static/data/goodreads_library_export.json');
    let highlights = await import('~/static/data/book_highlights.json');

    highlights.map(b => {
        b.slug = slug(b.title, {lower: true, symbols: false})
    })

    library.map(b => {
        b.slug = slug(b.Title, {lower: true, symbols: false})
    })
    return { library, highlights }
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
