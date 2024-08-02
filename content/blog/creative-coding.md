---
date: 2021-02-10T05:00:45-05:00
type: words
hidden: false
inprogress: true
dek: In which a computer is used as divination tool for random numbers (for the purposes of beauty, art, and poetry)
modified: 2024-06-21T10:11:27-04:00
---

## Generative Art

Writing code that makes shapes move on a screen is a rewarding feeling.

It is a medium that lets you be surprised as an artist. I like making art where I can assemble tiny pieces and step back and be surprised at what I have made.

Working with certain materials have their own creative minds, like pottery or watercolors. You feel you are in a partnership with your material more than the master of it.

Making a creative partnership with computers is an incredibly pleasurable way to spend time, at least for me. Computers are incredibly powerful and have an infinite capacity to surprise. Finding new ways to tune into the computer's ability to contribute as creative partner and diviner of random numbers is a lot of fun for me.

::table-of-contents

::

### My experiments in creative coding

I have never been able to create photo-realistic work when drawing or painting by hand. In drawing class growing up, I would find myself drawing an "icon" of the thing rather than of what it actually looked like.

My trees looked like robotic cutouts and nothing like an actual tree, organic and asymmetrical. I preferred to focus on outlines and silhouettes over shading. This played a part in my choice to pursue design over art as a teenager. Even when I pushed myself to focus more on lighting as a street photographer, I struggled to draw or paint what's in front of me in a literal way. I am still working on this through watercolors, focusing on organic shapes of plants has helped a lot.

Creating something with a computer as a partner often looks like creating a bunch of parameters that control different aspects: color, distance, size, direction and then handing those controls over to the computer to go wild with. From there it's a matter of tuning how much control to give over, and where.

My goal is always to be surprised by the work, and to come across something I could have never designed at the outset. It's a way to jam out and get into that [flow](<https://en.wikipedia.org/wiki/Flow_(psychology)>) of creation that is always eluding me.

#### 417am1975: My Twitter art-bot

[@417am1975](https://twitter.com/417am1975) is [a generative Twitter bot that tweeted randomized art every hour](https://twitter.com/417am1975/status/897299813074706434) for a couple of years, running on a Heroku instance. He's currently taking a break.

I would create a new generative art script after work to unwind. I would save it into a directory that 417am would look at every time he wanted to make a tweet. He would run it with a new set of random numbers and tweet it out.

I liked this a lot because I would be surfing Twitter throughout the day and be pleasantly surprised with something I liked – something 417am had made based on one of my scripts. They were familiar but the special ones jumped out as something I never would have thought of.

#### Glitch Generative Audio Experiments

I made a [series of little experiments on Glitch](https://glitch.com/@ejfox/generative-music) where I played with different javascript approaches to generative sound and music.

One of the things that I discovered is the importance of **loops** and **repetition** in what humans will consider music. I did a lot of approaches where the machine would just rumble forward, randomly picking the next note as it went, never repeating. It made some interesting and unusual sounding "music" but I never achieved what I set out to.

I think some next steps would be to use this as an engine and then provide some way for a user to "lock" the machine into its current parameters and loop it. Or even for the machine to have looping built into its DNA, which I did not experiment with much.

##### Javascript Generative Audio Tools

- [Tone.js](https://tonejs.github.io) is a great tool for generating sounds in the browser, and you can create your own oscillators, FX chains and play back samples (plus adjust their speed, start, and end positions)
- [Tonal](https://github.com/tonaljs/tonal) is a library to help you do musical math, work with scales, chords, and more. This lets you play around in different common patterns of music without needing to become intricately familiar with it.
- [Chance.js](https://chancejs.com) makes the experience of adding randomization to your project really pleasurable. I would feed it a musical scale I obtained from Tone.js and have it `.pick()` within that.

### What I Want to Try More

I want to keep experimenting with more with different types of outputs.

#### Raspberry Pi / Installations

I experimented with using Processing in combination with a node script to create an [automatic doomscroller](https://www.youtube.com/watch?v=MWeooNA8D6w) that pulls the latest headlines from various news sources with a modified version of Brad Oyler's [newsdivide](https://github.com/bradoyler/newsdivide). I tried to get a version of it running on a Raspberry Pi, but I ran into trouble capturing screenshots of the news sites with [puppeteer on the raspberry pi](https://stackoverflow.com/questions/60129309/puppeteer-on-raspberry-pi-zero-w) – but I like the idea of creating a generative piece of art and running it in the background on a screen through the raspberry pi.

#### Audio Visualization

I've experimented in the past with [the OS X VJ software CoGe](https://imimot.com/cogevj/) which I really enjoyed for BPM-syncing effects and looping videos and GIFs. Unfortunately it doesn't run on Catalina and the new version hasn't been released yet. But as a fan of music and DJ'ing and live music creation, I think that creating visuals both for livestreaming and also, maybe, eventually, in-person parties is a really interesting outlet for generative art.

### What I think the next 5-10 years will hold

#### Spatialization and Collaboration

I am excited to use shared online spaces to collaborate with friends and create generative art together. I want to create things where even a non-technical friend could come into a virtual space with a generative art piece, and start pulling knobs and levers and sliders and hitting buttons and seeing what the results are (and then save them out into a gallery for future visitors to explore).
