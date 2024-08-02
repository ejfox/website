---
dek: In which we deploy Nuxt 3 to Netlify and avoid a variety of potential pitfalls in the process
inprogress: true
date: 2023-08-28T11:58:16-04:00
modified: 2024-06-07T14:32:55-04:00
tags: tech programming
---

## Deploying Nuxt 3 apps to Netlify

### Pinia Store
```js


// Plain olf Vue 3 refs
const colorBy = ref('name');
const sizeBy = ref(null)

// But say we want to use a store instead
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app';
const state = useAppStore();

// We might be tempted to do this...
// Bad! Not reactive!
const colorBy = state.colorBy
const sizeBy = state.sizeBy

// Good! Reactive refs from the store
const {
  colorBy,
  sizeBy
} = storeToRefs(state)

// These refs can now be used by v-model
```