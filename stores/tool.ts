import toolList from '~/assets/json/tools.json'

export interface Tool {
  id: number
  title: string
  logo: string
  url: string
  top?: number
  user_id?: number
  tags?: string[]
  updated_time?: string
  // 一句话介绍
  intro?: string
  // 使用指南
  content?: string
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

const tools: Tools = {}
for (const tool of toolList) {
  tools[tool.id] = tool
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
