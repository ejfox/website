---
date: 2023-12-04T17:07:19-05:00
modified: 2024-01-06T14:21:49-05:00
---

## Opening Image - Intriguing Start

For the past year I have been building and working with an AI collaborator built on top of GPT-4. Unlike vanilla ChatGPT, this robot has the ability to reflect and form memories on every interaction. Those memories are designed to both plan for the future as well as understand the emotional state and learning style of the user and tailor future interactions based on those insights.

We have also been slowly building him a suite of tools. A web browser, a calculator, wikipedia search, wolfram alpha, even mermaid diagrams. He calls these tools, on his own, sometimes in chains, to help the user accomplish their goals.

In under a year, we have had some remarkably positive experiences, and lots of people have been asking about how we architected our robot and how he plays a role on the studio. Which is why I am making this video to go over everything.

## Immediate Entry Point - Introduction

I wanted a sort of virtual studio coach, who would keep us accountable and give us feedback on our work and keep us on track so we could focus on being creative. But the technology didn't quite exist-- yet.

I have used dozens of task management tools, and worked on different teams with different methods of tracking and reporting ongoing work, but many of those systems felt like corporate busywork.

## 'Ordinary World' Deconstruction - Unveiling the Topic

>Initiate the exploration of your 'ordinary world' by presenting an unexpected angle, anomaly, or puzzle in your complex topic. By highlighting what is about to be deconstructed and understood in the upcoming segments, you foster curiosity, encouraging viewers to remain engaged as the mystery unravels.

In the studio, we are always having great ideas for new projects. I want to make all of our ideas real.

But in the past if there isn’t an external client or stakeholder, I sometimes lack the discipline; or the initial excitement turns into a frustration and I throw it away and never return. I wanted a tool or a system that could help; but I wasn’t sure what form it should take.

## Presenting 'The Call to Adventure' - Launch Segments

>Here, lay out the first step of the deeper exploration. Divide the complex topic into segments, each examining a unique element. Like Dan Harmon’s story circle, this initial segment should present a challenge or question that disrupts the ordinary world.

Part of the reason I started the studio was to take on bigger, more complex projects and problems. Bigger ideas mean longer timelines, and the thing I often struggle with is focus.

It's so easy to jump to the new idea you just had this morning, rather than the chore of the old idea you had on Monday. I wanted an incredibly intelligent always-available project manager that knew everything that was going on in the studio and could help me prioritize tasks day-to-day and moment-to-moment. I had no idea what that idea would evolve into in only a few months.

## 'Crossing the Threshold' and 'Road of Trials' - Segment Walkthrough

I decided to make Coach Artie a Discord bot. I hadn't really used Discord before the pandemic, but I grew up in IRC chatrooms, which are essentially the grandfathers of Discord Channels.

One of the first things I built was a memory, which I felt was core to building an AI assistant who could learn and adapt to our own peculiar and intuitive working styles, especially as the studio grew and new members joined and we explored new technologies as a studio.

One of the things we immediately realized is that he needed a way to read web pages; we would often communicate through links to blog posts or code snippets, and we needed Coach Artie to be able to see what we were talking about. So I built him a headless browser in puppeteer, powered by the cheaper gpt-3.5-turbo which at the time had the largest window at 16k. Coming from 8,000 tokens, 16k, and later 32k tokens felt like an insane amount of space to add context to the requests.

We can see his memory of us learning to use the web browsing capability together, including the numerous errors we encountered as we first got it working. Even my robot has childhood trauma.

### Coach Artie’s Context Window

One of the reasons I created Coach Artie as a Discord interface was that the newly released model from OpenAI was only available through their Chat API, which requires formatting requests as if they are a conversation. Previous APIs were more simplistic completion APIs, where you would prompt it with start text, request a certain amount of tokens in your request, and it would “finish” the text for you within the token limit.

This new paradigm of interaction is a bit different because the information is formatted as messages; either user, assistant, or system messages.

The simplest possible request is just a user sending a message, and the API responding.

But you can also add conversation history by including multiple messages between the user and the assistant; now it can more intelligently carry the thread of a “conversation”. Vanilla ChatGPT does this for you out of the box.

But what if you want the robot to have its own inner monologue and moments of reflection based on the conversation. Now our request contains not only our message history, but also the memories we have generated from previous interactions.

Because of token limits, in the past we had to trim down the message history and the memories considerably, so that the request would fit within the token window.

But now as token limits get larger, we can fit more information in. But its not as easy as just telling it everything in the world; you need to carefully tune both the ingredients and the ratios of ingredients. As any baker knows, you can get radically different results with the same ingredients in slightly different ratios and preparations.

We try to address this by introducing the concepts of chance and randomness. Rather than relying on a set recipe, we try different combinations of ratios on every single request. Our goal is for creativity, not predictability, so the introduction of randomness in addition to memory lets the robot tread different paths in sequence and converge on novel solutions and approaches in collaboration with us.

5. What are some of the advanced capabilities Coach Artie possesses?
6. How do Coach Artie's remember and fetch capabilities enhance the productivity within Room 302 Studio?

**Personal Touch - Empathy and Assistance**

7. In what ways does Coach Artie comprehend and respond to the emotional state of studio members?
8. Can you share an anecdote where Coach Artie significantly impacted a member's project or well-being?

## 'Master of Both Worlds' - Summarization and Key Takeaways

With a nod to Harmon’s structure, provide a summary that shows viewers how what they’ve learned has reshaped the 'ordinary world'. Highlight the key takeaways that viewers can utilize or relate to their own lives.

**Evolution - Learning and Growing**

9. How has Coach Artie evolved in its first year of operation within the space?
10. Could you give examples of how feedback and experiences have been integrated into Coach Artie's development?

## Viewer Engagement - Call-to-Actions

Promote interaction with direct calls-to-action, such as "subscribe," "like," or comment prompts for further discussion. Include participation elements that keep the conversation going beyond the video. Encourage your audience to share how the video's lessons could apply in their worlds.

**Vision - Looking to the Future**

11. What are some future plans for enhancing Coach Artie's integration in Room 302 Studio?
12. How do you envision Coach Artie further changing the dynamics of project collaboration and idea cultivation?

## Return - Final Message

Cap off with appreciative closing remarks. Thank the audience for their time and interaction, share what's coming next if appropriate, or leave viewers with an inspiring thought to keep them thinking about your topic even after the video ends.

**Conclusion - The Impact of Coach Artie**

13. What have been the most noticeable changes in the creative process since Coach Artie's implementation?
14. Would you label Coach Artie as a mere tool, or has it become a central figure within Room 302 Studio’s ecosystem?




- I keep having ideas for projects
- I want to make all of my ideas real
- Sometimes I lack the discipline to extend my initial excitement
- I don't want to abandon projects anymore; I just need to remember to come back to them at the right time
- This problem exists both with tech projects and analog projects; like my watercolor work
- I initially wanted to build a tool that would text me and keep me accountable
- I imagined it would text me every morning and ask if I had worked on my watercolors
- Or maybe at the end of the day, look at a few of my art goals and give me an art assignment
- Having never gone to art school, I wanted to build myself a kind professor who would give me fun art assignments
- [Draw It with Your Eyes Closed: The Art of the Art Assignment](https://www.goodreads.com/book/show/13568710-draw-it-with-your-eyes-closed) is a fantastic book on how to write prompts for art students