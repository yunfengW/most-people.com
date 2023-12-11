<template>
  <div id="page-knowledge">
    <mp-header title="知识库" />
    <main v-if="knowledgeStore.inited">
      <nuxt-link :to="`/knowledge/${knowledge.id}`" v-for="knowledge in knowledgeStore.list">
        {{ knowledge.title }}
      </nuxt-link>
      <br />
      <el-button @click="addKnowledge">添加</el-button>
    </main>
    <mp-loading v-else />
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '~/stores/knowledge'
import api from '~/utils/api'

const knowledgeStore = useKnowledgeStore()

const addKnowledge = async () => {
  const res = await api({
    method: 'put',
    url: '/knowledge/add',
    data: {
      title: '点击修改',
    },
  })
  if (res.data?.id) {
    knowledgeStore.list.push(res.data)
  }
}

if (process.client) {
  knowledgeStore.init()
}
</script>

<style lang="scss">
#page-knowledge.page {
  main {
    width: 100%;
    a {
      display: inline-flex;
      padding: 10px;
    }
  }
}
</style>
