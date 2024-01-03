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
    <el-button type="warning" @click="startGroup">进入小组</el-button>
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
const startGroup = () => {
  router.push(`/group/1`)
}

onMounted(async () => {
  // 私聊
  const A = await mp.key('A', 'most-people.com')
  const B = await mp.key('B', 'www.most-people.com')

  const A_to_B = mp.decode(
    mp.encode('A: 你好吗', B.public_key, A.private_key),
    A.public_key,
    B.private_key,
  )
  console.log('🌊', A_to_B)
  const B_to_A = mp.decode(
    mp.encode('B: 我很好', A.public_key, B.private_key),
    B.public_key,
    A.private_key,
  )
  console.log('🌊', B_to_A)

  // 群聊
  const { key } = await mp.key('测试测试', '收到收到')
  const encrypted = await mp.encrypt('歪比歪比', key)
  const decrypted = await mp.decrypt(encrypted, key)
  console.log('🌊', decrypted)
})
</script>
<style lang="scss"></style>
