import api from '~/utils/api'

export interface Note {
  id: number
  title: string
  content: string
  updated_time: string
  user_id: number
}

interface NoteStore {
  notes: Note[]
  inited: boolean
}

export const useNoteStore = defineStore({
  id: 'noteStore',
  state: (): NoteStore => {
    return {
      notes: [],
      inited: false,
    }
  },
  getters: {},
  actions: {
    async init() {
      const userStore = useUserStore()
      if (userStore.user && !this.inited) {
        const res = await api({ method: 'post', url: '/db/Notes/user/' + userStore.user.id })
        this.notes = res.data as Note[]
        this.inited = true
      }
    },
  },
})
