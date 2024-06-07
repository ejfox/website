---
draft: true
dek: 'In which the importance of mindful CMS selection is examined, the option of "no CMS" is considered, and the benefits of using Markdown are revealed'
inprogress: true
date: 2023-04-04T14:50:35-04:00
modified: 2024-06-03T12:56:07-04:00
tags: tech howto
---

## A Thoughtful Approach to Choosing a Modern CMS

#tech

In an age where content is king, the choice of a Content Management System (CMS) is akin to forging a bond with an unknown force that holds sway over all of your endeavors, and it is a decision that cannot be taken lightly, though it often is.

We are creative creatures navigating the complex collision of man-made machines and natural beauty, it is crucial for us to approach CMS selection with careful consideration, lest one finds themselves shackled to an ill-fitting system for eternity.

Many times, you don't even need a traditional CMS at all: just use your computer's existing filesystem and tools.

![A digital artist working with multiple screens: Develop an image of a digital artist or content creator surrounded by multiple screens, each displaying a different CMS platform or aspect of content management (e.g., writing in Markdown, managing media assets, or monitoring website performance). This image would showcase the complexity of selecting and working with a modern CMS and emphasize the importance of considering various factors when making a choice](edited_142288951_A%20hipster%20digital%20artist%20working%20with%20multiple%20scr_xl-beta-v2-2-2.png)

My experience with Content Management Systems has primarily been within the bustling world of news organizations and startups, where work is often birthed in familiar tools like Word or Google Docs before being shepherded into a CMS for finalization, and time is of the essence.

However, the limitations of many platforms become apparent when you want to do anything other than publish text. Elements such as full-screen videos, interactives, and scrollytelling might need to be hosted externally, accessed via links or iframes, and may not be responsive. This is extremely frustrating for everyone involved.

::table-of-contents

::

### The argument for no CMS

Let's get to the point: unless you can easily list the reasons why you need a CMS, your default should be to avoid it as long as possible.

The longer you keep your content outside of the CMS, the longer you have complete control over your content and your code and you don’t have to worry about compatibility issues and artificial limitations.

The downside is that it takes time, effort, and intentionality to build everything from scratch. If you want to add features like comments or social sharing, you have to build those yourself or find a plugin that works with your system. This approach is only valuable if you want to create work that looks unlike everyone else's, and can benefit from the value of complete control.

The tools and frameworks for creating websites quickly change the equation. If I can use tools like Tachyons, Nuxt, and Supabase to create complex scalable applications in hours, why would you then spend additional hours trying to get it to work within the limitations of a legacy CMS? [[2022-prototyping-toolkit]]

#### Redefine 'CMS' and bring your own

But what does it actually mean to not have a CMS? It means that instead of entrusting your database of content and assets to a third party, you treat them like you already do; as folders of content in your local filesystem. This encourages a bring-your-own CMS approach; use whatever Markdown editor you want. Use whatever image editing tool you want.

By bringing your content out of a traditional web-based CMS, you unlock the ability to use your existing toolset without the friction of working through web-based recreations with a fraction of the functionality.

You can keep your folder of assets in markdown in sync with whatever system you want; a GitHub repo, Dropbox or Google Drive folder, or using keeping it all in an Obsidian Vault and using Obsidian Sync.

The important thing is that you can switch between any of these options at any time. This also lets you change your mind, quickly, easily, and repeatedly. Because your content is kept out of a database, you don't have to add additional plug-ins or re-craft taxonomies in new tools. The Markdown ecosystem is incredibly vast, and every user can bring their preferred solution to the content without affecting anyone else.

It's essential to acknowledge that no single solution can cater to everyone's needs, and the perceived advantages of a CMS may not always outweigh the drawbacks, especially when it comes to migrating to a different solution down the road.

Furthermore, the expenses associated with hosting, licensing, and maintaining a CMS might be a deterrent, especially for individuals and smaller organizations with limited budgets. On the other hand, the expenses associated with having creatives and developers create custom-built solutions without existing templates/and frameworks may outweigh the benefits of creative freedom if not managed correctly.

### The argument *for* a CMS

Proponents of CMS platforms often emphasize the efficient workflows and user-friendly interfaces a well-chosen system can provide. By offering a unified structure and set of tools, modern CMS platforms simplify content management, enabling even those with minimal technical expertise to contribute effectively and move quickly.

### Twitter is a model CMS

It is incredibly easy to throw together a twitter thread and have it be easily digestible and shareable. With the freedom to interweave images or graphics, Twitter's CMS permits bursts of raw emotion and inspiration with the immediate feedback of likes, retweets, and comments. Few CMSes can rival the pleasure and simplicity of Twitter.

There is an undeniable allure to the ease of use and the minimalistic approach to maintaining a Twitter account. For many, Twitter stands as the best CMS they have ever encountered.

### Markdown-powered CMS

Markdown's simplicity as a plain-text format allows for effortless writing and editing using any text editor or even the built-in editor in a CMS. As a standard format, migrating content between CMS platforms is super easy.

#### Nuxt Content powered by Markdown

[Nuxt Content](https://content.nuxtjs.org) is a powerful CMS alternative that uses Markdown as its content format. With Nuxt Content, you can easily create and manage a website without having to worry about complex database schemas or cumbersome UIs.

I use Nuxt Content to [power my website](http://github.com/ejfox/website)

Nuxt Content also provides a lot of powerful features like automatic syntax highlighting for code blocks, support for YAML front matter, and a plethora of modules that make it easy to generate opengraph images, include Google Fonts, and a bunch of other useful things.

#### Markdown editing tools
- IA Writer [Site Unreachable](https://ia.net/writer)
- [Obsidian](http://obsidian.md) [[why-i-love-obsidian]]

Ultimately, the decision to implement a CMS rests on carefully assessing the available options and considering one's unique situation; but "we need a CMS" should never be the default option.

A well-informed and discerning approach to CMS selection can enable teams of content creators and developers to maintain a productive balance between freedom and speed.

By understanding the full spectrum of choices, we can confidently navigate the world of CMS platforms and select the solution best suited for our creative endeavors, even if sometimes the best solution is no solution at all.

---

If you ever find yourself creating a new hand-built CMS- you probably shouldn't. But if you do, it should follow these principles at minimum.

### What a CMS should do
#### Be easy to use

A CMS should make it easy to make content.

A CMS should cater to both content creators and developers. It must be intuitive for content creators and allow developers the flexibility to easily extend and customize functionality without unintentionally causing issues.

#### Help your process

A good CMS can help with the process of revisions, edits, and versioning. It might be a place where discussion or feedback takes place. It should reinforce your existing processes; not force you to adopt new ones.

#### Be secure

Your CMS should be secure. This means that it should be regularly updated to fix security vulnerabilities.

It should have authentication features like password protection and user permissions to control who can access the CMS and what they can do. Publishing and editing live articles should be available to a limited number of users.

#### Be scalable

Your CMS should be scalable. This means that it should be able to handle large spikes in traffic.

### How do you handle versioning?

Text should be versioned in easy to see snapshots in time with simple functionality to revert place in time. It should be easy to see all the changes made and who made them.

Graphics and interactive data visualizations should be stored in GitHub and each published version should be a new release and version number bump with a CHANGELOG of the differences between versions.

It should be easy to see any version of any asset and compare them.

CMSes could also do more to help with project management by showing versions to users as well as item status, deadline, and assignment information. Often this information is captured in software outside the CMS, but it would be great to have it all in one place.

### Where do you keep your media?

#### Cloudinary

Cloudinary is a cloud-based service that allows you to store, manage, and deliver your media assets. It provides a lot of features around image transformations and optimizations that make it a powerful option for displaying images and video.

#### Amazon S3

Amazon S3 is a cloud-based storage service that allows you to store and deliver your media assets. A lot of organizations already use S3, and it can be way easier to start putting assets in a new bucket in an S3 account that exists already.

#### Supabase Storage

Supabase Storage, an extension to the popular Supabase platform, which gives users an effortless way to handle large media files directly within their CMS interface. It integrates smoothly with other parts of Supabase, so if you are already storing your data in Supabase, it's an easy choice.

### Where do you host it?
#### Netlify

Netlify is a cloud-based hosting service that allows you to deploy and host your website.

It has a free plan that allows you to deploy up to 3 sites and gives you 100GB of data transfer per month. It also has a paid plan that allows you to deploy an unlimited number of sites and gives you unlimited data transfer.

#### Amazon AWS

Amazon AWS is a cloud-based hosting service that allows you to deploy and host your website. It is much more difficult to automate deploys to AWS than to Netlify, in my experience. It is probably the most-used hosting service, but it is also the most expensive.

#### Self-hosting

Self-hosting your website is an option if you have the technical expertise and resources to maintain and secure your server. It can give you complete control over your website, but it also requires a lot of work and can be costly in terms of time and money. It is not recommended for most individuals or small businesses without dedicated technical support.

### CMS Recommendations
- Wordpress: sometimes the best CMS is the one your client is already using, and often, that is Wordpress.
- Storyblok: A really next-level CMS built to be used headlessly in webapps, great extensibility, API, and documentation
