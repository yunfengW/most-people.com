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
import api from '~/utils/api'

const router = useRouter()
const userStore = useUserStore()

const contact = reactive({
  person: '',
  personLoading: false,
  groupName: '',
  groupPassword: '',
  groupLoading: false,
})

const formatPerson = (chat: Chat) => {
  const username = localStorage.getItem('username')
  for (const name of chat.you_me) {
    if (name !== username) {
      return name
    }
  }
  return username
}

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
  if (!res.data) {
    mp.error('联系人不存在')
    return
  }
  router.push(`/chat/${contact.person}`)
}
const joinGroup = async () => {
  if (!contact.groupName) {
    mp.info('请输入小组名称')
    return
  }
  contact.groupLoading = true
  const { token } = await mp.key(contact.groupName, contact.groupPassword)
  const password_hash = await mp.encrypt(contact.groupPassword)
  const res = await api({
    method: 'post',
    url: '/chat/group.join',
    data: { name: contact.groupName, password_hash, token },
  })
  contact.groupLoading = false
  if (res.ok) {
    router.push(`/group/${res.data}`)
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
  if (res.ok) {
    const group = res.data as GroupChat
    bindGroup(group)
  }
}

const bindGroup = async (group: GroupChat) => {
  const member = group.members.find((e) => userStore.user?.id === e.id)
  if (member) {
    const password = await mp.decrypt(member.password_hash)
    router.push({
      path: '/group/' + group.id,
      query: { p: mp.enBase64(password) },
    })
  }
}
const bindPerson = async (person: Chat) => {
  const person_name = person.you_me.find((e) => e !== userStore.user?.name) || userStore.user?.name
  router.push('/chat/' + person_name)
}

const form = reactive({
  chats: [] as Chat[],
  groups: [] as GroupChat[],
})

onMounted(async () => {
  const res = await api({ url: '/chat/list', method: 'post' })
  if (res.ok && res.data) {
    form.groups = res.data.groups as GroupChat[]
    form.chats = res.data.persons as Chat[]
  }
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
