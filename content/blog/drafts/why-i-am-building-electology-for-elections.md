---
draft: true
dek: "In Which Election Chaos is Tamed by a Deceptively Simple, Data-Fueled Marvel"
date: "2022-11-03T01:05:53.000Z"
modified: "2023-08-09T18:32:25.000Z"
tags: "politics dataviz america"
hidden: true
---
# Why I Am Building Electology

In this era where understanding election results has mutated into a labyrinth of guile and gamesmanship, the majority of the tools we have at our disposal are woefully inadequate. The majority of these options lack the flexibility to explore in a user-friendly way or require proficiency in data analysis tools and programming languages. 

Moreover, most visualizations need extensive effort and time to create from scratch. I should know; I [helped create the app powering NBC's Big Board](https://www.newscaststudio.com/2018/11/05/nbc-big-board-update/) which has been wielded live, under fire for the past half-decade

Election analysis is not static - things change all the time, often due to shifts in demographics, policies, platforms, and more. Electology addresses this by allowing users to synthesize data from multiple sources and time periods while also using intelligent algorithms to create continuous information sets covering any point in time. This makes it easier than ever to trace trends across election cycles and geography.

It is hard to know in advance what will be interesting in the weeks surrounding an election, and being able to zoom into the most accurate detailed information on any town, county, or district is crucial to being able to nimbly respond to breaking news events and understand their significance.

The backbone of Electology’s powerful analytics capabilities lie in its atomic units of analysis: **candidates, races, states, counties, districts, and precincts**. By analyzing these fundamental elements separately and then bringing them together into a cohesive whole, we can unlock comparisons and trends that paint a more complete picture of what is driving elections trends. 

---

*Electology is a data-driven platform that simplifies election analysis and visualization. It synthesizes data from various sources and time periods, allowing users to explore trends and generate insights with just a few clicks. The platform focuses on year-round election analysis using the atomic units of candidates, races, and features. By combining a variety of historical and demographic datasets, Electology enables non-technical users to create novel analyses and visualizations.*

---

Unlike many other election results apps, which are often created by news organizations focused on election night, we are focused on **year-round election analysis** that is constantly updated with the latest data and technology.

We combine a number of historical open-source datasets and synthesize races, features, and candidates into a comprehensive optimized knowledge base. This allows us to combine analyses that would have previously required bouncing between data sources and tools, and gives the power to a non-technical user to explore questions and create novel visualizations.

Because I have spent so much time gathering and synthesizing data, I have open-sourced a collection of [election-related Javascript helpers](https://www.npmjs.com/package/election-helpers), a tool for creating [fake election data for testing](https://observablehq.com/@ejfox/election-data-generator), and I hope to continue to contribute to the elections and open-source communities. 

These tools have already helped Electology by moving often-repeated Election logic to one location, and making it easy to stress-test any tool that depends on Election data by creating fake testing data with erroneous winner flags, long candidate names, and blow-out elections - all with optional fictional candidates, parties, and colors.

Despite its complexity and depth, Electology has been designed to be as straightforward and user friendly as possible. Care and attention has been paid to the experience of expert-level political fanatics as well as the everyday voter. 

All the tools are just a few clicks away, presented in an attractive and intuitive interface so anyone can start exploring right away without extra effort. 

After a decade of working in data visualization and cartography, one of my personal joys is working on Electology's novel visualizations. Electology showcases a number of new beautiful and innovative data visualizations and maps for easy consumption of complex data sets. 

Electology will be invite-only, with a monthly fee that supports development and data procurement. Sign up for the waitlist at <https://electology.co>

---

See also: [[things-ive-learned-about-elections]]

#elections #process #programming
