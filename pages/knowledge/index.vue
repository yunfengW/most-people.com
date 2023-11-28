<template>
  <div id="page-knowledge">
    <mp-header title="知识库" />
    <main>
      <nuxt-link :to="`/knowledge/${knowledge.id}`" v-for="knowledge in knowledgeList">
        {{ knowledge.Question }}
      </nuxt-link>
    </main>
  </div>
</template>

<script setup lang="ts">
const { knowledgeList } = useKnowledge()
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
