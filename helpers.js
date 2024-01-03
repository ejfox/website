import md5 from "js-md5";

export function scrapToUUID(scrap) {
  const hash = md5(scrap?.type + scrap?.href);
  return hash;
}

export function uuidToScrap(uuid, scrapArray) {
  // we need to find the scrap that matches the uuid
  if (!scrapArray) return console.error('No scrap array');
  if (!scrapArray.length) return console.error('Empty scrap array');
  if (!uuid) return console.error('No uuid');
  const scrap = scrapArray.find((scrap) => scrapToUUID(scrap) === uuid);
  if (!scrap) return console.error('No scrap found');
  return scrap;
}


function articleExists(article) {
  if(!article) return false
  if(!article.excerpt) return false
  if(!article.excerpt.children) return false
  if(!article.excerpt.children.length) return false
  return true
}


export function countWords(article) {
  if(!articleExists(article)) return 0
  if(!article.excerpt.children) return 0
  // console.log('Counting words in', article)
  const words = article.excerpt.children
    .filter(
      (node) =>
        node.tag === "p" ||
        node.tag === "h1" ||
        node.tag === "h2" ||
        node.tag === "h3" ||
        node.tag === "h4" ||
        node.tag === "blockquote" ||
        node.tag === "li" ||
        node.tag === "ol" ||
        node.tag === "ul"        
    )
    .map((node) => node.children)
    .flat()
    .filter((node) => node.type === "text")
    .map((node) => node.value)
    .join(" ")
    .split(" ")
    .filter((word) => word.length > 0);
  return words.length;
}

export function countPhotos(article) {
  const photos = article.body.children
    .filter((node) => node.tag === "img")
    .map((node) => node.attrs)
    .flat();

  return photos.length;
}

export function extractPhotos(article) {
  const photos = article.body.children
    .filter((node) => node.tag === "img")
    .flat();

  return photos;
}

export function extractFirstPhoto(article) {
  const photos = extractPhotos(article)
  if(photos.length) return photos[0]
  return null
}

export function countLinks(article) {
  if(!articleExists(article)) return 0
  // look inside all paragraphs and headings for links
  if(!article.excerpt.children) return 0
  const links = article.excerpt.children
    .filter(
      (node) =>
        node.tag === "p" ||
        node.tag === "h1" ||
        node.tag === "h2" ||
        node.tag === "h3" ||
        node.tag === "h4" ||
        node.tag === "blockquote"
    )
    .map((node) => node.children)
    .flat()
    .filter((node) => node.tag === "a")
    .map((node) => node.attrs)
    .flat();
  return links.length;
}

export function filterStrongTags(article) {
  if(!articleExists(article)) return []
  // look 3 levels deep in article.body.children for strong tags
  const strongTags = article.body.children
    .filter(
      (node) =>
        node.tag === "p" ||
        node.tag === "h1" ||
        node.tag === "h2" ||
        node.tag === "h3" ||
        node.tag === "h4" ||
        node.tag === "blockquote"
    )
    .map((node) => node.children)
    .flat()
    .filter((node) => node.tag === "strong")
    .map((node) => node.children)
    .flat()
    .filter((node) => node.type === "text")
    .map((node) => node.value)
    .filter((word) => word.length > 0);
  return strongTags;
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
