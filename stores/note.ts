export interface Note {
  id: number
  title: string
  content: string
  updated_time: string
  user_id: number
}

interface NoteStore {
  notes: Note[]
}

export const useNoteStore = defineStore({
  id: 'noteStore',
  state: (): NoteStore => {
    return {
      notes: [],
    }
  },
  getters: {},
  actions: {},
})
