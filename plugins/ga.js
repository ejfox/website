import VueGtag from 'vue-gtag'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueGtag, {
        config: {
            id: 'UA-319549-1',
        },
    }, nuxtApp.$router)
})