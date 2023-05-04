<template>
  <div id="page-tools">
    <mp-header content="万能工具箱" />
    <div class="top-box">
      <div class="top" v-for="list in topList">
        <h4>{{ list.zh }}</h4>
        <div v-for="key in list.top">
          <nuxt-link :to="'/tool/' + mp.hyphenate(tools[key as 'Bing']?.id)">
            {{ tools[key as 'Bing']?.zh }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'
import topList from '~/assets/json/topList.json'

useHead({
  title: '万能工具箱',
})
</script>

<style lang="scss">
#page-tools.page {
  background-color: #0e4d8a;
  max-width: 100%;
  color: white;
  min-height: 100vh;
}
</style>
