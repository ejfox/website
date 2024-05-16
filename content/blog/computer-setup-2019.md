---
dek: In which the author proudly lays out his toolkit
type: words
hidden: false
inprogress: false
date: "2019-03-24T21:19:39-04:00"
hidetimestamp: false
---

# Computer setup

I’m a big fan of [preparation](https://ejfox.com/blog/step-zero/). There is some part of my personality that identifies with preppers who assemble [go bags](https://en.wikipedia.org/wiki/Survival_kit) in case of emergency. It’s the same instinct that made me want to buy a manual transmission for my first car. That way I could be sure I could drive any car I encountered.

My technological set-up is similar. There are a lot of things in place that one could argue I don’t need right now, or don’t use regularly, or could be done a bit more automatically.

But it makes me feel better because they are already configured and set up in case I need them, and I can get fine-tuned control when I need it.

> There are about a hundred little tricks like this that Hiro wouldn't know about if he hadn't been programming avatars for people like Vitaly Chernobyl for the last couple of years. To write a really good invisible avatar from scratch would take a long time, but he puts one together in several hours by recycling bits and pieces of old projects left behind in his computer. Which is how hackers usually do it.
> <cite>Neal Stephenson, Snow Crash, 1992</cite>

::table-of-contents
::

#### Why?

The motivations behind doing this are not always clear to me. But in the end it comes from a core belief that computers can allow us to do amazing things. As I discover new pockets of knowledge, I also find new ways to string them together. Occasionally an idea will come to me and I can see how I would put it together because I had already experimented with some of the elements without necessarily even knowing why.

I’ve written a bit about how I believe the [internet was built to be hacked](https://ejfox.com/blog/the-internet-was-built-to-be-hacked) and the tools to do so have been given to us- and they’re pretty well documented!

Part of this exercise has been going back to my roots to understand some of the root technologies (like email, mailing lists, usenet, IRC, PGP, etc.) can be remembered, reused, and repurposed to build a better online world.

I’ve also been watching a lot of Mr. Robot lately and it frankly just feels cool to make computers do what you want by typing the right magic words.

## Passwords & 2FA

1password is the core of my set up. It allows me to have secure and complicated passwords for all of my accounts / logins / keys / etc. My golden rule lately is that if I can remember my password, it isn’t strong enough.

The iPhone with Face ID makes opening 1password on-the-go incredibly fast. On the desktop, I open 1password with Alfred, search for the login, and use the “CMD-shift-C” hotkey to copy the password which can be done exclusively from the keyboard relatively quickly.

I use two-factor authentication on every service that offers it. Wherever possible, I [avoid 2FA that uses my phone number](https://authy.com/blog/understanding-2fa-the-authy-app-and-sms/). I really like Authy. The app is designed intelligently and importantly they have planned for the occasion when I upgrade my phone. I recently had to go through the process of removing 2FA from all of my services when I upgraded my iPhone because I was using Google Authenticator which does not support backups. I’m not doing that again.

## Using the command line

I’ve spent a long time halfway comfortable with the command line. Essentially swimming in shallow water with a `cd` here and and `ls` there. I wanted to take some concentrated time to become more familiar with the command line. The eventual goal would be to be able to sign onto any \*nix command line and be able to navigate and get stuff done.

For now, I’m just focusing on using the command line more in my everyday life. I am finding there are certain tasks I prefer to tackle in different ways, but part of the process is exposing myself to all the different potential tools I could use.

### iTerm hotkey window

At any time I can [easily conjure a terminal](https://www.typefloundry.com/1-800-iterm-bling.html) by pressing “cmd-shift-I” which makes it easier to jump in and out of the CLI with basically no friction.

### tmux

I’m also running [tmux](https://hackernoon.com/a-gentle-introduction-to-tmux-8d784c404340) so creating a new window is a quick “ctrl-a c” and I’m off and running. I’ve also been using “ctrl-a w” which is basically a tmux version of alt-tab and lets me go between my different windows with the arrow keys.

### vim

I only just started using vim, and it required setting it up _just_ right for [my personal setup](https://github.com/ejfox/dotfiles/blob/master/.vimrc “My vim configuration file is hosted on GitHub with the rest of my dotfiles”). I’ve been collecting helpful commands or tools with the [vim tag on pinboard](https://pinboard.in/u:ejfox/t:vim)

- [nerdtree](https://github.com/scrooloose/nerdtree) for a file explorer
- [fzf](https://github.com/junegunn/fzf#respecting-gitignore-hgignore-and-svnignore) which I’ve remapped to ctrl-p (like Atom) so I can quickly search files in my directory to open
- [lightline](https://github.com/itchyny/lightline.vim) is a statusline for vim that makes it easy to see what mode I’m in

### cli tools

- [lazygit](https://github.com/jesseduffield/lazygit) is an amazing tool for doing most git-related tasks easily and sanely without memorizing tons of commands - I use it all the time in combination with vim
- [mackup](https://github.com/lra/mackup) has been instrumental for me. It allows you to back up your application settings and dotfiles through Dropbox. It lets a lot of my hotkey and app settings stay the same between my personal and work machine without having to set everything up all the time. It also makes it really easy to spin up on new machines/VMs.
- [jsonfui](https://github.com/AdrianSchneider/jsonfui) is a great CLI interface for JSON data, and a way more performant way of exploring large datasets than loading them into a Atom or a browser and waiting for the prettification. It's also nice to be able to pipe outputs of node scripts to a quick UI.
- [things.sh](https://github.com/alexanderwillner/things.sh/) lets me check my [Things](https://culturedcode.com/) to-do list from the command line. [^I have two aliases: `alias todo="things.sh"` and `alias today="todo today | awk 'BEGIN{FS=OFS=\"|\"}{\$1=\$3=\"\";gsub(/[|]+/,\"|\")}1' | tr -d '|'"` to quickly show today’s tasks with `today`.]
- [fd](https://github.com/sharkdp/fd) as a fast alternative to the native `find` command
- [catimg](https://github.com/posva/catimg) allows you to preview images in the terminal which is pretty rad and marginally useful
- [mutt](https://medium.com/@stessyco/gmail-from-the-command-line-with-mutt-mac-os-x-92d047bcd74f) lets me send and receive email from the command line which is rad and a nice no-frills interface that makes one feel like a Real Hacker
- [newsboat](https://github.com/newsboat/newsboat) is like mutt for RSS feeds
- [recon-ng](https://bitbucket.org/LaNMaSteR53/recon-ng) is a tool used for OSINT research, using a variety of Python scripts and APIs to look up publicly available information for research purposes

## Communicating

I really love [Keybase](https://keybase.io/)! They make getting started with cryptography really fun. I’ve understood the concepts and methodology of PGP before, and even generated a key and promptly never used it. But Keybase bridged the gap for me.

I now have a [keybase profile](https://keybase.io/ejfox) that lists a handful of verified identities and addresses that are provably me. I am also now hosting my public PGP key at <https://ejfox.com/pgp.txt> so that people who want to send me encrypted messages can do so. It is easy to import with `curl https://ejfox.com/pgp.txt | gpg --import`

It’s also nice that, even as much as I trust keybase, the PGP key is [hosted on an HTTPS website that I exclusively control](https://jacob.hoffman-andrews.com/README/the-safe-way-to-put-a-pgp-key-in-your-twitter-bio/).

My key is also hosted in multiple places, so you can confirm my public key [on GitHub](https://github.com/ejfox.gpg)^[Which I use to [sign my commits](https://medium.com/@rwbutler/signing-commits-using-gpg-on-macos-7210362d15)] is the same as the one [I host](https://ejfox.com/pgp.txt) which is the same as the one [on Keybase](https://keybase.io/ejfox/pgp_keys.asc) which is the same as the one [on Wikipedia](https://en.wikipedia.org/wiki/User:Ejfox/Key).

A semi-automated way to do this comparison is by appending all 3 keys to a txt file and comparing them ^[Or you can just run [this gist](https://gist.github.com/ejfox/d64a7da835ef51ef67c376fdf6d0b542) as a one-liner: `sh -c "$(curl -fsSL https://gist.githubusercontent.com/ejfox/d64a7da835ef51ef67c376fdf6d0b542/raw/0c5724ab43ea5af6a25d3544e43fcfe75bce8d41/verify-pgp.sh)"`].

```bash
curl https://github.com/ejfox.gpg | gpg --with-colons --import-options import-show --dry-run --import >> fp.txt
curl https://ejfox.com/pgp.txt | gpg --with-colons --import-options import-show --dry-run --import >> fp.txt
curl https://keybase.io/ejfox/pgp_keys.asc | gpg --with-colons --import-options import-show --dry-run --import >> fp.txt
grep 89CD fp.txt
```

Which should return the same matching fingerprint from all 3 files. ^[If any of my publicly-posted keys (or fingerprints) do not match please [contact me immediately](mailto:ejfox@ejfox.com) because something weird is afoot.]

```md
fpr:::::::::5D30A33E08E35B8915B4C7E2E2078E653FE389CD:
fpr:::::::::5D30A33E08E35B8915B4C7E2E2078E653FE389CD:
fpr:::::::::5D30A33E08E35B8915B4C7E2E2078E653FE389CD:
```

My [website is backed up](https://ejfox.keybase.pub/) on the [Keybase filesystem](https://keybase.io/docs/kbfs) as part of my [site’s deploy process](https://github.com/ejfox/website/blob/master/package.json#L14).

I’ve got the [GPG Suite](https://gpgtools.org/) for OS X which makes it so you can store your PGP key passphrase in the keychain. This makes it easier to do a handful of things, including [signing git commits](https://help.github.com/en/articles/signing-commits) with my key without having to enter my passphrase every time.

I’m also using [FlowCrypt](https://flowcrypt.com/) which makes it easy to encrypt and decrypt emails in gmail through a Chrome extension. Like Keybase, it makes something that has been really complicated before really easy and accessible and low-friction.

I wish people still used IRC, but it really doesn’t seem like they do (invite me to your server). I think the future looks a lot less like Slack or Discord and a lot more like an anonymous decentralized encrypted IRC. As far as I can tell, that’s this thing called [matrix](http://matrix.org/).

Matrix even supports [bridging with IRC channels](https://matrix.org/blog/2015/04/22/matrix-irc-application-service/) and I like that kind of backwards compatibility. On the downside, however, it looks like literally no one uses these yet. I’ve been playing around with [riot.im](https://about.riot.im/) as my web/ios matrix client and don’t have many complaints, but I don’t use it that much.

## Surfing the web

I recently got rid of the internet connection at my apartment. It doesn’t mean I don’t use the internet, but I no longer have the ability to sit around and watch Netflix or play video games online all day. It’s been an experiment that’s been going well- what started as two weeks has stretched to over 2 months.

I’ve been looking into getting rid of my cable connection while I wait for real consumer-facing 5G. In the meantime I’ve been looking into a group called [NYC Mesh](https://www.nycmesh.net/faq#free) who are building a low-cost mesh wifi network across New York City. This ties into a lot of ideas I have about democratizing access to the internet and more general mutual aid.

I’ve been tethering to my iPhone a lot too, which has meant slightly adjusting my internet habits and figuring out ways to reduce my data usage and still get work done and enjoy myself. This adds to my sense of freedom- anywhere I have cell phone service I can do essentially anything.

I’ve been really interested in the work being done with the [Brave Browser](https://brave.com/) especially the [Basic Attention Token](https://basicattentiontoken.org/) which among other things, allows people who browse the web to give money to content publishers through automated microtransactions (which I think is probably the future of healthy content consumption on the internet).

#### VPN

I really like [NordVPN](https://nordvpn.com/) last time I’d checked they had relatively good reviews from folks I trusted, they are pretty affordable, they take cryptocurrency, and their desktop and iOS apps are actually really nice. I usually have a VPN running on my desktop and phone in addition to the [1.1.1.1](https://itunes.apple.com/us/app/1-1-1-1-faster-internet/id1423538627?mt=8) app.

All of that is handy because do you know those [LinkNYC](https://www.link.nyc/find-a-link.html) things that are replacing phone booths across the city? They have incredibly fast and incredibly insecure (and high-target) wifi networks! But using a VPN makes me feel more comfortable.

## Cryptocurrency

I cannot see any downsides to making it easier for people to send me money.

```md
BTC=3DE42VUyUKSikQ9eUeFKv2EkKVms7Pmd1G
BCH=qrwzlfjhhn8jdx92a8m8e2kuxcchmmvdgguqgy23a7
ETH=0x63958715F8e9Fd6CF0652394a89bb2AdD0a11686
LTC=MDvtqRMS6QiiXpYgxtgZKHPrYnLovjdcsZ
XLM=ejfox\*keybase.io
```

If I was teaching a stranger or a relative about bitcoin, I would probably show them [Yenom](https://yenom.tech/) which makes it ridiculously easy to send/receive BCH. I sort of recommend Coinbase, but they’ve done [things that make me nervous](https://twitter.com/mrejfox/status/928332448068403201) in the past and are incredibly bad at responding to support requests for a company that holds people’s money. I still use the Coinbase iOS app but I do it semi-warily.

## Publishing

I publish most of my prototypes and websites through [Netlify](https://netlify.com) using the [Netlify CLI tools](https://www.netlify.com/docs/cli/), which I’ve [written about previously](https://ejfox.com/blog/how-i-prototype-apps-and-dataviz-quickly-in-2019). It makes it easy to run [one command to rebuild and redeploy my sites](https://github.com/ejfox/website/blob/master/package.json) and even create little preview sites.

I’m also really excited about using [Glitch](https://glitch.me/) to create smaller apps and explanations, especially those that I might want to others to modify or fork since Glitch makes that so easy. Glitch also makes it really easy to embed little apps in my blog posts. I’m excited about the future of Glitch and want to help their methodology and ecosystem grow.

Anonymous GitHub PRs can be submitted [using gitmask](https://gitmask.com) or works published on [neocities](https://neocities.org/) or Pastebin through [Tor](https://www.torproject.org/) or NordVPN’s [Onion over VPN](https://nordvpn.com/features/onion-over-vpn/).

## Why is anonymity important?

A lot of good work and activism can be done anonymously but it takes work to set things up properly beforehand. It is worthwhile for anyone to have a process by which they can publish materials to the web anonymously in a way that is hard to scrub from the web even if they see no need to use them currently. Prepare for rain and hope for sun.

Some things need to be done anonymously... but how do you decide when?

- Will the work make you a target of harassment from dark corners of the internet?
- Will the work potentially annoy the rich and powerful who can afford to try to have you sued or silenced?
- Will the work potentially reveal truths that governments would rather not be publicized?
- Are you creating work that could have a large monetary value that could make you a target? (Think Bitcoin’s Satoshi)
- Could the work potentially be used by bad actors to commit crimes?

## These tools are for everyone

I wrote this up because I was surprised at how easy it was to get set up. These are at their core very complicated systems, but over the past few decades really smart people have made them easy and approachable. Practice going through the motions of getting things set up now, you never know when that knowledge might come in handy.
