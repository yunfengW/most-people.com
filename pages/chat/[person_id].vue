<template>
  <div id="page-chat-person">
    <mp-header title="单线联系" />
    {{ userStore.user?.id }} to
    {{ route.params.person_id }}

    <div class="messages-box">
      <div
        class="message-box"
        :class="{ me: message.id === userStore.user?.id }"
        v-for="message in form.messages"
        :key="message.timestamp"
      >
        <span>{{ message.name }}</span>
        <span>:</span>
        <br />
        <span v-for="line in message.content.split('\n')">{{ line }}<br /></span>
      </div>
    </div>

    <div class="send-box">
      <div class="box">
        <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 2 }" resize="none" />
        <el-button type="primary" @click="submit" :loading="form.loading" :disabled="!form.content">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { init, form, route, submit, userStore } = useChatPerson()
onMounted(() => {
  init()
})
watch(
  () => userStore.user,
  () => init(),
)
</script>

<style lang="scss">
#page-chat-person {
  .messages-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 40px;
    .message-box.me {
      align-self: flex-end;
    }
  }
  .send-box {
    // position: fixed;
    // bottom: 40px;
    // left: 0;
    // right: 0;
    width: 100%;
    .box {
      // margin: 0 auto;
      // width: 61.8%;
      display: flex;
      gap: 8px;
    }
  }
}
</style>
