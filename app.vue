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
  position: relative;
  min-height: 100vh;

  > .page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    margin: 0 auto;
    padding: 56px 20px 30px;
  }
  > .mp-uid {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 10;
  }
}

// PC端 横屏
@media (orientation: landscape) and (min-width: 980px) {
  #app {
    > .page {
      max-width: 61.8%;
    }
  }
}
</style>
