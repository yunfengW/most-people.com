import { defineStore } from 'pinia'
import { User } from '~/utils/api'

interface UserStore {
  firstPath: string
  user: User | null
  inited: boolean
}

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserStore => {
    const route = useRoute()
    return {
      firstPath: route.path,
      user: null,
      inited: false,
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
      this.user = user
    },
    async init() {
      const username = localStorage.getItem('username')
      if (username) {
        const userDB = await indexDB.getUser(username)
        if (userDB) {
          const user = await api.getUser(username)
          if (user) {
            const decrypt_username = await mp.decrypt(user.password_hash, userDB.key)
            if (username === decrypt_username) {
              this.update(user)
            }
          }
        }
      }
      this.inited = true
    },
  },
})
