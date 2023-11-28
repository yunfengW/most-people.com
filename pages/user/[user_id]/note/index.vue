<template>
  <div id="page-user-note">
    <mp-header title="我的笔记" />
    <main>
      <nuxt-link :to="`/user/${note.user_id}/note/${note.id}`" v-for="note in notes">
        {{ note.title }} {{ note.content.startsWith('mp://') ? '【私有】' : '' }}
      </nuxt-link>

      <el-button @click="mp.info('开发中')">添加</el-button>
    </main>
  </div>
</template>

<script setup lang="ts">
const { notes } = useUserNote()
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
