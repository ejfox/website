---
dek: In which we give the robot a bunch of data and ask it to tell us what it means
inprogress: true
date: 2023-07-19T08:27:21-04:00
modified: 2023-12-17T19:11:07-05:00
tags: machinelearning data
---

## Data-driven sentences with LLMs

I am a big fan of data visualization, but it is even better when paired with well-crafted human readable text that reiterates or enhances what the visual is conveying. Graphics and text used together in this way can create something greater than the sum of their parts.

These data-driven sentences can be enhanced *even further* with Large Language Models (LLMs) if given the correct contextual data, templates, and prompting. This data-driven text can help make data graphics and user interfaces more understandable to our users, and provide a way to surface interesting contextual information that might not have a place in a traditional user interface.

Historically data-driven sentences have followed a sort of “mad libs” formula, where a sentence template is created and variables are filled in. These results can sometimes feel robotic, less like a caption and more like a receipt! But even within these limits, the results are pretty good.

In this article we are going to explore different techniques and experiment with both how to provide contextual data and correctly prompt LLMs to be produce high-quality and factual data-driven sentences based on our own datasets.

## Example: Summarizing a Scatterplot

Scatterplots are useful visual explanations, but are sometimes hard to read if you don't already know what is being plotted and what the axes are. As a reader, I much prefer a scatterplot accompanied by a short explanation of what it shows, and maybe some useful annotations of the outliers.

Data-driven sentences can help with this.

### Summarizing groups of datas
#### LatentScope: summarizing UMAP clusters of qualitative data

One experiment in data-driven sentences happened during the development of LatentScope with Room 302 Studio Member Ian Johnson who built a tool to create embeddings from any CSV, map, cluster, and explore them. We were curious about the groupings the tool created, and we would often poke around the individual nodes in each group to get a sense of what the commonalities were.

To automate summaries and naming of the groups, we take a random sample (as much as will fit in token space) and prompt-stuff that before our request; “can you summarize the common themes between these entries?”

The automated summaries proved to be surprisingly high-quality.

#### Electology: data-driven election results and history
#### Gpt-browser: summarizing webpages info facts in the command line
