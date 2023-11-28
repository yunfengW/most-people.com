<template>
  <div id="page-knowledge">
    <mp-header title="知识库" />
    <main>
      <nuxt-link :to="`/knowledge/${knowledge.id}`" v-for="knowledge in knowledgeList">
        {{ knowledge.Question }}
      </nuxt-link>

      <el-button @click="addKnowledge">添加</el-button>
    </main>
  </div>
</template>

<script setup lang="ts">
import api from '~/utils/api'

const { knowledgeList } = useKnowledge()

const addKnowledge = async () => {
  const res = await api({
    method: 'put',
    url: '/knowledge/add',
    data: {
      Question: '点击修改',
      // Answer: '阿里翻译：https://medtrans.damo.alibaba.com/\n百度翻译：https://fanyi.baidu.com/\n提供多种语言翻译',
      // updated_time: String(Date.now()),
    },
  })
  if (res.data?.id) {
    knowledgeList.value.push(res.data)
  }
}
</script>

<style lang="scss">
#page-knowledge.page {
  main {
    a {
      display: inline-flex;
      margin: 10px;
    }
  }
}
</style>
