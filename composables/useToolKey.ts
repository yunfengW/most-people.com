import { marked } from 'marked'
import api from '~/utils/api'
// import DOMPurify from 'dompurify'

export const useToolKey = () => {
  const inited = ref(false)
  const markdownElement = ref<HTMLDivElement>()
  const route = useRoute()
  const router = useRouter()
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
  const markdownOld = ref('')
  const init = () => {
    initMarked()

    console.log('🌊', toolStore.tools)
    // api({
    //   method: 'post',
    //   url:'/db/'
    // })
    // apiData(`https://data.most-people.cn/tool/${toolKey}.md?t=${Date.now()}`)
    //   .then((res) => {
    //     const text = String(res.data)
    //     if (text) {
    //       markdown.value = text
    //       markdownOld.value = text
    //     }
    //   })
    //   .catch((err) => {
    //     // mp.error(err.message)
    //   })
    //   .finally(() => {
    //     inited.value = true
    //   })
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

  const publish = async () => {
    const res = await api({
      method: 'put',
      url: '/data/tool.guide.update',
      data: {
        id: toolKey,
        markdown: markdown.value,
      },
    })
    if (res.data?.statusCode === 1004) {
      router.push('/login')
      return
    }
    if (res.data === true) {
      mp.success('发布成功！')
    }
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
    init()
  }

  return {
    inited,
    toolName,
    markdownElement,
    markdown,
    markdownOld,
    render,
    publishGuide,
  }
}
