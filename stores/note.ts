import api from '~/utils/api'

export interface NoteAuthor {
  name: string
  password_hash: string
}
export interface Note {
  id: number
  title: string
  content: string
  updated_time: string
  user_id: number
  authors?: NoteAuthor[]
  address?: string
}

interface NoteStore {
  notes: Note[]
  authorsNotes: Note[]
  inited: boolean
}

export const useNoteStore = defineStore({
  id: 'noteStore',
  state: (): NoteStore => {
    return {
      notes: [],
      authorsNotes: [],
      inited: false,
    }
  },
  getters: {},
  actions: {
    async init() {
      this.initAuthorsNotes()
      const userStore = useUserStore()
      if (userStore.user && !this.inited) {
        const res = await api({ method: 'post', url: '/note/list' })
        if (res.ok) {
          this.notes = res.data as Note[]
          this.inited = true
        }
      }
    },
    async initAuthorsNotes() {
      const res = await api({ method: 'post', url: '/note/authors.list' })
      if (res.ok) {
        this.authorsNotes = res.data
      }
    },
  },
})
