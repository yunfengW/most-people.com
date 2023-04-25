import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    const route = useRoute()
    return {
      firstPath: route.path,
    }
  },
})
