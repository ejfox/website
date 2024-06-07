---
draft: true
dek: In which we study the art and science of using little dots to represent people on a map
inprogress: true
date: 2022-11-02T19:56:37-04:00
modified: 2022-12-23T09:10:34-05:00
---
# Dot Density Mapping in JS and QGIS

#dataviz #howto

The visual representation of data can be tricky business, and one of the most deceptive forms is choropleth maps, where features are filled in with a single color to represent a data point. It’s easy to get fooled by this practice – the larger the feature, the more prominent it appears in a map, giving the false illusion that there is more of something than there actually is.

Take, for instance, election data. A large majority of votes come from small counties or towns that are barely visible on a map showing country-wide results. While these counties may account for a huge percentage of votes, they’ll still appear in the same color as a state that has very few votes.

For visual forms like this, it’s important to pay special attention to the color scale, otherwise the information presented can be completely off.

Another approach is to avoid choropleth maps and, where possible, use a [dot distribution map](https://en.wikipedia.org/wiki/Dot_distribution_map). 

## How and when to use dot-density
## Prior work
- [Racial demographic dot-density map by Aaron Williams](https://observablehq.com/@aboutaaron/racial-demographic-dot-density-map)
- [Segregation map: America’s cities 50 years after the Fair Housing Act of 1968 - Washington Post](https://www.washingtonpost.com/graphics/2018/national/segregation-us-cities/)
- [Dot Density election maps of America by Benjamin Schmidt](https://observablehq.com/@bmschmidt/2020-election-dot-density)
- [A Dot for Every Vote Map](https://www.esri.com/en-us/maps-we-love/gallery/election-2016-dot-density)

## Using census race data for racial dot-density maps

Compared to choropleth maps, dot-density maps provide a more granular level of detail. This is especially beneficial when analyzing at small-scale areas, where a choropleth’s single-color scheme could obscure unintended details. 

For example, dot-density maps would be preferred in population analysis. By plotting individual dots across the map, one can easily observe pockets of higher or lower populations. This can be extremely helpful in targeting areas of concern or planning future developments.

I'm going to walk through how to create dot density maps in code with Javascript (With Canvas, D3, and Topojson) as well as through a GUI with QGIS. These tools provide different approaches and final products, depending on what you are looking to do. 

For example, Javascript enables us to customize the data and UI to better fit our needs, but it also requires a good amount of coding. This can be difficult for those who are not familiar with coding. On the other hand, QGIS is much more user-friendly and can produce great visuals with fewer things to learn to get a result. 

## Javascript Dot-Density Mapping

## QGIS Dot-Density Mapping
