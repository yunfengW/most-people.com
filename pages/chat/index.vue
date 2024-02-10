<template>
  <div id="page-chat">
    <mp-header title="加密聊天" />

    <h4>单线联系（最安全）</h4>

    <div class="persons">
      <el-button
        text
        type="success"
        class="person"
        v-for="chat in form.chats"
        :key="chat.id"
        @click="bindPerson(chat)"
      >
        {{ formatPerson(chat) }}
      </el-button>
    </div>

    <el-input v-model="contact.person" placeholder="输入联系人" />
    <br />
    <el-button type="success" @click="startPerson" :loading="contact.personLoading">开始</el-button>

    <h4>联络小组（切勿泄露联络密码）</h4>

    <div class="groups">
      <el-button
        text
        type="warning"
        class="group"
        v-for="group in form.groups"
        :key="group.id"
        @click="bindGroup(group)"
      >
        {{ group.name }}
      </el-button>
    </div>

    <el-input v-model="contact.groupName" placeholder="输入小组名称" />
    <br />
    <el-input v-model="contact.groupPassword" placeholder="输入联络密码" />
    <br />
    <div>
      <el-button type="info" @click="createGroup">创建小组</el-button>
      <el-button type="warning" @click="joinGroup">进入小组</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  init,
  form,
  contact,
  startPerson,
  formatPerson,
  createGroup,
  bindGroup,
  joinGroup,
  bindPerson,
} = useChat()

onMounted(() => {
  init()
})
</script>

<style lang="scss">
#page-chat {
  .persons,
  .groups {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin: 14px;
  }
}
</style>
