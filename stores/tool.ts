import tools from '~/assets/json/tools.json'

export interface Tool extends Note {
  logo: string
  url: string
  top: number
  tags: string[]
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
    initTops(list: Tool[]) {
      const tops: Top[] = [
        {
          name: '未分类',
          tools: [],
        },
      ]
      for (const tool of list) {
        if (tool.tags.length > 0) {
          for (const tag of tool.tags) {
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
          tops[0].tools.push(tool.id)
        }
      }
      this.toolTops = tops
    },
  },
})
