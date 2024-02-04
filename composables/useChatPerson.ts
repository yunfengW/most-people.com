import api from '~/utils/api'

export interface Message {
  id: number
  name: string
  content: string
  contentType?: string
  timestamp: number
}

export interface Chat {
  id: number
  name: string
  messages: Message[]
}

export const useChatPerson = () => {
  const userStore = useUserStore()
  const route = useRoute()
  const form = reactive({
    messages: [] as Message[],
    content: '',
    loading: false,
  })

  const sendMessage = async () => {
    const res = await api({
      method: 'put',
      url: `/chat/${route.params.person_id}`,
      data: {
        content: form.content,
      },
    })
    if (res.data.ok === true) {
      form.messages.push(res.data.message)
      form.content = ''
    }
  }

  const submit = async () => {
    form.loading = true
    await sendMessage()
    form.loading = false
  }

  const initSSE = () => {
    // 创建一个新的EventSource实例，连接到你的SSE端点
    const url = new URL(api.getUri())
    url.pathname = '/chat/connect'
    url.searchParams.set('authorization', 'Bearer ' + window.sessionStorage.getItem('token') || '')
    const sse = new EventSource(url)

    // 监听消息
    sse.addEventListener('open', () => {
      const username = localStorage.getItem('username')
      console.log(`➜ ${username} Connect`)
    })
    sse.addEventListener('message', (event) => {
      // 解析收到的数据
      const json = event.data as string
      try {
        const message = JSON.parse(json) as Message
        form.messages.push(message)
      } catch (error) {
        console.error(error)
      }
    })
    sse.addEventListener('error', (error) => {
      console.error('EventSource failed:', error)
      // 解析收到的数据
      sse.close()
    })
  }

  const initMessages = async () => {
    const res = await api({
      method: 'post',
      url: `/chat/${route.params.person_id}`,
      data: {
        page: 1,
        pageSize: 100,
      },
    })
    const messages = res.data?.messages as Message[] | undefined
    if (messages) {
      form.messages = messages
    }
  }

  const init = () => {
    if (userStore.user) {
      initSSE()
      initMessages()
    }
  }

  return {
    init,
    form,
    route,
    submit,
    userStore,
  }
}
