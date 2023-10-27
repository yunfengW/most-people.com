export const useToolTop = () => {
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

  const editTop = (index: number) => {
    showTopEdit.value = true
    topIndex.value = index
  }

  return {
    showTopAdd,
    showTopEdit,
    topIndex,
    bindTool,
    editTop,
    toolStore,
  }
}
