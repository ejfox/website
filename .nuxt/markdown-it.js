import MarkdownIt from 'markdown-it'

export default ({ app }, inject) => {

  const md = new MarkdownIt({"typographer":true,"html":true,"breaks":true})

  inject('md', md)
}
