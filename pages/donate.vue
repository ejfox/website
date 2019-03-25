<template>
  <section class="w-80 center tc pa5 f3">
    <div>
      <a class="donate-with-crypto"
         href="https://commerce.coinbase.com/checkout/b33a499d-e032-4554-967c-2353d15d8651">
        <span>Donate to EJ Fox with cryptocurrency</span>
      </a>
      <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807">
      </script>
    </div>

    <h2 class="mv5">OR</h2>

    <h3>Send directly to BTC address</h3>
    <img src="/coinbase-bitcoin.png" class="w-100 w-50-ns" alt="">

    <h3>Send directly to BCH address</h3>
    <img src="/coinbase-bitcoin-cash.png" class="w-100 w-50-ns" alt="">
  </section>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  mounted: function () {
  },
  methods: {
  }
};
</script>

<style>
</style>
