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
  actions: {},
})
