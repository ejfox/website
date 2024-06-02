---
dek: In which
inprogress: true
date: 2022-12-05T18:34:09-05:00
modified: 2024-06-02T00:36:36-04:00
tags:
---

## Advanced Animations and Transitions in Vue

## Properly keying is essential

Many bugs with animations and transitions often come to not properly keying various elements in a `v-for` - this means the animation can't keep track of the [object constancy](https://bost.ocks.org/mike/constancy/) and things behave strangely. Each key must be unique to each individual thing you want to animate.

## Deciding between JS and CSS animations

A lot depends on how complicated you want an animation to be, if you want to stagger or delay parts of the animation, what properties you want to animate, if you want to pull sound into your animation, the mechanism you will use to trigger the animation, and how many DOM elements you will be animating at once.

### Integrating Anime.js and Vue

Anime.js has an incredibly well-designed interface for designing performant animations. We will use it in combination with Vue's ref system so that we can maintain performance and keep our code as simple as possible.

## Appearance Animations

By adding the [appear prop] to the `<Transition appear>` the transition will be applied on the initial render.

## Event Animations

Sometimes we want an animation to be triggered when an event happens, like data being successfully fetched, user input, or some other sort of change. Anime makes this easy, as we can define the animation in a function and then pass the element into it as needed, using our existing event structure.

## Vue's Built-In Enter/Leave Transitions

Vue has `Transition` and `TransitionGroup` components [built in](https://vuejs.org/guide/built-ins/transition) to apply animations when elements are added or removed, or change position within a v-for.

### Named Transitions

You can create a named transition and define it in CSS.

```vue
<Transition name="fade"> ... </Transition>
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Custom Transition Classes

Some libraries like [Animate.css](https://daneden.github.io/animate.css/) provide a bunch of premade animations which can be invoked by adding class names to an element.

In Vue you can specify CSS class names to be added to the element at certain portions of the lifecycle:

```vue
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

### Transition Javascript Hooks

The `<Transition>` element also provides a number of handy event-style hooks that will allow us to use javascript to animate the element in more elaborate ways.

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>

</Transition>
```

## Page & Element Transitions

Nuxt provides [page transitions](https://nuxt.com/docs/getting-started/transitions#page-transitions) that let you apply classes as the route or [layout](https://nuxt.com/docs/getting-started/transitions#layout-transitions) changes.

```
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
```