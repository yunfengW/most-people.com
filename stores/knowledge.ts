import api from "~/utils/api"

export interface Knowledge {
  id: number
  Question: string
  Answer: string
  updated_time: string
  user_id: number
}

interface KnowledgeStore {
  list: Knowledge[]
  inited: boolean
}

export const useKnowledgeStore = defineStore({
  id: 'knowledgeStore',
  state: (): KnowledgeStore => {
    return {
      list: [],
      inited: false,
    }
  },
  getters: {},
  actions: {
    async init() {
      if (!this.inited) {
        const res = await api({ method: 'post', url: '/db/Knowledge' })
        this.list = res.data
        this.inited = true
      }
    },
  },
})
