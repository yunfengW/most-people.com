<template>
  <div id="page-top">
    <mp-header title="万能工具箱" />

    <el-tabs v-model="tab">
      <el-tab-pane label="分类" name="top"></el-tab-pane>
      <el-tab-pane label="全部" name="all"></el-tab-pane>
    </el-tabs>

    <div v-show="tab === 'top'" class="top-box">
      <div class="top" v-for="(top, index) in toolStore.toolsTop">
        <h4>
          <span>{{ top.zh }}</span>
          <mp-icon name="edit" @click="editTop(index)" />
        </h4>
        <div class="ul">
          <div class="li" v-for="(key, i) in top.list" @click="bindTool(key)">
            <span class="number">{{ i + 1 }}</span>
            <img class="logo" :src="toolStore.tools[key]?.logo" :alt="toolStore.tools[key]?.zh" />
            <a>{{ toolStore.tools[key]?.zh }}</a>
          </div>
        </div>
      </div>
      <div class="top add">
        <mp-icon name="add" @click="showTopAdd = true" />
        <span @click="showTopAdd = true">添加</span>
      </div>
    </div>

    <div v-show="tab === 'all'" class="tool-box">
      <div class="tool" v-for="tool in Object.values(toolStore.tools)">
        <img class="logo" :src="tool.logo" :alt="tool.zh" />
        <span>{{ tool.zh }}</span>
        <mp-icon name="edit" />
      </div>
    </div>

    <mp-dialog-top-edit v-model="showTopEdit" @close="showTopEdit = false" :topIndex="topIndex" />
    <mp-dialog-top-add v-model="showTopAdd" @close="showTopAdd = false" />
  </div>
</template>

<script setup lang="ts">
const showTopAdd = ref(false)
const showTopEdit = ref(false)
const topIndex = ref(-1)

useHead({
  title: '万能工具箱',
})

const userStore = useUserStore()
const toolStore = useToolStore()
const router = useRouter()
const route = useRoute()
const bindTool = (key: string) => {
  const tool = toolStore.tools[key]
  if (tool) {
    // 添加
    if (route.query.type === 'add') {
      addTool(tool)
      return
    }

    userStore.updateTool(tool.id)
    router.replace('/')
  }
}

const addTool = (tool: Tool) => {
  if (userStore.user === null) {
    mp.info('请先登录，登录后即可添加')
  } else {
    if (userStore.tools.includes(tool.id) === false) {
      userStore.tools.push(tool.id)
      userStore.updateTools()
    }
  }
  userStore.updateTool(tool.id)
  router.replace('/')
}

const editTop = (index: number) => {
  showTopEdit.value = true
  topIndex.value = index
}

const tab = ref('top')
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

          a {
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

      .mp-icon-edit {
        cursor: pointer;
        margin-left: auto;
        color: #909399;
      }
    }
  }
}
</style>
