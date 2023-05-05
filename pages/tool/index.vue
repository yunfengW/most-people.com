<template>
  <div id="page-tools">
    <mp-header content="万能工具箱" />
    <div class="top-box">
      <div class="top" v-for="list in topList">
        <h4>{{ list.zh }}</h4>
        <div class="li" v-for="key in list.top" @click="bindTool(key)">
          <img :src=" tools[key as 'Bing']?.logo" :alt="tools[key as 'Bing']?.zh" />
          <a>{{ tools[key as 'Bing']?.zh }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'
import topList from '~/assets/json/topList.json'
import { useUserStore } from '~/stores/user'

useHead({
  title: '万能工具箱',
})

const userStore = useUserStore()
const router = useRouter()
const bindTool = (key: string) => {
  const tool = tools[key as 'Bing']?.id
  if (tool) {
    userStore.tools.push(tool)
    router.replace('/')
  }
}
</script>

<style lang="scss">
#page-tools.page {
  background-color: #0e4d8a;
  max-width: 100%;
  color: #fff;
  min-height: 100vh;

  .top-box {
    color: #000;
    display: flex;
    flex-wrap: wrap;
    margin-right: -8px;
    .top {
      box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
      background-color: #fff;
      will-change: background;
      list-style: auto;
      border-radius: 5px;
      margin-right: 8px;
      margin-bottom: 8px;
      width: 163px;
      padding: 0 20px 20px;
      .li {
        margin: 4px 0;
        display: flex;
        align-items: center;

        img {
          width: 20px;
          height: 20px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
