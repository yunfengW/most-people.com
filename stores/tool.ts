import tools from '~/assets/json/tools.json'

export interface Tool extends Note {
  logo: string
  url: string
  top: number
  tags?: string[]
  tops?: number[]
  // 一句话介绍
  intro: string
}
export interface Tools {
  [key: string]: Tool
}
export interface Top {
  name: string
  tools: number[]
}

interface ToolStore {
  tools: Tools
  toolTops: Top[]
  tab: 'top' | 'all'
}

export const useToolStore = defineStore({
  id: 'toolStore',
  state: (): ToolStore => {
    return {
      tools,
      toolTops: [],
      tab: 'top',
    }
  },
  getters: {},
  actions: {
    // 建立索引
    initTops() {
      const tops: Top[] = []
      // 未分类的工具
      const unclassified: number[] = []
      for (const id in this.tools) {
        const tool = this.tools[id]
        const tags = tool.tags || []
        if (tags.length > 0) {
          for (const tag of tags) {
            const i = tops.findIndex((top) => top.name === tag)
            if (i === -1) {
              tops.push({
                name: tag,
                tools: [tool.id],
              })
            } else {
              tops[i].tools.push(tool.id)
            }
          }
        } else {
          unclassified.push(tool.id)
        }
      }
      if (unclassified.length > 0) {
        tops.push({
          name: '未分类',
          tools: unclassified,
        })
      }
      this.toolTops = tops
    },
  },
})
