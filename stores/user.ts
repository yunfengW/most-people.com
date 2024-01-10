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
  public_key: string
  tools?: number[]
  urls?: string
  memo?: string
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
  memo: string
  // 搜索
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
      tool_id: 38,
      tools: [5, 43, 185, 57, 39, 46, 84, 37],
      urls: [],
      message: '',
      sugIndex: -1,
      sugList: [],
      memo: '',
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
    getSugList(): Search[] {
      return this.sugList.slice(0, 10)
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
    initUser(user: User, token: string) {
      this.user = user
      window.sessionStorage.setItem('token', token)

      // 初始化笔记
      useNoteStore()
        .init()
        .then(() => this.initSearch())

      // 初始化书签
      if (user.urls) {
        mp.decrypt(user.urls).then((json) => {
          try {
            const urls = JSON.parse(json)
            if (Array.isArray(urls)) {
              this.urls = urls
            }
          } catch (error) {
            console.error(error)
          }
        })
      }
      // 初始化工具
      if (user.tools) {
        this.tools = user.tools
      }

      // 初始化便签
      if (user.memo) {
        mp.decrypt(user.memo).then((memo) => {
          if (memo) {
            this.memo = memo
          }
        })
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
            this.initSearch()
          }
        })

      const username = window.localStorage.getItem('username')
      if (username) {
        const userDB = await indexDB.getUser(username)
        if (userDB) {
          const res = await api({
            method: 'post',
            url: '/user/get.user',
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
        .filter((e) => mp.filter(e.title, v))
        .map((e) => {
          return {
            name: e.title,
            type: 'knowledge',
            data: `/knowledge/${e.id}`,
          }
        })
      this.sugList.push(...list)
    },
    initTool(v: string) {
      const toolStore = useToolStore()
      const list: Search[] = []
      for (const key in toolStore.tools) {
        const e = toolStore.tools[key]
        if (mp.filter(e.title, v)) {
          list.unshift({
            name: e.title,
            type: 'tool',
            data: e.id,
          })
        } else {
          const tags = e.tags || []
          for (const tag of tags) {
            if (mp.filter(tag, v)) {
              list.unshift({
                name: e.title,
                type: 'tool',
                data: e.id,
              })
            }
          }
        }
      }
      this.sugList.push(...list)
    },
    initUrl(v: string) {
      const list: Search[] = this.urls
        .filter((e) => mp.filter(e.name, v))
        .map((e) => {
          return {
            name: e.name,
            type: 'url',
            data: e.url,
          }
        })
      this.sugList.push(...list)
    },
    initNote(v: string) {
      const noteStore = useNoteStore()
      const list: Search[] = noteStore.notes
        .concat(noteStore.authorsNotes)
        .filter((e) => mp.filter(e.title, v))
        .map((e) => {
          return {
            name: e.title,
            type: 'note',
            data: `/note/${e.id}`,
          }
        })
      this.sugList.push(...list)
    },
    initSearch() {
      const v = this.message

      this.sugList = []
      this.sugIndex = -1

      if (!v) {
        return
      }

      this.initNote(v)
      this.initUrl(v)
      this.initKnowledge(v)
      this.initTool(v)
      // initSogou(v)
    },
  },
})
