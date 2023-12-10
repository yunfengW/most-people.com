import api from '~/utils/api'

export const useTool = () => {
  const showTopAdd = ref(false)
  const showTopEdit = ref(false)
  const topIndex = ref(-1)

  const userStore = useUserStore()
  const toolStore = useToolStore()
  const router = useRouter()
  const route = useRoute()

  const bindTool = (id: number) => {
    const tool = toolStore.tools[id]
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
  const tool_id = ref(0)

  const toolEdit = (id: number) => {
    showToolEdit.value = true
    tool_id.value = id
  }

  const publish = async () => {
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
          formData.append('id', String(tool.id))
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
            const url = new URL(res.data)
            url.searchParams.set('t', String(Date.now()))
            tool.logo = url.href
            delete tool.logoFile
            delete tool.logoDel
          }
        }
      }
    }
    // 保存
    const tools: Tools = JSON.parse(JSON.stringify(toolStore.tools))
    const toolsTop = JSON.parse(JSON.stringify(toolStore.toolsTop))

    const res = await api({
      method: 'put',
      url: '/tool/update.tools',
      data: {
        toolList: Object.values(tools),
        toolsTop,
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

  const publishTools = () => {
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
    tool_id,
    toolEdit,
    // 发布
    publishTools,
  }
}
