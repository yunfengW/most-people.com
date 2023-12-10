<template>
  <div id="app">
    <nuxt-link class="mp-uid" to="/mine">
      <el-button link type="info">{{ userStore.getUID }}</el-button>
    </nuxt-link>
    <nuxt-page class="page" />
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup lang="ts">
import { indexDB } from '~/utils/api/indexdb'
import api from '~/utils/api'
import type { ToolsTop, Tool, Tools } from '~/stores/tool'

const userStore = useUserStore()
const toolStore = useToolStore()

const initTools = async () => {
  api({ method: 'post', url: '/db/ToolsTop' }).then((res) => {
    toolStore.toolsTop = res.data as ToolsTop[]
  })
  api({ method: 'post', url: '/db/Tools' }).then((res) => {
    const list = res.data as Tool[]
    const tools: Tools = {}
    for (const tool of list) {
      tools[tool.id] = tool
    }
    toolStore.tools = tools
  })
}
if (process.client) {
  initTools()
}

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
:root {
  --red: #e30002;
}

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
    padding: 20px;
  }
  > .mp-uid {
    position: absolute;
    right: 14px;
    bottom: 0;
    z-index: 10;
  }
}

// element UI
body {
  // mp-tooltip
  .el-popper {
    font-size: 16px;
    line-height: normal;
    max-width: calc(100% - 10px);
  }
  .el-popper.is-customized {
    padding: 6px 12px;
    background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
  }

  .el-popper.is-customized .el-popper__arrow::before {
    background: linear-gradient(45deg, #b2e68d, #bce689);
    right: 0;
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
