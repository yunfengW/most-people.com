import tools from '~/assets/json/tools.json'

export interface Tool extends Note {
  logo: string
  url: string
  top?: number
  tags?: string[]
  // 一句话介绍
  intro?: string
  // logo 上传
  logoFile?: File
  logoDel?: string
}
export interface Tools {
  [key: string]: Tool
}
export interface ToolsTop {
  title: string
  list: number[]
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
      toolsTop: [],
      toolList: [],
      tab: 'top',
    }
  },
  getters: {},
  actions: {},
})
