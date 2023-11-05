import { defineStore } from 'pinia'
import api from '~/utils/api'
import { indexDB } from '~/utils/api/indexdb'

export interface User {
  id: number
  name: string
  password_hash: string
  sign_time: string
  address: string
  tools?: string[]
  // tool: string
}

interface UserStore {
  firstPath: string
  user: User | null
  inited: boolean
  toolKey: string
  tools: string[]
  message: string
  sugList: string[]
  sugIndex: number
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserStore => {
    const route = useRoute()
    return {
      firstPath: route.path,
      user: null,
      inited: false,
      // current tool
      toolKey: 'Sogou',
      tools: [
        'ChatGPT',
        'Bing',
        'Google',
        'Douyin',
        'Bilibili',
        'SogouTranslate',
        'Filehelper',
        'MathSolver',
      ],
      message: '',
      sugList: [],
      sugIndex: -1,
    }
  },
  getters: {
    tool(): Tool {
      const toolStore = useToolStore()
      const key = this.toolKey
      if (toolStore.tools[key]) {
        return toolStore.tools[key]
      } else {
        return toolStore.tools['Sogou']
      }
    },
    getUID() {
      const n = this.user?.id || 0
      let result = ''
      const s = n.toString().padStart(9, '0')
      for (let i = 0; i < s.length; i++) {
        if (i > 0 && i % 3 === 0) {
          result += ' '
        }
        result += s.charAt(i)
      }
      return 'UID ' + result
    },
  },
  actions: {
    update(user: User, token: string) {
      this.user = user
      window.sessionStorage.setItem('token', token)

      if (user.tools) {
        this.tools = user.tools
      }
    },
    updateTools() {
      const tools = JSON.parse(JSON.stringify(this.tools))
      api({
        method: 'post',
        url: '/user/update',
        data: { tools },
      }).then((ok) => {
        if (!ok) {
          mp.error('保存出错，请联系管理员')
        }
      })
    },
    updateTool(key: string) {
      if (process.client) {
        window.sessionStorage.setItem('toolKey', key)
      }
      this.toolKey = key
    },
    async init() {
      const username = window.localStorage.getItem('username')
      if (username) {
        const userDB = await indexDB.getUser(username)
        if (userDB) {
          const user: User | null = await api({
            url: '/user',
          })
          if (user) {
            const decrypt_username = await mp.decrypt(user.password_hash, userDB.key)
            if (username === decrypt_username) {
              this.update(user, userDB.token)
            }
          }
        } else {
          window.sessionStorage.removeItem('token')
          window.localStorage.removeItem('username')
        }
      }
      this.inited = true
    },
    exit() {
      if (!this.user) {
        return
      }
      indexDB.delUser(this.user.name)
      this.$reset()
      this.init()
    },
  },
})
