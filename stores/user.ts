import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'

import in_a_word from '~/assets/json/in-a-word.json'

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
  sign_time: string
  address: string
  public_key: string
  tools?: number[]
  urls?: string
  memo?: string
}

export type SugType = 'sogou' | 'tool' | 'url' | 'note' | 'knowledge'

export interface Sug {
  type: SugType
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
  sugList: Sug[]
  sugIndex: number
  // 摘录句子
  placeholder: string
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
      tools: [5, 43, 185, 39, 46, 84, 37, 290, 57],
      urls: [],
      message: '',
      sugIndex: -1,
      sugList: [],
      memo: '',
      placeholder: '没有调查，就没有发言权',
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
    sugs(): Sug[] {
      return this.sugList.slice(0, 10)
    },
    UID() {
      const n = this.user?.id || 0
      let result = 'UID '
      const s = n.toString().padStart(9, '0')
      for (let i = 0; i < s.length; i++) {
        if (i > 0 && i % 3 === 0) {
          result += ' '
        }
        result += s.charAt(i)
      }
      return result
    },
  },
  actions: {
    initPlaceholder() {
      const i = Math.floor(Math.random() * in_a_word.length)
      this.placeholder = in_a_word[i]
    },
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
          if (res.data?.address) {
            const user = res.data as User
            const address = mp.getAddress('Bearer ' + userDB.token)
            if (user.address === address) {
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
      const list: Sug[] = knowledgeStore.list
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
      const list: Sug[] = []
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
      const list: Sug[] = this.urls
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
      const list: Sug[] = noteStore.notes
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

      const url = new URL(window.location.href)
      if (v) {
        url.searchParams.set('s', v)
      } else {
        url.searchParams.delete('s')
      }
      window.history.replaceState({}, '', url.toString())

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
