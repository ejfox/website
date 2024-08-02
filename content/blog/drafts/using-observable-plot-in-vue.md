---
dek: "In which we use two javascript frameworks to quickly scale from prototype to functional tool"
inprogress: true
date: "2022-12-15T15:18:53.000Z"
modified: "2024-07-18T18:27:31.000Z"
tags: "tech howto"
hidden: true
draft: true
---
## Using Observable Plot in Vue

#dataviz #howto

[Observable Plot](https://observablehq.com/@observablehq/plot) is an awesome tool for quickly sketching and exploring data. It is wonderful when paired with Vue, which can handle user interactions, routing, and state management that can be a bridge between a [[2022-prototyping-toolkit |prototype]] and a functional tool.

>[Observable Plot](https://github.com/observablehq/plot) is a free, open-source JavaScript library to help you quickly visualize tabular data. It has a concise and (hopefully) memorable API to foster fluency — and plenty of examples to learn from and copy-paste.

[From the Observable Plot page](https://observablehq.com/@observablehq/plot)

Plot makes it very easy to try out lots of different visual forms without hand-building everything. Because of that, Observable and Plot are a crucial part of the exploratory process of beginning to become acquainted with a dataset and beginning to [interrogate a dataset](https://observablehq.com/@ejfox/data-interrogation-template)

### Getting set up

`npx nuxi init PROJECT-NAME` installs a blank [Nuxt 3](https://nuxt.com) project ready to go.

#### Getting Observable Plot into Vue

`yarn add @observablehq/plot` adds Plot to our project.

Then, at the top of any component where we want to use Plot, we need to import it: `import * as Plot from '@observablehq/plot'`

### Making a chart with Plot and rendering with Vue

Vue and Observable Plot live in slightly different worlds that we need to bridge a bit. When we change our data, we want our Plot to automatically re-render. When we resize our page, we also want our Plot to automatically re-render. We will need to handle some of that in the way we build and call our chart within Vue.

#### Making a function to make the viz

```js
function makePlotLineGraph(city, targetContainerId) {
const chartPlot = Plot.plot({
	width: 500,
	height: 500,
	style: {
		background: "black",
		color: "white"
	}
})
  
return chartPlot
}
```

#### Getting the data and rendering it

#### Triggering chart updates when the data changes

First we load the data using fetch:

```js
fetch('/cities.csv')
.then((response) => response.text())
.then((data) => {
// Set all of the city data
cities.value = csvParse(data);

// Set the city data for the active city based on the prop
city.value = cities.value.find((city) => city.name === props.cityName);
});
```

We need a computed property that holds the HTML of the rendered Plot based on the data we just updated.

```js
// make a computed that gets the HTML for the chart

const chartHTML = computed(() => {
if (city.value) {
// If we have a city, make a chart
return makePlotLineGraph(city.value, 'chart').outerHTML
} else {
// Otherwise, return an empty div
return '<div></div>'
}
})
```

Then we render this computed HTML with a simple template

```vue
<div ref="chart" id="chart" v-html="chartHTML"></div>
```
