<template>
  <div id="page-knowledge">
    <mp-header title="知识库" />
    <main v-if="knowledgeStore.inited">
      <div class="filter">
        <el-input v-model="filter" placeholder="关键字查询" clearable />
      </div>

      <nuxt-link :to="`/knowledge/${knowledge.id}`" v-for="knowledge in knowledgeList">
        <el-button link>{{ knowledge.title }}</el-button>
      </nuxt-link>
      <br />
      <el-link @click="addKnowledge" type="success">
        <mp-icon name="add" />
        <span :style="{ marginLeft: '2px' }">添加</span>
      </el-link>
    </main>
    <mp-loading v-else />
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '~/stores/knowledge'
import api from '~/utils/api'

const router = useRouter()

const knowledgeStore = useKnowledgeStore()

const filter = ref('')

const knowledgeList = computed(() => {
  return knowledgeStore.list.filter((e) =>
    e.title.toLowerCase().includes(filter.value.toLowerCase()),
  )
})

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
    router.push(`/knowledge/${res.data.id}`)
  }
}

// if (process.client) {
//   knowledgeStore.init()
// }
</script>

<style lang="scss">
#page-knowledge.page {
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
