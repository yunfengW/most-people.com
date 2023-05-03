<template>
  <div id="page-tool">
    <mp-header :content="userStore.tool.zh" />
    <ContentDoc class="markdown-box">
      <template #not-found>
        <h4>抱歉，暂时还没有「{{ userStore.tool.zh }}」的操作指南</h4>
        <div>如果你有兴趣的话，加入我们吧</div>
        <br />
        <el-image class="join-us" src="/img/join-us.jpg" />
      </template>
    </ContentDoc>
  </div>
</template>

<script setup lang="ts">
import tools from '~/assets/json/tools.json'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const route = useRoute()
for (const tool of tools) {
  if (route.params.slug[0] === tool.id) {
    userStore.tool = tool
    break
  }
}

useHead({
  title: userStore.tool.zh,
})
</script>

<style lang="scss">
#page-tool {
  .markdown-box {
    width: 100%;
  }
  .join-us {
    max-width: 375px;
  }
}
</style>
