import api from '~/utils/api'

export const useTool = () => {
  const showTopAdd = ref(false)
  const showTopEdit = ref(false)
  const topIndex = ref(-1)

  const userStore = useUserStore()
  const toolStore = useToolStore()
  const router = useRouter()
  const route = useRoute()

  const bindTool = (key: string) => {
    const tool = toolStore.tools[key]
    if (tool) {
      // 添加
      if (route.query.type === 'add') {
        addTool(tool)
        return
      }

      userStore.updateTool(tool.id)
      router.replace('/')
    }
  }

  const addTool = (tool: Tool) => {
    if (userStore.user === null) {
      mp.info('请先登录，登录后即可添加')
    } else {
      if (userStore.tools.includes(tool.id) === false) {
        userStore.tools.push(tool.id)
        userStore.updateTools()
      }
    }
    userStore.updateTool(tool.id)
    router.replace('/')
  }

  const topEdit = (index: number) => {
    showTopEdit.value = true
    topIndex.value = index
  }

  // tool
  const showToolEdit = ref(false)
  const toolKey = ref('')

  const toolEdit = (id: string) => {
    showToolEdit.value = true
    toolKey.value = id
  }

  const publishTools = async () => {
    // 处理需要上传的图片
    for (const key in toolStore.tools) {
      const tool = toolStore.tools[key]
      if (tool.logo.startsWith('blob:')) {
        const file = tool.logoFile
        if (file) {
          // 创建FormData对象
          const formData = new FormData()
          // 'file'是要上传的文件字段名，file是要上传的文件对象
          formData.append('file', file)
          formData.append('id', tool.id)
          formData.append('logoDel', tool.logoDel || '')
          const res = await api({
            method: 'put',
            url: '/data/tool.logo.update',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          if (res.data?.statusCode === 1004) {
            router.push('/login')
            return
          }
          if (res.data) {
            tool.logo = res.data
            delete tool.logoFile
            delete tool.logoDel
          }
        }
      }
    }
    // 保存
    const tools = JSON.parse(JSON.stringify(toolStore.tools))
    const res = await api({
      method: 'put',
      url: '/data/tools.update',
      data: {
        tools,
      },
    })
    console.log('🌊', res)
  }

  return {
    toolStore,
    bindTool,
    // top
    showTopAdd,
    showTopEdit,
    topIndex,
    topEdit,
    // tool
    showToolEdit,
    toolKey,
    toolEdit,
    // 发布
    publishTools,
  }
}
