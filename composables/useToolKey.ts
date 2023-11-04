import axios from 'axios'
import { marked } from 'marked'
import apiData from '~/utils/api/data'
// import DOMPurify from 'dompurify'

export const useToolKey = () => {
  const inited = ref(false)
  const markdownElement = ref<HTMLDivElement>()
  const route = useRoute()
  const toolKey = (route.params.toolKey || '') as string

  const toolStore = useToolStore()

  const toolName = computed(() => {
    const tool = toolStore.tools[toolKey]
    if (tool) {
      return tool.zh
    }
    return toolKey as string
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

    // const clean = DOMPurify.sanitize(html, { ADD_TAGS: ['mp-mi'] })
    return html
  }

  const markdown = ref('')
  const init = () => {
    initMarked()

    axios({
      url: `https://data.most-people.cn/tool/${toolKey}.md`,
    })
      .then((res) => {
        if (res.data) {
          markdown.value = res.data
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

  return {
    inited,
    toolName,
    markdownElement,
    markdown,
    render,
  }
}
