<template>
  <div id="page-user-note">
    <mp-header title="我的笔记" />
    <main>
      <nuxt-link :to="`/user/${note.user_id}/note/${note.id}`" v-for="note in notes">
        {{ note.title }}
      </nuxt-link>
    </main>
  </div>
</template>

<script setup lang="ts">
const { notes } = useUserNote()
</script>

<style lang="scss">
#page-user-note.page {
  main {
    margin-top: 70px;

    a {
      display: inline-flex;
      margin: 10px;
    }
  }
}
</style>
