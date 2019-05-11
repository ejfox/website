# ejfox
## Personal website & blog for EJ Fox
### <https://ejfox.com>
[![Netlify Status](https://api.netlify.com/api/v1/badges/ff495492-f06f-44e1-8986-fe4b47981237/deploy-status)](https://app.netlify.com/sites/ejfoxcom/deploys)

Currently powered by:
+ Netlify for web hosting
+ Cloudinary for image hosting
+ Vue/Nuxt for the site
+ Tachyons for layout and styling
+ Markdown for text formatting

## Backups
<http://ejfox.keybase.pub>

## To do
+ Add status tags for posts ("notes", "draft", "in progress", "finished" )
+ Add way for people to submit anonymous feedback / tips
+ Add mechanism for automatically archiving linked URLs [a la Gwern](https://www.gwern.net/Archiving-URLs)

### Books
+ Go to [this page](https://www.goodreads.com/review/import) and click "Export Library"
+ Wait for library in email
+ Copy the goodreads CSV to the data folder
+ Run `> npx csvtojson static/data/goodreads_library_export.csv > static/data/goodreads_library_export.json` to convert the CSV into json

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate

# generate static project and publish to keybase
$ npm run keybase

# generate static project and publish everywhere
$ npm run publish

# convert goodreads csv into json
$ npx csvtojson static/data/goodreads_library_export.csv > static/data/goodreads_library_export.json
```
