<template>
  <div id="page-top">
    <mp-header title="万能工具箱" />

    <el-tabs v-model="toolStore.tab">
      <el-tab-pane label="分类" name="top"></el-tab-pane>
      <el-tab-pane label="全部" name="all"></el-tab-pane>
    </el-tabs>

    <div class="filter">
      <el-input v-model="filter" placeholder="关键字查询" clearable />
    </div>

    <div v-show="toolStore.tab === 'top'" class="top-box">
      <template v-for="(top, index) in allTops" :key="top.name">
        <div class="top">
          <h4>
            <span>
              {{ top.name }}
              <span class="number">{{ index + 1 }}</span>
            </span>
            <mp-icon name="edit" @click="topEdit(top, index + 1)" />
          </h4>
          <div class="ul">
            <template v-for="id in top.tools" :key="id">
              <mp-tooltip :tip="toolStore.tools[id]?.intro || '暂无介绍'">
                <div class="li" :style="{ order: toolStore.getTop(id, top.name) }">
                  <span class="number">
                    {{
                      toolStore.getTop(id, top.name) === 100 ? '' : toolStore.getTop(id, top.name)
                    }}
                  </span>
                  <img
                    class="logo"
                    :src="toolStore.tools[id]?.logo"
                    :alt="toolStore.tools[id]?.title"
                    @click.stop="bindTool(id)"
                  />
                  <div class="name" @click.stop="bindTool(id)">
                    {{ toolStore.tools[id]?.title }}
                  </div>
                </div>
              </mp-tooltip>
            </template>
          </div>
        </div>
      </template>
    </div>

    <div v-show="toolStore.tab === 'all'" class="tool-box">
      <client-only>
        <template v-for="tool in allTools" :key="`tool-${tool.id}`">
          <mp-tooltip :tip="tool.intro || '暂无介绍'">
            <div class="tool">
              <img class="logo" :src="tool.logo" :alt="tool.title" />
              <span class="name" @click.stop="bindTool(tool.id)">{{ tool.title }}</span>
              <mp-icon name="edit" @click.stop="toolEdit(tool.id)" />
            </div>
          </mp-tooltip>
        </template>
      </client-only>
      <div class="tool add">
        <mp-icon name="add" @click="toolEdit(0)" />
        <span @click="toolEdit(0)">添加</span>
      </div>
    </div>

    <mp-dialog-top-edit
      v-model="showTopEdit"
      @edit="toolEdit"
      :top="top_edit"
      :top_number="top_number"
    />
    <mp-dialog-tool-edit v-model="showToolEdit" @close="showToolEdit = false" :tool_id="tool_id" />
  </div>
</template>

<script setup lang="ts">
const allTools = computed(() => {
  return Object.values(toolStore.tools)
    .filter((e) => mp.filter(e.title, filter.value, 0))
    .sort((a, b) => a.top - b.top)
})

const allTops = computed(() => {
  return Object.values(toolStore.toolTops)
    .filter((e) => {
      if (mp.filter(e.name, filter.value, 0)) {
        return true
      }
      for (const id of e.tools) {
        if (mp.filter(toolStore.tools[id]?.title, filter.value, 0)) {
          return true
        }
      }
      return false
    })
    .sort((a, b) => {
      let x = 0
      const xList = a.tools
        .sort((a1, b1) => toolStore.tools[a1]?.top - toolStore.tools[b1]?.top)
        .slice(0, 4)
      for (const id of xList) {
        x += toolStore.tools[id].top
      }
      let y = 0
      const bList = b.tools
        .sort((a2, b2) => toolStore.tools[a2]?.top - toolStore.tools[b2]?.top)
        .slice(0, 4)
      for (const id of bList) {
        y += toolStore.tools[id].top
      }
      return x / xList.length - y / bList.length
    })
})

const {
  filter,
  toolStore,
  bindTool,
  // top
  showTopEdit,
  top_edit,
  top_number,
  topEdit,
  // tool
  showToolEdit,
  tool_id,
  toolEdit,
} = useTool()
</script>

<style lang="scss">
#page-top.page {
  max-width: 100%;

  .filter {
    max-width: 240px;
    margin-bottom: 18px;
    width: 100%;
  }

  .top-box {
    color: #000;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 8px;
    justify-content: space-between;

    .top {
      box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
      background-color: #fff;
      will-change: background;
      list-style: auto;
      border-radius: 5px;
      padding: 0 20px;
      height: 180px;

      h4 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          > .number {
            color: rgba(0, 0, 0, 0);
            margin-left: 4px;
            font-size: 14px;
            font-weight: 300;
          }
        }

        .mp-icon {
          cursor: pointer;
          color: #909399;
        }
      }

      .ul {
        height: 96px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

        .li {
          display: flex;
          align-items: center;
          height: 24px;
          flex-shrink: 0;

          > .number {
            margin-right: 4px;
          }

          img.logo {
            cursor: pointer;
            width: 20px;
            height: 20px;
            margin-right: 4px;
          }

          .name {
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--el-color-primary);

            &:hover {
              color: var(--el-color-primary-dark-2);
            }
          }
        }
      }

      &.add {
        padding: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .mp-icon {
          cursor: pointer;
          font-size: 36px;
        }

        span {
          cursor: pointer;
        }
      }
    }
  }

  .tool-box {
    color: #000;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 8px;
    justify-content: space-between;

    .tool {
      box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
      background-color: #fff;
      will-change: background;
      border-radius: 5px;
      padding: 20px;

      display: flex;
      align-items: center;

      img.logo {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }

      .name {
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .mp-icon-edit {
        cursor: pointer;
        margin-left: auto;
        color: #909399;
      }
    }

    .tool.add {
      display: flex;
      justify-content: center;
      user-select: none;

      .mp-icon {
        cursor: pointer;
        padding-right: 4px;
      }

      span {
        cursor: pointer;
      }
    }
  }
}
</style>
