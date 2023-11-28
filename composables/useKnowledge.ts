import api from '~/utils/api'

export interface Knowledge {
  id: number
  Question: string
  Answer: string
  updated_time: string
  user_id: number
}
export const useKnowledge = () => {
  const knowledgeList = ref<Knowledge[]>([])

  const init = async () => {
    const res = await api({ method: 'post', url: '/db/Knowledge' })
    knowledgeList.value = res.data
  }
  if (process.client) {
    init()
  }

  return {
    knowledgeList,
  }
}
