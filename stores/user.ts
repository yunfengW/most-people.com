import { defineStore } from 'pinia'
import { User } from '~/utils/api'
import tools from '~/assets/json/tools.json'

export interface Tool {
  id: string
  zh: string
  logo: string
  url: string
}
interface UserStore {
  firstPath: string
  user: User | null
  inited: boolean
  toolKey: string
  tools: string[]
  message: string
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
      toolKey: 'Bing',
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
    }
  },
  getters: {
    tool(): Tool {
      const key = this.toolKey as 'Bing'
      if (tools[key]) {
        return tools[key]
      } else {
        return tools['Bing']
      }
    },
    getUID() {
      const n = this.user?.id || 1
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
      api.updateUser({ tools })
    },
    updateTool(key: string) {
      this.toolKey = key
    },
    async init() {
      const username = window.localStorage.getItem('username')
      if (username) {
        const userDB = await indexDB.getUser(username)
        if (userDB) {
          const user = await api.getUser(username)
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
  },
})
