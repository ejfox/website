import MarkdownIt from 'markdown-it'

export default ({ app }, inject) => {

  const md = new MarkdownIt()

  inject('md', md)
}
