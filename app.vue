<template>
  <div id="app">
    <nuxt-link class="mp-uid" to="/mine">
      <el-button link type="info">{{ userStore.getUID }}</el-button>
    </nuxt-link>
    <nuxt-page class="page" />
    <el-backtop :visibility-height="1400" />
  </div>
</template>

<script setup lang="ts">
import { indexDB } from '~/utils/api/indexdb'
import api from '~/utils/api'
import type { Tool, Tools } from '~/stores/tool'

const userStore = useUserStore()
const toolStore = useToolStore()

const initTools = async () => {
  api({ method: 'post', url: '/db/Tools' }).then((res) => {
    const list = res.data as Tool[]
    const tools: Tools = {}
    for (const tool of list) {
      if (!tool.content) {
        tool.content = ''
      }
      tools[tool.id] = tool
    }
    toolStore.tools = tools
    toolStore.initTops(list)
  })
}
if (process.client) {
  initTools()
}

// const initZoom = () => {
//   // 获取屏幕宽度和高度
//   const screenWidth =
//     window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
//   const screenHeight =
//     window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

//   // 计算缩放比例
//   const scaleRatio = Math.min(1920 / screenWidth, 1080 / screenHeight) // 假设参考分辨率为 1920x1080

//   // 计算缩放级别
//   const zoomLevel = 1 / scaleRatio

//   const zoom = String(zoomLevel > 1 ? zoomLevel : 1)

//   // 应用缩放级别
//   document.body.style.setProperty('zoom', zoom)
// }

onBeforeMount(() => {
  // 屏幕缩放
  // initZoom()
  // window.addEventListener('resize', initZoom)

  // indexDB
  indexDB.init().then(() => {
    userStore.init()
  })

  // 搜狗 jsonp 提示
  window.sogou = {
    sug(data) {
      userStore.sugList = data[1]
      userStore.sugIndex = -1
    },
  }
})

onMounted(() => {
  // mp-mi
  document.addEventListener('click', async (event: any) => {
    const mi = event?.target?.parentElement as HTMLDivElement
    const tagName = mi?.tagName
    if (tagName === 'MP-MI') {
      if (event?.target?.tagName === 'A') {
        const input = event.target.previousSibling
        if (input.tagName === 'INPUT') {
          const password = input.value as string
          const text = mi.querySelector('span')?.innerText || ''
          const { key } = await mp.key('most-people', password)
          const decrypted = await mp.decrypt(text, key)
          if (decrypted) {
            mi.innerHTML = `<div>${decrypted.replaceAll('\n', '<br />')}</div>`
          } else {
            mp.error('密码错误')
            input.select()
          }
        }
      }
    }
  })
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault()
    }
  })
})
</script>

<style lang="scss">
// global
@import '~/assets/css/global.scss';
@import '~/assets/css/markdown.scss';
</style>
