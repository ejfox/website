---
dek: In which the author proudly lays out his technological toolkit
type: words
hidden: false
inprogress: false
date: '2021-02-09T20:42:11-05:00'
hidetimestamp: false
---

# Computer setup
I’m a big fan of [preparation](https://ejfox.com/blog/step-zero/). It's the same part of my personality that causes me to assemble [go bags](https://en.wikipedia.org/wiki/Survival_kit). It’s the same instinct that made me want to buy a manual transmission for my first car: that way I could be sure I could drive any car I encountered.

My technological set up is similar. There are a lot of things in place that one could argue I don’t **need** right now, or don’t use  every day.

But it makes me feel better because they are already configured and set up in case I need them. These are my tools, sitting cleaned and sharpened, waiting for me to figure out what to do. 

> There are about a hundred little tricks like this that Hiro wouldn't know about if he hadn't been programming avatars for people like Vitaly Chernobyl for the last couple of years. To write a really good invisible avatar from scratch would take a long time, but he puts one together in several hours by recycling bits and pieces of old projects left behind in his computer. Which is how hackers usually do it.
> <cite>Neal Stephenson, Snow Crash, 1992</cite>

[[toc]]

#### Why?
The motivations behind doing this are not always clear to me. But in the end it comes from a core belief that computers can allow us to do amazing things. As I discover new pockets of knowledge, I also find new ways to string them together. 

An idea will come to me and I can see how I would create it because I had already experimented with some of the elements without even knowing why.

I’ve written a bit about how the [internet was built to be hacked](https://ejfox.com/blog/the-internet-was-built-to-be-hacked) and the amazing tools we have been given to do so. 

Part of this exercise has been going to my roots to understand how some fundamental technologies (like email, mailing lists, usenet, IRC, PGP, etc.) can [be remembered, reused, and repurposed to build a better online world](https://www.are.na/ej-fox/neo-internet-philosophy).

There is also the magical and inexplicably cool feeling of typing the right magic words and convincing a computer to do what you want.

## Passwords & 2FA
1password is the core of my set up. It allows me to have secure and complicated passwords for my accounts / logins / keys / etc. My golden rule is that if I can remember my password, it isn’t strong.

I use two-factor authentication on every service that offers it. Wherever possible, I [avoid 2FA that uses my phone number](https://authy.com/blog/understanding-2fa-the-authy-app-and-sms/). I really like Authy for now, but am looking to switch to 1password for 2FA as well.

## Using the command line
I’ve spent a long time becoming comfortable with the command line. I started swimming in shallow water with a `cd` here and and `ls` there. I wanted to take some concentrated time to become more familiar with the command line. The goal is to be able to sign onto any \*nix command line and be able to navigate around and get stuff done.

### tmux
I’m also running [tmux](https://hackernoon.com/a-gentle-introduction-to-tmux-8d784c404340) so creating a new window is a quick “ctrl-a c” and I’m off and running. I’ve also been using “ctrl-a w” which is basically a tmux version of alt-tab and lets me go between my different windows with the arrow keys. 

### vim
I only just started using vim, and it required setting it up *just* right for [my personal setup](https://github.com/ejfox/dotfiles/blob/master/.vimrc “My vim configuration file is hosted on GitHub with the rest of my dotfiles”). I’ve been collecting helpful commands or tools with the [**vim** tag on pinboard](https://pinboard.in/u:ejfox/t:vim)
- [nerdtree](https://github.com/scrooloose/nerdtree) for a file explorer
- [fzf](https://github.com/junegunn/fzf#respecting-gitignore-hgignore-and-svnignore) which I’ve remapped to ctrl-p (like Atom) so I can quickly search files in my directory to open
- [lightline](https://github.com/itchyny/lightline.vim) is a statusline for vim that makes it easy to see what mode I’m in

### cli tools
- [lazygit](https://github.com/jesseduffield/lazygit) is an amazing tool for doing most git-related tasks easily and sanely without memorizing tons of commands - I use it all the time in combination with vim
- [jq](https://github.com/stedolan/jq) is a great tool for processing JSON data, especially large datasets. Use like `cat package.json | jq .scripts`
- [jsonfui](https://github.com/AdrianSchneider/jsonfui) is a great CLI interface for JSON data, and a way more performant way of exploring large datasets in a command line UI
- [gtypist](https://www.gnu.org/savannah-checkouts/gnu/gtypist/gtypist.html) is a nice tool to practice and check my typing speed
- [mutt](https://medium.com/@stessyco/gmail-from-the-command-line-with-mutt-mac-os-x-92d047bcd74f) lets me send and receive email from the command line which is rad and a nice no-frills interface that makes one feel like a Real Hacker
- [recon-ng](https://bitbucket.org/LaNMaSteR53/recon-ng) is a tool used for OSINT research, using a variety of Python scripts and APIs to look up publicly available information for research purposes
- [things.sh](https://github.com/alexanderwillner/things.sh/) lets me check my [Things](https://culturedcode.com/) to-do list from the command line. [^I have two aliases: `alias todo="things.sh"` and `alias today="todo today | awk 'BEGIN{FS=OFS=\"|\"}{\$1=\$3=\"\";gsub(/[|]+/,\"|\")}1' | tr -d '|'"` to quickly show today’s tasks with `today`.]

## Communicating Securely
I prefer [Keybase](https://keybase.io/).

I have a [keybase profile](https://keybase.io/ejfox) that lists a handful of verified identities and addresses that you can verify are me. I am also host my public PGP key at <https://ejfox.com/pgp.txt> so that people who want to send me encrypted messages can do so. 

### Importing my PGP key
You can easily import my PGP key with `curl https://ejfox.com/pgp.txt | gpg --import` 

It’s also nice that, even as much as I trust keybase, the PGP key is [hosted on an HTTPS website that I exclusively control](https://jacob.hoffman-andrews.com/README/the-safe-way-to-put-a-pgp-key-in-your-twitter-bio/). 

### Confirming my PGP public key and fingerprint

My key is also hosted in multiple places, so you can confirm my public key [on GitHub](https://github.com/ejfox.gpg)^[Which I use to [sign my commits](https://medium.com/@rwbutler/signing-commits-using-gpg-on-macos-7210362d15)] is the same as the one [I host](https://ejfox.com/pgp.txt) which is the same as the one [on Keybase](https://keybase.io/ejfox/pgp_keys.asc) which is the same as the one [on Wikipedia](https://en.wikipedia.org/w/index.php?title=User:Ejfox/Key&oldid=903520387).

A semi-automated way to do this comparison is by appending all 3 keys to a txt file and comparing them ^[Or you can just run [this gist](https://gist.github.com/ejfox/d64a7da835ef51ef67c376fdf6d0b542) as a one-liner: `sh -c "$(curl -fsSL https://gist.githubusercontent.com/ejfox/d64a7da835ef51ef67c376fdf6d0b542/raw/0c5724ab43ea5af6a25d3544e43fcfe75bce8d41/verify-pgp.sh)"`]. 
```bash
curl https://github.com/ejfox.gpg | gpg --with-colons --import-options import-show --dry-run --import >> fp.txt

curl https://ejfox.com/pgp.txt | gpg --with-colons --import-options import-show --dry-run --import >> fp.txt

curl https://keybase.io/ejfox/pgp_keys.asc | gpg --with-colons --import-options import-show --dry-run --import >> fp.txt

grep 89CD fp.txt
```

Which should return the same matching fingerprint from all 3 files. ^[If any of my publicly-posted keys (or fingerprints) do not match please [contact me immediately](mailto:ejfox@ejfox.com) because something weird is afoot.]
```
fpr:::::::::5D30A33E08E35B8915B4C7E2E2078E653FE389CD:
fpr:::::::::5D30A33E08E35B8915B4C7E2E2078E653FE389CD:
fpr:::::::::5D30A33E08E35B8915B4C7E2E2078E653FE389CD:
```

#### Website backups
My [website is backed up](https://ejfox.keybase.pub/) on the [Keybase filesystem](https://keybase.io/docs/kbfs) as part of my [site’s deploy process](https://github.com/ejfox/website/blob/master/package.json#L14).

I’ve got the [GPG Suite](https://gpgtools.org/) for OS X which makes it so you can store your PGP key passphrase in the keychain. This makes it easier to do a handful of things, including [signing git commits](https://help.github.com/en/articles/signing-commits) with my key without having to enter my passphrase every time.


## Surfing the web
I’ve really like the work being done with [Brave Browser](https://brave.com/) especially the [Basic Attention Token](https://basicattentiontoken.org/) which among other things, allows people who browse the web to give money to content publishers through automated micro-transactions (which I think is probably the future of healthy content consumption on the internet).

#### VPN
I like [NordVPN](https://nordvpn.com/) last time I’d checked they had relatively good reviews from folks I trusted, they are pretty affordable, they take cryptocurrency, and their desktop and iOS apps are actually really nice. 

I usually have a NordVPN running on my desktop and phone in addition to the [1.1.1.1](https://itunes.apple.com/us/app/1-1-1-1-faster-internet/id1423538627?mt=8) app.

## Cryptocurrency
I cannot see any downsides to making it easier for people to send me money.
```
BTC=3DE42VUyUKSikQ9eUeFKv2EkKVms7Pmd1G
BCH=qrwzlfjhhn8jdx92a8m8e2kuxcchmmvdgguqgy23a7
ETH=0x63958715F8e9Fd6CF0652394a89bb2AdD0a11686
LTC=MDvtqRMS6QiiXpYgxtgZKHPrYnLovjdcsZ
XLM=ejfox*keybase.io
```


## Publishing
I publish most of my prototypes and websites through [Netlify](https://netlify.com) using the [Netlify CLI tools](https://www.netlify.com/docs/cli/), which I’ve [written about previously](https://ejfox.com/blog/how-i-prototype-apps-and-dataviz-quickly-in-2019). It makes it easy to run [one command to rebuild and redeploy my sites](https://github.com/ejfox/website/blob/master/package.json) and even create little preview sites.

I’m also really excited about using [Glitch](https://glitch.me/) and [Observable](https://observablehq.com) to create smaller apps and explanations, especially those that I might want to others to modify or fork since Glitch makes that so easy.

### Misc.

Anonymous GitHub PRs can be submitted [using gitmask](https://gitmask.com) or works published on [neocities](https://neocities.org/) or Pastebin through [Tor](https://www.torproject.org/) or NordVPN’s [Onion over VPN](https://nordvpn.com/features/onion-over-vpn/).

## Why is anonymity important?

A lot of good work and activism can be done anonymously but it takes work to set things up properly in advance. By the time you want to be anonymous, it will likely be too late to learn all of the technologies and habits to do so successfully. So we practice anonymity in the hopes we never need to use it.

It is worthwhile for anyone to have a process by which they can publish materials to the web anonymously in a way that is hard to scrub. Prepare for rain and hope for sun.

How do you decide when to be anonymous?

- Will the work make you a target of harassment from dark corners of the internet?
- Will the work potentially annoy the rich and powerful who can afford to try to have you sued or silenced?
- Will the work potentially reveal truths that governments would rather not be publicized?
- Are you creating work that could have a large monetary value that could make you a target?
- Could the work potentially be used by bad actors to commit crimes?

## These tools are for everyone
I wrote this up because I was surprised at how easy it was to get set up. These are at their core very complicated systems, but over the past few decades really smart people have made them easy and approachable. Practice getting things set up now, you never know when that knowledge might come in handy.
