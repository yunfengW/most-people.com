import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    const route = useRoute()
    return {
      firstPath: route.path,
      UID: 1,
    }
  },
  getters: {
    getUID() {
      let n = this.UID
      let result = ''
      let s = n.toString().padStart(9, '0')
      for (let i = 0; i < s.length; i++) {
        if (i > 0 && i % 3 === 0) {
          result += ' '
        }
        result += s.charAt(i)
      }
      return 'UID ' + result
    },
  },
})
