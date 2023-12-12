import api from '~/utils/api'

export const useTool = () => {
  const showTopAdd = ref(false)
  const showTopEdit = ref(false)
  const topIndex = ref(-1)
  const filter = ref('')

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
    mp.info('维护中...')
    // showTopEdit.value = true
    // topIndex.value = index
  }

  const topAdd = () => {
    mp.info('维护中...')
    // showTopAdd.value = true
  }

  // tool
  const showToolEdit = ref(false)
  const tool_id = ref(0)

  const toolEdit = (id: number) => {
    showToolEdit.value = true
    tool_id.value = id
  }

  return {
    filter,
    toolStore,
    bindTool,
    // top
    showTopAdd,
    showTopEdit,
    topIndex,
    topAdd,
    topEdit,
    // tool
    showToolEdit,
    tool_id,
    toolEdit,
  }
}
