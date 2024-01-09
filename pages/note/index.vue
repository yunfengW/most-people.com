<template>
  <div id="page-user-note">
    <mp-header title="我的笔记" />

    <main v-if="noteStore.inited">
      <div class="filter">
        <el-input v-model="filter" placeholder="关键字查询" clearable />
      </div>

      <h4>公开笔记</h4>
      <template v-for="note in publicNotes">
        <nuxt-link :to="`/note/${note.id}`">
          <el-button link>{{ note.title }}</el-button>
        </nuxt-link>
      </template>
      <br />

      <el-link @click="addNote" type="success">
        <mp-icon name="add" />
        <span :style="{ marginLeft: '2px' }">添加</span>
      </el-link>

      <h4>加密笔记</h4>
      <template v-for="note in encryptedNotes">
        <nuxt-link :to="`/note/${note.id}`">
          <el-button link>{{ note.title }}</el-button>
        </nuxt-link>
      </template>

      <h4>多人笔记</h4>
      <template v-for="note in authorsNotes">
        <nuxt-link :to="`/note/${note.id}`">
          <el-button link>{{ note.title }}</el-button>
        </nuxt-link>
      </template>
    </main>
    <mp-loading v-else />
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api'

const noteStore = useNoteStore()

const filter = ref('')

const publicNotes = computed(() => {
  return noteStore.notes
    .filter((note) => !note.content.startsWith('mp://'))
    .filter((e) => mp.filter(e.title, filter.value, 0))
})

const encryptedNotes = computed(() => {
  return noteStore.notes
    .filter((note) => note.content.startsWith('mp://'))
    .filter((e) => mp.filter(e.title, filter.value, 0))
})

const authorsNotes = computed(() => {
  return noteStore.authorsNotes.filter((e) => mp.filter(e.title, filter.value, 0))
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
</script>

<style lang="scss">
#page-user-note.page {
  main {
    width: 100%;
    .filter {
      margin: 0 auto 18px;
      max-width: 240px;
      width: 100%;
    }
    a {
      display: inline-flex;
      margin: 10px;
    }
  }
}
</style>
