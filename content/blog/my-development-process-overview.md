---
date: 2022-11-02T20:01:31-04:00
modified: 2023-07-08T20:11:11-04:00
dek: In which we go into detail about how to write code to accomplish a goal
inprogress: true
---
# An overview of my development process

#programming #personal #process 

![[610144184_A_curious_man_in_a_flatbrim_baseball_cap_and_a_short_cropped_brown_beard__flying_over_a_sea_of_blog_.png]]

[[2022-prototyping-toolkit]]

[[my-vscode-setup]]

The rough shape of the project changes depending on a few factors:

- Personal project vs group project
- Paid vs unpaid
- Fast vs slow
- Public vs private

For more less-technical specifics around project management in general: [[how-to-run-a-project]]

For design philosophy [[design-philosophy]] and [[joy-driven-development]]

# Establish a clear goal

Sometimes the goal of a project can boil down to "who are we trying to make happy?"

That could be a particular type of user, or it could be a powerful stakeholder, or the person who commissioned the project. Who controls the future of this project and what are they trying to get out of it? How can we make them happy?

On personal project the goals might not be so clear, and it's worth digging into why something is interesting and putting it into words. Treat yourself as your client, with all the patience and diligence that implies. 

Personal projects can be beneficial for a variety of reasons:

- Explore personal curiosities
- Learn new technologies / techniques
- Collaborate with cool people 
- Create material for self-promotion
- Create work that you want to do more of

You can usually only accomplish a few of those goals, and knowing the bounds of your motivation for a project can help you avoid diving deep into the wrong areas and getting burnt out. 

## User story

I talk more about user stories in [[how-to-run-a-project]]

> User stories are a way of describing the functionality of a system from the perspective of the user. User stories are written in the following format:
> "As a *type of user, I want *goal* so that *reason*."

## Acceptance criteria

Acceptance criteria are predefined rules that determine whether a given feature or piece of functionality is working as intended. They are a set of statements, with a clear pass or fail result, that specify both functional and nonfunctional requirements, and are used to assess the success of a project. These conditions must be met to consider a project successful.

Acceptance criteria help to create a shared understanding between team members, clients, and stakeholders about what is expected from an engagement. It's important that they are clear, specific, measurable, and easy to validate.

I often write my acceptance criteria in the form of user stories.

## Deadline

Deadlines, while sometimes stressful, actually serve an important role in managing your work. They help to frame the timeline and encourage focus and productivity. A clearly defined deadline sets the expectation for when work should be completed and ensures that everyone is working towards the same goal.

## Core principles

## Gather context
### Stakeholder Needs

Knowing who the stakeholders are and what they expect from the project is crucial. Needs could range from project timeline, budget, technical specifics, to the business impact.

### Project Goals

Understanding and articulating the main objectives behind the project, along with what problem the project aims to solve.

### Technical Infrastructure

Understanding the tools, platforms, or systems that will be used during the project helps in planning and implementation.

### User Expectations

If the project involves a user base, understanding their expectations and needs can significantly enhance the project's design and usability.

### Market Trends

Keeping abreast of existing market trends, both direct and indirect competition, can inform the strategy and positioning of your project.

### Prior work

Before starting a new project, it's beneficial to research and understand the work that has already been done in the area. Existing solutions, projects, or research might provide valuable insights, lessons learned, or even spark new ideas. Evaluating prior work can also prevent you from duplicating efforts or repeating the same mistakes.

### Terminology / names

Every industry or project often has its own set of unique terms, names, or jargon. Familiarizing yourself with these terms can hugely impact your understanding of the project and improve your communication with stakeholders and team members. Trying to speak the same language as your users or clients can foster better understanding, and convey professionalism and competence.

### Tools that can help

Not every project will require the same set of tools. Depending on the project's nature, the 'right' tools can hugely differ. It's important to identify and understand the tools available that could aid your project's development, whether they're software for task management, design tools, coding platforms, analytical tools, or even physical equipment if relevant. They can save time, increase efficiency, and provide new capabilities.

## Gather data and explore

Data forms the backbone of any project. The type and amount of data needed will depend on the project's complexity and scope. Gathering useful data is a systematic process involving identifying data sources, collecting information, cleaning it, and then verifying its accuracy and relevance. 

In the exploration phase, objective analysis of the gathered data can reveal patterns, trends, and insights that inform your project direction and strategy.

## Metadata: what’s there? What’s missing?

As we navigate the development process, one crucial step is managing metadata - the information about our data. It's key in understanding the depth and quality of assembled data and integral to interpreting it correctly.

Observing what data exists and recognizing what's missing allows us to validate our data's completeness and reliability. Like a pre-flight checklist for a pilot, knowing your metadata and any gaps that exist helps you anticipate and mitigate any potential hiccups when using the data to drive your project decisions. It ensures the journey ahead relies on dependable, comprehensible information.

## Go Wide, Establish Possibilities

In this stage of the process, the objective is to broaden the horizons of your project and explore as many possibilities as you can. This is the brainstorming phase where no idea is dismissed prematurely. Encourage out-of-the-box thinking and don't limit your exploration to just the tried-and-true.

This step might involve several techniques like:

- **Mind Mapping:** This visual tool can help you organize thoughts, ideas, and potential solutions related to your project.
- **Prototyping:** Quick hands-on experiments or simulations can provide insights on feasibility of ideas.
- **Notebooks:** Jotting down or sketching ideas can help retain them and facilitate deeper analysis later.
- **Clients feedback and iteration loops:** Engaging stakeholders at this stage can bring in fresh perspectives and align ideas better to actual needs.

By stretching the possibilities wide in this stage, you ensure you have multiple approaches or solutions to choose

### Visual Forms

The use of visual forms in the exploration stage is instrumental. They convert raw data into insightful visuals, leading to an enhanced understanding and drastically improving the quality of the project:

#### Numeric Values: Scatterplot

Scatterplots illuminate trends or outliers in numeric data, providing a clear path to impactful solutions. 

#### Geographic Data: Map

Maps transform location-based data into discernible patterns, opening up the landscape for strategic decisions.

#### Data with Time: Line Chart or Animation

Line charts or animations translate progression over time into visible trends, illuminating the path forward.

## Make a prototype

In the developmental journey, crafting a prototype is your first step towards making your project tangible. A prototype, often developed with Vue/Nuxt in my process, is a functional, interactive model that embodies your design vision. 

A prototype primarily serves as a validation tool - a way to test design hypotheses, functionality, and gather initial user feedback. Prototypes might not encompass the full functionality of the final product and often focus on testing specific aspects of the design. As such, they're meant to be iterative, changed, and refined based on user feedback and testing outcomes. 

An important distinction to make is between a prototype and a Minimum Viable Product (MVP). While they seem similar, their purpose and scope differ. An MVP is a pared-down version of your product that includes just the core features necessary to make it work and deliver value to users. It's more polished than a prototype and is generally used to see how the target audience responds to the product's main idea. While the prototype is more for internal validation of design ideas, an MVP is put in front of actual users.

### Designing an MVP

When designing a Minimum Viable Product (MVP), the goal is to develop a product with the smallest possible feature set that still delivers core value to the user. To achieve this, everything we've done so far comes into play.

The understanding gained from gathering context about user needs, project goals, and stakeholder requirements informs what your MVP must achieve. The data exploration and visual forms help you grasp the intricacies of the data your MVP will handle, influencing design decisions. 

Starting with a mobile-first design helps focus on what's essential. On smaller screens, every element matters and unnecessary complexity can ruin user experience. This approach forces you to prioritize features, displaying only what's crucial on your MVP.

Using tools like Figma, create interactive high-fidelity prototypes to visualize the flow and feel of your MVP. Use it to try out different design possibilities and interaction patterns before committing any code.

It's important here to think in terms of problem-solving, not feature-building. Keep asking: what is the simplest solution that solves the problem for our users?

When defining the scope of your MVP, consider data prototypes too, especially for products involving complex data interactions. They allow you to test feasibility and performance early on.

At this stage, a key mantra should be: don't fall in love with your ideas. Be open to discard features or elements if they do not serve the primary goal of your MVP. 

Ultimately, designing an MVP is about discerning what's absolutely necessary for your product to provide its core value, and having the discipline to say 'no' to everything else until after validating the MVP. It is a challenging process but essential in creating focused, valuable products while minimizing wasted efforts.

## Visual design and polish

Post-MVP, attention turns to enhancing user experience with aesthetics. It's more than just colors and fonts; it's about intuitive, consistent visuals that boost user engagement. Crucial elements in this process are animations and easing.

Visual design gives your product its aesthetic appeal, aligning it with the brand's identity and improving user experience. It includes aspects like color schemes, typography, iconography, layout and spacing, among others.

Polishing your product involves refining every element and interaction to make sure it's smooth, intuitive, and visually pleasing. It's about paying attention to small details like consistency in design elements, easy-to-read fonts, sensible animations, effective color contrasts, and so on.

## User Testing

User testing is the pivotal phase where your product, the MVP you designed and polished, is put to the test in the hands of actual users. It provides crucial insights into its usability and any potential areas for improvement.

### The User is Always Right

During user testing, one mantra to remember is: The user is always right. If users struggle with a certain feature or can't navigate through your app intuitively, it indicates that changes are needed. This feedback is invaluable in improving the product and enhancing user satisfaction. After all, a product that doesn't meet user needs or isn't user-friendly will struggle to find success.

### Be Open to Big Pivots

It's also essential to remain open-minded and ready for change during this stage. Sometimes, user testing might reveal that significant changes (or pivots) are necessary for your product to work effectively. These pivots could range from minor feature tweaks to a complete overhaul of certain aspects. Being flexible and open to these big pivots can significantly improve your product's final version.

### Beginners Mind is Invaluable

Approaching user testing with a 'beginner's mind' can be invaluable. This mindset allows you to observe and understand users' experiences without preconceived notions, helping identify pain points or difficulties a more experienced eye might overlook.

## Documenting the Process

The process of developing a project is a journey filled with valuable insights, decisions, and iterations. Documenting this process serves several purposes:

- It provides a historical record of your project, allowing you to trace back your steps, understand the decisions made, and learn from them.
- It facilitates communication and transparency with stakeholders, clients or team members. They can see the progress made, understand the reasoning behind decisions, and contribute more effectively.
- It's a great tool for reflection and learning. Looking back at your documentation can provide insights into your working style, efficiency, and areas for improvement.

There are several ways to document the process effectively:

### Screenshots

Visuals can communicate information quickly and intuitively. Regularly taking screenshots of your work - be it design drafts, code snippets, bug reports or user feedback - can create a rich visual timeline of your project.

### Working in Public

Sharing your work progress publicly (e.g., on social media or a blog) not only serves as documentation but also invites feedback and creates accountability. It can foster community engagement and even attract potential users or clients.

### Live-Streaming

Live-streaming your work sessions is another form of real-time documentation. It gives people an inside look into your workflow and decision-making process. This transparency can build trust with clients or users and facilitate learning for others in your field.
