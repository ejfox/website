---
dek: "In which the author's adoration for Obsidian is revealed, celebrating its versatility, customizability, and ingenuity in revolutionizing the written word"
inprogress: true
date: 2023-04-04T14:48:13-04:00
modified: 2023-04-04T14:53:41-04:00
---

# Why I love Obsidian

#process #personal 

I am always on the lookout for tools that can enhance my creative process and help me organize my thoughts more efficiently. When I discovered Obsidian, it was as if I had found the perfect companion for the way my brain works. I want to share my love for Obsidian, highlighting its features, customization options, and how it has revolutionized the way I work.

![A screenshot of my Obsidian workspace: the top left pane has a list of files, the bottom left pane has a local network graph of notes and tags related to this one, the main pane has the content of this post, the top right pane has Smart Connection-powered similar articles, and the bottom right pane has an outline of the table of contents](Screenshot%202023-04-04%20at%202.44.48%20PM.png)

## The power of Markdown

Obsidian's use of Markdown as its primary language makes it incredibly versatile and easy to learn. I've been using Markdown for over 10 years, so it comes naturally. The simplicity of Markdown allows me to focus on my writing without getting bogged down by complex formatting or WYSIWYG tools. Moreover, its widespread adoption ensures compatibility with various platforms and tools, making it a true lingua franca for digital writing.

## Great plugin framework and community

One of the most exciting aspects of Obsidian is its thriving plugin community. This diverse ecosystem of plugins allows me to tailor my writing environment to suit my specific needs and preferences. From simple productivity enhancements to advanced features like graph views and AI-powered note suggestions, the possibilities are virtually endless.

## Using Obsidian with Nuxt for my website

I have also built a customized system that automatically publishes my notes from Obsidian to my website while excluding drafts. This seamless integration between my note-taking and publishing process has streamlined my workflow and made sharing my thoughts with the world easier than ever.

### Syncing blog content with rsync

In order to synchronize my notes (minus drafts) I use rsync and grab the markdown files from the place where Obsidian keeps them for auto-syncing.

```js[package.json]
"scripts": {
    "content:blog": "rsync -avz --delete --exclude='/drafts/' --include='*.md' --exclude='*' ~/Library/Mobile\\ Documents/iCloud\\~md\\~obsidian/Documents/EJ\\'s\\ Notes/ ~/code/website/content/blog/",
    "content:reading": "rsync -avz --delete --exclude='/drafts/' --include='*.md' --exclude='*' ~/Library/Mobile\\ Documents/iCloud\\~md\\~obsidian/Documents/EJ\\'s\\ Notes/reading/ ~/code/website/content/reading/",
    "content:all": "npm run content:blog && npm run content:reading"
  },
```

## Syncing reading

With the [Obsidian Kindle Plugin](https://github.com/hadynz/obsidian-kindle-plugin), I can effortlessly sync my Kindle highlights and integrate them into my notes, making it easy to reference and incorporate quotes from my favorite books. This centralized repository of knowledge has become an invaluable resource for my writing and personal growth.

### AI-Powered Note Suggestions

By leveraging the power of OpenAI embeddings through the [Smart Connections plugin](https://github.com/brianpetro/obsidian-smart-connections), I can discover similar notes and quotes within my Obsidian vault. This intelligent feature saves me time and ensures that I never miss an opportunity to enrich my writing with relevant insights from my past readings.

## Graph views

Obsidian's graph view feature offers a unique way to visualize the connections between my notes, revealing patterns and relationships that might have otherwise gone unnoticed. This bird's-eye perspective on my writing helps me identify gaps in my understanding and inspires new ideas for exploration.
