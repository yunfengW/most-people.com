<template>
  <div id="page-chat-person">
    <mp-header title="单线联系" />
    {{ userStore.user?.id }} to
    {{ route.params.person_id }}

    <div class="send-box">
      <div class="box">
        <el-input v-model="form.message" type="textarea" :autosize="{ minRows: 2 }" resize="none" />
        <el-button type="primary" @click="submit" :loading="form.loading" :disabled="!form.message"
          >发送</el-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import api from '~/utils/api'

const userStore = useUserStore()
const route = useRoute()
const form = reactive({
  message: '',
  loading: false,
})

const sendMessage = async () => {
  const res = await api({
    method: 'put',
    url: `/chat/${route.params.person_id}`,
    data: {
      message: form.message,
    },
  })
  if (!res.data) {
    console.error(res)
  }
}

const submit = async () => {
  form.loading = true
  await sendMessage()
  form.loading = false
}

const init = () => {
  // 创建一个新的EventSource实例，连接到你的SSE端点
  const url = new URL(api.getUri())
  url.pathname = '/chat/connect'
  url.searchParams.set('authorization', 'Bearer ' + window.sessionStorage.getItem('token') || '')
  const sse = new EventSource(url)

  // 监听消息
  sse.addEventListener('open', () => {
    const username = localStorage.getItem('username')
    console.log(`➜ ${username} Connect`)
  })
  sse.addEventListener('message', (event) => {
    // 解析收到的数据
    const data = event.data as string
    try {
      console.log('🌊', JSON.parse(data))
    } catch (error) {
      console.error(error)
    }
  })
  sse.addEventListener('error', (error) => {
    console.error('EventSource failed:', error)
    // 解析收到的数据
    sse.close()
  })
}

onMounted(() => {
  init()
})
</script>

<style lang="scss">
#page-chat-person {
  .send-box {
    position: fixed;
    bottom: 40px;
    left: 0;
    right: 0;
    .box {
      margin: 0 auto;
      width: 61.8%;
      display: flex;
      gap: 8px;
    }
  }
}
</style>
