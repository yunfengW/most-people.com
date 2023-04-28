import { defineStore } from 'pinia'
import { User } from '~/utils/api'

interface UserStore {
  firstPath: string
  user: User | null
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserStore => {
    const route = useRoute()
    return {
      firstPath: route.path,
      user: null,
    }
  },
  getters: {
    getUID() {
      const n = this.user?.id || 1
      let result = ''
      const s = n.toString().padStart(9, '0')
      for (let i = 0; i < s.length; i++) {
        if (i > 0 && i % 3 === 0) {
          result += ' '
        }
        result += s.charAt(i)
      }
      return 'UID ' + result
    },
  },
  actions: {
    update(user: User) {
      console.log('🌊', user)
    },
  },
})
