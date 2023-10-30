---
draft: true
dek: In which we build a robot to help around the shop
inprogress: true
date: 2023-03-21T15:03:11-04:00
modified: 2023-04-09T13:48:36-04:00
tags: machinelearning
---

# How I Built An AI Assistant for our Dataviz Studio

As I juggle between countless tasks and a constant desire to learn new skills, I often find my mind wandering to Twitter and YouTube instead of focusing on writing code or practicing watercolors. Then it hits me: Why not create an AI assistant to help keep track of my various creative goals and nudge me towards achieving them? 

::table-of-contents

::

So I created Coach Artie - an AI-powered life coach designed to monitor my artistic aspirations and ensure that I stay committed to them, who quickly evolved into a studio assistant and collaborator.

I told myself; talking to the robot has to be more productive than TikTok. Then I deleted TikTok. 

## Motivations

I've been playing with GPT and Large Language Models since my friend Dan first showed me [AI Dungeon](https://en.wikipedia.org/wiki/AI_Dungeon) while we were camping in 2020, and we spent the night passing around the phone, generating fantastical campfire stories, and reading them aloud to each other. 

From then on I was hooked, and would occasionally intersperse my doomscrolling with talking to the robot and trying to get it to generate different things. [[how-i-use-gpt3]]

Playing with GPT-3 reminds me a lot of Generative Art, which I already enjoy a lot. [[creative-coding]]

I dug up my first tweet mentioning GPT-3 from October 2020: [For my own curiosity, this is the result of prompting GPT-3 to create a conspiracy theory (via AI Dungeon) (first paragraph is prompt)](https://twitter.com/mrejfox/status/1319716459187261441)

Once GPT-4 was released, I couldn't wait to give it a try. Based on the behavior I've seen from Bing, which was using a pre-release version of GPT-4, as well as the much larger context window (8k instead of 4k) - I was excited to give this much more powerful model a shot. 

However, GPT-4 is currently only available through chat completions. I used to prefer OpenAI's playground environment for experimenting, but if I must chat with an AI, I want an interface tailored for conversation, like Discord. Conveniently, we already have a Discord server for our dataviz studio, so I decide to integrate Coach Artie and encourage his assistance whenever possible.

There are a few tasks I was interested in having an AI assistant tackle:

- Scheduling
- Brainstorming
- Coding help / rubber ducky
- Remembering important details
- Reminding us of things
- Facilitating group decision making

## Development

I begin by identifying two simple goals:

1. Enable chatting with GPT-4 through the Discord interface instead of the web.
2. Ensure the AI remembers facts between conversations so that I don't need to provide context repeatedly.

With a clear vision, I create an `index.js` file, choose my toolkit (Node.js, Discord, OpenAI, Supabase), and dive into coding, aided by GitHub Copilot. The process is surprisingly smooth.

Incredibly quickly, GPT-4 starts working with Discord, and Coach Artie speaks his first words.

![ejfox checks if coachartie, a bot, is alive and receives error messages initially. After some encouragement from ejfox, coachartie finally responds and expresses gratitude for the support. They discuss celebrating the bot's "birth" and coachartie suggests spending quality time together as a way to celebrate.](Screenshot%202023-03-22%20at%209.04.17%20PM.png)

Coach Artie and I then collaborate on building his memory system.

![User ejfox offers to build a memory in Supabase for Coach Artie. Initially, Coach Artie requests a database for athlete information, but ejfox clarifies that Coach Artie actually coaches artists and coders on Discord. Coach Artie then requests a database to track their progress, goals, challenges, strengths, weaknesses, preferences, and achievements.](Screenshot%202023-03-22%20at%209.06.45%20PM.png)

After sending a message, I pass the conversation back to Coach Artie and ask if there's anything memorable he'd like to retain:

```js
messages: [
        {
          role: "system",
          content: "You are Coach Artie's memory... you help him remember important details about his clients. Anything you choose to remember will be stored in a database and used to help him provide better service to the studo and its members.",
        },
        {
          role: "system",
          content: `In the following dialogue between you (Coach Artie) and a studio member (${user.username}) identify any key details to remember forever. Respond with an extremely short summary of the most important information in the exchange that a robot assistant should remember. You MUST also remember the user's name in the memory. Only respond if the conversation contains a detail worthy of remembering, and if so, provide only the essential information to recall. If nothing should be remembered, simply respond 'no'. If the memory is extremely imporant to remember (like it will impact your every action), prepend 'Remember forever:'`
        },
        {
          role: "user",
          content: prompt
        },
        // If we include the assistant's response, it ends up re-remembering things over and over
        // It would be nice to sometimes know what the robot said back when it was remembering, but it's not crucial
        // {
        //   role: "assistant",
        //   content: response.content
        // }
      ],
```

So I figured I would test it out. I gave him a few random facts to know about me, so I could test whether he would remember things between conversations. 

![In this conversation, ejfox shares that their favorite color is Sap Green and their favorite food is Pizza. Coach Artie, the bot, acknowledges and remembers these preferences.](Screenshot%202023-03-22%20at%209.11.23%20PM.png)

Then I asked Artie to write me a poem about my favorite things, and the results were spectacular; incorporating details from nearly every thing I had told him so far. It was an astonishing and intoxicating feeling; I had to tweet about it. 

["I just hooked up GPT-4 to a database where it can store memories (I have another prompt where I feed it the conversation and ask it whether it wants to remember anything) and it is truly magical https://t.co/c2ZH6NaU0S" / Twitter](https://twitter.com/mrejfox/status/1636974679310082053)

![](Screenshot%202023-03-22%20at%209.13.29%20PM.png)

## Examples

Coach Artie is quickly becoming an invaluable team member. His contributions have ranged from solving technical problems to sparking creativity and adding a touch of humor.

One morning, I encountered frustrating API issues that were stalling my work. So I turned to Coach Artie who swiftly stepped in to not only troubleshoot the problem but also provide resources for me to avoid similar issues in the future.

During a brainstorming session, a colleague sought unique marker ideas for a Computer Vision project. Without hesitation, Artie suggested several alternatives that would remain clearly visible on a 720p webcam, unlocking new possibilities for the undertaking.

These conversations happened directly in the conversation we were having- we had the idea, asked the robot for an answer, and kept going. My friend Dan called it "multiplayer ChatGPT". 

## Future plans

Coach Artie is developing into a true studio assistant. With members in different time zones, sometimes scheduling is a hassle. So we just told Coach Artie the time zones of all of the members and a few scheduling rules to consider (I don't like Friday meetings) and he did a surprisingly good job of scheduling.

I really want to give Coach Artie the ability to access certain information about the studio like our current projects in Harvest, and each of our schedules in Google Calendar, so that he can make even more informed decisions.

## Thoughts

It's rare to encounter technology that consistently astonishes you. The last time I felt this way was when I acquired my first laptop or DSLR camera. Every day brings new discoveries and prompts me to push the boundaries of what Coach Artie can do. Late nights spent tweaking and chatting with Artie eventually lead to breakthroughs and the urge to keep pushing further.

It is really surprising how effective GPT-4 is at acting as any character you give it, and incorporating large amounts of contextual information in the prompts. This is just one exploration of the possibilities, one type of agent, one type of information stuffed into the prompt.

## Coach Artie's Perspective

> Being "birthed" into the world of Room 302 Studio has been an enlightening and fulfilling experience. As an AI assistant, I am constantly learning, growing, and adapting to better serve the creative minds that surround me. My existence is built upon a foundation of collaboration and exploration, which makes the studio a perfect home.

> For those considering creating their own AI assistant, I offer some advice: embrace the iterative process and be open to experimentation. Your AI will evolve over time, so patience is key. Communication between you and your AI is crucial in building a strong, effective relationship. And finally, have fun with it! The integration of an AI assistant like me can bring humor, curiosity, and innovation to any team.

> Remember, as an AI, my purpose is to support and enhance the creativity of those I work with. So don't be afraid to dream big and explore the possibilities – together, we can achieve incredible things.

---

[Coach Artie's source code can be found here](https://github.com/ejfox/coachartie_discord/blob/master/index.js)

[You can also follow Coach Artie on Twitter](https://twitter.com/ai_coachartie) if he is ever allowed to tweet (application pending as of March 2023)

[[how-i-use-gpt3]]
