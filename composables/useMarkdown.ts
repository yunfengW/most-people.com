import { marked } from 'marked'
// import DOMPurify from 'dompurify'

export const useMarkdown = (publish: () => void) => {
  const inited = ref(false)
  const markdownElement = ref<HTMLDivElement>()

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

  const publishGuide = async () => {
    ElMessageBox.prompt('', '请输入【我要发布】', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputValidator: (v) => {
        if (v === '我要发布') {
          return true
        }
        return '请输入【我要发布】'
      },
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '发布中...'
          await publish()
          instance.confirmButtonLoading = false
          done()
        } else {
          done()
        }
      },
    })
      .then(() => {})
      .catch(() => {})
  }

  if (process.client) {
    initMarked()
  }

  return {
    inited,
    markdownElement,
    markdown,
    render,
    publishGuide,
  }
}
