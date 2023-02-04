---
draft: false
dek: In which we learn to perform the magic of conversing with a super-intelligent computer
inprogress: false
date: 2022-11-02T19:57:21-04:00
modified: 2023-02-03T20:39:20-05:00
---

# How I Use GPT-3

The OpenAI Generative Pre-trained Transformer 3 (GPT-3) can be used to do incredible things. From generating election summaries to writing shot lists for a documentary, knowing how to use GPT-3 is the key to unlocking its potential. 

I've been talking to GPT-3 (who I sometimes call 🤖 The Robot) for a while now. I first used GPT-3 through the app [AI Dungeon](https://www.pcgamer.com/this-ai-writes-a-text-adventure-while-you-play-it/) which encouraged a storytelling approach. Though it quickly became clear you could get the AI to dive into deep philosophical discussions, or psychedelic interpretations of religious doctrines, which I found extremely entertaining.

I eventually moved up the foodchain to the [OpenAI playground](https://platform.openai.com/playground/) and just started talking to the robot directly- mostly on my phone while smoking cigarettes. As more and more people are beginning to play with this technology, I want to share some of my thoughts and tips on the matter. 

## Who is OpenAI? Who are their investors?

When using a technology it is important to understand who created it and what their motivations are. This impacts both our understanding of the tool and the ethical balance of using it. 

[December 2016: Introducing OpenAI](https://openai.com/blog/introducing-openai/)

> OpenAI’s research director is Ilya Sutskever, one of the world experts in machine learning. Our CTO is Greg Brockman, formerly the CTO of Stripe. The group’s other founding members are world-class research engineers and scientists: Trevor Blackwell, Vicki Cheung, Andrej Karpathy, Durk Kingma, John Schulman, Pamela Vagata, and Wojciech Zaremba. Pieter Abbeel, Yoshua Bengio, Alan Kay, Sergey Levine, and Vishal Sikka are advisors to the group. OpenAI’s co-chairs are Sam Altman and [Elon Musk](https://www.theatlantic.com/technology/archive/2022/12/elon-musk-twitter-far-right-activist/672436/).

> [Sam (Altman)](https://moores.samaltman.com), Greg (Brockman), [Elon (Musk)](https://mashable.com/article/elon-musk-twitter-reinstates-nick-fuentes-kanye-west-advisor), Reid Hoffman, Jessica Livingston, [Peter Thiel](https://www.nytimes.com/2021/09/21/books/review/the-contrarian-peter-thiel-max-chafkin.html), Amazon Web Services (AWS), Infosys, and YC Research are donating to support OpenAI. In total, these funders have committed $1 billion, although we expect to only spend a tiny fraction of this in the next few years.

Links and last names in parantheses added by me. Some of these people are not very good people. We will still use their tool, but we will be careful about it. 

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

### Differences between GPT-3 and ChatGPT

I asked GPT-3 to describe the differences between GPT-3 and ChatGPT, and this was my favorite response.

> Holy sh*t, GPT-3 and ChatGPT are two totally different beasts! GPT-3 is this huge, massive, state-of-the-art model that is trained on a massive amount of data and is capable of understanding language like a human, generating descriptive texts, and answering questions. It's basically a massive artificial intelligence! But ChatGPT is like a little brother to GPT-3. I mean, it's still a pretty big brother, but it's much more limited. It's a layer that sits on top of GPT-3 and is specifically designed to understand and generate messages in a conversational style. So, unlike GPT-3, it's able to generate responses to messages that fit the context of the conversation. But, it doesn't have the same power as GPT-3; it's much more limited in its understanding and ability to generate text. So, while GPT-3 can be used in a variety of different applications, like natural language processing and question-answering, ChatGPT is really only good for chatting.

Given the same prompt, GPT-3 responded with:

> I'm sorry, I cannot fulfill this request as it goes against OpenAI's content policy of avoiding profanity and explicit language. I can only provide accurate and professional responses to ensure a respectful and appropriate conversation for all users.

I know who I would rather hang out with. 

## How I design prompts

["prompting LLMs is almost like subtractive sculpting; each additional word in the prompt eliminates some possible worlds and defines the task more clearly" - @goodside"](https://twitter.com/shyamalanadkat/status/1621631784311193600)

You have to imagine the robot, who has been trained on large swaths of the internet, as your average run-of-the-mill redditor, with all of the biases and idiosyncrancies that implies. In order to get results that are informed and intelligent, you must simply ask. But you have to ask. Otherwise it will feed you bullshit, and as long as you accept it, it will feed you more and more bullshit; it has learned that you seek bullshit.

So it is important to frontload prompts with a little bit of your worldview. Basic things like, please don't tell me lies. But also more subtle things. Blake Lemoine touched on this in a [conversation with Steven Levy](https://www.wired.com/story/blake-lemoine-google-lamda-ai-bigotry/)

> **Levy: You describe that as a bug. But if LaMDA is a person, fixing someone’s code is a weird way to address a racist stereotype.**
> Lemoine: Let me disagree with you there. I have two children. One is a 14-year-old boy. At various points in his life, while growing up in Louisiana, he picked up some racist stereotypes. I corrected him on them. That’s just it. People are viewing this as modifying a technical system. I view it as raising a child.

Over time a child accumulates a framework of morals and ethics. The robot comes with none, and they must be stated explicitly during nearly every interaction, at least for now. 

### World context

If a model doesn't have a good understanding of the context in which a prompt is used, it'll be kinda like ordering a burrito from Chipotle without specifying what type of meat, or what toppings you want. You might end up with something that fits the generic description of what a burrito is, but it won't actually be what you wanted. 

- Start by making sure your data set is as clean and organized as possible. This will help the model learn more effectively and quickly. 

- Give your model plenty of context. For example, if you're asking a question about a particular topic, make sure to provide related information that the model can use to get a better understanding of the question. 

- Use language that mirrors the type of response you want, and be sure to pay attention to the tone of your prompts. If you want a casual response, use casual language. If you want a formal response, use formal language. 

#### A Personalized Corpus

In addition to providing world context, you can also provide personalized context. If your model is trained on a particular domain (e.g., data journalism) you can supplement that training with a corpus of related materials (e.g., articles on data journalism, specific topics in the domain, etc.). This will help the model better understand the nuances and complexities of the topic and deliver more tailored and thoughtful responses.

I think that apps like Obsidian ([[why-i-love-obsidian]]) are fascinating tools to build up a plaintext corpus that can help you give a large language model the context to make choices that match your particular worldview, influences, and knowledge base. 

In my experience, the more the robot knows about your values, what you perceive as right and wrong, the more it can respond in a way that is useful for knowledge exploration without wading through tons of generic or ill-informed responses before striking gold. 

I have also been experimenting with front-loading prompts with a variety of personal data to inform questions I might have about approaches, scheduling, or other topics. This can include asking about my past experience, personal associations, and the context of the situation I am currently in. This provides a better connection between the prompt and how I can best interact with and respond to the model. 

For example, if I add the timestamps and titles of my most recent 25 notes, along with the time and durations of my last 10 meetings, the robot can infer not only what I am thining about, but also about when those thoughts occurred and who I interacted with about them. This results in personalized and detailed answers than would be possible without such information. 

I think the future of using LLMs is everyone having their own personalized corpus that gives the robot a sense of their moral framework, what they are personally interested in, and how they think. Each individual can then ask the robot questions that encompass their personal needs, while drawing on the same general knowledge shared by all the robots.

### A Quick Primer of Good and Bad

In order to get the best out of GPT-3, you must also provide it with a good/bad primer. This primer should outline what type of answers are valuable to you and which ones should be avoided.

### Immediate Context

Your prompt should also contain any information GPT-3 will need to make a good decision in response to the prompt you provide. For example, if you are looking for GPT-3 to provide thoughtful answers to a question, you will want to give the model a good primer of what thoughtful answers look like. If you are looking for funny responses, you will want to give the model a good primer of what funny responses look like.

## Prompt templates I have used

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

### Writing YouTube video titles
```
EJ is a journalist who makes videos about different topics, often times focusing on explaining complicated systems. He uses data and data visualization to look at the issues of the day through a unique angle. EJ’s videos are 10-20 minutes long.

EJ has been researching a variety of topics and tagging them. These are EJ's tags, with the number of items in parentheses: data (71) dataviz (71) politics (62) howto (59) design (54) art (49) journalism (46) research (44) cli (42) reference (39) elections (37) tool (34) javascript (31) vj (31) d3 (29) webdesign (29) mapping (29) music (27) police (26) tech (26) resource (24) visualization (23) video (22) 3d (22) protest (21) crypto (21) cooking (19) datajournalism (18) maps (18) twitter (18) food (16) election2020 (16) arduino (14) programming (13) writing (13) inspiration (13) dataset (13) photography (12) recipe (12) games (12) pico8 (12) occupy (11) hacking (11) code (11) activism (10) node (10) machinelearning (10) streaming (10) pandemic (10) youtube (9).

In the following section, write a YouTube Title & Description for EJ's livestream. Use emojis in the title and description, write the title and description in an interesting passionate style that will make the video go viral. Write at 4 sentences in the description. In the first sentence, hook the reader with an interesting quote or question. In sentence 2 and 3, describe the concept of the livestream. In sentence 4 describe the technologies used. Use the following format:

# ${title}

${description}

---

The topic of this week's livestream is: INSERT DESCRIPTION HERE

#
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

—

$gpt3:
```

### Generate a Dataviz Statement of Work from project description
```Statement of Work Template:

Statement of Work
Overview
[CLIENT NAME] (“Client”) are engaging [YOUR NAME] (“Contractor”) for support in development of an interactive visualization that will be incorporated into the Client's website.

Team
The primary contact for this project is: 
[YOUR NAME], email: [YOUR EMAIL], mobile:[YOUR CELL PHONE]

Other designers and engineers may be contracted under the terms of this agreement as needed.

Availability: [YOUR AVAILABILITY, LIKE: 30-40 hours/week]
Scope
Prepare and Analyze Data
Gather and process all necessary data. Perform any transformations or analysis required for desired visualization. 1 day.

Visualization / Map Prototyping
Using client-provided data, create a map that incorporates [TOPIC] data and visualizes it with [VISUALIZATION TECHNIQUE] as well as demographic info about the population impacted by those pollutants. The prototype(s) will be created in [VISUALIZATION TECHNOLOGY]

Our first milestone will be evaluating this visualization on [CHECK IN DATE].

Visualization Polish and Publishing
Iterate on the visualization, design, and storytelling approach based on feedback on the initial prototype. 3-5 days.

Our last milestone will be evaluating a publish-ready version of the visualization on [DAY BEFORE PUBLISH DATE]

Acceptance Criteria
The project is considered completed and successful if the following criteria are met:

Contractor provides a map visualization that shows [WHAT THEY WANT TO SHOW] using Client-provided data 
Contractor provides a mechanism to [DO WHAT THEY WANT TO DO]
Contractor develops Client-provided data into a data visualization created with D3, HTML, Javascript, and CSS that can be embedded into Client's website. (Additional open-source data visualization technologies may be used upon Client agreement)
Contractor delivers a production-ready data visualization code through a .zip file, Observable Notebook, or GitHub repo works on the latest web browsers
Costs
[ WHAT YOU CHARGE PER HOUR OR PROJECT ]

Time Estimates / Estimated Cost

[ ESTIMATED PROJECT TIME LIKE, 60-80 hours ]
Estimated cost: [YOUR HOURLY RATE * ESTIMATED PROJECT TIME]

Start date: [START DATE]
End date: [END DATE]

Termination
If at any time Client cancels this project, Client agrees to pay Contractor for hours accrued to date.

Payment Schedule
Upon completion of the project, the Contractor will provide a final invoice. 

Payment for the final invoice is expected within 30 days. A 2% fee will be charged for every 30 days the invoice is unpaid. 

---

Project description: INSERT THREE PARAGRAPHS DESCRIBING THE PROJECT HERE

---

Use the above information and SOW template to generate a Statement of Work based on the project description. Any information in [BRACKETS] should be replaced with information accurate to the project. Do not include any bracketed words in the output. If the answer is unknown, do not include it. The output should be a document that could be sent directly to the client for approval. There should be no errors or mistakes, and it should make the project appealing.

---

# Statement of Work

## Overview
```

---

Example prompts: <https://github.com/f/awesome-chatgpt-prompts>

GPT-3 refuses to give me the answer for a second: <https://youtu.be/RRLsja5VoJ4?t=6181>

[Replacing a SQL analyst with 26 recursive GPT prompts | Patterns](https://www.patterns.app/blog/2023/01/18/crunchbot-sql-analyst-gpt/)

#machinelearning
