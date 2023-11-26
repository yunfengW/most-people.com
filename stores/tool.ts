import tools from '~/assets/json/tools.json'
import toolsTop from '~/assets/json/toolsTop.json'

export interface Tool {
  id: string
  zh: string
  logo: string
  url: string
  // 一句话介绍
  intro?: string
  // 使用指南
  how_to_use?: string
  // logo 上传
  logoFile?: File
  logoDel?: string
}
export interface Tools {
  [key: string]: Tool
}
export interface ToolsTop {
  zh: string
  list: string[]
}

interface ToolStore {
  tools: Tools
  toolList: Tool[]
  toolsTop: ToolsTop[]
  tab: 'top' | 'all'
}

export const useToolStore = defineStore({
  id: 'toolStore',
  state: (): ToolStore => {
    return {
      tools,
      toolsTop,
      toolList: [],
      tab: 'top',
    }
  },
  getters: {},
  actions: {},
})
