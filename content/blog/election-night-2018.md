---
date: 2022-11-14T16:15:19-05:00
modified: 2024-08-01T10:21:42-04:00
---

## Election Night 2018

Around 1AM I saw a note in Slack that said, very simply, that there were bacon pancakes in studio 3B. Studio 3B had been accurately described to me as “that costco looking studio” and it held a makeshift control room. Screens were stacked at the front, different desks decked out with multiple monitors encompassing the director’s desk.

I said “It looks like you guys are launching a ship…”

“You know you’re not the first person to say that”

Jason and Adam had set up a makeshift assembly line, cooking bacon and then squirting pancake mix onto the strips and cooking them as quickly as the growing assembly of stagehands and graphics people and technical directors could eat them. Everyone was in good spirits. It was 1AM and things were, for the most part, over. Nothing had blown up. Lots of small things had blown up. But doing elections is like flying a large ship. Things break, and are designed to break, and so you use backups or take them out and figure out how to keep flying. So there is a special kinship with the people you fly with. You could have crashed and burned together. But you avoided it.

![Standing in front of a big screen with the app on it](https://res.cloudinary.com/ejf/image/upload/v1667919994/IMG_6222.jpg)

It is very strange to make an app that is put onto TV because it is performed. In a performance there is not a lot of room for error. It is definitely the most stressful thing I have ever done. To create something and hand it off to someone else and put it on a screen I have very little control of and broadcast it to 19 million people. And they translated it into Spanish at like 1 am the night before we went live. Very wild.

It felt really cool though when I went to collect my headset. Broadcast works through these radio frequencies, and for the most part it’s silent (when things are going well) and you can hear things breaking all over. “The 3A wall went to black” someone says. “The (ice) rink graphics are not loading” someone else says later. “Don’t go to that for now.” someone else responds back. You hope to god you don’t hear your name.

I kept my ears perked for key words like “Adam” (Kornacki’s producer), “Jan” (Who created the system that producers use to put the app on the screen), “The App” (Which is what everyone calls the app we built for the touchscreen), and of course my own name. You keep an eye out for emails and texts. Adam had been texting and calling me at all hours in the weeks leading up to the election as he did hits on Maddow and Morning Joe and Brian Williams so I had gotten used to fixing things or adding new scorecard filters at a moment’s notice.

Boop boop boop, just edit some JSON, VPN into the NBC network, SSH into the server that serves the app, git pull from master, pm2 restart all, text the producer that it’s updated. Bada bing bada boom. I did it from my couch a few times in a late-night emergency and then watched my changes on air a few minutes later through Hulu while smoking a spliff. That is a pretty cool feeling.

There are a lot of negatives that I could choose to dwell on. I keep thinking about that Larry Page quote: “it is very hard to fail completely at a very ambitious thing”. When you try and strive for enough cool shit, when some of it fails, as things inevitably do, even your failure is progress. I feel like we did that.

I wonder what I sacrificed to create this app though. I gave up a lot and delayed a lot of relationships and happiness just to make this thing that ultimately did… what? I think it is good to think about all of the things I learned. I learned how to be a better manager. To lead from behind. That pushing people doesn’t work. That different people have different motivations, and you have to learn each person’s and figure out how to appeal to those. That some people need a lot of direction and some people don’t want any direction. That you need to be very clear about things from the start. Even internally. Even with people that you trust.

I felt like I was going to get a lot more resources and at the end I really felt like it came down to how many hours I was awake coding, or maintaining things. Or doing demos and getting yelled at for the lack of progress being made. But no real power to get more resources. I kept being told “take more budget! hire more freelancers, what do you need?” but that ended up going to other people who didn’t want to hear my say about how to spend it. I was left with a lot of responsibility on the project but no ability to fix it beyond my own ability to code and put time in and keep making it better and closing tickets.

![A whole bunch of tickets on sticky notes](https://res.cloudinary.com/ejf/image/upload/v1667920000/IMG_6235.jpg)

But at least it’s over now, and I got to see my thing on TV. My baby. That all came from a prototype I made in January and demoed to Adam and then to Steve and then to Marc and got the budget and finally made this whole thing happen. Weathered changes from Andy and Phil and a final 2 weeks with David who basically invented the medium… Everyone at NBC kept telling me “don’t do what he says” but he was very convincing and I ended up doing what he said a few times and getting yelled at, except for one that I think no one noticed and Steve really appreciated.

You walk past TVs tuned to MSNBC (what else? This is 30 rock…) and then moments later walk past the cameras on the 3rd floor as you pass the interview booth. It gets to a point where you see the camera crew for the Showtime show “The Circus” and instead of being impressed by your proximity to fame or trying to nonchalantly work your way into the background of their shot, you just tire at their presence and wish they would stop blocking the fucking hallway.

I have a keen ability to quickly discover reasons to hate anything I have coveted for a long time, once I attain it. So far I have found very little use for this skill.

If achieving your dreams doesn’t make you happy, then maybe you should adjust your dreams? Or adjust your happiness? The path forward is unclear. But when you think you just want your friends and family to be proud of you, and they’re all finally texting you that they’ve seen your work and it’s awesome, what do you do when you don’t feel much from that? What do you do when 10 million Americans see the app you’ve made between NBC and MSNBC? When it’s featured in two of their top-rated shows? You just focus on the problems.

The brief sentence that comes in an otherwise glowing Vulture review of how great Kornacki was using your board. Or a parenthetical in a wrap-up of election night by the New York Times you read in the airport while you wait for your flight to California for vacation. It is very easy to focus on those things. Those are the things you feared. The evidence that things did not go off without a hitch.

![Presenting the app in a meeting](https://res.cloudinary.com/ejf/image/upload/v1667919786/IMG_5803.jpg)

It’s not even my fault, really, the things they are mentioning. The app briefly froze. Well it looked like that. Steve tapped, panicked, at a map of Montana election results that would not respond. It’s hard to explain to people that it wasn’t my app, per se, that broke. His touch inputs were being sent to my app, and it was responding. But the video feed from the app, which is routed through a control room so that it can be color corrected, had frozen. They had to re route the video feed to fix it. But not after Steve had grown frustrated, and everyone watching MSNBC had seen the issue. Ultimately that all falls on me. It is seen as how the app performed.

Nonetheless, at 1AM as the night drew down and everyone began to relax, I felt like I had accomplished it. We made it through the night. A coworker told me Chuck Todd’s producer had said this was the first election night where Chuck wasn’t frustrated with the app. Maybe he’s just relaxing in his own age, but I feel proud of that.

Steve looked amazing with the board, panning and zooming. Using the new features we had added, like the scoreboard, or the historical drawers for counties or districts, like a pro. He made it look good. Motions and ways of storytelling I had done months earlier, playing out how I wanted it to work, were appearing on TV. That felt really amazing. A lot of things that we wanted to work out worked out. A lot of things that we thought would be used a lot weren’t used at all. It’s funny how that is.

I scarfed down my bacon pancake, gratefully, and went back to the studio to finish out the night.

---

![](https://res.cloudinary.com/ejf/image/upload/v1667920116/IMG_6305.jpg)

![](https://res.cloudinary.com/ejf/video/upload/v1667920277/IMG_6795.mov)
