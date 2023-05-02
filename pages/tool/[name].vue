<template>
  <div id="page-tool">
    <mp-header :content="userStore.tool.zh" />

    <h4>抱歉，暂时还没有「{{ userStore.tool.zh }}」的操作指南</h4>

    <div>如果你有兴趣的话，加入我们吧</div>

    <el-image class="join-us" src="/img/join-us.jpg" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
</script>

<style lang="scss">
#page-tool {
  .join-us {
    max-width: 375px;
  }
}
</style>
