import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import api from '~/utils/api'
import { indexDB } from '~/utils/api/indexdb'

export interface Url {
  name: string
  url: string
  icon?: string
}
export interface User {
  id: number
  name: string
  password_hash: string
  sign_time: string
  address: string
  tools?: number[]
  urls?: Url[]
}

interface UserStore {
  firstPath: string
  user: User | null
  inited: boolean
  tool_id: number
  tools: number[]
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
      tool_id: 11,
      tools: [5, 40, 37, 46, 35, 53, 43, 57, 60, 58, 29, 62, 11],
      message: '',
      sugList: [],
      sugIndex: -1,
    }
  },
  getters: {
    tool(): Tool {
      const toolStore = useToolStore()
      const id = this.tool_id
      if (toolStore.tools[id]) {
        return toolStore.tools[id]
      } else {
        return toolStore.tools[1]
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
      }).then((res) => {
        if (!res.data) {
          mp.error('保存出错，请联系管理员')
        }
      })
    },
    updateTool(id: number) {
      if (process.client) {
        window.sessionStorage.setItem('tool_id', String(id))
      }
      this.tool_id = id
    },
    async init() {
      const username = window.localStorage.getItem('username')
      if (username) {
        const userDB = await indexDB.getUser(username)
        if (userDB) {
          const res = await api({
            method: 'post',
            url: '/user/login',
            data: { name: username },
          })
          if (res.data?.password_hash) {
            const user = res.data as User
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
      ElLoading.service({ fullscreen: true })
      indexDB.delUser(this.user.name)
      // this.$reset()
      // this.init()
      location.reload()
    },
  },
})
