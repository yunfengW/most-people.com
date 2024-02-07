<template>
  <div id="page-chat">
    <mp-header title="加密聊天" />

    <h4>单线联系（最安全）</h4>

    <el-input v-model="contact.person" placeholder="输入联系人" />
    <br />
    <el-button type="success" @click="startPerson" :loading="contact.personLoading">开始</el-button>

    <h4>联络小组（切勿泄露联络密码）</h4>

    <el-input v-model="contact.groupName" placeholder="输入小组名称" />
    <br />
    <el-input v-model="contact.groupPassword" placeholder="输入联络密码" />
    <br />
    <div>
      <el-button type="info" @click="createGroup">创建小组</el-button>
      <el-button type="warning" @click="startGroup">进入小组</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api'

const router = useRouter()

const contact = reactive({
  person: '',
  personLoading: false,
  groupName: '',
  groupPassword: '',
  groupLoading: false,
})

const startPerson = async () => {
  if (!contact.person) {
    mp.info('请输入联系人')
    return
  }
  contact.personLoading = true
  const res = await api({
    method: 'post',
    url: '/user/get.user.id',
    data: { name: contact.person },
  })
  contact.personLoading = false
  const person_id = res.data
  if (!person_id) {
    mp.error('联系人不存在')
    return
  }
  router.push(`/chat/${person_id}`)
}
const startGroup = async () => {
  if (!contact.groupName) {
    mp.info('请输入小组名称')
    return
  }
  contact.groupLoading = true
  const { token } = await mp.key(contact.groupName, contact.groupPassword)
  const res = await api({
    method: 'post',
    url: '/chat/group.join',
    data: { name: contact.groupName, token },
  })
  contact.groupLoading = false
  if (res.data.ok) {
    router.push(`/group/${res.data.id}`)
  }
}
const createGroup = async () => {
  if (!contact.groupName) {
    mp.info('请输入小组名称')
    return
  }
  contact.groupLoading = true
  const { token } = await mp.key(contact.groupName, contact.groupPassword)
  const password_hash = await mp.encrypt(contact.groupPassword)
  const res = await api({
    method: 'post',
    url: '/chat/group.create',
    data: { name: contact.groupName, password_hash, token },
  })
  contact.groupLoading = false
  if (res.data.ok) {
    const groupChat = res.data.groupChat as GroupChat
    router.push(`/group/${groupChat.id}`)
  }
}
</script>
<style lang="scss"></style>
