---
dek: In which the author muses about 2013-era web design aesthetics
type: words
hidden: false
inprogress: false
date: 2013-01-25T05:00:00-05:00
hidetimestamp: false
modified: 2024-06-21T10:13:21-04:00
---

## The Magazine Experience on the Web

**For the past couple of years, I’ve been obsessed with the metaphor of the online magazine.**

I think the web has more to offer a storyteller’s end product than previous venues. Seamless combinations of mediums will continue to evolve, inspired by the traditional magazine’s “special feature”. _This evolution will raise the bar for anyone, journalist or otherwise, who wants to tell stories on the web._

I know I’m not the only one. People already [understand that the attention span of readers is dwindling](http://www.niemanstoryboard.org/2010/07/09/short-attention-span-theater-peggy-nelson-on-narrative-and-models-of-interaction/), [and](http://www.marco.org/2012/10/11/the-magazine) [bite-size articles](http://www.digiday.com/publishers/making-news-mobile-friendly/) [are important](http://ejfox.tumblr.com/post/34820860800/circa-is-one-of-the-first-real-recent-steps-forward-in). But simply adding photos to accompany your articles online doesn’t have the brilliant exclamatory effect it does in magazines. Users want more.

Recently the entire web discovered infographics, for better or worse. For a year or more they packed an instant appeal, designers could take any set of information, make it understandable and visual and people would flock to it and share it. In part because infographics were new, but also because their brevity mirrored the fast pace of the contemporary web surfer.

But I fear that golden age [has](http://flowingdata.com/2012/04/10/how-businesses-approach-infographics/) [passed](http://flowingdata.com/2012/07/04/infographics-are-like-mothers-day-cards/). _Static infographics on the web use only a tiny portion of the web’s potential_, and as users [grow more savvy](http://flowingdata.com/2011/12/08/on-low-quality-infographics/) they are realizing this as well.

### A hint of what's to come

Recently, The New York Times- ever the pioneer of online storytelling- released [Snow Fall: The Avalanche at Tunnel Creek](http://www.nytimes.com/projects/2012/snow-fall/#/?part=tunnel-creek) which was received with [high praise](http://www.poynter.org/latest-news/top-stories/198970/how-the-new-york-times-snow-fall-project-unifies-text-multimedia/) in journalist-nerd circles and beyond. There are a couple of unique points about the snow fall piece:

- _It's graphics and videos stretch to fill the entire browser window_, an emerging design trend that is the true successor of the magazine’s full-bleed photos. The Times shows that when you elevate beautiful art that’s telling the story in a seamless way, it becomes greater than the sum of it’s parts. Compare to a [similar NYT story](http://www.nytimes.com/2012/10/14/magazine/californias-central-valley-land-of-a-billion-vegetables.html) where pictures are included with the story, but certainly not featured with any love.
- It’s not confined to the style of the rest of the NYT site, which is for the most part a static 975px width. Some of the impact of full-bleed pieces like Snow Fall comes from the contrast between those special features and the whitespace of the primary site. It’s a clue to the user to dig in, and that something special is going to happen.

Some critics said that [this kind of storytelling indulgence isn’t a sustainable future of journalism](http://www.theatlantic.com/business/archive/2012/12/snow-fall-isnt-the-future-of-journalism/266555/) because of the **16-person team** required to create the piece. I think that this view forgets a time when computers filled entire rooms with as much processing power as your iPod. _I think one day (soon!) journalists will be able to do this with as little as one person_, but probably in teams of 2 or 3.

That sort of criticism gets me going too, because I know that [there](http://d3js.org/) [are](http://raphaeljs.com/) [technologies](http://developer.nytimes.com/docs) [out](http://vis.stanford.edu/wrangler/) [there](http://www.quora.com/GitHub/What-are-some-interesting-repositories-on-Github-that-can-be-used-for-journalistic-purposes) [that](https://github.com/datawrapper/datawrapper) [are](http://nvd3.org/) [just](http://timeline.verite.co/) [within](http://leafletjs.com/) [reach](https://github.com/jsoma/tabletop) of every modern journalist willing to [try](http://www.symboliamag.com/post/40203443720/editors-note-people-frequently-ask-us-how) [new ways](http://www.wired.com/wiredenterprise/2012/02/github-revisited/) of [telling their stories](http://source.mozillaopennews.org/en-US/articles/mother-jones-voter-suppression-map/). [I want to help make those tools.](http://ejfox.github.com/sStory/) I want, like others, to bring that wonderful magazine experience to the web like we haven’t seen before. But there are a handful of problems to solve and gaps to bridge before we can reach our potential.

### Full Bleed Photos

One of the greatest experiences of reading a magazine is the beauty of the first page of an article, especially one beautiful photo spread across two pages.

The Snow Fall piece echoes this aesthetic perfectly. [Others come close](http://www.theverge.com/2013/1/8/3850056/qualcomms-insane-ces-2013-keynote-pictures-tweets).

_Why aren't we seeing more of this?_ Perhaps it is due to a old-school desire of having a fixed-width site that accomodates the lowest-common-denominator screen size. But with our industry embracing responsive design I think we can do better. New(ish) CSS properties like `background-size: cover;`(<http://css-tricks.com/perfect-full-page-background-image/>) allow us to have full-screen photos that are responsive too. There’s no reason not to make your images big and bold. This is the technique I employ in my [sStory project](http://ejfox.github.com/sStory/).

Combine that with [easy access to good typography](http://designshack.net/articles/css/10-great-google-font-combinations-you-can-copy/) and you can create some beautiful things.

### Collecting stories differently

When I covered the Occupy Oakland protests throughout 2012, I didn’t think of myself as a photographer, writer, tweeter, or film maker. But I still brought out my field audio recorder, my camera, and my DSLR.

_Some moments want to be documented differently._ A crowd chanting in response to a speaker is more powerful audio than it is a photo (though combined I think they are greater than the sum of their parts). The same can be said for the difference between a photo and video of an officer arresting someone. _Our storytelling technologies should be able to seamlessly combine what we gather._ We should be able to see a quick video teaser of the article. Then a user should be able to press play on an audio documentary of an event, then scroll down the page reading a reporter’s summary of it, perhaps highlighting sections in the text and even pictures when the audio is relevant. Quotes in the text, for example, could be higlighted when the speaker says the words in the audio.

### Seamlessly importing more mediums

The interplay of mediums the user can’t control (audio / video) and their scrolling will be a key piece of the puzzle to figure out. What happens when a user is listening to the audio of one section but moves on to the next? Do we automatically play the new section’s audio? Do we ask them? Do we cut our audio down into smaller clips that are activated as a user reaches subsections of the project to try and avoid the situation?

_How do we ensure our stories make sense if a reader simply consumes the text and images of the story without engaging with any of the enhanced features?_ The answer has long been a key tenant of web design; degrade gracefully. The additional mediums we include should, for the most part, be enhancements on a straightforward story. Let the user dive in to a particular section if it interests them, and collect all of the information and images and reporting necessary to fill those needs. But for the user who wants to get their information and go, we shouldn’t get in their way. And that is a careful balance.

### Great presentation requires great stories

One of many obvious shortcomings in the incoming wash of subpar infographics is that all of the information included in them, important or not, is presented as the most important thing you should read all day. Much like a graphic [loudness war](http://en.wikipedia.org/wiki/Loudness_war) users are berated with facts they don’t care about dressed up well enough to make it past their initial reflexive bullshit-detectors, if only for a second or two. And users don’t like that. _Infographics add value by doing the work of pointing you towards what’s interesting and why (by cutting out a lot of shit!)_, not by making every fact in your report world look interesting. _The same should be true of these “special feature” web stories._ It is not a technique to turn lead into gold, but merely to do justice to the wealth of engaging journalistic mediums we have access to today.

### Everything should be naturally responsive

Your story should be able to be enjoyed no matter what screen is being used, and this means [responsive design](http://www.niemanlab.org/2012/12/the-year-responsive-design-starts-to-get-weird/). Making stories that were created to be pixel-perfect on one screen size, and then translating them into a responsive design is approach the problem wrong. The storyteller should go into the process knowing that what they make needs to hold it’s own whether on an iPhone or a desktop.

Eventually we will come to the problem of [responsive content](http://www.mediabistro.com/10000words/journalism-trend-to-watch-reader-aware-and-responsive-content_b16300). Following the age-old journalist’s pyramid of importance, we could simply chop off some extraneous paragraphs when the article is viewed on mobile. Another possibility is an editor (or an algorithm!) might re-write a **[TLDR](http://toolong-didntread.com/)** version better paced for a mobile reader. I am excited to see how this problem gets solved, but I think for now, users on mobile are usually willing to work their way through a long piece of content if broken up elegantly.

### Finding the path

_The only way forward is through experimenting_, in every way possible. As traditional newspapers gasp for air, new journalists with an innate understanding of how to tell stories on the web each take their own strike at figuring out the new way forward. _We can’t be tied to simply translating print metaphors to the web._ And as much as I think the editors, designers, and developers of news websites today know that, for the most part they’re still doing it.

It’s time for all of us to find a great story, and apply these new storytelling methods to it. If an interactive piece about an avalanche can be riveting, where are it’s descendants tackling tougher issues like war, civil unrest, and urban poverty? These are all stories with intricacies that deserve exploration in multiple mediums. We must give them all that we have, all the technology, all of the knowledge, all of our skill in storytelling to grab the attention of readers.
