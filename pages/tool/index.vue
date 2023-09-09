<template>
  <div id="page-top">
    <mp-header content="万能工具箱" />
    <div class="top-box">
      <div class="top" v-for="list in toolsTop">
        <h4>{{ list.zh }}</h4>
        <div class="ul">
          <div class="li" v-for="(key, i) in list.top" @click="bindTool(key)">
            <span class="No">{{ i + 1 }}</span>
            <img class="logo" :src="tools[key as 'Bing']?.logo" :alt="tools[key as 'Bing']?.zh" />
            <a>{{ tools[key as 'Bing']?.zh }}</a>
          </div>
        </div>
      </div>
    </div>
    <nuxt-link to="/tool/list"></nuxt-link>
  </div>
</template>

<script setup lang="ts">
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'
import toolsTop from '~/assets/json/toolsTop.json'
import { Tool, useUserStore } from '~/stores/user'

useHead({
  title: '万能工具箱',
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const bindTool = (key: string) => {
  const tool = tools[key as 'Bing']
  if (tool) {
    // 添加
    if (route.query.type === 'add') {
      addTool(tool)
      return
    }

    userStore.updateTool(tool.id)
    router.replace('/')

    // // 支持搜索
    // if (tool.url.includes('「most-people」')) {
    //   userStore.updateTool(tool.id)
    //   router.replace('/')
    //   return
    // }
    // // 不支持搜索
    // window.open(tool.url)
  }
}

const addTool = (tool: Tool) => {
  if (userStore.tools.includes(tool.id) === false) {
    userStore.tools.push(tool.id)
    userStore.updateTools()
  }
  userStore.updateTool(tool.id)
  router.replace('/')
}
</script>

<style lang="scss">
#page-top.page {
  background-color: #0e4d8a;
  max-width: 100%;
  color: #fff;
  min-height: 100vh;

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
      padding: 0 20px 20px;

      .ul {
        height: 96px;
        overflow-y: auto;

        .li {
          display: flex;
          align-items: center;
          height: 24px;

          .No {
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
    }
  }
}
</style>
