<template>
  <div id="page-chat-person">
    <mp-header title="单线联系" />
    {{ userStore.user?.id }} to
    {{ route.params.person_id }}
  </div>
</template>
<script setup lang="ts">
import api from '~/utils/api'

const userStore = useUserStore()
const route = useRoute()
onMounted(() => {
  // 创建一个新的EventSource实例，连接到你的SSE端点
  const url = new URL(api.getUri())
  url.pathname = '/chat/connect'
  url.searchParams.set('authorization', 'Bearer ' + window.sessionStorage.getItem('token') || '')
  const sse = new EventSource(url)

  // 监听消息
  sse.addEventListener('open', () => {
    console.log('open')
  })
  sse.addEventListener('message', (event) => {
    // 解析收到的数据
    const message = event.data
    console.log('🌊', message)
  })
  sse.addEventListener('error', (error) => {
    console.error('EventSource failed:', error)
    // 解析收到的数据
    sse.close()
  })
})
</script>
