import api from '~/utils/api'

export interface Note {
  id: number
  title: string
  content: string
  updated_time: string
  user_id: number
  authors?: string[]
  passwords?: string[]
  note_password_hash?: string
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
        const res = await api({ method: 'post', url: '/db/Notes/user/' + userStore.user.id })
        this.notes = res.data as Note[]
        this.inited = true
      }
    },
    async initAuthorsNotes() {
      const res = await api({ method: 'post', url: '/note/authors' })
      if (res.data) {
        this.authorsNotes = res.data
      }
    },
  },
})
