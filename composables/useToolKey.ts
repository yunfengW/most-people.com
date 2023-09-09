import axios from 'axios'
import { marked } from 'marked'
import tools from '~/assets/json/tools.json'
import DOMPurify from 'dompurify'

export const useToolKey = () => {
  const renderHTML = ref('')
  const inited = ref(false)
  const markdownElement = ref<HTMLDivElement>()
  const route = useRoute()
  const toolKey = route.params.toolKey

  const toolName = computed(() => {
    const tool = tools[toolKey as 'Bing']
    if (tool) {
      return tool.zh
    }
    return toolKey as string
  })

  const render = async (md: string) => {
    const html = marked.parse(md)
    renderHTML.value = html

    // const clean = DOMPurify.sanitize(html, { ADD_TAGS: ['mp-mi'] })
    // renderHTML.value = clean
    // // mp-mi
    nextTick(() => {
      if (!markdownElement.value) return
      const miList = markdownElement.value.querySelectorAll('mp-mi') as unknown as HTMLDivElement[]
      for (const mi of miList) {
        mi.addEventListener('click', async (event: any) => {
          const tagName = event?.target?.tagName
          if (tagName === 'A') {
            const input = event.target.previousSibling
            if (input.tagName === 'INPUT') {
              const password = input.value as string
              const text = mi.querySelector('span')?.innerText || ''
              const { key } = await mp.key('most-people', password)
              const decrypted = await mp.decrypt(text, key)
              if (decrypted) {
                mi.innerHTML = `<div>${decrypted.replaceAll('\n', '<br />')}</div>`
              } else {
                mp.error('密码错误')
              }
            }
          }
        })
        mi.innerHTML = `<span>${mi.innerText}</span><input placeholder="输入密码" /><a>解密</a>`
      }
    })
  }

  const markdown = ref('')
  const init = () => {
    initMarked()

    axios({
      url: `https://cdn.most-people.cn/tool/${toolKey}.md`,
    })
      .then((res) => {
        const md = res.data as string
        if (md) {
          markdown.value = md
          render(md)
        }
      })
      .catch((err) => {
        // mp.error(err.message)
      })
      .finally(() => {
        inited.value = true
      })
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

  if (process.client) {
    init()
  }

  const editorElement = ref<HTMLDivElement>()

  onMounted(async () => {
    // const { editor } = await import('monaco-editor')
    // const markdownEditor = editor.create(editorElement.value, {
    //   value: markdown.value,
    //   language: 'markdown',
    //   tabSize: 2,
    //   minimap: {
    //     enabled: false,
    //   },
    // })
    // console.log('markdownEditor', markdownEditor)
  })

  return {
    inited,
    renderHTML,
    toolName,
    editorElement,
    markdownElement,
  }
}
