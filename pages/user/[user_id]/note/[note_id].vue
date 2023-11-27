<template>
  <div id="page-note-uid">
    <mp-header title="我的笔记" />
    <main>
      <!-- <nuxt-link :to="`/user/${note.user_id}/note/${note.id}`" v-for="note in notes">
        {{ note.title }}
      </nuxt-link> -->
    </main>
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api'

const route = useRoute()
const note_id = (route.params.note_id || '') as string
const init = async () => {
  const res = await api({ method: 'post', url: 'db/Notes/' + note_id })
  console.log('🌊', res)
  //   notes.value = res.data
}
init()
</script>

<style lang="scss">
#page-note-uid.page {
  main {
    margin-top: 70px;

    a {
      display: inline-flex;
      margin: 10px;
    }
  }
}
</style>
