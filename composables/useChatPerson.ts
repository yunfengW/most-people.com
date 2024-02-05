import api from '~/utils/api'
import { indexDB } from '~/utils/api/indexdb'
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
  const router = useRouter()
  const form = reactive({
    private_key: '',
    public_key: '',
    messages: [] as Message[],
    content: '',
    loading: false,
  })

  const sendMessage = async () => {
    const { content, public_key, private_key } = form
    if (!public_key) {
      mp.error('查无此人')
      return
    }
    const encode = mp.chatEncode(content, public_key, private_key)
    const res = await api({
      method: 'put',
      url: `/chat/${route.params.person_id}`,
      data: {
        content: encode,
      },
    })
    if (res.data.ok === true) {
      const message = res.data.message as Message
      form.messages.push(message)
      form.content = ''
    }
  }

  const submit = async () => {
    if (userStore.user === null) {
      mp.info('请先登录，登录后即可使用')
      router.push('/login')
      return
    }
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
        // 自己和自己聊天
        if (message.id !== userStore.user?.id) {
          form.messages.push(message)
        }
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
    if (res.data?.ok === true) {
      form.messages = res.data.messages as Message[]
      form.public_key = res.data.public_key
    }
  }
  const initPrivateKey = async () => {
    const userDB = await indexDB.getUserDB()
    if (userDB) {
      form.private_key = await mp.decrypt(userDB.mp_private_key)
    }
  }

  const init = () => {
    if (userStore.user) {
      initSSE()
      initMessages()
      initPrivateKey()
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
