---
date: "2024-04-21T22:29:38.000Z"
modified: "2024-06-02T04:30:31.000Z"
hidden: true
draft: true
---
## Coach Artie - One Year Retrospective

![Artie's "Brain" - a dashboard used to see his recent memories and messages](https://res.cloudinary.com/ejf/image/upload/v1710108694/Screenshot_2024-03-10_at_6.11.18_PM.png)

### Assumptions / Principles

#### Solving our own problems for ourselves, first

Coach Artie was initially created as an Art Coach to help me focus on my watercolor practice. It was first created as a Discord bot integration to allow the studio to play with the OpenAI API together, and it has been amazing to watch it evolve into something much bigger and more interesting over time.

>If you're making something for people, make sure it's something they actually want. The best way to do this is to make something you yourself want. Write the story you want to read; build the tool you want to use. Since your friends probably have similar interests, this will also get you your initial audience.
><https://paulgraham.com/greatwork.html>

#### "Multiplayer" Interactions

The tool was designed from the start to interact with multiple users simultaneously on Discord which helped us see Coach Artie more as a collaborator, rather than a service tool

Existing in our shared space allowed Artie to proactively gather information and insights and contribute effectively

He also began responding to `@here` and proactively writing meeting agendas

#### Anthropomorphism

We found the best results happened when treating Coach Artie has a studio collaborator or intern, and including it in our discussions wherever possible so it could have a contextual understanding of the goings-on of the studio to enrich responses

We also tried to emphasize emotional intelligence and joy in interactions- remembering specific emotional states and reactions in our reflections

![Screenshot_2024-02-16_at_1.51.13_PM](https://res.cloudinary.com/ejf/image/upload/v1708109486/Screenshot_2024-02-16_at_1.51.13_PM.png)

The anthropomorphism also helps already role-play the position of a studio assistant, which in fact results in him being that in reality.

#### Reflections and Memories

TODO: Make embedding map of Artie's memories

Every interaction (a message received, and a response sent back to the user) is passed through a "reflection stage" where the entire context window and the interaction is passed for evaluation and a memory of the interaction is formed.

```merm
graph TD
    A[User Message] -->|Username| B(Reflection Stage)
    C[AI Response] -->|Response| B
    
    B --> D[Assemble Preamble]
    D --> E[Add Relevant Memories]
    E --> F[Add Recent Memories]
    F --> G[Add General Memories]
    G --> H[Add Capability Manifest]
    H --> I[Add System Prompts]
    I --> J[Collection of Messages]
    
    J -->|Context Window| K[Generate Final AI Response]
    
    K --> L{Memory Generation}
    L -->|Prompt, Response, History| M[Analyze for Todos/Tasks]
    M -->|Task Commands| N[Execute Todo Commands]
    N -->|Todo Updates| O[Store Todo Changes]
    
    L -->|Prompt, Response, History| P[Generate Memory Completion]
    P --> Q[Filter Memory Completion]
    Q -->|Memory Text| R[Store User Memory]
    
    O --> S[Final Output]
    R --> S
```

These memories are adding to the context of every interaction on both a temporal and relevance basis; ie, both recent memories and "similar" memories to the user prompt are added to enrich responses

We found compounding effect to this knowledge; with over 3,000 memories in our database and experience working through a variety of problems with us, we find the answers more frequently reflect our preferences around coding libraries, approaches, and the tone of written copy.

Embeddings are also generated from memories so that similarity searches can be run on the user prompt to find memories that are relevant to the current task.

There is a combinatorial impact of memories and capabilities; every time a capability is used a memory is formed, including any errors generated. We have found that occasionally when developing new capabilities, Artie will suggest workable fixes for problems he encounters, which is an experience I had not yet experienced in over 20 years of computing.

### Focusing on Context-Stuffing and large context windows

In our experiments, the more real-world information and context given alongside a user query, the more accurate the response will be. Our goal is to build on this by assembling as much context as possible for each interaction and memory generation.

With a focus on high-quality inputs, we can build an application that is focused on filling ever-growing context windows with context that is relevant, sequenced properly, and at the right ratios and level of summary for the task at hand.

The actual LLM engine or API shouldn't really matter; a given set of memories, prompts, and context should be able to steer any current or future model, which lets us reap the benefits of rapidly improving models quickly, since our approach is platform-independent.

#### Relevance Context Window

All memories are embedded, so that similar memories can be categorized and queried later. Every user interaction includes a few relevant memories (the number is randomly-chosen) to the user prompt. When using a capability or tool, memories relevant to that tool are also recalled.

#### Temporal / Recent Context Window

In addition to relevance by topic, we include a running temporal context window that includes:

- The last few messages from that specific user
- The last few messages from users in general
- The last few memories generated for this user
- The last few memories generated for users in general

Because the exact number of these results are randomized for each message, the ratio is different each time. This lets us balance responsiveness with thorough memory; less context means faster answers, and some types of conversations don't require a long history of messages.

## Randomness and non-determinative systems

```merm
graph TD
    A[Reflection Stage] --> B[Add Relevant Memories]
    B --> C[Randomly Select<br>Memory Count]
    C --> D[Retrieve Relevant Memories]
    
    A --> E[Add Recent Memories]
    E --> F[Randomly Select<br>Memory Count]
    F --> G[Retrieve Recent Memories]
    
    A --> H[Add General Memories]
    H --> I[Randomly Select<br>Memory Count]
    I --> J[Retrieve General Memories]
    
    K[Memory Generation] --> L[Randomly Select<br>User Memory Count]
    L --> M[Retrieve User Memories]
    
    K --> N[Randomly Select<br>General Memory Count]
    N --> O[Retrieve General Memories]
    
    P[Generate AI Completion] --> Q[Generate Random<br>Temperature]
    Q --> R[Generate Random<br>Presence Penalty]
    R --> S[Generate Random<br>Frequency Penalty]
    
    T[Trim Message Chain] --> U[Randomly Select<br>Message to Trim]
```

### Where we use randomness
- Randomly deciding whether to add a hexagram prompt to messages
- Generating random values for temperature, presence penalty, and frequency penalty in AI completion parameters
- Selecting a random message to trim when trimming the message chain
- Determining the number of previous user messages and memories to retrieve
- Determining the number of relevant memories and general memories to retrieve
- Generating a random hexagram number and its corresponding name

## Letting Coach Artie Manage His Own Systems

In our quest to create a truly autonomous AI assistant, we've focused on giving Coach Artie the tools he needs to manage his own systems. Central to this effort are two powerful capabilities: `pgcron` and `supabaseraw`. These capabilities allow Coach Artie to interact with his Supabase database and schedule tasks without relying on human intervention.

## Building an extendable suite of capabilities

With `pgcron`, Coach Artie can create, list, update, and delete cron jobs, which are essentially scheduled tasks. This could be anything from running a SQL query to sending a webhook request to an external API. The flexibility of `pgcron` allows Coach Artie to automate a wide range of tasks and keep his operations running smoothly.

The `supabaseraw` capability complements `pgcron` by giving Coach Artie direct access to his database. He can select, insert, update, and delete data based on specific conditions, essentially giving him full control over his information storage and retrieval. This level of access allows Coach Artie to analyze his own data, detect patterns or inefficiencies, and take action to optimize his performance.

By leveraging these two capabilities, Coach Artie can now monitor his own systems, identify areas for improvement, and implement solutions independently. This represents a significant step forward in our goal of creating an AI assistant that can learn, adapt, and evolve without constant human guidance. As we continue to refine and expand Coach Artie's capabilities, we're excited to see how he'll use his newfound autonomy to tackle even more complex challenges.

## Constant testing and iteration
### Failures around teaching Capabilities

### Failures around scheduled proactivity
### Pilot program in The Birch School
### Internal usage within Room 302 Studio

## Future Plans: 1 year, 5 year outlook
### 1 Year Roadmap

### 5 Year Roadmap