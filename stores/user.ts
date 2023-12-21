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
  urls?: string
}

export type SearchType = 'sogou' | 'tool' | 'url' | 'note' | 'knowledge'

export interface Search {
  type: SearchType
  name: string
  data?: string | number
}

interface UserStore {
  firstPath: string
  user: User | null
  inited: boolean
  tool_id: number
  tools: number[]
  urls: Url[]
  message: string
  // 搜索
  searchList: Search[]
  sugList: Search[]
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
      tools: [5, 43, 185, 57, 39, 46, 84, 37],
      urls: [],
      message: '',
      sugList: [],
      sugIndex: -1,
      searchList: [],
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
    getSearchList(): Search[] {
      return [...this.searchList, ...this.sugList].slice(0, 10)
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
    async initUser(user: User, token: string) {
      this.user = user
      window.sessionStorage.setItem('token', token)

      useNoteStore()
        .init()
        .then(() => this.inputSearch())

      if (user.urls) {
        try {
          const json = await mp.decrypt(user.urls)
          const urls = JSON.parse(json)
          if (Array.isArray(urls)) {
            this.urls = urls
          }
        } catch (error) {}
      }

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
      const s = useRoute().query.s as string
      if (s) {
        this.message = s
      }
      useKnowledgeStore()
        .init()
        .then(() => {
          if (s) {
            this.inputSearch()
          }
        })

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
              this.initUser(user, userDB.token)
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
    // 搜索
    initKnowledge(v: string) {
      const knowledgeStore = useKnowledgeStore()
      const list: Search[] = knowledgeStore.list
        .filter((e) => e.title.toLowerCase().includes(v.toLowerCase()))
        .map((e) => {
          return {
            name: e.title,
            type: 'knowledge',
            data: `/knowledge/${e.id}`,
          }
        })
      this.searchList.push(...list)
    },
    initTool(v: string) {
      const toolStore = useToolStore()
      const list: Search[] = []
      for (const key in toolStore.tools) {
        const e = toolStore.tools[key]
        if (e.title.toLowerCase().includes(v.toLowerCase())) {
          list.unshift({
            name: e.title,
            type: 'tool',
            data: e.id,
          })
        } else {
          for (const tag of e.tags) {
            if (tag.toLowerCase().includes(v.toLowerCase())) {
              list.unshift({
                name: e.title,
                type: 'tool',
                data: e.id,
              })
            }
          }
        }
      }
      this.searchList.push(...list)
    },
    initUrl(v: string) {
      const list: Search[] = this.urls
        .filter((e) => e.name.toLowerCase().includes(v.toLowerCase()))
        .map((e) => {
          return {
            name: e.name,
            type: 'url',
            data: e.url,
          }
        })
      this.searchList.push(...list)
    },
    initNote(v: string) {
      const noteStore = useNoteStore()
      const list: Search[] = noteStore.notes
        .filter((e) => e.title.toLowerCase().includes(v.toLowerCase()))
        .map((e) => {
          return {
            name: e.title,
            type: 'note',
            data: `/note/${e.id}`,
          }
        })
      this.searchList.push(...list)
    },
    inputSearch() {
      const v = this.message

      this.sugList = []
      this.searchList = []
      this.sugIndex = -1

      if (!v) {
        return
      }

      this.initNote(v)
      this.initUrl(v)
      this.initTool(v)
      this.initKnowledge(v)
      // initSogou(v)
    },
  },
})
