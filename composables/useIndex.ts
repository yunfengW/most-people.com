// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'
import { useUserStore } from '~/stores/user'

export const useIndex = () => {
  const userStore = useUserStore()
  const router = useRouter()

  const form = reactive({
    placeholder: '没有调查，就没有发言权',
    remove: false,
  })

  const formatURL = (url: string) => {
    if (url.startsWith('/')) {
      return url
    }
    if (url.includes('「most-people」')) {
      const keyword = encodeURIComponent(userStore.message || form.placeholder)
      url = url.replace('「most-people」', keyword)
      return url.replace(/「[^」]*」/g, '')
    }
    const urlObject = new URL(url)
    const keyword = userStore.message || form.placeholder
    urlObject.searchParams.set('mp-keyword', keyword)
    return urlObject.href
  }
  const send = () => {
    const url = formatURL(userStore.tool.url)
    if (userStore.tool.url.includes('「mobile」')) {
      const width = 430
      const height = 844
      // 计算窗口的位置
      const screenWidth =
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      const screenHeight =
        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const left = screenWidth - width - screenWidth * 0.2
      const top = (screenHeight - height) / 2
      // 设置窗口的大小和位置
      const features = `width=${width},height=${height},left=${left},top=${top}`
      // 打开一个新的浏览器窗口
      const newWindow = window.open(url, '_blank', features)
      // 如果浏览器阻止了弹出窗口，则直接打开
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.open(url)
      }
    } else {
      window.open(url)
    }
  }
  const microphone = () => {
    ElMessage.info('语音输入 正在开发')
  }
  const bindTool = (key: string) => {
    const tool = tools[key as 'Bing']
    if (tool) {
      userStore.tool = tool
    }
  }

  const bindAdd = () => {
    router.push({
      path: '/tool',
      query: {
        type: 'add',
      },
    })
  }
  const bindRemove = (key: string) => {
    const i = userStore.tools.findIndex((e) => e === key)
    if (i >= 0) {
      userStore.tools.splice(i, 1)
    }
  }
  return {
    tools,
    userStore,
    form,
    microphone,
    send,
    bindTool,
    bindAdd,
    bindRemove,
    formatURL,
  }
}
