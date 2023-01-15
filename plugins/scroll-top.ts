export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:finish", async (a) => {
    // check if the route includes a hash, and if it does not, scroll to the top of the page
    if (!window.location.hash) window.scrollTo({ top: 0 });

    // otherwise scroll to the element with the id of the hash
    else {
      const hash = window.location.hash;
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }
  });
});
