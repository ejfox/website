<template>
  <div>
    <section
      v-for="book in books"
      itemprop="mainEntity"
      itemscope
      itemtype="http://schema.org/Book"
      :class="['book db mb1 mb4-l pa1', current ? 'current' : '']">
      <span class="b link black"
        itemprop="name"
        :title="book['Number of Pages']+' pages, Avg goodreads rating: '+ratingToStars(book['Average Rating'])">
        {{book.Title}}
      </span>

      <span class="pl2 gray" itemprop="author">
        {{book.Author}}
      </span>

      <span 
        v-if="!current"
        class="gray" itemprop="ratingValue"
        :class="[book['My Review'].replace(/<(?:.|\n)*?>/gm, '') === '' ? '' : 'yellow pointer']"
        :title="book['My Review'].replace(/<(?:.|\n)*?>/gm, '')">
        {{ratingToStars(book['My Rating'])}}
      </span>

      <!-- <small class="system-sans-serif gray" itemprop="dateCreated">
        {{book['Original Publication Year']}}
      </small> -->

      <!-- <span
        class="f5" itemprop="numberOfPages">
        <span
          v-if="book['Number of Pages'] !== ''">
          {{book['Number of Pages']}}
        </span>
      </span> -->

    </section>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    books: { type: Array, default: function () { return []} }
  },
  data: function () {
    return {
    }
  },
  methods: {
    ratingToStars (rating) {
      const star = '★'
      let starString = ''
      for (var i = 0; i < rating; i++) {
        starString += star
      }
      return starString
    }
  },
  mounted: function() {
  }
};
</script>
<style>

</style>
