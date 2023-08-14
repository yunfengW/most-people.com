<template>
  <div id="app">
    <nuxt-link class="mp-uid" to="/mine">
      <el-button link type="info">{{ userStore.getUID }}</el-button>
    </nuxt-link>
    <nuxt-page class="page" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { indexDB } from '~/utils/api/indexdb'

const userStore = useUserStore()

const initZoom = () => {
  // 获取屏幕宽度和高度
  const screenWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const screenHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

  // 计算缩放比例
  const scaleRatio = Math.min(1920 / screenWidth, 1080 / screenHeight) // 假设参考分辨率为 1920x1080

  // 计算缩放级别
  const zoomLevel = 1 / scaleRatio

  const zoom = String(zoomLevel > 1 ? zoomLevel : 1)

  // 应用缩放级别
  document.body.style.setProperty('zoom', zoom)
}

onBeforeMount(() => {
  indexDB.init().then(() => {
    userStore.init()
  })

  // 屏幕缩放
  initZoom()
  window.addEventListener('resize', initZoom)

  // 搜狗 jsonp 提示
  window.sogou = {
    sug(data) {
      console.log('🌊', data)
      userStore.sugList = data[1]
      userStore.sugIndex = -1
    },
  }
})
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

a {
  cursor: pointer;
  color: var(--el-color-primary);
  text-decoration: none;
}
a:hover {
  color: var(--el-color-primary-dark-2);
}

html,
body,
#__nuxt {
  height: 100%;
}

#app {
  position: relative;
  min-height: 100%;

  > .page {
    display: flex;
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
