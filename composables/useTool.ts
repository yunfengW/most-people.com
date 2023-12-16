export const useTool = () => {
  const showTopEdit = ref(false)
  const top_edit = ref<Top>()
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

  const topEdit = (top: Top) => {
    showTopEdit.value = true
    top_edit.value = top
  }

  // tool
  const showToolEdit = ref(false)
  const tool_id = ref(0)

  const toolEdit = (id: number) => {
    // showTopEdit.value = false
    showToolEdit.value = true
    tool_id.value = id
  }

  return {
    filter,
    toolStore,
    bindTool,
    // top
    showTopEdit,
    top_edit,
    topAdd,
    topEdit,
    // tool
    showToolEdit,
    tool_id,
    toolEdit,
  }
}
