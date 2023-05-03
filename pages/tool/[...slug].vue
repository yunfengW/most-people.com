<script setup lang="ts">
const route = useRoute()

const { data } = await useAsyncData('get-document', () => queryContent(route.path).findOne())
</script>

<template>
  <div>
    <mp-header :content="data?.title" />
    <ContentRenderer v-if="data" :value="data" />
  </div>
</template>
