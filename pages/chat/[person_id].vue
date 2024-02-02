<template>
  <div id="page-chat-person">
    <mp-header title="单线联系" />
  </div>
</template>
<script setup lang="ts">
onMounted(() => {
  // 创建一个新的EventSource实例，连接到你的SSE端点
  const eventSource = new EventSource('http://localhost:8001/events/stream')

  // 监听消息
  eventSource.onmessage = function (event) {
    // 解析收到的数据
    const message = event.data

    console.log('🌊', message)
  }

  // 监听错误事件
  eventSource.onerror = function (error) {
    console.error('EventSource failed:', error)
    eventSource.close()
  }
})
</script>
