<template>
  <div id="app">
    <nuxt-loading-indicator />
    <nuxt-page class="page" />

    <el-backtop :visibility-height="1400" />

    <nuxt-link class="mp-uid" to="/mine">
      <el-button link type="info">{{ userStore.UID }}</el-button>
    </nuxt-link>
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
    toolStore.initTops()
    userStore.initSearch()
  })
}
if (process.client) {
  initTools()
}

onBeforeMount(() => {
  // indexDB
  indexDB.init().then(() => {
    userStore.init()
  })
})

onMounted(() => {
  userStore.initPlaceholder()
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
