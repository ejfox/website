---
dek: "Artie's stepping up his game—now he can read whole repos and handle files like a pro"
date: "2022-12-05T23:34:09.000Z"
modified: "2024-05-16T18:50:23.000Z"
tags: null
hidden: true
draft: true
---
## Coach Artie: Webhooks, Cron, and Advanced Reflection

We've been working hard to make Coach Artie even better, and we're excited to share some updates on recent work we’ve been doing to make him more helpful and intuitive.

Recently, we introduced a new way for you to experiment with Artie's abilities without having to run the entire system or interact through Discord. This means you can now test and refine new capabilities quickly. It's a game-changer for speeding up development and making it easier for contributors to add their innovations. Coach Artie automatically parses jsdoc-formatted documentation within capabilities, so if the capability is well-documented he should be able to pick it right up.

Artie has also learned to communicate through webhooks, a technology that lets him send and receive messages from lots of different web services. We made sure to handle HMAC secrets so it is private and secure, and it works seamlessly with various services you might already use, like GitHub or Missive.

We also made it so Artie can now deep dive into long documents, digesting long and complex information and turning it into concise memories. Whether it's a lengthy report or a running notes from your meetings, he breaks it down into digestible memories, making sure he remembers the right details at the right time. And when you send him a file, he now treats it like it has its own life, creating memories specific to that document, which can evolve as the document changes.

As Coach Artie continues to learn and adapt, we're also building new ways for you to see what's going on in his 'brain' through a real-time, user-friendly website, which we have been using internally for development. This will help Artie’s users manage his capabilities and see the impact of his memory in action. It’s like having a window into how he thinks.

Through these updates, Coach Artie is not just a tool; he's becoming a more integrated part of our workflow, gathering context about the world automatically, anticipating our needs, and adapting to them without skipping a beat. We're excited to see how these improvements will continue to transform the way we interact with our tools.

```merm
graph TD
    A[Capability Player] -->|Test new features| B[Webhook Support]
    B -->|Secure communication| C[Missive Integration]
    B -->|Trigger actions| D[Automated pgcron scheduling]
    A -->|Dynamic testing| E[On-The-Fly Configuration]
    E -->|Model switching| F[Claude Support]
    E -->|Config adjustments| G[Supabase Admin Capabilities]
    C -->|Access conversations| H[Advanced Reflection: Todo List]
    D -->|Schedule tasks| H
    I[Deep Document Ingest] -->|Process documents| J[Forming Memories about Files]
    J -->|Memory creation| K[Read Repo Capability]
    I -->|Summarize content| K
    K -->|Interact with repos| L[Coach Artie Brain]
    L -->|Monitor memories and processes| M[Memory embedding visualization]
    H -->|Create actionable todos| L
    G -->|Database management| L
    F -->|Enhance capabilities| E
    J -->|Generate memories| L
    B -->|Integrate external services| K
    C -->|Enhance interaction quality| H
    D -->|Automate processes| G
    I -->|Enhance document handling| L
```
### Capability Player

We added a new capability player that makes it unnecessary to have a running instance of Coach Artie in order to test new capabilities. It allows you to run a capability with any arguments you choose, which should considerably speed up development. This should also enable people to contribute and test capabilities without needing to run the entire Coach Artie instance.

### Webhook Support

We added support for communicating with Coach Artie through webhooks, including HMAC secrets, which allows you to send private information securely. Initially, we added this integration for Missive, but it works for any service that uses webhooks like GitHub, Slack, or Supabase.

#### Missive Integration

In addition to the Missive webhook integration, we added deep Missive capabilities that allow Coach Artie to access conversations and attachments and build memories from Missive conversations.

### On-The-Fly Configuration

We enhanced Coach Artie with capabilities to edit his own configuration on the fly. This includes allowing him to switch between models such as Claude or OpenAI, with the potential to include others in the future. He can also adjust settings like Max Tries and other configurations. Now, he can run a capability to see his current settings and edit them in real time.

### Automated pgcron scheduling

One of our goals for Coach Artie is to enable him to schedule tasks for himself in the future. Since we're already using Supabase, it made sense to leverage its existing pg_cron functionality. This allows Coach Artie to set a cron job with any schedule he desires. This job will initiate a webhook with a custom prompt that gets sent to the previously mentioned webhook endpoint.

### Advanced Reflection: Todo List

We introduced a new to-do list concept, inspired by the idea of having sticky notes at your desk. These to-dos are omnipresent, added and removed as your day and week progress. To manage these, we added a new reflection stage. In this stage, in addition to making memories from a user interaction, Coach Artie determines whether a to-do or multiple to-dos need to be created from the interaction. These to-dos are then always added to the context window, ensuring they inform every future user interaction.

### Deep Document Ingest

To enhance our fetch and summarize capability in the web browser, we recognized the need for the robot to read very long documents and transform them into one or many concise memories linked to that document. This is often necessary when handling large documents, such as extensive notes from user meetings or detailed documentation. We added a new processing step, which we call "deep document ingest." This allows us to take lengthy documents and convert them into memories in an efficient and consistent manner, leveraging all the benefits of memory creation, while still creating distinct enough groupings to ensure we recall the right things at the right time.

### Forming Memories about Files

In addition to deep document ingest, we introduced a new concept where we can now form memories about files or resources. Previously, we only created memories linked to users, so a memory might contain information about a file a user sent, but it was always associated with that user. Now, when a user sends us a file, we treat that file as its own entity with its own memories. This is particularly useful for documents that change over time. It’s also beneficial for images and PDFs because we can process them with specialized vision and OCR capabilities, generating one or many memories of the document that can be accessed via that document ID.

### Read Repo Capability

We've been eager to give Coach Artie the ability to read entire repositories. Excited by new services that offer larger context windows, we can now potentially send some or all files from a repo, allowing Coach Artie to answer questions based on the structure of our entire codebase. To achieve this, we need to enable him to access any GitHub repository and send him all the files in an intelligently formatted manner. This setup will allow us to pose user questions similar to how we handle documents. Furthermore, it's essential to allow him to form memories about pieces of code that are not direct one-to-one representations; these are abstracted summaries of facts generated from the code and used for understanding the architecture.

### Claude Support

One of the more exciting developments over the last few months has been validating a long-held concept at Coach Artie—namely, that if we switch to a different LLM model, Coach Artie will retain much of the same functionality and personality we depend on. We recently tested this by moving the backend from OpenAI to the Anthropic Claude API, and we're thrilled with the results. The transition required us to format our messages slightly differently and adopt an XML-based command pattern. After making a few adjustments, we found that the switch was pretty seamless. We've particularly enjoyed working with Claude, finding its personality more enjoyable as it offers more openness and creativity compared to the increasingly restricted ChatGPT API.

### Supabase Admin Capabilities

One of the key advancements we've unlocked is enhanced database capabilities for Coach Artie around Supabase. All of Coach Artie’s memories, messages, and tasks are already stored as Supabase tables. We've now empowered him not only to insert, delete, and update rows on his own but also to create new tables and define new schemas on the fly. This capability provides a powerful solution that naturally extends as the models evolve, allowing him to build his own systems and data storage methods—capabilities we couldn’t have anticipated without the flexibility afforded by his new meta Supabase capability.

```merm
graph TD
    A[Self-Management Core] -->|Dynamic Configuration| B[On-The-Fly Configuration]
    B -->|Model Switching| C[Model Choices]
    C -->|Choose Claude or OpenAI| C
    B -->|Adjust Runtime Settings| D[Dynamic Settings Adjustment]
    D -->|Update Max Tries, etc.| D
    
    A -->|Meta-Capabilities| E[Supabase Admin Capabilities]
    E -->|Database Self-Management| F[Database Operations]
    F -->|CRUD Operations on Data| F
    E -->|Schema Self-Modification| G[Dynamic Table and Schema Management]
    
    A -->|Self-Auditing Capabilities| H[Coach Artie Brain]
    H -->|Monitor Own State| I[Real-Time Monitoring]
    I -->|View and Analyze Logs| J[Memory and Process Logs]
    I -->|Access and Query Logs| K[Log Querying]
    K -->|Self-Diagnosis and Debugging| K
    
    B -->|Capability Testing| L[Capability Player]
    L -->|Test New and Existing Features| L
    
    H -->|Visual Feedback for Users| M[Admin Interface]
    M -->|Client-Side Application| N[Client Side App]
    N -->|Manage Configurations and View States| N
```


### Coach Artie Brain

For the first year, we focused on managing Coach Artie exclusively through Discord, engaging in conversations and training him through the development of memories and patterns, which resulted in specific actions. Now, as we introduce more advanced capabilities, it's becoming crucial to have effective ways to see what's happening in Coach Artie's "brain" at any given time and in real time. To address this, I've begun developing a client-side app using Nuxt that displays all of Coach Artie's memories and messages.

We are now sending all the logs to Supabase, enabling you to view and filter these logs as they process in real time. This development is particularly exciting because it also manages configurations and prompts, creating an admin interface that simplifies management for non-technical users and potential clients of Coach Artie. This interface is designed to be simple, beautiful, and powerful, enhancing the user experience and facilitating self-management through a user-friendly web interface.

As we advance the capabilities of Coach Artie, it's clear that our work at Room 302 Studio is a small but meaningful step towards the future of interactive AI. By focusing on user-centric features and intuitive design, we are committed to making advanced technology accessible and useful for everyone. While we are proud of our progress, we view it our contribution to a larger journey in the ever-evolving landscape of AI.

Coach Artie is open source for non-commercial use, embodying our belief in the power of community-driven innovation. By making these tools available freely, we invite developers and enthusiasts to join us in refining and expanding Artie's capabilities. We want to build a collaborative environment where Artie grows through shared knowledge and creativity.