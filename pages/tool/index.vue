<template>
  <div id="page-tools">
    <mp-header content="万能工具箱" />
    <nuxt-link v-for="tool in tools" :to="'/tool/' + tool.id">{{ tool.zh }}</nuxt-link>
  </div>
</template>

<script setup lang="ts">
// JSON 可视化编辑器 https://jsoneditoronline.org
import tools from '~/assets/json/tools.json'

useHead({
  title: '万能工具箱',
})
</script>
