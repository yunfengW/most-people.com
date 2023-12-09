<template>
  <div id="page-user-note">
    <mp-header title="我的笔记" />
    <main>
      <h4>公开笔记</h4>
      <template v-for="note in publicNotes">
        <nuxt-link :to="`/note/${note.id}`">
          {{ note.title }}
        </nuxt-link>
      </template>
      <br />
      <el-button @click="addNote">添加</el-button>
      <h4>加密笔记</h4>
      <template v-for="note in encryptedNotes">
        <nuxt-link :to="`/note/${note.id}`">{{ note.title }} </nuxt-link>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api'

const noteStore = useNoteStore()
const userStore = useUserStore()

const publicNotes = computed(() => {
  return noteStore.notes.filter((note) => !note.content.startsWith('mp://'))
})

const encryptedNotes = computed(() => {
  return noteStore.notes.filter((note) => note.content.startsWith('mp://'))
})

const addNote = async () => {
  const res = await api({
    method: 'put',
    url: '/note/add',
    data: {
      title: '点击修改',
    },
  })
  if (res.data?.id) {
    noteStore.notes.push(res.data)
  }
}
const init = async () => {
  if (userStore.user && !noteStore.inited) {
    const res = await api({ method: 'post', url: '/db/Notes/user/' + userStore.user.id })
    noteStore.notes = res.data as Note[]
    noteStore.inited = true
  }
}

onBeforeMount(() => {
  init()
})

watch(
  () => userStore.user,
  () => {
    init()
  },
)
</script>

<style lang="scss">
#page-user-note.page {
  main {
    a {
      display: inline-flex;
      margin: 10px;
    }
  }
}
</style>
