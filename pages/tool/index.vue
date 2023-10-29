<template>
  <div id="page-top">
    <mp-header title="万能工具箱">
      <template #right>
        <div class="edit" @click="mp.info('开发中...')">
          <span>发布</span>
          <mp-icon name="publish" />
        </div>
      </template>
    </mp-header>

    <el-tabs v-model="toolStore.tab">
      <el-tab-pane label="分类" name="top"></el-tab-pane>
      <el-tab-pane label="全部" name="all"></el-tab-pane>
    </el-tabs>

    <div v-show="toolStore.tab === 'top'" class="top-box">
      <div class="top" v-for="(top, index) in toolStore.toolsTop">
        <h4>
          <span>{{ top.zh }}</span>
          <mp-icon name="edit" @click="editTop(index)" />
        </h4>
        <div class="ul">
          <div class="li" v-for="(key, i) in top.list" @click="bindTool(key)">
            <span class="number">{{ i + 1 }}</span>
            <img class="logo" :src="toolStore.tools[key]?.logo" :alt="toolStore.tools[key]?.zh" />
            <a class="name">{{ toolStore.tools[key]?.zh }}</a>
          </div>
        </div>
      </div>
      <div class="top add">
        <mp-icon name="add" @click="showTopAdd = true" />
        <span @click="showTopAdd = true">添加</span>
      </div>
    </div>

    <div v-show="toolStore.tab === 'all'" class="tool-box">
      <div class="tool" v-for="(tool, index) in Object.values(toolStore.tools)">
        <img class="logo" :src="tool.logo" :alt="tool.zh" />
        <span class="name" @click="bindTool(tool.id)">{{ tool.zh }}</span>
        <mp-icon name="edit" @click="editTool(index)" />
      </div>
      <div class="tool add">
        <mp-icon name="add" @click="showToolAdd = true" />
        <span @click="showToolAdd = true">添加</span>
      </div>
    </div>

    <mp-dialog-top-edit v-model="showTopEdit" @close="showTopEdit = false" :topIndex="topIndex" />
    <mp-dialog-top-add v-model="showTopAdd" @close="showTopAdd = false" />

    <mp-dialog-tool-edit v-model="showToolEdit" @close="showToolEdit = false" />
    <mp-dialog-tool-add v-model="showToolAdd" @close="showToolAdd = false" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '万能工具箱',
})
const { toolStore, showTopAdd, showTopEdit, topIndex, bindTool, editTop } = useToolTop()

const showToolAdd = ref(false)
const showToolEdit = ref(false)

const editTool = (index: number) => {
  showToolEdit.value = true
  console.log('🌊', index)
}
</script>

<style lang="scss">
#page-top.page {
  max-width: 100%;

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
        .mp-icon {
          cursor: pointer;
          color: #909399;
        }
      }

      .ul {
        height: 96px;
        overflow-y: auto;

        .li {
          cursor: pointer;
          display: flex;
          align-items: center;
          height: 24px;

          .number {
            margin-right: 4px;
          }

          img.logo {
            width: 20px;
            height: 20px;
            margin-right: 4px;
          }

          .name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
        height: auto;
        margin-right: 6px;
      }

      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          cursor: pointer;
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
