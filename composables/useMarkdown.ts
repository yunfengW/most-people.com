import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

const marked = new Marked(
  markedHighlight({
    // 设置语言前缀
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

export const useMarkdown = (markdownElement: Ref<HTMLDivElement | undefined>) => {
  // editor options
  const options: any = {
    tabSize: 2,
    minimap: {
      enabled: false,
    },
    formatOnType: true,
    wordWrap: 'on',
    theme: 'vs-dark',
  }

  const form = reactive({
    title: '',
    titleOld: '',
    content: '',
    contentOld: '',
    inited: false,
  })

  const render = (md: string) => {
    const html = marked.parse(md)
    // mp-mi
    nextTick(async () => {
      if (!markdownElement.value) return
      const miList = markdownElement.value.querySelectorAll('mp-mi') as unknown as HTMLDivElement[]
      for (const mi of miList) {
        const encrypted = mi.querySelector('span')?.innerText || mi.innerText
        mi.innerHTML = `<span>${encrypted}</span><input placeholder="输入密码" /><a>解密</a>`
      }
    })
    return html
  }

  const initMarked = () => {
    marked.use({
      breaks: true,
    })

    const renderer = new marked.Renderer()
    renderer.link = function (href, title, text) {
      const div = document.createElement('div')
      const a = document.createElement('a')
      a.href = href
      a.target = '_blank'
      if (title) {
        a.title = title
      }
      a.textContent = text
      div.appendChild(a)
      return div.innerHTML
    }
    marked.setOptions({
      renderer: renderer,
    })
  }

  const toc = computed(() => {
    const { title, content } = form
    if (!title) {
      return ''
    }
    let text = content
    // 补全代码块
    let codeBlock = text.match(/\n```/g)
    if (codeBlock && codeBlock.length % 2 === 1) {
      text += '\n```'
    }
    // 移除代码块
    text.replace(/```[\s\S]+?```/g, '')

    let arr: string[] = [`# ${title}`]
    arr = arr.concat(text.split('\n'))
    // # 号开头
    arr = arr.filter((e) => /^#+? /.test(e))
    arr = arr.map((e, i) => {
      // #
      e = e.slice(1).replace(/#/g, '>')
      // > -
      e = e.replace(/ /, ' - ')
      // 锚点
      e = e.replace(/ - (.+?)$/g, ` - <a href="#${i}">$1</a>`)
      return e
    })
    const md = arr.join('\n')
    return md
  })

  if (process.client) {
    initMarked()
  }

  return {
    render,
    options,
    markdownElement,
    form,
    toc,
  }
}
