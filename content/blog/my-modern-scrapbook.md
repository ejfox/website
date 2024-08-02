---
dek: In which we attempt to craft some treasure from the debris of a life lived on the internet
inprogress: true
date: 2022-12-05T18:34:09-05:00
modified: 2024-08-02T12:26:26-04:00
tags: organization process tech personal
---

## Building myself a scrapbook

I have gotten pretty good at saving interesting things that I see on the internet. On my iPhone, I have the Pins app, which allows me to take any link I see and add it to my Pinboard bookmarks, and even mark it to read later. Anytime I read something I think I might want to reference, show someone, or think about later, I chuck it into my bookmarks. I've done this for over 10 years now, making little notes of my favorite things in an ever-expanding deluge of "content", and now I want to take a step back and map the constellations of my mind that emerge.

When I see cool visuals that I want to save, I use the service are.na , which is sort of like a grown-up tumblr with a lot of powerful capabilities around exploration and organization. Are.na lets you organize “blocks” which might be images, text, or links, though I primarily use it for images. Blocks can themselves be organized into channels, and it is very easy to pull another user’s blocks into your own channels, and vice versa.

![The index of all of my are.na channels, grouped into different categories by emoji](http://res.cloudinary.com/ejf/image/upload/v1722609675/Screenshot_2024-08-02_at_10.41.03_AM.png)

I also write a lot of code. I’ll have a new idea, clone my template, make a little prototype, create a github repo for it, and if I’m a good little boy, I will fill it with Issues and notes of plans to enhance it later when I get more time.

Sometimes when I think about something, I’ll tweet out my thought process in pulbic. Or, I used to tweet about it, I post on Mastodon now. These are tiny public-facing diary entries that capture my thoughts and thought processes on a particular day or topic, likely inspired by the stuff I am bookmarking, screenshotting, and researching.

I'm constantly taking screenshots; of inspiration, of works in progress, weird glitches, and things that inspire me. This forms an interesting visual historical record of what I am working on at a particular time, and allows me to quickly reference moodboards and inspiration for different projects, like my channel of [teapot inspiration](https://www.are.na/ej-fox/teapots-f_pi17ebgzq) or [print/lino work](https://www.are.na/ej-fox/print-lino-inspiration) or [information graphics](https://www.are.na/ej-fox/information-graphics-p_tbc8ske6g).

![](http://res.cloudinary.com/ejf/image/upload/v1722609820/Screenshot_2024-08-02_at_10.43.12_AM.png)

Lately, I've been talking to lots of different [robots](https://en.wikipedia.org/wiki/Large_language_model) lately– and I find myself wanting to reference a piece of information, or even wishing the robot would have already seen my last 10 bookmarks as I stumble through figuring out the hidden threads that are often key to a new creative idea.

My bookmarks are also filled with a lot of, I think, useful information about the world that inform how to be intelligent and behave ethically in our modern world. A lot of my worldview is captured in this hand-curated corpus, and having it at my disposal to train and fine-tune various robots seems exceedingly useful. In the future, it may be that everyone lugs around a corpus of information used to initialize a robot into their worldview, culture, and overall vibes.

![Pinboard makes a little visualization of my top tags: data, dataviz, design, howto, politics- this is a pretty accurate representation of my brain](http://res.cloudinary.com/ejf/image/upload/v1722609879/Screenshot_2024-08-02_at_10.44.24_AM.png)

All of these things; mastodon posts, pinboard bookmarks, are.na blocks, can be thought of various scraps of paper sitting on my desk, clipped out from some source material. You could also potentially think of them as unique hypercards, to be stacked, grouped, and inter-referenced. But first I needed to reclaim my data from the various services in which they live.

## The groundwork for customized interfaces

A key missing element in making this workflow useful to me is building tools and interfaces for exploration and organization. I feel pretty confident about my mechanisms of *capture* - as I spin off a number of scraps every day without even thinking about it.

But I struggle seeing the over-arching themes and connections between projects on longer timelines. Some research, projects, or threads of exploration have lasted me years. When I was collecting the material, it felt like smaller, disconnected explorations. But when put together in retrospect overarching themes become obvious.

I love tools like [Scapple](https://www.literatureandlatte.com/scapple/overview) and [Mermaid](https://mermaid.live/edit) that make it easily make mindmaps and spatially arrange and connect concepts.

![Scapple diagram sketching out an early concept for a tool to read all my bookmarks](http://res.cloudinary.com/ejf/image/upload/v1722610045/Screenshot_2024-08-02_at_10.47.11_AM.png)

This intuitively seems like the type of problem that LLMs could be helpful for.

## Retrieving my data

The first thing I did was build a [scraper to get all my Pinboard bookmarks](https://github.com/ejfox/scrapbook-core/blob/main/scripts/dl_pinboard.mjs) - then I did the same for [are.na blocks](https://github.com/ejfox/scrapbook-core/blob/main/scripts/dl_arena.mjs), [public GitHub actions](https://github.com/ejfox/scrapbook-core/blob/main/scripts/dl_github.mjs), and [Mastodon Posts](https://github.com/ejfox/scrapbook-core/blob/main/scripts/dl_mastodon.mjs) - all coordinated in [my index file](https://github.com/ejfox/scrapbook-core/blob/main/scripts/index.mjs) that handles rate limiting, sequencing, and the CLI options.

![Running the node script for the scraper](https://res.cloudinary.com/ejf/video/upload/q_auto/w_768/e_loop/v1722610899/Screen_Recording_2024-08-02_at_10.59.48_AM.gif)

I got really into reading [Command Line Interface Guidelines](https://clig.dev) which provides a bunch of guidance around creating modern CLI apps that handle errors nicely, provide help to new users, and operate in the ways people expect. Even though no one will likely be using this specific tool except for me, I will be practicing a bit of self care in the form of a well-crafted tool that I can find, and most importantly, figure out how to use months or years down the line.

The scraper currently runs on a GitHub action that runs every 8 hours and when I push an update to `main`

```yaml
name: Update Scrapbook

on:
  push:
    branches:
      - main
  schedule:
    # - cron: '0 0 * * *'  # Runs every day at midnight
    # - cron: '0 */2 * * *'  # Runs every 2 hours
    - cron: '0 */8 * * *'  # Runs every 8 hours
```

I used to have this scrape the latest changes, add them to a JSON file, and commit and push the changes. This would in turn trigger a new Netlify deploy with the latest JSON, updating my website.

But my plans quickly grew grander, and I could avoid a database no longer, so I created a table on supabase to keep everything organized and accessible everywhere in real-time.

## Enhancing my data

Retrieving my bookmarks was easy enough, but there isn't much you can do with just a URL. URLs are generally only as valuable as the information contained in them, so I added a step that goes through every bookmark, fetches the contents, and summarizes them with an LLM. I've also [released an npm package `@ejfox/gpt-browser`](https://www.npmjs.com/package/@ejfox/gpt-browser) that makes it easy to do this both in JS and from the command line.

I take the contents of the webpage, and break it into chunks based on the available token window, asking the robot to summarize it into a standalone list of facts. Once facts are generated from each chunk, I combine all of the fact lists and send them back to the robot once again, for a final summary. I then ask the robot to pick through my [list of tags](https://ejfox.com/tags.json)[^1] and decide which, if any, are applicable.

I figured while I was at it, I might as well ask the robot to try and determine a primary geographic location for the article, which I reverse geocode. Maybe later I can map or geographically query my scraps. But I have the data.

I also ask the robot to generate a list of relationships contained within the article. I've re-used the [Cypher query language](https://en.wikipedia.org/wiki/Cypher_(query_language)) - which looks like `[Person:Stewart Brand] -[:CreatedBy]-> [Publication:Whole Earth Catalog]` - and the robot is capable of writing them pretty accurately, and I can easily turn these into nodes/edges with some lightweight regex parsing.

![An example with the list of facts at the top, and the auto-generated relationship diagram at the bottom](http://res.cloudinary.com/ejf/image/upload/v1722614112/Screenshot_2024-08-02_at_11.55.00_AM.png)

I might as well also generate an embedding of the text summary, so I can do similarity searching and clustering/mapping down the line.

![](https://res.cloudinary.com/ejf/image/upload/v1719800138/Screenshot_2024-06-30_at_10.15.26_PM.png)

With all this data carefully collected and analyzed, it's time to start exploring and arranging it.

## Exploring my data

The robot and I created a [command-line tool to explore my scraps](https://github.com/ejfox/scrapbook-cli) – partially for the practicality of having a fast, responsive interface I can keep open on my screen, and also for potential *aesthetic*[^2] usage in future videos and livestreams. I ended up making a little [helper library of useful CLI patterns](https://github.com/ejfox/cybermaint-toolkit) I found myself reusing while making it, like a typing-style animation, playing sounds, and a glitch effect.

![](https://res.cloudinary.com/ejf/video/upload/q_auto/w_768/e_loop/v1722610907/Screen_Recording_2024-08-02_at_11.00.13_AM.gif)

I've also been itching to replace my doomscrolling with something productive, and I wish that in the moments I caught myself aimlessly wading through brainrot videos, I was instead doing something creative. Going back through my research isn't exactly the same as *making something*, but it's definitely better than other ways I spend my time. So I decided to create an [infinite-scrolling interface for my scraps called scrapscroller](https://github.com/ejfox/scrapscroller).

![](http://res.cloudinary.com/ejf/video/upload/q_auto/w_768/e_loop/v1722611463/Screen_Recording_2024-08-02_at_11.10.26_AM.gif)

## Quickly recalling my research

I created an [Alfred workflow](https://github.com/ejfox/scrapbook-core/blob/main/Local%20Scrap%20Search.1.1.alfredworkflow.zip) that makes it really easy to search through a local sqliteDB mirror of my scrap database [through a .js file](https://github.com/ejfox/scrapbook-core/blob/main/scripts/search_sqlite_scraps.js). In order to do this, I had to write some scripts to [set up the sqlite table](https://github.com/ejfox/scrapbook-core/blob/main/scripts/setup_sqlite.mjs) and another to [fetch my bookmarks into it](https://github.com/ejfox/scrapbook-core/blob/main/scripts/sync_supabase_to_sqlite.mjs) - but with that all done, the result is near-instantaneous and feels quite magical.

![](https://res.cloudinary.com/ejf/image/upload/v1722573787/Screenshot_2024-08-02_at_12.42.54_AM.png)

## Sharing with others

I also created the [/scrapbook](https://ejfox.com/scrapbook/) section of my website, that shows all of my recent internet actions all in one place, primarily for my own consumption. Theoretically, if you cared enough, you could watch me work through things in real time; gathering inspiration, thinking through ideas, writing code, and making things. I do this for a bunch of reasons. I do it to be accountable, to make promises in public, to share knowledge, to send to friends after a conversation, and to simply remember it all later.

[/scrapbook/verbose/](https://ejfox.com/scrapbook/verbose/) is a table-style, information-dense view of all of my recent scraps with the goal of making it easy to see a lot at once, in order to see patterns / links over a larger period of time, since only 1 or 2 scraps fit into a screen in the normal view.

![](http://res.cloudinary.com/ejf/image/upload/v1722612330/Screenshot_2024-08-02_at_11.25.18_AM.png)

[/scrapbook/graph/](https://ejfox.com/scrapbook/graph/) is the foundation of a network-based view of my scraps, beginning with tying each scrap together sequentially and placing them on the screen horizontally based on the day they were saved. But I am hoping eventually the network of scraps can be explored through shared tags, references, and entity relationships.

![](http://res.cloudinary.com/ejf/image/upload/v1722612365/Screenshot_2024-08-02_at_11.25.53_AM.png)

### Public bibliography

This public record of work that influences me is also particularly useful as I try to do a better job of publishing my work. As I wrote this very essay, I looked up a few links I had gathered in the process of researching how to best build these systems. This helps me give credit more readily and accurately. By sharing my path, hopefully others who want to talk it can do so more easily. I have been blessed with so much wisdom, given freely on the internet in my lifetime, it would be an honor to return the favor.

## Take control of your own data, make your own systems

I created a [30 minute YouTube video](https://www.youtube.com/watch?v=Ly3BXZbWOak) where I code a custom interface to are.na. The goal was to make the idea of creating custom interfaces for our own data accessible. When our data is held by ethical, logical institutions, we can take it out and play with it if we want. Instead of using technology purely as a method of consuming algorithmic feeds, that we have no control over, tuned to maximize engagement instead of our own happiness and creativity. We can (and should) remake these systems in ways that benefit us and the people around us, in ways that align with our own moral compass and worldview.

The ability to own, possess, remix, and re-explore my own data is crucial for me to make sense of the world. It's how I access my own thoughts, understand *how* I think about things, and to find creative paths forward and decide what is worth focusing on. If I gave up those responsibilities to a faceless algorithm whose goals are quite different from my own, I would be giving up quite a lot. You are what you eat.

[^1]: Having a publicly-available JSON file with all my tags has proven helpful when creating a bunch of interlinked tools without having to copy this list between them all, or having to update multiple codebases if I want to change it. This file, at the base directory of my website, will forever be the source of truth for my current top-level tags across *all services*, and will hopefully reduce the creation of redundant tags, as the whole point is to find patterns and connections.
[^2]: Did you know that the `blessed` library lets you draw little [ascii art maps](https://github.com/yaronn/blessed-contrib?tab=readme-ov-file#map) from lat/lngs? It's super fun.