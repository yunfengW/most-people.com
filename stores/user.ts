export const useUserStore = defineStore({
  id: 'userStore',
  state: () => {
    return {
      firstPath: route.path,
    }
  },
  getters: {},
  actions: {},
})
