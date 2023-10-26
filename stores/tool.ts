import tools from '~/assets/json/tools.json'
import toolsTop from '~/assets/json/toolsTop.json'

export interface Tool {
  id: string
  zh: string
  logo: string
  url: string
}
export interface Tools {
  [key: string]: Tool
}
export interface ToolTop {
  zh: string
  list: string[]
}

interface ToolStore {
  tools: Tools
  toolsTop: ToolTop[]
  tab: 'top' | 'all'
}

export const useToolStore = defineStore({
  id: 'toolStore',
  state: (): ToolStore => {
    return {
      tools,
      toolsTop,
      tab: 'top',
    }
  },
  getters: {},
  actions: {},
})
