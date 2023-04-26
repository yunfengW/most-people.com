<template>
  <div id="app">
    <nuxt-link class="mp-uid" to="/me">
      <el-button link type="info">{{ userStore.getUID }}</el-button>
    </nuxt-link>
    <nuxt-page class="page" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from './stores/user'

const userStore = useUserStore()
</script>

<style lang="scss">
// global
*,
::after,
::before {
  box-sizing: border-box;
}
html {
  background: rgb(241, 241, 241);
}
body {
  margin: 0;
}
#app {
  > .page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 30px;
  }
  > .mp-uid {
    position: fixed;
    right: 10px;
    bottom: 10px;
    z-index: 10;
  }
}
</style>
