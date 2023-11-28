import api from '~/utils/api'

export interface Note {
  id: number
  title: string
  content: string
  updated_time: string
  user_id: number
}
export const useUserNote = () => {
  const route = useRoute()
  const user_id = (route.params.user_id || '') as string

  const notes = ref<Note[]>([])

  const init = async () => {
    const res = await api({ method: 'post', url: 'db/Notes/user/' + user_id })
    notes.value = res.data
  }
  if (process.client) {
    init()
  }

  return {
    notes,
  }
}
