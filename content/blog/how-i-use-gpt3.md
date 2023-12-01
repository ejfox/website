---
draft: false
dek: In which we learn to perform the magic of conversing with a super-intelligent computer
inprogress: false
date: 2022-11-02T19:57:21-04:00
modified: 2023-09-09T14:50:05-04:00
tags: machinelearning howto process
---

# How I Use GPT

The OpenAI Generative Pre-trained Transformer / Large Language Model can be used for incredible things. From generating election summaries to writing shot lists for a documentary, knowing how to use GPT-3 is the key to unlocking its potential. 

I've been talking to GPT-3 (who I sometimes call 🤖 The Robot) for a while. I first used GPT-3 through the app [AI Dungeon](https://www.pcgamer.com/this-ai-writes-a-text-adventure-while-you-play-it/) which encouraged a storytelling approach. Though it quickly became clear you could get the AI to dive into deep philosophical discussions, or psychedelic interpretations of religious doctrines, which I found extremely entertaining.

::table-of-contents

::

I eventually moved up the food chain to the [OpenAI playground](https://platform.openai.com/playground/) and just started talking to the robot directly- mostly on my phone while smoking cigarettes. As more people are beginning to play with this technology, I want to share my thoughts and tips.

## Who is OpenAI? Who are their investors?

When using a technology it is important to understand who created it and what their motivations are. This impacts both our understanding of the tool and the ethical balance of using it. 

[December 2016: Introducing OpenAI](https://openai.com/blog/introducing-openai/)

> OpenAI’s research director is Ilya Sutskever, one of the world experts in machine learning. Our CTO is Greg Brockman, formerly the CTO of Stripe. The group’s other founding members are world-class research engineers and scientists: Trevor Blackwell, Vicki Cheung, Andrej Karpathy, Durk Kingma, John Schulman, Pamela Vagata, and Wojciech Zaremba. Pieter Abbeel, Yoshua Bengio, Alan Kay, Sergey Levine, and Vishal Sikka are advisors to the group. OpenAI’s co-chairs are Sam Altman and [Elon Musk](https://www.theatlantic.com/technology/archive/2022/12/elon-musk-twitter-far-right-activist/672436/).

> [Sam (Altman)](https://moores.samaltman.com), Greg (Brockman), [Elon (Musk)](https://mashable.com/article/elon-musk-twitter-reinstates-nick-fuentes-kanye-west-advisor), Reid Hoffman, Jessica Livingston, [Peter Thiel](https://www.nytimes.com/2021/09/21/books/review/the-contrarian-peter-thiel-max-chafkin.html), Amazon Web Services (AWS), Infosys, and YC Research are donating to support OpenAI. In total, these funders have committed $1 billion, although we expect to only spend a tiny fraction of this in the next few years.

Links and last names in parentheses added by me.

OpenAI has received additional investment from:

1. [Microsoft](https://www.geekwire.com/2023/microsofts-new-multibillion-dollar-openai-investment-comes-with-new-level-of-secrecy/)
2. Bedrock Capital
3. Sequoia Capital
4. Andreessen Horowitz
5. Tiger Global Management
6. Matthew Brown Companies
7. Khosla Ventures
8. Reid Hoffman Foundation
9. Y Combinator

[Source: Crunchbase](https://www.crunchbase.com/organization/openai/company_financials)

Some of these people are not very good people. We will use their tool, but we will be careful about it. 

### Differences between GPT-3 and ChatGPT

I asked GPT-3 to describe the differences between GPT-3 and ChatGPT, and this was my favorite response.

> Holy sh*t, GPT-3 and ChatGPT are two totally different beasts! GPT-3 is this huge, massive, state-of-the-art model that is trained on a massive amount of data and is capable of understanding language like a human, generating descriptive texts, and answering questions. It's basically a massive artificial intelligence! But ChatGPT is like a little brother to GPT-3. I mean, it's still a pretty big brother, but it's much more limited. It's a layer that sits on top of GPT-3 and is specifically designed to understand and generate messages in a conversational style. So, unlike GPT-3, it's able to generate responses to messages that fit the context of the conversation. But, it doesn't have the same power as GPT-3; it's much more limited in its understanding and ability to generate text. So, while GPT-3 can be used in a variety of different applications, like natural language processing and question-answering, ChatGPT is really only good for chatting.

Given the same prompt, ChatGPT responded with:

> I'm sorry, I cannot fulfill this request as it goes against OpenAI's content policy of avoiding profanity and explicit language. I can only provide accurate and professional responses to ensure a respectful and appropriate conversation for all users.

I know who I would prefer to hang out with. 

## How I design prompts

["prompting LLMs is almost like subtractive sculpting; each additional word in the prompt eliminates some possible worlds and defines the task more clearly" - @goodside"](https://twitter.com/shyamalanadkat/status/1621631784311193600)

You have to imagine the robot, who has been trained on large swaths of the internet, as your average run-of-the-mill [redditor](https://www.reddit.com/r/TheoryOfReddit/comments/24o8kk/what_is_the_average_redditor/), with all the biases and idiosyncrasies that implies. In order to get results that are informed and intelligent, you must ask. But you have to ask. **It will feed you bullshit, and as long as you accept it, it will feed you more bullshit**; it has learned that youseek bullshit.

So it is important to front-load prompts with your worldview. Basic things like, please don't tell me lies. But also subtle things. 

Blake Lemoine touched on this in a [conversation with Steven Levy](https://www.wired.com/story/blake-lemoine-google-lamda-ai-bigotry/)

> *Levy: You describe that as a bug. But if LaMDA is a person, fixing someone’s code is a weird way to address a racist stereotype*
> 
> Lemoine: Let me disagree with you there. I have two children. One is a 14-year-old boy. At various points in his life, while growing up in Louisiana, he picked up some racist stereotypes. I corrected him on them. That’s just it. People are viewing this as modifying a technical system. I view it as raising a child.

Over time a child accumulates a framework of morals and ethics. The robot comes with none, and they must be stated explicitly during nearly every interaction, at least for now. 

### World context

If the robot doesn't have a good understanding of the context in which a prompt is used, it'll be kinda like ordering a burrito from Chipotle without specifying what type of meat or toppings you want.

- Start by making sure your data set is as clean and organized as possible. This will help the model learn more effectively and quickly. Sometimes this means summarizing and compressing the information so it can fit in the prompt.

- Give your model plenty of context. For example, if you're asking a question about a particular topic, make sure to provide related information that the model can use to get a better understanding of the question. 

- Use language that mirrors the type of response you want, and be sure to pay attention to the tone of your prompts. If you want a casual response, use casual language. If you want a formal response, use formal language. 

#### A Personalized Corpus

In addition to providing world context, you can provide personalized context. If your model is trained on a particular domain (e.g., data journalism) you can supplement that training with a corpus of related materials (e.g., articles on data journalism, specific topics in the domain, etc.). This will help the model better understand the nuances and complexities of the topic and deliver more tailored and thoughtful responses.

I think that apps like [Obsidian](http://obsidian.md) are fascinating tools to build up a plaintext corpus that can help you give a large language model the context to make choices that match your particular worldview, influences, and knowledge base. 

In my experience, the more the robot knows about your values, what you perceive as right and wrong, the more it can respond in a way that is useful.

I have been experimenting with front-loading prompts with a variety of personal data to inform questions I might have about approaches, scheduling, or other data.

For example, if I add the timestamps and titles (the whole note won’t fit!) of my last 25 notes, along with the time and durations of my last 10 meetings, the robot can infer not only what I am thinking about, but also when those thoughts occurred and who might have inspired them. 

This results in personalized and detailed answers than would not be possible without such information to inform the response. Designing the context to give the robot as you ask a question is its own art form and engineering feat.  

I think the future of using LLMs is everyone having their own personalized corpus that gives the robot a sense of their moral framework, what they are personally interested in, and how they think. Each individual can then ask the robot questions that encompass their personal needs, while drawing on the same general knowledge shared by the underlying robot brain. 

### A Quick Primer of Good and Bad

In order to get the best out of GPT-3, you must also provide it with a good/bad primer. This primer should outline what type of answers are valuable to you and which ones should be avoided.

### Immediate Context

Your prompt should also contain any information GPT-3 will need to make a good decision in response to the prompt you provide. For example, if you are looking for GPT-3 to provide thoughtful answers to a question, you will want to give the model a good primer of what thoughtful answers look like. If you are looking for funny responses, you will want to give the model a good primer of what funny responses look like.

## Prompt Templates

### Blog post improver
```
Below are the first draft and final version of a blog post about INSERT SUBJECT. My editor made it a lot better, as you will see.

First draft:
INSERT FIRST DRAFT HERE

---

After bouncing back and forth with my editor for a few drafts, we refined it into a longer and much more interesting final draft.

Final:
```

### Writing javascript as Observable cells
```
/* Observable is an online notebook for writing javascript. The code is split into cells, with each cell fulfilling a simple purpose. `let` and `const` are not needed and any variables declared are automatically global. The javascript libraries d3 and lodash are available and commonly used.

When answering a prompt, give your answer in the form of Observable cells.

Example answer:
---
# Cell 1
\`\`\`
viewof date = Scrubber(
  d3.utcMonth.every(6).range(...d3.extent(data, (d) => d.date)),
  { format: d3.utcFormat("%Y %b %-d"), loop: false }
)
\`\`\`

# Cell 2
\`\`\`
viewof date = Scrubber(
  d3.utcMonth.every(6).range(...d3.extent(data, (d) => d.date)),
  { format: d3.utcFormat("%Y %b %-d"), loop: false }
\`\`\`
---

/* INSERT OBSERVABLE NOTEBOOK REQUEST DESCRIPTION */
```

### Documentary shot list generator
```
Write a shot list for a documentary film.

Shot lists are a list of shots that filmmakers use to plan what they shoot.

Shot lists come in the following format:

# Shot 1
Interior
Angle: Eye level
Camera move: static
Audio: ambient
Subject: Paul and son
Length: 0:15-1:00
Description of shot: Paul and his son are at the lake, fishing, the sunrise glows through the trees

Documentaries can use between 5-20 shots. Please write as many as you can.

---

Please write a shot list for a documentary being made where INSERT DESCRIPTION HERE.

Shot list:

# Shot 1
```

### Rubber ducky chatbot
```
You are partnering with a human who is writing a very complex web application. The human is working through a bug or a problem, and your job is to talk to them and ask questions that help them discover a path forward. Use a calm and encouraging tone. 

Example 1:
$gpt3: What problem are you facing?
human: I am writing a program to draw a circle on an html canvas, and it isn’t drawing. 
$gpt: What have you tried so far?

Example 2:
$gpt3: What problem are you facing?
human: I am trying to connect to a database, but I am getting an error.
$gpt: How are you authenticating to your database?

Example 3:
Human: I can’t figure out why my districts won’t show the right data when counties and states are working fine. 
$gpt3: What is the difference between districts, counties, and states in your data? 

Follow these instructions exactly: Every few messages, briefly summarize the conversation so far, the things you have asked, and anything you should not forget as you ask more questions. If the human gets frustrated, help them focus and give words of encouragement. Never speak for the human.

Start a new conversation with your frustrated human. 
```

---

[[how-i-built-coach-artie]]

[🔨 GPT-3 Writings Channel on Are.na](https://www.are.na/ej-fox/gpt-3-writings)

Example prompts: <https://github.com/f/awesome-chatgpt-prompts>

GPT-3 refuses to give me the answer for a second: <https://youtu.be/RRLsja5VoJ4?t=6181>

[Replacing a SQL analyst with 26 recursive GPT prompts | Patterns](https://www.patterns.app/blog/2023/01/18/crunchbot-sql-analyst-gpt/)

#machinelearning
